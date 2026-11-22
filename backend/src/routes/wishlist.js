const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { getPelangganId, findProdukIdBySku } = require('../lib/utils');

// Mengembalikan daftar SKU produk favorit
async function getFavorit(idPelanggan) {
  const [rows] = await pool.query(
    `SELECT pr.sku FROM favorit f
     JOIN produk pr ON pr.id_produk = f.id_produk
     WHERE f.id_pelanggan = ?
     ORDER BY pr.id_produk ASC`,
    [idPelanggan]
  );
  return rows.map((r) => r.sku);
}

// GET /api/wishlist
router.get('/', async (req, res) => {
  try {
    const idPelanggan = await getPelangganId(req);
    res.json(await getFavorit(idPelanggan));
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil wishlist', error: err.message });
  }
});

// POST /api/wishlist/toggle
router.post('/toggle', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId wajib diisi' });

    const idProduk = await findProdukIdBySku(productId);
    if (!idProduk) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const idPelanggan = await getPelangganId(req);
    const [del] = await pool.query('DELETE FROM favorit WHERE id_pelanggan = ? AND id_produk = ?', [
      idPelanggan,
      idProduk,
    ]);
    if (del.affectedRows === 0) {
      await pool.query('INSERT IGNORE INTO favorit (id_pelanggan, id_produk) VALUES (?, ?)', [
        idPelanggan,
        idProduk,
      ]);
    }
    res.json(await getFavorit(idPelanggan));
  } catch (err) {
    res.status(500).json({ message: 'Gagal toggle wishlist', error: err.message });
  }
});

module.exports = router;
