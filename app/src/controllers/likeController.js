const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

exports.addLikeHandler = async(req, res) => {
    try {
        const { liked_book_id } = req.params;
        const user_id = req.user.id;
        const [rows] = await connection.execute(`SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?`, [user_id, liked_book_id]);
        if(rows.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: '이미 좋아요 등록 됨' });
        } else {
            await connection.execute(`INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`, [user_id, liked_book_id]);
            res.status(StatusCodes.OK).json({ msg: '좋아요 등록 완료' });
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server Error' });
    }
};

exports.deleteLikeHandler = async(req, res) => {
    try {
        const { liked_book_id } = req.params;
        const user_id = req.user.id;
        const [rows] = await connection.execute(`SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?`, [user_id, liked_book_id]);
        if(rows.length > 0) {
            await connection.execute(`DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`, [user_id, liked_book_id]);
            res.status(StatusCodes.OK).json({ msg: '좋아요 삭제 완료' });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: '좋아요 없음' });
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server Error' });
    }
};