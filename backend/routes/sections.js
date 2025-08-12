const express = require('express');
const router = express.Router();
const pool = require('../db');

const authenticateToken = require('../middleware/authenticateToken');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM sections');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, order, is_active } = req.body;
        await pool.query('INSERT INTO sections (name, "order", is_active) VALUES ($1, $2, $3)',[name, order, is_active]);
        res.status(200).send('Section created');
    } catch (err) {
        res.status(500).json({error: err.message})
    }
});

module.exports = router;