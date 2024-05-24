const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const indexRouter = require('./src/routes/index');
const userRouter = require('./src/routes/users');
const bookRouter = require('./src/routes/books');
const likeRouter = require('./src/routes/likes');

dotenv.config({ path: path.join(__dirname, '..', '.env')});
const app = express();
app.set('port', process.env.PORT);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(indexRouter);
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/likes', likeRouter);

app.listen(app.get('port'), () => {
    console.log(`* ${app.get('port')}번 서버 대기 중`);
});