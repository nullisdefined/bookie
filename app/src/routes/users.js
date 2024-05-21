const express = require('express');
const connection = require('../db/connection');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

router.use(express.json());

const joinHandler = async(req, res) => {
    const { name, email, pwd } = req.body;

    try {
        await connection.execute(
            'INSERT INTO users (name, email, pwd) VALUES (?, ?, ?)', [name, email, pwd]
        );
        res.status(201).json({ msg: `${name}님, 회원가입이 완료되었습니다.`});
    } catch(err) {
        console.error(err);
        res.json({ msg: '서버 오류' });
    }
};
const loginHandler = async(req, res) => {
    const { email, pwd } = req.body;

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ? AND pwd = ?', [email, pwd]
        );

        if(rows.length > 0) {
            res.json({ msg: `${rows[0].name}님, 반갑습니다.`});
        } else {
            res.status(403).json({ msg: '이메일 또는 비밀번호가 올바르지 않습니다.'});
        }
    } catch(err) {
        console.error(err);
        res.json({ msg: '서버 오류' });
    }
};


router.post('/join',
    joinHandler
);
router.post('/login',
    loginHandler
);

module.exports = router;