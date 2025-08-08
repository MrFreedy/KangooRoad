const express = require('express');
const cors = require('cors');
const questionRouter = require('./routes/questions');
const sectionsRouter = require('./routes/sections');
const feedbacksRouter = require('./routes/feedbacks');
const usersRouter = require('./routes/users');
const authenticateToken = require('./middleware/authenticateToken');

const port = 3002;

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/questions', questionRouter);
app.use('/sections', sectionsRouter);
app.use('/feedbacks', feedbacksRouter);
app.use('/users', usersRouter);

app.get('/', authenticateToken, (req, res) => {
    res.send('Welcome to the Kangooroad API!');
});

app.listen(port, () => {
    console.log('API is running on port', port);
});