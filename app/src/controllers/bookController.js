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

exports.getAllBooksHandler = async (req, res) => {
    const { category_id, isNew, limit = 4, page = 1 } = req.query;
    const offset = limit * (page - 1);
    try {
        let query = 'SELECT books.id, title, summary, author, price, pub_date FROM books';
        let params = [];
        if(category_id) {
            query += ' WHERE category_id = ?';
            params.push(category_id);
            if(isNew === 'true') {
                query += ' AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
            } else if (isNew !== 'false' && isNew !== undefined) {
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
            }
        } else {
            query += ' LEFT JOIN category ON books.category_id = category.id';
            if(isNew === 'true') {
                query += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
            }
        }
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await connection.execute(query, params);

        if(rows.length > 0) {
            res.status(StatusCodes.OK).json(rows);
        } else {
            res.status(StatusCodes.NO_CONTENT).json();
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'INTERNAL_SERVER_ERROR' });
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