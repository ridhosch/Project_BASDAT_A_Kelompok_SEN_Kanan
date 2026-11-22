const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { getPelangganId, normalizePlate } = require('../lib/utils');

// GET /api/profile/motor  (tabel motor_pengguna)
router.get('/motor', async (req, res) => {
  try {
    const idPelanggan = await getPelangganId(req);
    const [rows] = await pool.query(
      'SELECT * FROM motor_pengguna WHERE id_pelanggan = ? ORDER BY id_motor ASC LIMIT 1',
      [idPelanggan]
    );
    if (rows.length === 0) return res.json(null);
    const m = rows[0];
    res.json({
      ownerName: m.nama_pemilik || '',
      brand: m.merek || '',
      modelYear: m.tipe_model || '',
      plateNumber: m.plat_nomor || '',
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil profil motor', error: err.message });
  }
});

// PUT /api/profile/motor
// Plat nomor dinormalisasi lalu divalidasi unik (UNIQUE uq_motor_plat) agar data motor
// yang sama tidak tersimpan berulang.
router.put('/motor', async (req, res) => {
  try {
    const { ownerName = '', brand, modelYear } = req.body;
    const plate = normalizePlate(req.body.plateNumber);

    if (!brand || !modelYear) {
      return res.status(400).json({ message: 'Merek dan tipe/tahun motor wajib diisi' });
    }
    if (!plate) {
      return res.status(400).json({ message: 'Plat nomor wajib diisi' });
    }
    if (plate.length > 15) {
      return res.status(400).json({ message: 'Plat nomor maksimal 15 karakter' });
    }

    const idPelanggan = await getPelangganId(req);

    // Validasi sebelum simpan: apakah plat ini sudah dipakai data motor milik pelanggan lain?
    const [dup] = await pool.query(
      'SELECT id_motor FROM motor_pengguna WHERE plat_nomor = ? AND id_pelanggan <> ? LIMIT 1',
      [plate, idPelanggan]
    );
    if (dup.length > 0) {
      return res.status(409).json({ message: `Plat nomor ${plate} sudah terdaftar` });
    }

    const [existing] = await pool.query(
      'SELECT id_motor FROM motor_pengguna WHERE id_pelanggan = ? ORDER BY id_motor ASC LIMIT 1',
      [idPelanggan]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE motor_pengguna
         SET nama_pemilik = ?, merek = ?, tipe_model = ?, plat_nomor = ?
         WHERE id_motor = ?`,
        [ownerName, brand, modelYear, plate, existing[0].id_motor]
      );
    } else {
      await pool.query(
        `INSERT INTO motor_pengguna (id_pelanggan, nama_pemilik, merek, tipe_model, plat_nomor)
         VALUES (?, ?, ?, ?, ?)`,
        [idPelanggan, ownerName, brand, modelYear, plate]
      );
    }

    res.json({ ownerName, brand, modelYear, plateNumber: plate });
  } catch (err) {
    // Jaring pengaman: dua permintaan bersamaan dengan plat sama ditolak oleh UNIQUE di database
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Plat nomor sudah terdaftar' });
    }
    res.status(500).json({ message: 'Gagal menyimpan profil motor', error: err.message });
  }
});

// GET /api/profile/address  (tabel alamat_pengiriman)
router.get('/address', async (req, res) => {
  try {
    const idPelanggan = await getPelangganId(req);
    const [rows] = await pool.query(
      'SELECT * FROM alamat_pengiriman WHERE id_pelanggan = ? ORDER BY id_alamat ASC LIMIT 1',
      [idPelanggan]
    );
    if (rows.length === 0) return res.json(null);
    const a = rows[0];
    res.json({
      recipient: a.nama_penerima,
      phone: a.no_hp || '',
      email: a.email || '',
      label: a.label || 'Rumah • Utama',
      street: a.alamat_lengkap,
      note: a.catatan || '',
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil alamat', error: err.message });
  }
});

// PUT /api/profile/address
router.put('/address', async (req, res) => {
  try {
    const { recipient, phone, email = '', label = 'Rumah • Utama', street, note = '' } = req.body;
    if (!recipient || !phone || !street) {
      return res.status(400).json({ message: 'Nama penerima, telepon, dan alamat wajib diisi' });
    }

    const idPelanggan = await getPelangganId(req);
    const [existing] = await pool.query(
      'SELECT id_alamat FROM alamat_pengiriman WHERE id_pelanggan = ? ORDER BY id_alamat ASC LIMIT 1',
      [idPelanggan]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE alamat_pengiriman
         SET label = ?, nama_penerima = ?, no_hp = ?, email = ?, alamat_lengkap = ?, catatan = ?
         WHERE id_alamat = ?`,
        [label, recipient, phone, email, street, note, existing[0].id_alamat]
      );
    } else {
      await pool.query(
        `INSERT INTO alamat_pengiriman
           (id_pelanggan, label, nama_penerima, no_hp, email, alamat_lengkap, catatan)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [idPelanggan, label, recipient, phone, email, street, note]
      );
    }

    res.json({ recipient, phone, email, label, street, note });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan alamat', error: err.message });
  }
});

module.exports = router;
