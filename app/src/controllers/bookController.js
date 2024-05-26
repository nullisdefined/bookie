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
    const { category_id, isNew } = req.query;
    if(category_id) {
        try {
            let query = `SELECT books.id, title, summary, author, price, pub_date FROM books `;
            if(isNew === 'true') 
                query += `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() AND category_id = ?`;
            else if(isNew === 'false' || isNew === undefined)
                query += `WHERE category_id = ?`;
            else
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
            const [rows] = await connection.execute(query, [category_id]);
            if(rows.length > 0) 
                res.status(StatusCodes.OK).json(rows);
            else
                return res.status(StatusCodes.NO_CONTENT).json({ msg: 'NO_CONTENT' });
        } catch(err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
        }
    } else {
        try {
            let query = `SELECT books.*, category.name AS 'category_name' FROM books
                LEFT JOIN category ON books.category_id = category.id `;
            if(isNew === 'true')
                query += `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
            const [rows] = await connection.execute(query);
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
        const [rows] = await connection.execute(`SELECT books.*, category.name AS 'category_name' FROM books 
                LEFT JOIN category ON books.category_id = category.id
                WHERE books.id = ?`, [id]);
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