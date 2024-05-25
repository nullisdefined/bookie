const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

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

exports.getAllCategoriesHandler = async(req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM category');
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