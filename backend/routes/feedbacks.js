const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const requireRole = require('../middleware/requireRole');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM feedbacks');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const feedback = req.body;

  if (!feedback.form_data) {
    return res.status(400).json({ error: 'form_data is required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO feedbacks (form_data) VALUES ($1);',
      [JSON.stringify(feedback.form_data)]
    );
    res.status(200).send('Feedback created successfully');
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', requireRole('admin'), async (req, res) => {
    const { id } = req.params;

    try{
        const { school, year, city, country, user_type, is_contact, firstname, lastname, email } = req.body;
        await pool.query('UPDATE feedbacks SET school = $1, year = $2, city = $3, country = $4, user_type = $5, is_contact = $6, firstname = $7, lastname = $8, email = $9 WHERE id = $10', [school, year, city, country, user_type, is_contact, firstname, lastname, email, id]);

        res.status(200).send('Feedback updated successfully');
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM feedbacks WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).send('Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id/visibility', requireRole('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const { is_visible } = req.body
        await pool.query('UPDATE feedbacks SET is_visible = $1 WHERE id=$2',[is_visible, id]);

        res.status(200).send('Feedback visibility updated');
    } catch (error) {
        console.error('Error updating visibility feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = router;