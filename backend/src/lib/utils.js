const { pool } = require('../config/db');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const DEFAULT_CUSTOMER_EMAIL = 'tamu@senkanan.local';
const DEFAULT_ADMIN_EMAIL = 'admin@senkanan.local';

/**
 * Program belum punya login pelanggan (lihat catatan ERD), jadi pelanggan
 * diidentifikasi lewat email. Frontend boleh mengirim header `x-customer-email`
 * (dan opsional `x-customer-name`); tanpa header dipakai pelanggan "tamu".
 */
async function getPelangganId(req, db = pool) {
  const email = String(req.headers['x-customer-email'] || DEFAULT_CUSTOMER_EMAIL)
    .trim()
    .toLowerCase();
  const nama = String(req.headers['x-customer-name'] || 'Pelanggan SENkanan').trim();
  const [result] = await db.query(
    `INSERT INTO pelanggan (nama, email) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE id_pelanggan = LAST_INSERT_ID(id_pelanggan)`,
    [nama, email]
  );
  return result.insertId;
}

/** Admin yang tercatat pada riwayat_stok & pembayaran (login admin di program masih simulasi). */
async function getAdminId(db = pool) {
  const [result] = await db.query(
    `INSERT INTO admin (nama_admin, email, kata_sandi) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE id_admin = LAST_INSERT_ID(id_admin)`,
    ['Admin SENkanan', DEFAULT_ADMIN_EMAIL, 'belum-diset']
  );
  return result.insertId;
}

/** Frontend memakai SKU (mis. "sein-led-sequential") sebagai ID produk. */
async function findProdukIdBySku(sku, db = pool) {
  const [rows] = await db.query('SELECT id_produk FROM produk WHERE sku = ?', [String(sku)]);
  return rows.length ? rows[0].id_produk : null;
}

function stockStatus(stok) {
  const n = Number(stok || 0);
  if (n <= 0) return { status: 'habis', label: 'Stok habis' };
  if (n <= 5) return { status: 'terbatas', label: 'Stok terbatas' };
  return { status: 'tersedia', label: 'Stok tersedia' };
}

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const pad = (v) => String(v).padStart(2, '0');

function formatLabel(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()} • ${pad(d.getHours())}.${pad(d.getMinutes())} WIB`;
}

function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addBusinessDays(date, n) {
  const d = new Date(date);
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d;
}

/** Normalisasi plat nomor: huruf besar, tanpa spasi/simbol ("b 1234 abc" -> "B1234ABC"). */
function normalizePlate(plate) {
  return String(plate || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

module.exports = {
  HttpError,
  normalizePlate,
  getPelangganId,
  getAdminId,
  findProdukIdBySku,
  stockStatus,
  formatLabel,
  toDateStr,
  addBusinessDays,
};
