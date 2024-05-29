const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

exports.orderHandler = async(req, res) => {
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;
    const user_id = req.user.id;
    let delivery_id;
    let order_id;
    try {
        let params = [delivery.address, delivery.receiver, delivery.contact];
        let [rows] = await connection.execute(
            `INSERT INTO delivery (address, receiver, contact) VALUES (?, ? ,?)`
            , params
        );
        delivery_id = rows.insertId;
        
        params = [user_id, delivery_id, firstBookTitle, totalQuantity, totalPrice];
        [rows] = await connection.execute(`
            INSERT INTO orders (user_id, delivery_id, book_title, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)`
            , params
        );
        order_id = rows.insertId;

        const orderedBookParams = items.map((item) => [order_id, item.book_id, item.quantity]);
        const placeholders = orderedBookParams.map(() => '(?, ?, ?)').join(', ');
        await connection.execute(
            `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ${placeholders}`,
            orderedBookParams.flat()
        );
        res.json({ msg: '주문 완료' });
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'INTERNAL_SERVER_ERROR' });
    }
};
exports.getOrdersHandler = (req, res) => {

};
exports.getOrderDetailHandler = (req, res) => {

};
