const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const {
  HttpError,
  getPelangganId,
  getAdminId,
  formatLabel,
  toDateStr,
  addBusinessDays,
} = require('../lib/utils');

const SERVICE_FEE = 1000;
const KURIR = {
  reg: { nama: 'JNE REG', ongkir: 18000, hariMin: 2, hariMax: 3, label: '2-3 hari kerja' },
  yes: { nama: 'JNE YES', ongkir: 28000, hariMin: 1, hariMax: 1, label: '1 hari kerja' },
};
const INSURANCE_COST = 1800;
const BANK_LABEL = { BCA: 'BCA', BNI: 'BNI', MANDIRI: 'Mandiri' };
const TAHAP = ['DIBUAT', 'DIPROSES', 'DIKIRIM', 'SELESAI'];

const SELECT_PESANAN = `
  SELECT p.*,
         g.nama_penerima, g.no_hp_penerima, g.email_penerima, g.alamat_lengkap,
         g.catatan_alamat, g.kurir, g.ongkir, g.asuransi, g.no_resi,
         g.estimasi_awal, g.estimasi_akhir,
         b.bank, b.no_va, b.status AS status_bayar, b.waktu_bayar,
         b.waktu_konfirmasi, b.catatan_admin,
         (SELECT a.label FROM alamat_pengiriman a
           WHERE a.id_pelanggan = p.id_pelanggan ORDER BY a.id_alamat ASC LIMIT 1) AS label_alamat
  FROM pesanan p
  LEFT JOIN pengiriman g ON g.id_pesanan = p.id_pesanan
  LEFT JOIN pembayaran b ON b.id_pesanan = p.id_pesanan`;

// "#SK-261122-1234" atau "SK-261122-1234" -> id_pesanan
async function resolveIdPesanan(param, db = pool) {
  const nomor = decodeURIComponent(String(param)).replace(/^#/, '');
  const [rows] = await db.query('SELECT id_pesanan FROM pesanan WHERE nomor_pesanan = ?', [nomor]);
  return rows.length ? rows[0].id_pesanan : null;
}

// Ambil pesanan (beserta item) dalam bentuk yang dipakai senkanan-app & senkanan-admin
async function loadOrders(whereSql = '', params = [], tail = '') {
  const [rows] = await pool.query(
    `${SELECT_PESANAN} ${whereSql} ORDER BY p.tanggal_pesanan DESC, p.id_pesanan DESC ${tail}`,
    params
  );
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id_pesanan);
  const [items] = await pool.query(
    `SELECT d.id_pesanan, pr.sku AS productId, pr.nama_produk AS title,
            d.harga_satuan AS price, d.jumlah AS qty, COALESCE(pr.gambar, '') AS image
     FROM detail_pesanan d
     JOIN produk pr ON pr.id_produk = d.id_produk
     WHERE d.id_pesanan IN (${ids.map(() => '?').join(',')})
     ORDER BY pr.id_produk ASC`,
    ids
  );
  const itemsByOrder = new Map();
  for (const it of items) {
    if (!itemsByOrder.has(it.id_pesanan)) itemsByOrder.set(it.id_pesanan, []);
    itemsByOrder.get(it.id_pesanan).push({
      productId: it.productId,
      title: it.title,
      name: it.title,
      price: it.price,
      qty: it.qty,
      image: it.image,
    });
  }

  return rows.map((r) => formatOrder(r, itemsByOrder.get(r.id_pesanan) || []));
}

function formatOrder(r, items) {
  const kurirKey = r.kurir === 'JNE YES' ? 'yes' : 'reg';
  const bankLabel = BANK_LABEL[r.bank] || r.bank || '';
  const va = r.no_va || '';
  const paymentMethod = `${bankLabel} Virtual Account${va ? ` •••• ${va.slice(-4)}` : ''}`;

  return {
    id: `#${r.nomor_pesanan}`,
    customer: r.nama_penerima || 'Pelanggan',
    createdAt: formatLabel(r.tanggal_pesanan),
    estimatedArrival: KURIR[kurirKey].label,
    estimatedFrom: r.estimasi_awal,
    estimatedTo: r.estimasi_akhir,
    stage: String(r.tahap || 'DIBUAT').toLowerCase(),
    courier: r.kurir || '',
    trackingNumber: r.no_resi || '',
    items,
    shippingCost: r.ongkir || 0,
    insuranceCost: r.asuransi || 0,
    serviceFee: r.biaya_layanan,
    totalAmount: r.total,
    paymentMethod,
    paymentType: 'VA',
    vaNumber: va,
    paidAt: formatLabel(r.waktu_bayar),
    payment: {
      method: paymentMethod,
      bank: bankLabel,
      type: 'VA',
      va,
      status: String(r.status_bayar || 'MENUNGGU').toLowerCase(),
      note: r.catatan_admin || '',
      paidAt: formatLabel(r.waktu_bayar),
      confirmedAt: formatLabel(r.waktu_konfirmasi),
    },
    address: {
      recipient: r.nama_penerima,
      phone: r.no_hp_penerima || '',
      email: r.email_penerima || '',
      label: r.label_alamat || 'Rumah • Utama',
      street: r.alamat_lengkap,
      note: r.catatan_alamat || '',
    },
    note: r.catatan || '',
  };
}

// GET /api/orders - pesanan milik pelanggan (terbaru di atas)
router.get('/', async (req, res) => {
  try {
    const idPelanggan = await getPelangganId(req);
    res.json(await loadOrders('WHERE p.id_pelanggan = ?', [idPelanggan]));
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil daftar pesanan', error: err.message });
  }
});

// GET /api/orders/all - semua pesanan (Panel Admin)
router.get('/all', async (req, res) => {
  try {
    res.json(await loadOrders());
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil semua pesanan', error: err.message });
  }
});

// GET /api/orders/latest - pesanan terakhir milik pelanggan
router.get('/latest', async (req, res) => {
  try {
    const idPelanggan = await getPelangganId(req);
    const list = await loadOrders('WHERE p.id_pelanggan = ?', [idPelanggan], 'LIMIT 1');
    res.json(list[0] || null);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pesanan terbaru', error: err.message });
  }
});

// POST /api/orders - checkout dari senkanan-app
router.post('/', async (req, res) => {
  const {
    items,
    shippingMethod = 'reg',
    withInsurance = true,
    paymentMethod = 'BCA Virtual Account',
    vaNumber = '',
    address = {},
    note = '',
    clearCartAfter = true,
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Keranjang belanja kosong' });
  }
  const kurir = KURIR[shippingMethod];
  if (!kurir) return res.status(400).json({ message: 'Metode pengiriman tidak valid' });

  const va = String(vaNumber).replace(/\D/g, '');
  if (va.length !== 16) {
    return res.status(400).json({ message: 'Nomor Virtual Account harus 16 digit' });
  }
  const bankMatch = String(paymentMethod).toUpperCase().match(/BCA|BNI|MANDIRI/);
  const bank = bankMatch ? bankMatch[0] : 'BCA';

  const conn = await pool.getConnection();
  try {
    // Gabungkan item dengan SKU yang sama (PK detail_pesanan = id_pesanan + id_produk)
    const wanted = new Map();
    for (const it of items) {
      if (!it.productId) throw new HttpError(400, 'productId pada item wajib diisi');
      const qty = Math.max(1, parseInt(it.qty, 10) || 1);
      wanted.set(it.productId, (wanted.get(it.productId) || 0) + qty);
    }

    await conn.beginTransaction();

    const skus = [...wanted.keys()];
    const [produkRows] = await conn.query(
      `SELECT id_produk, sku, nama_produk, harga, stok
       FROM produk WHERE sku IN (${skus.map(() => '?').join(',')}) FOR UPDATE`,
      skus
    );
    const produkBySku = new Map(produkRows.map((p) => [p.sku, p]));

    let subtotal = 0;
    for (const [sku, qty] of wanted) {
      const prod = produkBySku.get(sku);
      if (!prod) throw new HttpError(400, `Produk ${sku} tidak ditemukan di database`);
      if (prod.stok < qty) {
        throw new HttpError(400, `Stok ${prod.nama_produk} tidak mencukupi (sisa ${prod.stok})`);
      }
      subtotal += prod.harga * qty;
    }

    const ongkir = kurir.ongkir;
    const asuransi = withInsurance ? INSURANCE_COST : 0;
    const total = subtotal + ongkir + asuransi + SERVICE_FEE;

    const idPelanggan = await getPelangganId(req, conn);
    const now = new Date();
    const dateCode = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}${String(now.getDate()).padStart(2, '0')}`;

    // nomor_pesanan format SK-YYMMDD-NNNN (UNIQUE) -> coba ulang jika bentrok
    let idPesanan = null;
    let nomorPesanan = '';
    for (let attempt = 0; attempt < 8 && !idPesanan; attempt += 1) {
      nomorPesanan = `SK-${dateCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      try {
        const [ins] = await conn.query(
          `INSERT INTO pesanan
             (nomor_pesanan, id_pelanggan, tanggal_pesanan, tahap, biaya_layanan, total, catatan)
           VALUES (?, ?, ?, 'DIBUAT', ?, ?, ?)`,
          [nomorPesanan, idPelanggan, now, SERVICE_FEE, total, String(note).slice(0, 255)]
        );
        idPesanan = ins.insertId;
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') throw err;
      }
    }
    if (!idPesanan) throw new HttpError(500, 'Gagal membuat nomor pesanan unik, coba lagi');

    for (const [sku, qty] of wanted) {
      const prod = produkBySku.get(sku);
      await conn.query(
        'INSERT INTO detail_pesanan (id_pesanan, id_produk, jumlah, harga_satuan) VALUES (?, ?, ?, ?)',
        [idPesanan, prod.id_produk, qty, prod.harga]
      );
      await conn.query('UPDATE produk SET stok = stok - ? WHERE id_produk = ?', [qty, prod.id_produk]);
    }

    await conn.query(
      `INSERT INTO pengiriman
         (id_pesanan, nama_penerima, no_hp_penerima, email_penerima, alamat_lengkap,
          catatan_alamat, kurir, ongkir, asuransi, estimasi_awal, estimasi_akhir)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPesanan,
        address.recipient || 'Pelanggan SENkanan',
        address.phone || '',
        address.email || '',
        address.street || '',
        String(address.note || '').slice(0, 255),
        kurir.nama,
        ongkir,
        asuransi,
        toDateStr(addBusinessDays(now, kurir.hariMin)),
        toDateStr(addBusinessDays(now, kurir.hariMax)),
      ]
    );

    await conn.query(
      `INSERT INTO pembayaran (id_pesanan, bank, no_va, jumlah, status, waktu_bayar)
       VALUES (?, ?, ?, ?, 'MENUNGGU', ?)`,
      [idPesanan, bank, va, total, now]
    );

    if (clearCartAfter) {
      await conn.query('DELETE FROM keranjang WHERE id_pelanggan = ?', [idPelanggan]);
    }

    await conn.commit();

    const [created] = await loadOrders('WHERE p.id_pesanan = ?', [idPesanan]);
    res.status(201).json(created);
  } catch (err) {
    await conn.rollback();
    if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
    console.error('Error POST /api/orders:', err);
    res.status(500).json({ message: 'Gagal membuat pesanan', error: err.message });
  } finally {
    conn.release();
  }
});

// PATCH /api/orders/:id/stage - majukan tahap pesanan (Panel Admin)
router.patch('/:id/stage', async (req, res) => {
  try {
    const tahap = String(req.body.stage || '').toUpperCase();
    if (!TAHAP.includes(tahap)) {
      return res.status(400).json({ message: 'Stage pesanan tidak valid' });
    }

    const idPesanan = await resolveIdPesanan(req.params.id);
    if (!idPesanan) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    if (tahap !== 'DIBUAT') {
      const [bayar] = await pool.query('SELECT status FROM pembayaran WHERE id_pesanan = ?', [
        idPesanan,
      ]);
      if (!bayar.length || bayar[0].status !== 'LUNAS') {
        return res
          .status(400)
          .json({ message: 'Pesanan hanya bisa diproses setelah pembayaran LUNAS' });
      }
    }

    const now = new Date();
    const sets = ['tahap = ?'];
    const vals = [tahap];
    if (tahap === 'DIPROSES' || tahap === 'DIKIRIM' || tahap === 'SELESAI') {
      sets.push('waktu_diproses = COALESCE(waktu_diproses, ?)');
      vals.push(now);
    }
    if (tahap === 'DIKIRIM' || tahap === 'SELESAI') {
      sets.push('waktu_dikirim = COALESCE(waktu_dikirim, ?)');
      vals.push(now);
    }
    if (tahap === 'SELESAI') {
      sets.push('waktu_tiba = COALESCE(waktu_tiba, ?)');
      vals.push(now);
    }
    await pool.query(`UPDATE pesanan SET ${sets.join(', ')} WHERE id_pesanan = ?`, [
      ...vals,
      idPesanan,
    ]);

    // Nomor resi baru dibuat saat pesanan dikirim
    if (tahap === 'DIKIRIM' || tahap === 'SELESAI') {
      const resi = `SK${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(
        2,
        '0'
      )}${String(now.getDate()).padStart(2, '0')}${Math.floor(100000 + Math.random() * 900000)}`;
      await pool.query('UPDATE pengiriman SET no_resi = COALESCE(no_resi, ?) WHERE id_pesanan = ?', [
        resi,
        idPesanan,
      ]);
    }

    const [updated] = await loadOrders('WHERE p.id_pesanan = ?', [idPesanan]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status pesanan', error: err.message });
  }
});

// PATCH /api/orders/:id/payment - konfirmasi / tolak pembayaran VA oleh Admin
router.patch('/:id/payment', async (req, res) => {
  try {
    const status = String(req.body.status || '').toUpperCase();
    const note = String(req.body.note || '').slice(0, 255);
    if (!['MENUNGGU', 'LUNAS', 'DITOLAK'].includes(status)) {
      return res.status(400).json({ message: 'Status pembayaran tidak valid' });
    }

    const idPesanan = await resolveIdPesanan(req.params.id);
    if (!idPesanan) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    const decided = status !== 'MENUNGGU';
    const idAdmin = decided ? await getAdminId() : null;
    await pool.query(
      `UPDATE pembayaran
       SET status = ?, catatan_admin = ?, id_admin = ?, waktu_konfirmasi = ?
       WHERE id_pesanan = ?`,
      [status, note, idAdmin, status === 'LUNAS' ? new Date() : null, idPesanan]
    );

    const [updated] = await loadOrders('WHERE p.id_pesanan = ?', [idPesanan]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status pembayaran', error: err.message });
  }
});

// DELETE /api/orders/:id - batalkan & hapus pesanan (Panel Admin)
// Stok dikembalikan bila pesanan belum dikirim, dan dicatat di riwayat_stok.
router.delete('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const idPesanan = await resolveIdPesanan(req.params.id, conn);
    if (!idPesanan) {
      conn.release();
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    await conn.beginTransaction();

    const [[pesanan]] = await conn.query(
      'SELECT nomor_pesanan, tahap FROM pesanan WHERE id_pesanan = ? FOR UPDATE',
      [idPesanan]
    );

    if (pesanan.tahap === 'DIBUAT' || pesanan.tahap === 'DIPROSES') {
      const [details] = await conn.query(
        'SELECT id_produk, jumlah FROM detail_pesanan WHERE id_pesanan = ?',
        [idPesanan]
      );
      const idAdmin = await getAdminId(conn);
      for (const d of details) {
        await conn.query('UPDATE produk SET stok = stok + ? WHERE id_produk = ?', [
          d.jumlah,
          d.id_produk,
        ]);
        await conn.query(
          'INSERT INTO riwayat_stok (id_produk, id_admin, jumlah, catatan, waktu) VALUES (?, ?, ?, ?, ?)',
          [d.id_produk, idAdmin, d.jumlah, `Pesanan ${pesanan.nomor_pesanan} dibatalkan`, new Date()]
        );
      }
    }

    // detail_pesanan, pengiriman, dan pembayaran ikut terhapus (ON DELETE CASCADE)
    await conn.query('DELETE FROM pesanan WHERE id_pesanan = ?', [idPesanan]);
    await conn.commit();

    res.json({ message: 'Pesanan berhasil dihapus', id: `#${pesanan.nomor_pesanan}` });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Gagal menghapus pesanan', error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
