const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

dotenv.config();

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

exports.getAllBooksHandler = async(req, res) => {
    const { category_id } = req.query;
    if(category_id) {
        try {
            const [rows] = await connection.execute('SELECT * FROM books WHERE category_id = ?', [category_id]);
            if(rows.length > 0) {
                res.status(StatusCodes.OK).json(rows);
            } else {
                return res.status(StatusCodes.NOT_FOUND).json({ msg: 'NOT_FOUND' });
            }
        } catch(err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
        }
    } else {
        try {
            const [rows] = await connection.execute('SELECT * FROM books');
            if(rows.length > 0) {
                res.status(StatusCodes.OK).json(rows);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
            }
        } catch(err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
        }
    }
};

exports.getBookHandler = async(req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.execute('SELECT * FROM books WHERE id = ?', [id]);
        if(rows.length > 0) {
            res.status(StatusCodes.OK).json(rows[0]);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
    }
};