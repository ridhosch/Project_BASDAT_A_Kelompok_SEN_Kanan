// Konfigurasi & fungsi bantu panel admin SENkanan. Data diambil dari backend.

export const STORE_URL = import.meta.env.VITE_STORE_URL || '#';

export function stockStatus(stock) {
  if (stock <= 0) return 'habis';
  if (stock <= 5) return 'terbatas';
  return 'tersedia';
}

export function formatRupiah(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

export function formatVA(number) {
  if (!number) return '';
  return String(number).replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function nowLabel() {
  const d = new Date();
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const pad = (v) => String(v).padStart(2, '0');
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()} • ${pad(d.getHours())}.${pad(d.getMinutes())} WIB`;
}

export function orderSubtotal(order) {
  return (order?.items || []).reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0), 0);
}

export function orderTotal(order) {
  if (order?.totalAmount != null) return Number(order.totalAmount);
  return (
    orderSubtotal(order) +
    Number(order?.shippingCost || 0) +
    Number(order?.insuranceCost || 0) +
    Number(order?.serviceFee || 0)
  );
}

export function orderItemCount(order) {
  return (order?.items || []).reduce((s, i) => s + Number(i.qty || 0), 0);
}