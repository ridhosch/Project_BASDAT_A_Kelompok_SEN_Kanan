const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { getPelangganId, findProdukIdBySku } = require('../lib/utils');

async function getCart(idPelanggan) {
  const [rows] = await pool.query(
    `SELECT pr.sku AS productId, k.jumlah AS qty, pr.nama_produk AS title,
            pr.harga AS price, pr.gambar AS image, pr.spesifikasi AS spec
     FROM keranjang k
     JOIN produk pr ON pr.id_produk = k.id_produk
     WHERE k.id_pelanggan = ?
     ORDER BY k.id_keranjang ASC`,
    [idPelanggan]
  );
  return rows;
}

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const idPelanggan = await getPelangganId(req);
    res.json(await getCart(idPelanggan));
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil keranjang', error: err.message });
  }
});

// POST /api/cart - tambah produk (productId = SKU)
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const qty = Math.max(1, parseInt(req.body.qty, 10) || 1);
    if (!productId) return res.status(400).json({ message: 'productId wajib diisi' });

    const idProduk = await findProdukIdBySku(productId);
    if (!idProduk) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const idPelanggan = await getPelangganId(req);
    await pool.query(
      `INSERT INTO keranjang (id_pelanggan, id_produk, jumlah)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE jumlah = jumlah + VALUES(jumlah)`,
      [idPelanggan, idProduk, qty]
    );
    res.status(201).json(await getCart(idPelanggan));
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah item keranjang', error: err.message });
  }
});

// PATCH /api/cart/:productId - ubah jumlah
router.patch('/:productId', async (req, res) => {
  try {
    const qty = Math.max(1, parseInt(req.body.qty, 10) || 1);
    const idPelanggan = await getPelangganId(req);
    const idProduk = await findProdukIdBySku(req.params.productId);
    if (idProduk) {
      await pool.query(
        'UPDATE keranjang SET jumlah = ? WHERE id_pelanggan = ? AND id_produk = ?',
        [qty, idPelanggan, idProduk]
      );
    }
    res.json(await getCart(idPelanggan));
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui qty keranjang', error: err.message });
  }
});

// DELETE /api/cart/:productId
router.delete('/:productId', async (req, res) => {
  try {
    const idPelanggan = await getPelangganId(req);
    const idProduk = await findProdukIdBySku(req.params.productId);
    if (idProduk) {
      await pool.query('DELETE FROM keranjang WHERE id_pelanggan = ? AND id_produk = ?', [
        idPelanggan,
        idProduk,
      ]);
    }
    res.json(await getCart(idPelanggan));
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus item keranjang', error: err.message });
  }
});

module.exports = router;
