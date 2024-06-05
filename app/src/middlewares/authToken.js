const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const { StatusCodes } = require('http-status-codes');

exports.authenticateToken = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({ msg: '로그인을 먼저 해주세요.' });
    try {
        let user = jwt.verify(token, process.env.SECRET_KEY);
        const [userIdRows] = await connection.execute(`SELECT id FROM users WHERE email = ?`, [user.email]);
        user.id = userIdRows[0].id;
        req.user = user;
        next();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.FORBIDDEN).json({ msg: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.' });
    }
};