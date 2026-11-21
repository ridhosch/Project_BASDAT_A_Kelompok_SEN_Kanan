const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/products - Ambil semua produk dengan filter kategori, pencarian, dan sorting
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'Semua Produk') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR spec LIKE ? OR compatibility LIKE ? OR category LIKE ?)';
      const kw = `%${search.trim()}%`;
      params.push(kw, kw, kw, kw);
    }

    if (sort === 'harga-rendah') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'harga-tinggi') {
      sql += ' ORDER BY price DESC';
    } else if (sort === 'nama-az') {
      sql += ' ORDER BY title ASC';
    } else {
      sql += ' ORDER BY created_at ASC';
    }

    const [rows] = await pool.query(sql, params);

    const formatted = rows.map((row) => ({
      id: row.id,
      tag: row.tag,
      category: row.category,
      title: row.title,
      spec: row.spec,
      price: row.price,
      stock: row.stock,
      stockStatus: row.stock_status,
      stockLabel: row.stock_label,
      compatibility: row.compatibility,
      description: row.description,
      image: row.image,
      artType: row.art_type,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error GET /api/products:', err);
    res.status(500).json({ message: 'Gagal mengambil data produk', error: err.message });
  }
});

// GET /api/products/categories - Ambil daftar kategori
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    const formatted = rows.map((r) => ({
      name: r.name,
      desc: r.description,
      featured: Boolean(r.featured),
      icon: r.icon,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil kategori', error: err.message });
  }
});

// GET /api/products/:id - Detail produk
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    const row = rows[0];
    res.json({
      id: row.id,
      tag: row.tag,
      category: row.category,
      title: row.title,
      spec: row.spec,
      price: row.price,
      stock: row.stock,
      stockStatus: row.stock_status,
      stockLabel: row.stock_label,
      compatibility: row.compatibility,
      description: row.description,
      image: row.image,
      artType: row.art_type,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail produk', error: err.message });
  }
});

// PATCH /api/products/:id/stock - Tambah stok produk dari Panel Admin
router.patch('/:id/stock', async (req, res) => {
  try {
    const addQty = parseInt(req.body.qty, 10) || 0;
    if (addQty <= 0) {
      return res.status(400).json({ message: 'Jumlah penambahan stok harus lebih dari 0' });
    }

    await pool.query(
      `UPDATE products
       SET stock = stock + ?,
           stock_status = CASE WHEN stock + ? <= 0 THEN 'habis' WHEN stock + ? <= 5 THEN 'terbatas' ELSE 'tersedia' END,
           stock_label = CASE WHEN stock + ? <= 0 THEN 'Stok habis' WHEN stock + ? <= 5 THEN 'Stok terbatas' ELSE 'Stok tersedia' END
       WHERE id = ?`,
      [addQty, addQty, addQty, addQty, addQty, req.params.id]
    );

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui stok', error: err.message });
  }
});

module.exports = router;