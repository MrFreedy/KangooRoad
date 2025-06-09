const express = require('express');
const router = express.Router();
const pool = require('../db');

const checkCookie = require('../middleware/checkCookie');

router.get('/', checkCookie, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM questions');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;