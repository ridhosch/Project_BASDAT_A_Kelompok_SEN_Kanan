const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

const getSessionId = (req) => req.headers['x-session-id'] || req.query.sessionId || 'guest-default';

async function getOrderWithItems(orderRow) {
  const [items] = await pool.query(
    `SELECT oi.product_id AS productId, oi.product_title AS title, oi.product_title AS name,
            oi.price, oi.qty, COALESCE(p.image, '') AS image
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderRow.id]
  );

  return {
    id: orderRow.id,
    customer: orderRow.recipient_name || 'Pelanggan',
    createdAt: orderRow.created_at_label,
    estimatedArrival: orderRow.estimated_arrival,
    stage: orderRow.stage,
    courier: orderRow.courier,
    trackingNumber: orderRow.tracking_number,
    items,
    shippingCost: orderRow.shipping_cost,
    insuranceCost: orderRow.insurance_cost,
    serviceFee: orderRow.service_fee,
    totalAmount: orderRow.total_amount,
    paymentMethod: orderRow.payment_method,
    paymentType: orderRow.payment_type,
    vaNumber: orderRow.va_number || '',
    paidAt: orderRow.paid_at,
    payment: {
      method: orderRow.payment_method,
      type: orderRow.payment_type,
      va: orderRow.va_number || '',
      status: orderRow.payment_status || 'menunggu',
      note: orderRow.payment_note || '',
      confirmedAt: orderRow.confirmed_at || '',
    },
    address: {
      recipient: orderRow.recipient_name,
      phone: orderRow.recipient_phone,
      email: orderRow.recipient_email,
      label: orderRow.shipping_label,
      street: orderRow.shipping_street,
      note: orderRow.shipping_note,
    },
    note: orderRow.order_note || '',
  };
}

// GET /api/orders - Ambil semua pesanan user berdasarkan session (terbaru di atas)
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE session_id = ? ORDER BY created_at DESC',
      [sessionId]
    );
    const orders = await Promise.all(rows.map(getOrderWithItems));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil daftar pesanan', error: err.message });
  }
});

// GET /api/orders/all - Ambil SEMUA pesanan dari database untuk Panel Admin
router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = await Promise.all(rows.map(getOrderWithItems));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil semua pesanan', error: err.message });
  }
});

// GET /api/orders/latest - Ambil pesanan terakhir
router.get('/latest', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
      [sessionId]
    );
    if (rows.length === 0) return res.json(null);
    const order = await getOrderWithItems(rows[0]);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pesanan terbaru', error: err.message });
  }
});

// POST /api/orders - Checkout & buat pesanan baru dari senkanan-app
router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const sessionId = getSessionId(req);
    const {
      items,
      shippingMethod = 'reg',
      withInsurance = true,
      paymentMethod = 'BCA Virtual Account',
      vaNumber = '',
      address,
      note = '',
      clearCartAfter = true,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      conn.release();
      return res.status(400).json({ message: 'Keranjang belanja kosong' });
    }

    await conn.beginTransaction();

    const productIds = items.map((i) => i.productId);
    const [dbProducts] = await conn.query(
      `SELECT id, title, price, stock FROM products WHERE id IN (${productIds.map(() => '?').join(',')})`,
      productIds
    );
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prod = productMap.get(item.productId);
      if (!prod) {
        throw new Error(`Produk ${item.productId} tidak ditemukan di database`);
      }
      const qty = Math.max(1, Number(item.qty || 1));
      subtotal += prod.price * qty;
      verifiedItems.push({
        productId: prod.id,
        title: prod.title,
        price: prod.price,
        qty,
      });

      const nextStock = Math.max(0, Number(prod.stock || 0) - qty);
      const nextStatus = nextStock <= 0 ? 'habis' : nextStock <= 5 ? 'terbatas' : 'tersedia';
      const nextLabel = nextStock <= 0 ? 'Stok habis' : nextStock <= 5 ? 'Stok terbatas' : 'Stok tersedia';

      await conn.query(
        'UPDATE products SET stock = ?, stock_status = ?, stock_label = ? WHERE id = ?',
        [nextStock, nextStatus, nextLabel, prod.id]
      );
    }

    const shippingCost = shippingMethod === 'yes' ? 28000 : 18000;
    const insuranceCost = withInsurance ? 1800 : 0;
    const serviceFee = 1000;
    const totalAmount = subtotal + shippingCost + insuranceCost + serviceFee;

    const now = new Date();
    const dateCode = now.toISOString().slice(2, 10).replace(/-/g, '');
    const orderId = `#SK-${dateCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `SK${dateCode}${Math.floor(100000 + Math.random() * 900000)}`;
    const courier = shippingMethod === 'yes' ? 'JNE YES' : 'JNE Reguler';
    const estimatedArrival = shippingMethod === 'yes' ? '1-2 hari kerja' : '2-3 hari kerja';
    const paymentType = 'VA';

    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const pad = (v) => String(v).padStart(2, '0');
    const formattedNow = `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()} • ${pad(now.getHours())}.${pad(now.getMinutes())} WIB`;

    await conn.query(
      `INSERT INTO orders (
        id, session_id, stage, courier, tracking_number, estimated_arrival,
        subtotal, shipping_cost, insurance_cost, service_fee, total_amount,
        payment_method, payment_type, va_number, payment_status, paid_at,
        recipient_name, recipient_phone, recipient_email, shipping_label, shipping_street, shipping_note,
        order_note, created_at_label
      ) VALUES (?, ?, 'dibuat', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        sessionId,
        courier,
        trackingNumber,
        estimatedArrival,
        subtotal,
        shippingCost,
        insuranceCost,
        serviceFee,
        totalAmount,
        paymentMethod,
        paymentType,
        vaNumber,
        formattedNow,
        address?.recipient || 'Pelanggan',
        address?.phone || '',
        address?.email || '',
        address?.label || 'Rumah • Utama',
        address?.street || '',
        address?.note || '',
        note,
        formattedNow,
      ]
    );

    for (const vi of verifiedItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_title, price, qty) VALUES (?, ?, ?, ?, ?)',
        [orderId, vi.productId, vi.title, vi.price, vi.qty]
      );
    }

    if (clearCartAfter) {
      await conn.query('DELETE FROM cart_items WHERE session_id = ?', [sessionId]);
    }

    await conn.commit();
    conn.release();

    const [createdRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const createdOrder = await getOrderWithItems(createdRows[0]);
    res.status(201).json(createdOrder);
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('Error POST /api/orders:', err);
    res.status(500).json({ message: 'Gagal membuat pesanan', error: err.message });
  }
});

// PATCH /api/orders/:id/stage - Update status progres pengiriman pesanan
router.patch('/:id/stage', async (req, res) => {
  try {
    const orderId = decodeURIComponent(req.params.id);
    const { stage } = req.body;
    const validStages = ['dibuat', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];
    if (!validStages.includes(stage)) {
      return res.status(400).json({ message: 'Stage pesanan tidak valid' });
    }

    await pool.query('UPDATE orders SET stage = ? WHERE id = ?', [stage, orderId]);
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    const updated = await getOrderWithItems(rows[0]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status pesanan', error: err.message });
  }
});

// PATCH /api/orders/:id/payment - Konfirmasi atau tolak pembayaran VA oleh Admin
router.patch('/:id/payment', async (req, res) => {
  try {
    const orderId = decodeURIComponent(req.params.id);
    const { status, note = '', confirmedAt = '' } = req.body;
    if (!['menunggu', 'lunas', 'ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Status pembayaran tidak valid' });
    }

    await pool.query(
      'UPDATE orders SET payment_status = ?, payment_note = ?, confirmed_at = ? WHERE id = ?',
      [status, note, status === 'lunas' ? confirmedAt : '', orderId]
    );

    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    res.json(await getOrderWithItems(rows[0]));
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui status pembayaran', error: err.message });
  }
});

// DELETE /api/orders/:id - Hapus / batalkan pesanan dari Admin
router.delete('/:id', async (req, res) => {
  try {
    const orderId = decodeURIComponent(req.params.id);
    await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
    res.json({ message: 'Pesanan berhasil dihapus', id: orderId });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus pesanan', error: err.message });
  }
});

module.exports = router;
