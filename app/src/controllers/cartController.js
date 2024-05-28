const connection = require('../db/connection');
const { StatusCodes } = require('http-status-codes');

/**
 * TODO: 장바구니에 이미 담겨져 있는 경우 수량 추가하기
 */
exports.addToCartHandler = async(req, res) => {
    try {
        const { book_id, quantity } = req.body;
        const user_id = req.user.id;
        await connection.execute(`INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`, [book_id, quantity, user_id]);
        res.status(StatusCodes.CREATED).json({ msg: '장바구니에 담겼습니다.' });
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
    }
};
exports.getCartItemsHandler = async(req, res) => {
    try {
        const { selected } = req.body;
        const user_id = req.user.id;
        let params = [user_id];
        let query = `
            SELECT cartItems.id, book_id, title, summary quantity, price
            FROM cartItems LEFT JOIN books
            ON cartItems.book_id = books.id
            WHERE user_id = ?`;
        if(selected && selected.length > 0) {
            const placeholders = selected.map(() => '?').join(',');
            query += ` AND cartItems.id IN (${placeholders})`;
            params = params.concat(selected);
        }
        const [rows] = await connection.execute(query, params);
        if(rows.length > 0) {
            res.status(StatusCodes.OK).json(rows);
        } else {
            return res.status(StatusCodes.NO_CONTENT).json({ msg: '장바구니가 비었습니다.' });
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
    }
};
exports.deleteCartItemsHandler = async(req, res) => {
    try {
        const book_id = req.params.id;
        const user_id = req.user.id;
        await connection.execute(`DELETE FROM cartItems WHERE user_id = ? AND book_id`, [user_id, book_id]);
        res.status(StatusCodes.OK).json({ msg: '아이템 삭제 완료' });
        if(rows.length > 0) {
            res.status(StatusCodes.OK).json(rows);
        } else {
            return res.status(StatusCodes.NO_CONTENT).json({ msg: '장바구니가 비었습니다.' });
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'BAD_REQUEST' });
    }
};