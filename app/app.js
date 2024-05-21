const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const indexRouter = require('./src/routes/index');
const userRouter = require('./src/routes/users');

// 프로젝트 폴더 구조 변경에 따른 경로 설정
dotenv.config({ path: path.join(__dirname, '..', '.env')});

const app = express();

app.set('port', process.env.PORT);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(userRouter);
app.use(indexRouter);

app.listen(app.get('port'), () => {
    console.log(`***${app.get('port')}번 서버 대기 중`);
});