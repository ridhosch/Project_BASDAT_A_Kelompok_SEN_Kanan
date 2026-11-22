const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { getAdminId, stockStatus } = require('../lib/utils');

const SELECT_PRODUK = `
  SELECT p.id_produk, p.sku, p.nama_produk, p.spesifikasi, p.label, p.kecocokan,
         p.deskripsi, p.harga, p.stok, p.gambar, k.nama_kategori
  FROM produk p
  JOIN kategori_produk k ON k.id_kategori = p.id_kategori`;

// Bentuk respons sama seperti sebelumnya: id = SKU, supaya frontend tidak perlu diubah
function formatProduk(row) {
  const s = stockStatus(row.stok);
  return {
    id: row.sku,
    tag: row.label,
    category: row.nama_kategori,
    title: row.nama_produk,
    spec: row.spesifikasi,
    price: row.harga,
    stock: row.stok,
    stockStatus: s.status,
    stockLabel: s.label,
    compatibility: row.kecocokan,
    description: row.deskripsi,
    image: row.gambar,
  };
}

// GET /api/products - semua produk (filter kategori, pencarian, sorting)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let sql = `${SELECT_PRODUK} WHERE 1=1`;
    const params = [];

    if (category && category !== 'Semua Produk') {
      sql += ' AND k.nama_kategori = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql +=
        ' AND (p.nama_produk LIKE ? OR p.spesifikasi LIKE ? OR p.kecocokan LIKE ? OR k.nama_kategori LIKE ?)';
      const kw = `%${search.trim()}%`;
      params.push(kw, kw, kw, kw);
    }

    if (sort === 'harga-rendah') sql += ' ORDER BY p.harga ASC';
    else if (sort === 'harga-tinggi') sql += ' ORDER BY p.harga DESC';
    else if (sort === 'nama-az') sql += ' ORDER BY p.nama_produk ASC';
    else sql += ' ORDER BY p.id_produk ASC';

    const [rows] = await pool.query(sql, params);
    res.json(rows.map(formatProduk));
  } catch (err) {
    console.error('Error GET /api/products:', err);
    res.status(500).json({ message: 'Gagal mengambil data produk', error: err.message });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kategori_produk ORDER BY id_kategori ASC');
    res.json(
      rows.map((r, i) => ({
        name: r.nama_kategori,
        desc: r.deskripsi,
        featured: i === 0, // tabel kategori_produk tidak punya kolom "featured"; kategori pertama disorot
        icon: r.ikon,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil kategori', error: err.message });
  }
});

// GET /api/products/:id - detail produk (id = SKU)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`${SELECT_PRODUK} WHERE p.sku = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(formatProduk(rows[0]));
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail produk', error: err.message });
  }
});

// PATCH /api/products/:id/stock - tambah stok dari Panel Admin (dicatat di riwayat_stok)
router.patch('/:id/stock', async (req, res) => {
  const addQty = parseInt(req.body.qty, 10) || 0;
  if (addQty <= 0) {
    return res.status(400).json({ message: 'Jumlah penambahan stok harus lebih dari 0' });
  }
  const catatan = String(req.body.note || 'Penambahan stok dari panel admin').slice(0, 255);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [found] = await conn.query('SELECT id_produk FROM produk WHERE sku = ? FOR UPDATE', [
      req.params.id,
    ]);
    if (found.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    const idProduk = found[0].id_produk;
    const idAdmin = await getAdminId(conn);

    await conn.query('UPDATE produk SET stok = stok + ? WHERE id_produk = ?', [addQty, idProduk]);
    await conn.query(
      'INSERT INTO riwayat_stok (id_produk, id_admin, jumlah, catatan, waktu) VALUES (?, ?, ?, ?, ?)',
      [idProduk, idAdmin, addQty, catatan, new Date()]
    );

    await conn.commit();

    const [rows] = await pool.query(`${SELECT_PRODUK} WHERE p.id_produk = ?`, [idProduk]);
    res.json(formatProduk(rows[0]));
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Gagal memperbarui stok', error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
