const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

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