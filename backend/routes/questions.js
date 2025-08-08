const express = require('express');
const router = express.Router();
const pool = require('../db');

const authenticateToken = require('../middleware/authenticateToken');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM questions');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;