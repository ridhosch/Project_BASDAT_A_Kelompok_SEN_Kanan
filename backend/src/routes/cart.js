const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

const getSessionId = (req) => req.headers['x-session-id'] || req.query.sessionId || 'guest-default';

// GET /api/cart - Ambil item keranjang
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [rows] = await pool.query(
      `SELECT c.product_id AS productId, c.qty, p.title, p.price, p.image, p.spec
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = ?
       ORDER BY c.id ASC`,
      [sessionId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil keranjang', error: err.message });
  }
});

// POST /api/cart - Tambah produk ke keranjang
router.post('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId wajib diisi' });

    await pool.query(
      `INSERT INTO cart_items (session_id, product_id, qty)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)`,
      [sessionId, productId, Number(qty)]
    );

    const [rows] = await pool.query(
      'SELECT product_id AS productId, qty FROM cart_items WHERE session_id = ? ORDER BY id ASC',
      [sessionId]
    );
    res.status(201).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah item keranjang', error: err.message });
  }
});

// PATCH /api/cart/:productId - Ubah jumlah (qty) item keranjang
router.patch('/:productId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = req.params;
    const { qty } = req.body;

    const finalQty = Math.max(1, Number(qty || 1));
    await pool.query(
      'UPDATE cart_items SET qty = ? WHERE session_id = ? AND product_id = ?',
      [finalQty, sessionId, productId]
    );

    const [rows] = await pool.query(
      'SELECT product_id AS productId, qty FROM cart_items WHERE session_id = ? ORDER BY id ASC',
      [sessionId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui qty keranjang', error: err.message });
  }
});

// DELETE /api/cart/:productId - Hapus item dari keranjang
router.delete('/:productId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = req.params;

    await pool.query('DELETE FROM cart_items WHERE session_id = ? AND product_id = ?', [
      sessionId,
      productId,
    ]);

    const [rows] = await pool.query(
      'SELECT product_id AS productId, qty FROM cart_items WHERE session_id = ? ORDER BY id ASC',
      [sessionId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus item keranjang', error: err.message });
  }
});

module.exports = router;
