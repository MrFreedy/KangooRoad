const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
//const userRouter = require('./routes/users');

const port = 3000;
dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

//app.use('/users', userRouter);

app.listen(port, () => {
    console.log('API is running on port', port);
});