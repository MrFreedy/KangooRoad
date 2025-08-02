const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const questionRouter = require('./routes/questions');
const sectionsRouter = require('./routes/sections');
const feedbacksRouter = require('./routes/feedbacks');
const checkCookie = require('./middleware/checkCookie');

const port = 3002;
dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/questions', questionRouter);
app.use('/sections', sectionsRouter);
app.use('/feedbacks', feedbacksRouter);

app.get('/', checkCookie, (req, res) => {
    res.send('Welcome to the Kangooroad API!');
});

app.listen(port, () => {
    console.log('API is running on port', port);
});