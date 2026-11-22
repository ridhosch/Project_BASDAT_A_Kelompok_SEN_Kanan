import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout.jsx';
import { Toast } from './components/ui.jsx';
import LoginPage from './pages/LoginPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import StockPage from './pages/StockPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import { nowLabel } from './data.js';

const CANDIDATE_APIS = [
  import.meta.env.VITE_API_URL,
  'http://localhost:5001/api',
  'http://localhost:5000/api',
].filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i);

let resolvedApiCache = CANDIDATE_APIS[0] || 'http://localhost:5001/api';

async function getApiBase() {
  for (const base of CANDIDATE_APIS) {
    try {
      const res = await fetch(`${base}/health`);
      if (res.ok) {
        resolvedApiCache = base;
        return base;
      }
    } catch (e) {
      // coba port berikutnya
    }
  }
  return resolvedApiCache;
}

const FOOTER = {
  stock: '',
  orders: '',
  payments: '',
};

function normalizeOrder(o) {
  const addrObj = o.address && typeof o.address === 'object' ? o.address : null;
  const street = addrObj ? addrObj.street : (o.address || '');
  const cityMatch = String(street).match(/(Kota\s+[^,]+|Kab\.\s+[^,]+|Jakarta\s+[^,]+)/i);
  const method = o.payment?.method || o.paymentMethod || 'BCA Virtual Account';

  return {
    ...o,
    rawId: o.id,
    id: String(o.id || '').replace(/^#/, ''),
    customer: o.customer || addrObj?.recipient || 'Pelanggan',
    email: o.email || addrObj?.email || '',
    phone: o.phone || addrObj?.phone || '',
    addressLabel: o.addressLabel || addrObj?.label || '',
    address: street,
    city: o.city || (cityMatch ? cityMatch[1] : ''),
    resi: o.resi || o.trackingNumber || '',
    payment: {
      ...o.payment,
      bank: o.payment?.bank || method.replace(/\s*Virtual Account/i, '').trim(),
      va: o.payment?.va || o.vaNumber || '',
      status: o.payment?.status || 'menunggu',
      paidAt: o.payment?.paidAt || o.paidAt || '',
      confirmedAt: o.payment?.confirmedAt || '',
    },
  };
}

export default function App() {
  // page: login | welcome | stock | orders | payments
  const [page, setPage] = useState('login');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stockLog, setStockLog] = useState([]);
  const [user] = useState({ name: 'Admin SENkanan', role: 'Operasional' });
  const [lastUpdated, setLastUpdated] = useState({ stock: '', orders: '', payments: '' });
  const [toast, setToast] = useState('');
  const [orderSel, setOrderSel] = useState('');
  const [paySel, setPaySel] = useState('');

  const closeToast = useCallback(() => setToast(''), []);

  // Ambil daftar pesanan terbaru dari MySQL
  const fetchOrdersFromDb = useCallback(async () => {
    try {
      const apiBase = await getApiBase();
      const res = await fetch(`${apiBase}/orders/all`);
      if (!res.ok) return;
      const data = await res.json();
      setOrders(Array.isArray(data) ? data.map(normalizeOrder) : []);
      const stamp = `Diperbarui ${nowLabel()}`;
      setLastUpdated((prev) => ({ ...prev, orders: stamp, payments: stamp }));
    } catch (err) {
      console.error('Gagal mengambil pesanan dari server:', err);
    }
  }, []);

  // Ambil daftar produk & stok terbaru dari MySQL
  const fetchProductsFromDb = useCallback(async () => {
    try {
      const apiBase = await getApiBase();
      const res = await fetch(`${apiBase}/products`);
      if (!res.ok) return;
      const data = await res.json();
      setProducts(
        (Array.isArray(data) ? data : []).map((p) => ({
          ...p,
          name: p.title,
          sku: p.id,
        }))
      );
      setLastUpdated((prev) => ({ ...prev, stock: `Diperbarui ${nowLabel()}` }));
    } catch (err) {
      console.error('Gagal mengambil produk dari server:', err);
    }
  }, []);

  // Sinkronisasi otomatis setiap 3 detik agar pesanan baru dari app langsung muncul
  useEffect(() => {
    fetchOrdersFromDb();
    fetchProductsFromDb();
    const timer = setInterval(() => {
      fetchOrdersFromDb();
      fetchProductsFromDb();
    }, 3000);
    return () => clearInterval(timer);
  }, [fetchOrdersFromDb, fetchProductsFromDb]);

  useEffect(() => {
    if (!orderSel && orders.length > 0) {
      setOrderSel(orders[0].id);
    }
  }, [orders, orderSel]);

  useEffect(() => {
    if (!paySel && orders.length > 0) {
      const firstPending = orders.find((o) => o.payment?.status === 'menunggu') || orders[0];
      setPaySel(firstPending?.id || '');
    }
  }, [orders, paySel]);

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0 });
  };

  // Simpan penambahan stok ke MySQL
  const addStock = async (productId, qty, note) => {
    try {
      const apiBase = await getApiBase();
      const res = await fetch(`${apiBase}/products/${encodeURIComponent(productId)}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
      });
      if (res.ok) {
        await fetchProductsFromDb();
        setStockLog((prev) => [{ productId, qty, note, at: nowLabel() }, ...prev]);
      }
    } catch (err) {
      console.error('Gagal menambah stok:', err);
    }
  };

  const exportStock = () => {
    const rows = [['SKU', 'Produk', 'Kategori', 'Stok']].concat(
      products.map((p) => [p.sku, p.name, p.category, p.stock])
    );
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stok-senkanan.csv';
    a.click();
    URL.revokeObjectURL(url);
    setToast('Stok berhasil diekspor ke stok-senkanan.csv.');
  };

  // Admin mengonfirmasi / menolak pembayaran VA ke Database
  const decidePayment = async (orderId, status, note) => {
    const target = orders.find((o) => o.id === orderId);
    const dbId = target?.rawId || orderId;
    const confirmedAt = status === 'lunas' ? nowLabel() : '';
    try {
      const apiBase = await getApiBase();
      const res = await fetch(`${apiBase}/orders/${encodeURIComponent(dbId)}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: note || '', confirmedAt }),
      });
      if (res.ok) {
        await fetchOrdersFromDb();
      }
    } catch (err) {
      console.error('Gagal menyimpan status pembayaran:', err);
    }
  };

  // Majukan tahap pesanan: dibuat -> diproses -> dikirim ke Database
  const advanceOrder = async (orderId) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    let nextStage = null;
    let message = '';
    if (target.stage === 'dibuat' && target.payment?.status === 'lunas') {
      nextStage = 'diproses';
      message = `Pesanan #${orderId} mulai diproses.`;
    } else if (target.stage === 'diproses') {
      nextStage = 'dikirim';
      message = `Pesanan #${orderId} dikirim.`;
    }
    if (!nextStage) return;

    try {
      const apiBase = await getApiBase();
      const res = await fetch(`${apiBase}/orders/${encodeURIComponent(target.rawId || orderId)}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage }),
      });
      if (res.ok) {
        await fetchOrdersFromDb();
        setToast(message);
      }
    } catch (err) {
      console.error('Gagal memperbarui tahap pesanan:', err);
    }
  };

  // Batalkan dan hapus pesanan dari Database
  const cancelOrder = async (orderId) => {
    const target = orders.find((o) => o.id === orderId);
    try {
      const apiBase = await getApiBase();
      const res = await fetch(`${apiBase}/orders/${encodeURIComponent(target?.rawId || orderId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const next = orders.filter((o) => o.id !== orderId);
        setOrders(next);
        if (orderSel === orderId) setOrderSel(next[0]?.id || '');
        if (paySel === orderId) {
          const nextPending = next.find((o) => o.payment?.status === 'menunggu') || next[0];
          setPaySel(nextPending?.id || '');
        }
        setToast(`Pesanan #${orderId} berhasil dibatalkan dan dihapus.`);
      }
    } catch (err) {
      console.error('Gagal menghapus pesanan:', err);
    }
  };

  const pendingPayments = orders.filter((o) => o.payment?.status === 'menunggu').length;

  if (page === 'login') {
    return <LoginPage onLogin={() => navigate('orders')} />;
  }
  if (page === 'welcome') {
    return <WelcomePage onNavigate={navigate} pendingPayments={pendingPayments} />;
  }

  return (
    <>
      <AdminLayout
        page={page}
        onNavigate={navigate}
        onLogout={() => navigate('login')}
        counts={{ orders: orders.length, payments: pendingPayments }}
        user={user}
        footerNote={FOOTER[page]}
      >
        {page === 'stock' && (
          <StockPage
            products={products}
            lastUpdated={lastUpdated.stock}
            onAddStock={addStock}
            onExport={exportStock}
            onToast={setToast}
          />
        )}
        {page === 'orders' && (
          <OrdersPage
            orders={orders}
            lastUpdated={lastUpdated.orders}
            onAdvance={advanceOrder}
            onCancelOrder={cancelOrder}
            onGoPayments={(id) => {
              setPaySel(id);
              navigate('payments');
            }}
            selectedId={orderSel}
            setSelectedId={setOrderSel}
          />
        )}
        {page === 'payments' && (
          <PaymentsPage
            orders={orders}
            lastUpdated={lastUpdated.payments}
            onDecide={decidePayment}
            onToast={setToast}
            selectedId={paySel}
            setSelectedId={setPaySel}
          />
        )}
      </AdminLayout>
      <Toast message={toast} onClose={closeToast} />
    </>
  );
}
