const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

const getSessionId = (req) => req.headers['x-session-id'] || req.query.sessionId || 'guest-default';

// GET /api/profile/motor
router.get('/motor', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [rows] = await pool.query('SELECT * FROM user_motors WHERE session_id = ?', [sessionId]);
    if (rows.length === 0) return res.json(null);
    const m = rows[0];
    res.json({
      ownerName: m.owner_name || '',
      brand: m.brand,
      modelYear: m.model_year,
      plateNumber: m.plate_number || '',
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil profil motor', error: err.message });
  }
});

// PUT /api/profile/motor
router.put('/motor', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { ownerName = '', brand, modelYear, plateNumber = '' } = req.body;
    if (!brand || !modelYear) {
      return res.status(400).json({ message: 'Merek dan tipe/tahun motor wajib diisi' });
    }

    await pool.query(
      `INSERT INTO user_motors (session_id, owner_name, brand, model_year, plate_number)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         owner_name = VALUES(owner_name),
         brand = VALUES(brand),
         model_year = VALUES(model_year),
         plate_number = VALUES(plate_number)`,
      [sessionId, ownerName, brand, modelYear, plateNumber]
    );

    res.json({ ownerName, brand, modelYear, plateNumber });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan profil motor', error: err.message });
  }
});

// GET /api/profile/address
router.get('/address', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [rows] = await pool.query('SELECT * FROM user_addresses WHERE session_id = ?', [
      sessionId,
    ]);
    if (rows.length === 0) return res.json(null);
    const a = rows[0];
    res.json({
      recipient: a.recipient,
      phone: a.phone,
      email: a.email || '',
      label: a.label || 'Rumah • Utama',
      street: a.street,
      note: a.note || '',
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil alamat', error: err.message });
  }
});

// PUT /api/profile/address
router.put('/address', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { recipient, phone, email = '', label = 'Rumah • Utama', street, note = '' } = req.body;
    if (!recipient || !phone || !street) {
      return res.status(400).json({ message: 'Nama penerima, telepon, dan alamat wajib diisi' });
    }

    await pool.query(
      `INSERT INTO user_addresses (session_id, recipient, phone, email, label, street, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         recipient = VALUES(recipient),
         phone = VALUES(phone),
         email = VALUES(email),
         label = VALUES(label),
         street = VALUES(street),
         note = VALUES(note)`,
      [sessionId, recipient, phone, email, label, street, note]
    );

    res.json({ recipient, phone, email, label, street, note });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan alamat', error: err.message });
  }
});

module.exports = router;
