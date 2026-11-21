const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

const getSessionId = (req) => req.headers['x-session-id'] || req.query.sessionId || 'guest-default';

// GET /api/wishlist
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [rows] = await pool.query('SELECT product_id FROM wishlists WHERE session_id = ?', [
      sessionId,
    ]);
    res.json(rows.map((r) => r.product_id));
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil wishlist', error: err.message });
  }
});

// POST /api/wishlist/toggle
router.post('/toggle', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId wajib diisi' });

    const [existing] = await pool.query(
      'SELECT id FROM wishlists WHERE session_id = ? AND product_id = ?',
      [sessionId, productId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM wishlists WHERE session_id = ? AND product_id = ?', [
        sessionId,
        productId,
      ]);
    } else {
      await pool.query('INSERT INTO wishlists (session_id, product_id) VALUES (?, ?)', [
        sessionId,
        productId,
      ]);
    }

    const [rows] = await pool.query('SELECT product_id FROM wishlists WHERE session_id = ?', [
      sessionId,
    ]);
    res.json(rows.map((r) => r.product_id));
  } catch (err) {
    res.status(500).json({ message: 'Gagal toggle wishlist', error: err.message });
  }
});

module.exports = router;
