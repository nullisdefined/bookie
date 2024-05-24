const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

dotenv.config();

exports.joinHandler = async(req, res) => {
    const { email, pwd } = req.body;

    try {
        await connection.execute('INSERT INTO users (email, pwd) VALUES (?, ?)', [email, pwd]);
        res.status(StatusCodes.CREATED).json({ msg: `회원가입이 완료되었습니다.`});
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
    }
};

exports.loginHandler = async(req, res) => {
    const { email, pwd } = req.body;

    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ? AND pwd = ?', [email, pwd]);

        if(rows.length > 0) {
            const payload = { email: rows[0].email };
            const options = {
                expiresIn: '3m'
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, options);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.json({ msg: `로그인 되었습니다.`});
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ msg: '이메일 또는 비밀번호가 올바르지 않습니다.'});
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
    }
};

exports.logoutHandler = async(req, res) => {
    res.clearCookie('token');
    res.json({ msg: '로그아웃되었습니다.' })
};

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({ msg: '로그인을 먼저 해주세요.' });

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.FORBIDDEN).json({ msg: '권한이 없습니다.' });
    }
};

exports.pwdResetReqHandler = async(req, res) => {
    const { email, pwd } = req.body;

    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ? AND pwd = ?', [email, pwd]);

        if(rows.length > 0) {
            return res.status(StatusCodes.OK).json({ email });
        } else {
            return res.status(StatusCodes.FORBIDDEN).end();
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
    }
};

exports.pwdReset = async(req, res) => {
    const { email, newPwd } = req.body;
    
    try {
        connection.execute('UPDATE users SET pwd = ? WHERE email = ?', [newPwd, email]);
        res.json({ msg: '비밀번호가 변경되었습니다.' });
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).end();
    }
};
