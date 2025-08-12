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

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM sections WHERE id = $1', [id]);
        res.status(200).send('Section deleted');
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id/visibility', async (req, res) => {
    const { id } = req.params;
    try {
        const { is_active } = req.body
        await pool.query('UPDATE sections SET is_active = $1 WHERE id=$2',[is_active, id]);

        res.status(200).send('Section visibility updated');
    } catch (error) {
        console.error('Error updating visibility section:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try{
        const { name, order, is_active } = req.body;
        await pool.query('UPDATE sections SET name = $1, "order"=$2, is_active=$3 WHERE id = $4', [name, order, is_active, id]);

        res.status(200).send('Section updated succesfully');
    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;