import React, { useState, useEffect, useMemo } from 'react';

const PRODUCTS = [
  {
    id: 'sein-led-sequential',
    tag: 'PILIHAN SENKANAN',
    category: 'Lampu dan sein',
    title: 'Sein LED Sequential Mini',
    spec: 'Universal • Sepasang • 12V',
    price: 85000,
    stockStatus: 'tersedia',
    stockLabel: 'Stok tersedia',
    compatibility: 'Cocok untuk motor matic, bebek, dan sport dengan dudukan baut sein standar M10.',
    description:
      'Lampu sein LED model running sequential dengan cahaya amber terang agar sinyal belok lebih mudah terlihat siang maupun malam.',
    image: '/images/product-1.jpg',
    artType: 'sein',
  },
  {
    id: 'kampas-rem-cakram',
    tag: null,
    category: 'Pengereman',
    title: 'Kampas Rem Cakram Depan',
    spec: 'Vario 125/150 • Set depan',
    price: 45000,
    stockStatus: 'tersedia',
    stockLabel: 'Stok tersedia',
    compatibility: 'Vario 125, Vario 150, Beat FI, Scoopy, dan kaliper depan 1 piston sejenis.',
    description:
      'Kampas rem cakram depan dengan daya cengkeram stabil untuk penggunaan harian dalam kota maupun perjalanan jauh.',
    image: '/images/product-2.jpg',
    artType: 'kampas',
  },
  {
    id: 'spion-bar-end-cnc',
    tag: 'FAVORIT UPGRADE',
    category: 'Aksesori motor',
    title: 'Spion Bar End CNC',
    spec: 'Universal • Sepasang • Hitam',
    price: 175000,
    stockStatus: 'tersedia',
    stockLabel: 'Stok tersedia',
    compatibility: 'Stang berlubang diameter dalam 13-18 mm (matic, naked, retro, dan sport).',
    description:
      'Spion ujung stang berbahan aluminium CNC hitam matte dengan kaca cembung anti-silau untuk tampilan rapi dan visibilitas luas.',
    image: '/images/product-3.jpg',
    artType: 'spion',
  },
  {
    id: 'busi-iridium-performance',
    tag: null,
    category: 'Mesin dan komponen',
    title: 'Busi Iridium Performance',
    spec: 'Matic 110-150cc • 1 buah',
    price: 95000,
    stockStatus: 'tersedia',
    stockLabel: 'Stok tersedia',
    compatibility: 'Motor matic 110cc hingga 150cc (Vario, Beat, NMAX, Aerox, PCX, Mio).',
    description:
      'Elektroda iridium ujung halus membantu pembakaran lebih fokus, tarikan awal responsif, dan umur pakai lebih panjang.',
    image: '/images/product-4.jpg',
    artType: 'busi',
  },
  {
    id: 'lampu-led-headlight-h4',
    tag: null,
    category: 'Lampu dan sein',
    title: 'Lampu LED Headlight H4',
    spec: 'Soket H4 • Putih • 12V',
    price: 125000,
    stockStatus: 'tersedia',
    stockLabel: 'Stok tersedia',
    compatibility: 'Motor dengan reflektor utama soket H4 (Vixion, CB150R, Verza, Scoopy karbu, Vespa).',
    description:
      'Lampu utama LED soket H4 dilengkapi kipas pendingin aluminium dan cut-off cahaya rapi agar tidak menyilaukan pengendara lawan arah.',
    image: '/images/product-5.jpg',
    artType: 'headlight',
  },
  {
    id: 'piringan-cakram-220mm',
    tag: null,
    category: 'Pengereman',
    title: 'Piringan Cakram 220 mm',
    spec: 'Vario 125/150 • Stainless',
    price: 185000,
    stockStatus: 'terbatas',
    stockLabel: 'Stok terbatas',
    compatibility: 'Vario 125/150 lubang baut 4 (pemasangan plug and play ukuran standar 220 mm).',
    description:
      'Rotor cakram floating look berbahan baja tahan karat dengan lubang ventilasi untuk pelepasan panas optimal saat pengereman berulang.',
    image: '/images/product-6.jpg',
    artType: 'cakram',
  },
  {
    id: 'kiprok-regulator-4-pin',
    tag: null,
    category: 'Kelistrikan',
    title: 'Kiprok Regulator 4 Pin',
    spec: 'Bebek / matic • 12V',
    price: 78000,
    stockStatus: 'tersedia',
    stockLabel: 'Stok tersedia',
    compatibility: 'Sistem kelistrikan DC/AC 12V soket 4 pin pada motor bebek dan matic harian.',
    description:
      'Regulator rectifier dengan sirip pendingin tebal untuk menjaga tegangan pengisian aki tetap stabil dan mencegah lampu putus.',
    image: '/images/product-7.jpg',
    artType: 'kiprok',
  },
  {
    id: 'handgrip-karet-sport',
    tag: null,
    category: 'Aksesori motor',
    title: 'Handgrip Karet Sport',
    spec: 'Universal • Sepasang • Hitam',
    price: 65000,
    stockStatus: 'tersedia',
    stockLabel: 'Stok tersedia',
    compatibility: 'Semua stang motor ukuran standar 22 mm (kanan selongsong gas, kiri stang).',
    description:
      'Handgrip tekstur diamond anti-slip dengan cincin ujung aluminium anodized emas untuk genggaman mantap saat hujan maupun panas.',
    image: '/images/product-8.jpg',
    artType: 'handgrip',
  },
];

const CATEGORIES = [
  {
    name: 'Lampu dan sein',
    desc: 'Terang & lebih terlihat',
    featured: true,
    icon: 'bulb',
  },
  {
    name: 'Pengereman',
    desc: 'Kontrol di setiap jalan',
    featured: false,
    icon: 'brake',
  },
  {
    name: 'Kelistrikan',
    desc: 'Daya untuk perjalanan',
    featured: false,
    icon: 'battery',
  },
  {
    name: 'Aksesori motor',
    desc: 'Detail sesuai gayamu',
    featured: false,
    icon: 'handlebar',
  },
  {
    name: 'Mesin dan komponen',
    desc: 'Jaga performa motor',
    featured: false,
    icon: 'gear',
  },
];



const INITIAL_CART = [
  
];

const INITIAL_ADDRESS = {
  recipient: '',
  phone: '',
  email: '',
  label: '',
  street: '',
  note: '',
};

const INITIAL_ORDER = {
  id: '',
  createdAt: '',
  estimatedArrival: '',
  stage: '',
  courier: '',
  trackingNumber: '',
  items: [

  ],
  shippingCost: 0,
  insuranceCost: 0,
  serviceFee: 0,
  paymentMethod: '',
  paymentType: '',
  vaNumber: '',
  paidAt: '',
  address: INITIAL_ADDRESS,
  note: '',
};

const INFO_DOCS = {
  tentang: {
    title: 'Tentang SENkanan',
    subtitle: 'Part tepat. Motor siap.',
    body: [
      'SENkanan dirancang sebagai toko sparepart dan aksesori motor yang mengutamakan kejelasan spesifikasi, kecocokan tipe kendaraan, dan transparansi stok.',
      'Mulai dari kebutuhan perawatan berkala seperti kampas rem dan busi iridium hingga peningkatan tampilan seperti spion bar end CNC dan lampu sein LED sequential, setiap produk dilengkapi detail ukuran dan kecocokan.',
    ],
  },
  panduan: {
    title: 'Panduan Kecocokan Part',
    subtitle: 'Cocokkan tipe, tahun, soket, dan ukuran sebelum membeli.',
    body: [
      '1. Daftarkan merek, tipe/model, dan tahun motor pada menu Motor Saya agar catatan kecocokan selalu tampil saat memilih produk.',
      '2. Periksa spesifikasi soket kelistrikan (misalnya soket H4 atau regulator 4 pin) serta diameter dudukan (misalnya cakram 220 mm atau stang 22 mm).',
      '3. Jika ragu, gunakan tombol Konsultasi via WhatsApp untuk mencocokkan foto part lama dengan katalog SENkanan.',
    ],
  },
  pemesanan: {
    title: 'Cara Pemesanan',
    subtitle: 'Alur belanja ringkas dari katalog hingga pelacakan pesanan.',
    body: [
      '1. Pilih sparepart di halaman Beranda atau Katalog Produk, lalu buka Lihat Detail untuk memastikan spesifikasi.',
      '2. Tambahkan part ke Keranjang Belanja, sesuaikan jumlah item, dan periksa alamat pengiriman.',
      '3. Lanjutkan ke Checkout, pilih layanan kurir JNE Reguler atau Express, tentukan metode pembayaran, lalu klik Bayar Sekarang untuk memantau status pesanan.',
    ],
  },
  pengiriman: {
    title: 'Pengiriman & Ongkir',
    subtitle: 'Pengiriman ke seluruh Indonesia dengan estimasi transparan.',
    body: [
      'SENkanan menyediakan pilihan pengiriman JNE REG (Reguler, estimasi 2-3 hari kerja, Rp18.000) dan JNE YES (Express, estimasi 1 hari kerja, Rp28.000).',
      'Tersedia perlindungan asuransi pengiriman opsional sebesar Rp1.800 untuk melindungi paket dari risiko kerusakan atau kehilangan selama perjalanan.',
    ],
  },
  
  syarat: {
    title: 'Syarat & Ketentuan',
    subtitle: 'Ketentuan penggunaan konsep storefront SENkanan.',
    body: [
      'Seluruh nama produk, harga, nomor resi, dan data penerima pada pratinjau ini merupakan simulasi transaksi storefront SENkanan.',
      'Pastikan pembeli memeriksa kompatibilitas tipe dan tahun kendaraan sebelum menyelesaikan pembayaran.',
    ],
  },
  privasi: {
    title: 'Kebijakan Privasi',
    subtitle: 'Perlindungan data profil motor dan alamat pengiriman.',
    body: [
      'Data profil kendaraan pada menu Motor Saya serta alamat pengiriman hanya digunakan untuk mempermudah pengecekan kecocokan sparepart dan simulasi checkout.',
    ],
  },
};

// Format VA mengikuti pola nyata: 16 digit = kode perusahaan bank + nomor unik pelanggan.
// BCA: 5 digit kode perusahaan + 11 digit | BNI: 8 + 3 digit client ID + 12 digit |
// Mandiri: 5 digit kode perusahaan + 11 digit.
const VA_BANKS = [
  { id: 'bca', bank: 'BCA', prefix: '80777', hint: 'm-BCA, KlikBCA, ATM BCA' },
  { id: 'bni', bank: 'BNI', prefix: '8808', hint: 'BNI Mobile Banking, ATM BNI' },
  { id: 'mandiri', bank: 'Mandiri', prefix: '88908', hint: "Livin' by Mandiri, ATM Mandiri" },
];

function generateVANumber(bankId) {
  const bank = VA_BANKS.find((b) => b.id === bankId) || VA_BANKS[0];
  let digits = bank.prefix;
  while (digits.length < 16) {
    digits += Math.floor(Math.random() * 10);
  }
  return digits;
}

function generateAllVA() {
  return Object.fromEntries(VA_BANKS.map((b) => [b.id, generateVANumber(b.id)]));
}

function formatVA(number) {
  return number.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function vaLabel(va) {
  return `${va.bank} Virtual Account •••• ${va.number.slice(-4)}`;
}

function formatRupiah(amount) {
  return 'Rp' + Number(amount || 0).toLocaleString('id-ID');
}

function BrandLogo({ onClick }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="SENkanan Beranda"
      className="bg-white rounded-lg px-2.5 py-1.5 inline-flex flex-col items-center justify-center shadow-sm hover:opacity-95 transition-opacity shrink-0"
    >
      {!logoFailed ? (
        <img
          src="/images/logo-senkanan.png"
          alt="SENkanan - Sparepart & Aksesori Motor"
          width="408"
          height="136"
          onError={() => setLogoFailed(true)}
          className="h-11 w-auto object-contain"
        />
      ) : (
        <>
          <div className="font-black italic tracking-tighter text-lg leading-none">
            <span className="text-[#EAB308]">SEN</span>
            <span className="text-[#111111]">kanan</span>
          </div>
          <span className="text-[6.5px] font-extrabold tracking-[0.14em] text-[#111111] uppercase mt-0.5">
            SPAREPART &amp; AKSESORI MOTOR
          </span>
        </>
      )}
    </button>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span
        className={`inline-block w-5 h-[2px] ${light ? 'bg-[#111111]' : 'bg-[#FFD000]'}`}
        aria-hidden="true"
      />
      <span
        className={`text-[11px] font-extrabold uppercase tracking-[0.12em] ${
          light ? 'text-[#111111]' : 'text-[#FFD000]'
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function ProductArtwork({ product, className = 'w-full h-full object-cover' }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed && product.image) {
    return (
      <img
        src={product.image}
        alt={product.title}
        width="622"
        height="450"
        onError={() => setImgFailed(true)}
        className={className}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 320 230"
      className="w-full h-full bg-[#E5E5E5]"
      role="img"
      aria-label={product.title}
    >
      <rect width="320" height="230" fill="#E5E5E5" />
      <ellipse cx="160" cy="186" rx="84" ry="12" fill="#D4D4D4" />
      <rect x="96" y="72" width="128" height="86" rx="14" fill="#262626" />
      <circle cx="160" cy="115" r="26" fill="#FFD000" />
      <circle cx="160" cy="115" r="11" fill="#171717" />
    </svg>
  );
}

function CategoryIcon({ type }) {
  switch (type) {
    case 'bulb':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'brake':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" strokeLinecap="round" />
        </svg>
      );
    case 'battery':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <rect x="3" y="7" width="18" height="12" rx="2" />
          <path d="M7 7V5h2v2M15 7V5h2v2M12 10l-2 3h4l-2 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'handlebar':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <circle cx="5.5" cy="16.5" r="3.5" />
          <circle cx="18.5" cy="16.5" r="3.5" />
          <path d="M5.5 16.5L10 9h4l4.5 7.5M10 9l-1-3h3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

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

const SESSION_ID = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Tiap web dibuka, pelanggan dianggap "tamu baru" (data kosong). Setelah memasukkan data motor,
// identitas berpindah ke nomor plat sehingga data lama dengan plat yang sama bisa dipanggil kembali.
let customerEmail = `${SESSION_ID}@tamu.senkanan.local`;

const normalizePlate = (plate) => String(plate || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const plateToEmail = (plate) => `${normalizePlate(plate)}@motor.senkanan.local`;

function apiFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'x-session-id': SESSION_ID,
      'x-customer-email': customerEmail,
    },
  });
}

export default function App() {

  const [activeTab, setActiveTab] = useState('beranda');
  const [selectedCategory, setSelectedCategory] = useState('Semua Produk');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rekomendasi');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState(INITIAL_CART);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Profil Motor Saya (dari database)
  const [motorDraft, setMotorDraft] = useState({
    ownerName: '',
    brand: '',
    modelYear: '',
    plateNumber: '',
  });
  const [savedMotor, setSavedMotor] = useState(null);
  const [motorError, setMotorError] = useState('');

  // Alamat & Checkout State (dari database)
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState(INITIAL_ADDRESS);
  const [shippingMethod, setShippingMethod] = useState('reg');
  const [withInsurance, setWithInsurance] = useState(true);
  const [orderNote, setOrderNote] = useState('');
  const [selectedVAId, setSelectedVAId] = useState('bca');
  const [vaNumbers, setVaNumbers] = useState(generateAllVA);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Orders & Modal State (dari database)
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(INITIAL_ORDER);
  const [infoModalKey, setInfoModalKey] = useState(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  // Modal peringatan saat checkout tetapi data alamat / motor belum lengkap
  const [checkoutAlert, setCheckoutAlert] = useState(null); // { missingAddress, missingMotor } | null

  const selectedVABank = VA_BANKS.find((v) => v.id === selectedVAId) || VA_BANKS[0];
  const selectedVA = { ...selectedVABank, number: vaNumbers[selectedVABank.id] };
  const appliedPaymentLabel = vaLabel(selectedVA);

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const subtotalCart = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        const unitPrice = prod ? prod.price : Number(item.price || 0);
        return sum + unitPrice * item.qty;
      }, 0),
    [cart]
  );

  const payableTotal =
    subtotalCart + (shippingMethod === 'yes' ? 28000 : 18000) + (withInsurance ? 1800 : 0) + 1000;

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setInfoModalKey(null);
        setIsConsultModalOpen(false);
        setIsWelcomeModalOpen(false);
        setIsPaymentModalOpen(false);
        setIsEditingAddress(false);
        setCheckoutAlert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Muat keranjang, wishlist, profil, dan pesanan dari MySQL melalui Backend API
  useEffect(() => {
    let active = true;
    const loadInitialFromDb = async () => {
      try {
        const apiBase = await getApiBase();
        const [cartRes, wishRes, motorRes, addrRes, ordersRes] = await Promise.all([
          apiFetch(`${apiBase}/cart`),
          apiFetch(`${apiBase}/wishlist`),
          apiFetch(`${apiBase}/profile/motor`),
          apiFetch(`${apiBase}/profile/address`),
          apiFetch(`${apiBase}/orders`),
        ]);

        if (!active) return;

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCart(Array.isArray(cartData) ? cartData : []);
        }
        if (wishRes.ok) {
          const wishData = await wishRes.json();
          setWishlist(Array.isArray(wishData) ? wishData : []);
        }
        if (motorRes.ok) {
          const motorData = await motorRes.json();
          if (motorData) {
            setSavedMotor(motorData);
            setMotorDraft(motorData);
          }
        }
        if (addrRes.ok) {
          const addrData = await addrRes.json();
          if (addrData) {
            setAddress(addrData);
            setAddressDraft(addrData);
          }
        }
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const list = Array.isArray(ordersData) ? ordersData : [];
          setOrders(list);
          if (list.length > 0) {
            setCurrentOrder(list[0]);
          }
        }
      } catch (err) {
        console.error('Gagal memuat data dari backend:', err);
      }
    };

    loadInitialFromDb();
    return () => {
      active = false;
    };
  }, []);

  // Sinkronisasi berkala pesanan & status pembayaran dari database agar perubahan Admin langsung tampil
  useEffect(() => {
    const syncOrders = async () => {
      try {
        const apiBase = await getApiBase();
        const ordersRes = await apiFetch(`${apiBase}/orders`);
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const list = Array.isArray(ordersData) ? ordersData : [];
          setOrders(list);
          setCurrentOrder((prev) => {
            if (list.length === 0) return INITIAL_ORDER;
            if (!prev.id) return list[0];
            const updated = list.find((o) => o.id === prev.id);
            return updated || list[0];
          });
        }
      } catch (err) {
        // Abaikan sementara jika server sedang restart
      }
    };

    const timer = setInterval(syncOrders, 3500);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (tab, categoryOverride = null) => {
    setActiveTab(tab);
    if (categoryOverride) {
      setSelectedCategory(categoryOverride);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = async (productId) => {
    try {
      const apiBase = await getApiBase();
      const res = await apiFetch(`${apiBase}/wishlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setWishlist(Array.isArray(updated) ? updated : []);
      }
    } catch (err) {
      showToast('Gagal memperbarui favorit di database.');
    }
  };

  const addToCart = async (productId, qty = 1) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    try {
      const apiBase = await getApiBase();
      const res = await apiFetch(`${apiBase}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyimpan item ke keranjang database.');
      }
      setCart(Array.isArray(data) ? data : []);
      if (prod) {
        showToast(`${prod.title} (${qty} item) disimpan ke keranjang.`);
      }
    } catch (err) {
      showToast(err.message || 'Backend tidak terhubung. Pastikan senkanan-backend berjalan.');
    }
  };

  const updateCartQty = async (productId, delta) => {
    const existing = cart.find((i) => i.productId === productId);
    if (!existing) return;
    const nextQty = Math.max(1, existing.qty + delta);
    try {
      const apiBase = await getApiBase();
      const res = await apiFetch(`${apiBase}/cart/${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: nextQty }),
      });
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(Array.isArray(updatedCart) ? updatedCart : []);
      }
    } catch (err) {
      showToast('Gagal memperbarui jumlah keranjang.');
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const apiBase = await getApiBase();
      const res = await apiFetch(`${apiBase}/cart/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(Array.isArray(updatedCart) ? updatedCart : []);
      }
    } catch (err) {
      showToast('Gagal menghapus item dari keranjang.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateTo('katalog');
  };

  // Salin keranjang, favorit (dan alamat) yang sudah diisi di sesi ini ke identitas pelanggan baru
  const carryOverSessionData = async (apiBase, { withAddress }) => {
    for (const item of cart) {
      await apiFetch(`${apiBase}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.productId, qty: item.qty }),
      });
    }
    if (wishlist.length > 0) {
      const haveRes = await apiFetch(`${apiBase}/wishlist`);
      const have = haveRes.ok ? await haveRes.json() : [];
      for (const productId of wishlist) {
        if (Array.isArray(have) && have.includes(productId)) continue;
        await apiFetch(`${apiBase}/wishlist/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
      }
    }
    if (withAddress && isAddressComplete) {
      await apiFetch(`${apiBase}/profile/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
    }
  };

  // Panggil kembali semua data milik pelanggan (motor, alamat, keranjang, favorit, pesanan)
  const recallCustomerData = async (apiBase) => {
    const [cartRes, wishRes, motorRes, addrRes, ordersRes] = await Promise.all([
      apiFetch(`${apiBase}/cart`),
      apiFetch(`${apiBase}/wishlist`),
      apiFetch(`${apiBase}/profile/motor`),
      apiFetch(`${apiBase}/profile/address`),
      apiFetch(`${apiBase}/orders`),
    ]);
    if (cartRes.ok) {
      const data = await cartRes.json();
      setCart(Array.isArray(data) ? data : []);
    }
    if (wishRes.ok) {
      const data = await wishRes.json();
      setWishlist(Array.isArray(data) ? data : []);
    }
    if (motorRes.ok) {
      const data = await motorRes.json();
      if (data) {
        setSavedMotor(data);
        setMotorDraft(data);
      }
    }
    if (addrRes.ok) {
      const data = await addrRes.json();
      if (data) {
        setAddress(data);
        setAddressDraft(data);
      }
    }
    if (ordersRes.ok) {
      const data = await ordersRes.json();
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      setCurrentOrder(list.length > 0 ? list[0] : INITIAL_ORDER);
    }
  };

  const handleSaveMotor = async (e) => {
    if (e) e.preventDefault();
    if (!motorDraft.brand.trim() || !motorDraft.modelYear.trim()) {
      setMotorError('Isi minimal merek dan tipe/model motor sebelum menyimpan.');
      return;
    }
    if (!normalizePlate(motorDraft.plateNumber)) {
      setMotorError('Isi nomor plat agar datamu bisa dipanggil kembali saat web dibuka lagi.');
      return;
    }
    setMotorError('');

    const previousEmail = customerEmail;
    const nextEmail = plateToEmail(motorDraft.plateNumber);

    try {
      const apiBase = await getApiBase();

      if (nextEmail !== previousEmail) {
        // Ganti identitas ke plat ini, lalu cek apakah plat ini sudah pernah terdaftar
        customerEmail = nextEmail;
        const existingRes = await apiFetch(`${apiBase}/profile/motor`);
        const existing = existingRes.ok ? await existingRes.json() : null;

        if (existing) {
          await carryOverSessionData(apiBase, { withAddress: false });
          await recallCustomerData(apiBase);
          showToast(`Data untuk plat ${motorDraft.plateNumber.toUpperCase()} ditemukan.`);
          return;
        }

        // Plat baru: bawa data yang sudah diisi di sesi ini
        await carryOverSessionData(apiBase, { withAddress: true });
      }

      const res = await apiFetch(`${apiBase}/profile/motor`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motorDraft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data motor');
      setSavedMotor(data);
      setMotorDraft(data);
      showToast('Profil Motor Saya berhasil disimpan.');
    } catch (err) {
      customerEmail = previousEmail;
      showToast(err.message || 'Gagal terhubung ke database.');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...addressDraft,
        phone: addressDraft.phone?.trim() || '-',
        label: addressDraft.label?.trim() || 'Rumah • Utama',
      };
      const apiBase = await getApiBase();
      const res = await apiFetch(`${apiBase}/profile/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan alamat');
      setAddress(data);
      setAddressDraft(data);
      setIsEditingAddress(false);
      showToast('Alamat pengiriman disimpan ke database.');
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan alamat ke database.');
    }
  };

  // Validasi kelengkapan data sebelum checkout
  const isAddressComplete =
    Boolean(address.recipient?.trim()) &&
    Boolean(address.phone?.trim()) &&
    address.phone.trim() !== '-' &&
    Boolean(address.street?.trim());
  const isMotorComplete = Boolean(savedMotor?.brand?.trim() && savedMotor?.modelYear?.trim());

  const handleRequestPayment = () => {
    if (cart.length === 0) return;
    const missingAddress = !isAddressComplete;
    const missingMotor = !isMotorComplete;
    if (missingAddress || missingMotor) {
      setCheckoutAlert({ missingAddress, missingMotor });
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleCheckoutSubmit = async () => {
    if (cart.length === 0) return;
    if (!isAddressComplete || !isMotorComplete) {
      setCheckoutAlert({ missingAddress: !isAddressComplete, missingMotor: !isMotorComplete });
      return;
    }
    setIsSubmittingOrder(true);

    try {
      const apiBase = await getApiBase();
      const response = await apiFetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
          shippingMethod,
          withInsurance,
          paymentMethod: appliedPaymentLabel,
          vaNumber: selectedVA.number,
          address: {
            ...address,
            recipient: address.recipient?.trim() || 'Pelanggan SENkanan',
          },
          note: orderNote,
          clearCartAfter: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan pesanan ke database');
      }

      const created = {
        ...data,
        vaNumber: data.vaNumber || selectedVA.number,
      };
      setCurrentOrder(created);
      setOrders((prev) => [created, ...prev]);
      setCart([]);
      setOrderNote('');
      setVaNumbers(generateAllVA());
      navigateTo('pesanan');
      showToast(`Pesanan ${data.id} berhasil disimpan ke database.`);
    } catch (err) {
      showToast(err.message || 'Gagal terhubung ke server backend.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col font-sans">
      {/* Top Yellow Announcement Bar */}
      <div className="bg-[#FFD000] text-[#111111] text-[11px] font-extrabold px-4 sm:px-8 py-1.5">
        <div className="max-w-[1320px] mx-auto flex justify-between items-center gap-4">
          <span className="tracking-wide uppercase">PART TEPAT. MOTOR SIAP.</span>
          <span className="hidden sm:inline font-semibold">
            Sparepart &amp; aksesori motor &nbsp;/&nbsp; Pengiriman ke seluruh Indonesia
          </span>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header className="bg-[#111111] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-9">
            <BrandLogo onClick={() => navigateTo('beranda')} />

            <nav aria-label="Navigasi utama" className="flex items-center gap-5 sm:gap-7 text-sm">
              {[
                { id: 'beranda', label: 'Beranda' },
                { id: 'katalog', label: 'Katalog' },
                { id: 'motor-saya', label: 'Motor Saya' },
              ].map((nav) => {
                const isActive = activeTab === nav.id;
                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => navigateTo(nav.id)}
                    className={`relative py-2 min-h-[44px] inline-flex items-center font-semibold transition-colors ${
                      isActive ? 'text-[#FFD000]' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    {nav.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FFD000] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="order-3 md:order-2 w-full md:flex-1 md:max-w-md relative"
            role="search"
          >
            <label htmlFor="global-part-search" className="sr-only">
              Cari part untuk motormu
            </label>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              id="global-part-search"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'katalog' && e.target.value.trim().length > 0) {
                  setActiveTab('katalog');
                }
              }}
              placeholder="Cari part untuk motormu..."
              className="w-full min-h-[44px] bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#FFD000] transition-colors"
            />
          </form>

          <div className="order-2 md:order-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('pesanan')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold border transition-colors inline-flex items-center gap-1.5 ${
                activeTab === 'pesanan'
                  ? 'border-[#FFD000] text-[#FFD000] bg-[#FFD000]/10'
                  : 'border-white/10 text-zinc-300 hover:text-white hover:border-white/25'
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
              </svg>
              <span>Pesanan</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('keranjang')}
              aria-label={`Keranjang Belanja, ${totalCartItems} item`}
              className={`min-h-[44px] px-3 py-2 rounded-lg inline-flex items-center gap-2 transition-colors ${
                activeTab === 'keranjang' || activeTab === 'checkout'
                  ? 'bg-white/10 text-[#FFD000]'
                  : 'text-zinc-200 hover:bg-white/5'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 7H6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="bg-[#FFD000] text-[#111111] text-xs font-extrabold min-w-[22px] h-[22px] px-1.5 rounded-full inline-flex items-center justify-center">
                {totalCartItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Alert Banner (ringkas, tidak menutupi halaman) */}
      {isWelcomeModalOpen && !savedMotor && (
        <div className="bg-[#1E1E1E] px-4 sm:px-8 pt-4">
          <div
            role="alert"
            aria-labelledby="welcome-alert-title"
            className="max-w-[1320px] mx-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 bg-[#252525] border border-white/15 border-l-[6px] border-l-[#FFD000] rounded-lg pl-4 pr-3 py-3.5"
          >
            <div className="flex-1 min-w-0 text-xs sm:text-sm leading-relaxed text-zinc-300">
              <span className="inline-block align-middle bg-[#FFD000] text-[#111111] text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded mr-2.5 my-0.5">
                Selamat datang
              </span>
              <strong id="welcome-alert-title" className="text-white font-bold">
                Daftarkan data motormu dulu!
              </strong>{' '}
              Agar tidak salah pilih ukuran soket, kampas, atau dudukan baut, lengkapi merek, tipe, dan tahun motor kamu di halaman{' '}
              <strong className="text-[#FFD000]">Motor Saya</strong>.
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setIsWelcomeModalOpen(false);
                  navigateTo('motor-saya');
                }}
                className="min-h-[44px] px-4 rounded-lg border border-[#FFD000] text-[#FFD000] hover:bg-[#FFD000] hover:text-[#111111] font-bold text-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Isi Data Motor</span>
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWelcomeModalOpen(false)}
                aria-label="Tutup peringatan"
                className="w-11 h-11 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 inline-flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#111111] border border-[#FFD000] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFD000]" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Active Route View */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <BerandaView
            navigateTo={navigateTo}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onOpenDetail={setSelectedProduct}
            onOpenConsult={() => setIsConsultModalOpen(true)}
            savedMotor={savedMotor}
          />
        )}

        {activeTab === 'katalog' && (
          <KatalogView
            navigateTo={navigateTo}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onOpenDetail={setSelectedProduct}
            onOpenConsult={() => setIsConsultModalOpen(true)}
            savedMotor={savedMotor}
          />
        )}

        {activeTab === 'motor-saya' && (
          <MotorSayaView
            navigateTo={navigateTo}
            motorDraft={motorDraft}
            setMotorDraft={setMotorDraft}
            savedMotor={savedMotor}
            motorError={motorError}
            onSaveMotor={handleSaveMotor}
            onOpenConsult={() => setIsConsultModalOpen(true)}
          />
        )}

        {activeTab === 'keranjang' && (
          <KeranjangView
            navigateTo={navigateTo}
            cart={cart}
            subtotalCart={subtotalCart}
            totalCartItems={totalCartItems}
            updateCartQty={updateCartQty}
            removeCartItem={removeCartItem}
            address={address}
            onStartEditAddress={() => {
              setAddressDraft({ ...address });
              setIsEditingAddress(true);
            }}
            onOpenConsult={() => setIsConsultModalOpen(true)}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutView
            navigateTo={navigateTo}
            cart={cart}
            subtotalCart={subtotalCart}
            totalCartItems={totalCartItems}
            address={address}
            onStartEditAddress={() => {
              setAddressDraft({ ...address });
              setIsEditingAddress(true);
            }}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            withInsurance={withInsurance}
            setWithInsurance={setWithInsurance}
            orderNote={orderNote}
            setOrderNote={setOrderNote}
            selectedVAId={selectedVAId}
            setSelectedVAId={setSelectedVAId}
            vaNumbers={vaNumbers}
            onOpenPaymentModal={handleRequestPayment}
            isSubmittingOrder={isSubmittingOrder}
            onOpenConsult={() => setIsConsultModalOpen(true)}
            showToast={showToast}
          />
        )}

        {activeTab === 'pesanan' && (
          <PesananView
            navigateTo={navigateTo}
            orders={orders}
            order={currentOrder}
            onSelectOrder={setCurrentOrder}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#181818] border-t border-white/10 text-zinc-400 text-sm mt-auto">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-10">
            <div className="lg:col-span-4 space-y-4">
              <BrandLogo onClick={() => navigateTo('beranda')} />
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                Teman cari sparepart dan aksesori motor. Dari kebutuhan harian sampai detail yang bikin motor jadi lebih kamu.
              </p>
              <p className="text-[#FFD000] font-black text-base tracking-tight pt-1">
                PART TEPAT. MOTOR SIAP.
              </p>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-white font-bold text-sm mb-4">Jelajahi</h2>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button type="button" onClick={() => navigateTo('beranda')} className="hover:text-[#FFD000] transition-colors">
                    Beranda
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('katalog')} className="hover:text-[#FFD000] transition-colors">
                    Katalog Produk
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigateTo('motor-saya')} className="hover:text-[#FFD000] transition-colors">
                    Motor Saya
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setInfoModalKey('tentang')} className="hover:text-[#FFD000] transition-colors">
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsConsultModalOpen(true)} className="hover:text-[#FFD000] transition-colors">
                    Panduan Kecocokan
                  </button>
                </li>
              </ul>
            </div>

            

            <div className="lg:col-span-3">
              <h2 className="text-white font-bold text-sm mb-4">Hubungi Kami</h2>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#FFD000]" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
                    </svg>
                  </span>
                  <a href="https://wa.me/6281936734212" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD000] transition-colors">WhatsApp: +62 819-3673-4212</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#FFD000]" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                  </span>
                  <span>Instagram: @senkanan.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#FFD000]" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <span>halosenkanan@gmail.com</span>
                </li>
              </ul>
              
            </div>
          </div>

          {/* Shipping Info Strip inside Footer */}
          <div className="bg-[#232323] border border-white/10 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <span className="text-[#FFD000] mt-0.5 sm:mt-0 shrink-0" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <div>
                <p className="text-white font-bold text-xs">
                  Siap menemani perjalananmu, di mana pun kamu berada.
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Pengiriman ke seluruh Indonesia. Estimasi tiba dan biaya kirim mengikuti alamat serta kurir pilihan saat checkout.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInfoModalKey('pengiriman')}
              className="text-xs font-bold text-[#FFD000] hover:underline shrink-0 inline-flex items-center gap-1 min-h-[44px]"
            >
              <span>Info pengiriman</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-zinc-500">
            <span>© 2026 SENkanan. Sparepart &amp; Aksesori Motor.</span>
           
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          savedMotor={savedMotor}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
          onAddToCart={(qty) => {
            addToCart(selectedProduct.id, qty);
            setSelectedProduct(null);
          }}
          onGoMotorSaya={() => {
            setSelectedProduct(null);
            navigateTo('motor-saya');
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Edit Address Modal */}
      {isEditingAddress && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-address-title"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="bg-[#1E1E1E] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 id="edit-address-title" className="text-lg font-black text-white">
                Ubah Alamat Pengiriman
              </h2>
              <button
                type="button"
                onClick={() => setIsEditingAddress(false)}
                aria-label="Tutup dialog"
                className="w-10 h-10 rounded-lg bg-[#252525] text-zinc-300 hover:text-white inline-flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSaveAddress}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="addr-recipient" className="block text-zinc-400 font-bold uppercase mb-1">
                    Nama Penerima
                  </label>
                  <input
                    id="addr-recipient"
                    type="text"
                    required
                    value={addressDraft.recipient}
                    onChange={(e) => setAddressDraft({ ...addressDraft, recipient: e.target.value })}
                    className="w-full min-h-[44px] bg-[#252525] border border-white/10 rounded-lg px-3 text-white text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="addr-phone" className="block text-zinc-400 font-bold uppercase mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    id="addr-phone"
                    type="text"
                    required
                    value={addressDraft.phone}
                    onChange={(e) => setAddressDraft({ ...addressDraft, phone: e.target.value })}
                    className="w-full min-h-[44px] bg-[#252525] border border-white/10 rounded-lg px-3 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="addr-street" className="block text-zinc-400 font-bold uppercase mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  id="addr-street"
                  rows={2}
                  required
                  value={addressDraft.street}
                  onChange={(e) => setAddressDraft({ ...addressDraft, street: e.target.value })}
                  className="w-full bg-[#252525] border border-white/10 rounded-lg p-3 text-white text-sm"
                />
              </div>

              <div>
                <label htmlFor="addr-note" className="block text-zinc-400 font-bold uppercase mb-1">
                  Patokan Alamat
                </label>
                <input
                  id="addr-note"
                  type="text"
                  value={addressDraft.note}
                  onChange={(e) => setAddressDraft({ ...addressDraft, note: e.target.value })}
                  className="w-full min-h-[44px] bg-[#252525] border border-white/10 rounded-lg px-3 text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="min-h-[44px] px-4 rounded-lg bg-[#252525] text-zinc-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-lg bg-[#FFD000] text-[#111111] font-bold"
                >
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Alert Modal: alamat / data motor belum lengkap */}
      {checkoutAlert && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="checkout-alert-title"
          aria-describedby="checkout-alert-desc"
          className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center p-4"
          onClick={() => setCheckoutAlert(null)}
        >
          <div
            className="bg-[#1E1E1E] border border-white/15 border-t-[6px] border-t-[#FFD000] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="w-11 h-11 shrink-0 rounded-full bg-[#FFD000] text-[#111111] inline-flex items-center justify-center text-xl font-black"
                >
                  !
                </span>
                <div>
                  <Eyebrow>DATA BELUM LENGKAP</Eyebrow>
                  <h2 id="checkout-alert-title" className="text-xl font-black text-white mt-1">
                    Lengkapi data dulu sebelum checkout
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutAlert(null)}
                aria-label="Tutup peringatan"
                className="w-10 h-10 rounded-lg bg-[#252525] text-zinc-300 hover:text-white inline-flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>

            <p id="checkout-alert-desc" className="text-xs text-zinc-300 leading-relaxed">
              Pesananmu belum bisa diproses karena data berikut masih kosong:
            </p>

            <ul className="space-y-2.5 text-xs">
              {checkoutAlert.missingAddress && (
                <li className="bg-[#252525] border border-white/10 rounded-xl p-3.5">
                  <p className="font-bold text-white">Alamat penerima belum diisi</p>
                  <p className="text-zinc-400 mt-1 leading-relaxed">
                    Isi nama penerima, nomor telepon, dan alamat lengkap agar kurir tahu ke mana part dikirim.
                  </p>
                </li>
              )}
              {checkoutAlert.missingMotor && (
                <li className="bg-[#252525] border border-white/10 rounded-xl p-3.5">
                  <p className="font-bold text-white">Identitas motor belum diisi</p>
                  <p className="text-zinc-400 mt-1 leading-relaxed">
                    Isi merek dan tipe/tahun motor di Motor Saya supaya part yang dipesan sesuai kendaraanmu.
                  </p>
                </li>
              )}
            </ul>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setCheckoutAlert(null)}
                className="min-h-[46px] px-4 rounded-xl bg-[#252525] hover:bg-[#2E2E2E] text-zinc-300 font-semibold text-xs"
              >
                Nanti saja
              </button>
              <button
                type="button"
                onClick={() => {
                  const { missingAddress } = checkoutAlert;
                  setCheckoutAlert(null);
                  if (missingAddress) {
                    setAddressDraft({ ...address });
                    setIsEditingAddress(true);
                  } else {
                    navigateTo('motor-saya');
                  }
                }}
                className="flex-1 min-h-[46px] px-5 rounded-xl bg-[#FFD000] hover:bg-[#ffe033] text-[#111111] font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>{checkoutAlert.missingAddress ? 'Isi Alamat Sekarang' : 'Isi Data Motor'}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            {checkoutAlert.missingAddress && checkoutAlert.missingMotor && (
              <button
                type="button"
                onClick={() => {
                  setCheckoutAlert(null);
                  navigateTo('motor-saya');
                }}
                className="w-full text-center text-xs font-bold text-[#FFD000] hover:underline min-h-[36px]"
              >
                Isi data motor dulu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {isPaymentModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-modal-title"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="bg-[#1E1E1E] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow>KONFIRMASI PEMBAYARAN</Eyebrow>
                <h2 id="payment-modal-title" className="text-xl font-black text-white mt-1.5">
                  Sudah bayar lewat Virtual Account?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                aria-label="Tutup konfirmasi pembayaran"
                className="w-10 h-10 rounded-lg bg-[#252525] text-zinc-300 hover:text-white inline-flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#252525] border border-white/10 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between gap-4 text-zinc-300">
                <span>Bank</span>
                <span className="font-bold text-white">{selectedVA.bank} Virtual Account</span>
              </div>
              <div className="flex justify-between gap-4 text-zinc-300">
                <span>No. Virtual Account</span>
                <span className="font-bold text-white tabular-nums">{formatVA(selectedVA.number)}</span>
              </div>
              <div className="flex justify-between items-baseline gap-4 pt-3 border-t border-white/10">
                <span className="text-sm font-bold text-white">Total pembayaran</span>
                <span className="text-xl font-black text-[#FFD000]">{formatRupiah(payableTotal)}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Pastikan nominal transfer sesuai total pembayaran. Setelah konfirmasi, pesananmu akan langsung tampil di tab Pesanan.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="min-h-[46px] px-4 rounded-xl bg-[#252525] hover:bg-[#2E2E2E] text-zinc-300 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmittingOrder || cart.length === 0}
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  handleCheckoutSubmit();
                }}
                className="flex-1 min-h-[46px] px-5 rounded-xl bg-[#FFD000] hover:bg-[#ffe033] disabled:opacity-50 text-[#111111] font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Konfirmasi Pembayaran</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      {isConsultModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consult-modal-title"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="bg-[#1E1E1E] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <Eyebrow>KONSULTASI KECOCOKAN</Eyebrow>
                <h2 id="consult-modal-title" className="text-xl font-black text-white mt-1">
                  Cek Kecocokan Part
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsConsultModalOpen(false)}
                aria-label="Tutup konsultasi"
                className="w-10 h-10 rounded-lg bg-[#252525] text-zinc-300 hover:text-white inline-flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {savedMotor
                ? `Data motor aktif kamu: ${savedMotor.brand} ${savedMotor.modelYear} (${savedMotor.plateNumber || 'tanpa plat'}). Siap dicocokkan dengan part di katalog.`
                : 'Belum ada data motor tersimpan. Kamu bisa mengisi tipe motor di halaman Motor Saya atau menanyakan ukuran soket langsung.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://wa.me/6281936734212"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsConsultModalOpen(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[#FFD000] text-[#111111] font-bold text-xs inline-flex items-center gap-2"
              >
                <span>Chat WhatsApp (+62 819-3673-4212)</span>
                <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsConsultModalOpen(false);
                  navigateTo('motor-saya');
                }}
                className="min-h-[44px] px-4 rounded-xl bg-[#252525] text-zinc-200 font-semibold text-xs"
              >
                Isi Data Motor Saya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal (Footer & Panduan Kecocokan) */}
      {infoModalKey && INFO_DOCS[infoModalKey] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="bg-[#1E1E1E] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow>INFORMASI SENKANAN</Eyebrow>
                <h2 id="info-modal-title" className="text-xl font-black text-white mt-1">
                  {INFO_DOCS[infoModalKey].title}
                </h2>
                <p className="text-xs text-[#FFD000] font-semibold mt-0.5">
                  {INFO_DOCS[infoModalKey].subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInfoModalKey(null)}
                aria-label="Tutup informasi"
                className="w-10 h-10 rounded-lg bg-[#252525] text-zinc-300 hover:text-white inline-flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              {INFO_DOCS[infoModalKey].body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoModalKey(null)}
                className="min-h-[44px] px-5 rounded-xl bg-[#FFD000] text-[#111111] font-bold text-xs"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   1. BERANDA VIEW
   ============================================================================ */
function BerandaView({
  navigateTo,
  selectedCategory,
  setSelectedCategory,
  wishlist,
  toggleWishlist,
  onOpenDetail,
  onOpenConsult,
  savedMotor,
}) {
  const featuredProducts = useMemo(() => {
    if (selectedCategory === 'Semua Produk') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      {/* Hero Section (#111111) */}
      <section className="bg-[#111111] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 px-4 sm:px-8 py-12 lg:py-20 flex flex-col justify-center space-y-6">
            <div>
              <Eyebrow>SPAREPART &amp; AKSESORI MOTOR</Eyebrow>
              <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-black tracking-tight leading-[1.04] mt-4">
                <span className="block text-white">Sparepart Motor?</span>
                <span className="block text-[#FFD000]">SENkanan Aja.</span>
              </h1>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-md">
              Dari perawatan harian sampai upgrade tampilan. Temukan part yang pas untuk motor dan gaya berkendaramu.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => navigateTo('katalog')}
                className="min-h-[48px] bg-[#FFD000] hover:bg-[#ffe033] text-[#111111] font-extrabold text-sm px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2.5"
              >
                <span>Belanja Sekarang</span>
                <span aria-hidden="true">↗</span>
              </button>

              <a
                href="#kategori-section"
                className="min-h-[48px] px-4 py-3 text-sm font-bold text-white hover:text-[#FFD000] transition-colors inline-flex items-center gap-2"
              >
                <span>Jelajahi kategori</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => navigateTo('motor-saya')}
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2.2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  {savedMotor
                    ? `Profil aktif: ${savedMotor.brand} ${savedMotor.modelYear}`
                    : 'Pilih sesuai tipe & tahun motor kamu.'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Hero Studio Photo */}
          <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[440px] bg-[#0B0E10] overflow-hidden">
            <img
              src="/images/hero-banner.jpg"
              alt="Komponen spion bar end CNC, lampu sein LED, dan piringan cakram motor SENkanan"
              width="1200"
              height="896"
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-transparent opacity-60 pointer-events-none hidden lg:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* 4-Column Trust & Value Bar */}
      <section className="bg-[#1E1E1E] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Pilihan part terkurasi',
              desc: 'Untuk harian hingga modifikasi',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                </svg>
              ),
            },
            {
              title: 'Kirim seluruh Indonesia',
              desc: 'Ongkir dihitung saat checkout',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                  <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              ),
            },
            {
              title: 'Bantu cek kecocokan',
              desc: 'Konsultasikan tipe motor kamu',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ),
            },
            {
              title: 'Belanja lebih tenang',
              desc: 'Informasi produk yang jelas',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3.5">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <h2 className="text-sm font-bold text-white">{item.title}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategori Section */}
      <section id="kategori-section" className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-14 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <Eyebrow>CARI SESUAI KEBUTUHAN</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Motor beda. Kebutuhan beda.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('katalog', 'Semua Produk')}
            className="text-xs font-bold text-[#FFD000] hover:underline inline-flex items-center gap-1 min-h-[44px]"
          >
            <span>Semua kategori</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => navigateTo('katalog', cat.name)}
              className={`text-left p-5 rounded-xl border transition-all flex flex-col justify-between min-h-[144px] ${
                cat.featured
                  ? 'bg-[#FFD000] border-[#FFD000] text-[#111111] hover:bg-[#ffe033]'
                  : 'bg-[#252525] border-white/10 text-white hover:border-[#FFD000]/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cat.featured ? 'text-[#111111]' : 'text-[#FFD000]'}>
                  <CategoryIcon type={cat.icon} />
                </span>
                <span
                  aria-hidden="true"
                  className={`text-sm font-bold ${cat.featured ? 'text-[#111111]' : 'text-zinc-400'}`}
                >
                  ↗
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-extrabold text-base leading-snug">{cat.name}</h3>
                <p className={`text-xs mt-1 ${cat.featured ? 'text-[#111111]/80 font-medium' : 'text-zinc-400'}`}>
                  {cat.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Produk Unggulan Section */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <Eyebrow>PILIHAN UNTUK MOTORMU</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Produk Unggulan
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Part esensial untuk performa, keamanan, dan tampilan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('katalog', 'Semua Produk')}
            className="min-h-[44px] bg-[#252525] border border-white/15 hover:border-[#FFD000] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>Lihat Semua Produk</span>
            <span className="text-[#FFD000]" aria-hidden="true">↗</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-7" role="tablist" aria-label="Filter produk unggulan">
          {['Semua Produk', ...CATEGORIES.map((c) => c.name)].map((catName) => {
            const active = selectedCategory === catName;
            return (
              <button
                key={catName}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(catName)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  active
                    ? 'bg-[#FFD000] text-[#111111]'
                    : 'bg-[#252525] border border-white/10 text-zinc-300 hover:text-white hover:border-white/25'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              onOpenDetail={() => onOpenDetail(product)}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-zinc-500 mt-6">
          <span>Katalog demo: nama, harga, dan stok merupakan contoh untuk desain.</span>
          <span>Cek kompatibilitas sebelum membeli.</span>
        </div>
      </section>

      {/* Full-Width Yellow Consultation Banner */}
      <section className="bg-[#FFD000] text-[#111111] relative overflow-hidden mt-8">
        <svg
          viewBox="0 0 300 220"
          fill="none"
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-auto opacity-20 pointer-events-none"
        >
          <path d="M220 -20C140 50 140 170 230 240" stroke="#111111" strokeWidth="3" />
        </svg>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="text-[11px] font-extrabold tracking-widest uppercase">
              JANGAN ASAL PASANG.
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Masih ragu part yang cocok?
            </h2>
            <p className="text-sm text-[#111111]/85 font-medium">
              Siapkan tipe, tahun, dan foto part motormu. Kami bantu arahkan pilihannya.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2">
            <button
              type="button"
              onClick={onOpenConsult}
              className="min-h-[52px] bg-[#181818] hover:bg-black text-white font-bold text-sm px-6 py-3.5 rounded-xl inline-flex items-center gap-3 transition-colors"
            >
              <span>Konsultasi via WhatsApp</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
   2. KATALOG VIEW
   ============================================================================ */
function KatalogView({
  navigateTo,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  wishlist,
  toggleWishlist,
  onOpenDetail,
  onOpenConsult,
  savedMotor,
}) {
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      const matchCat =
        selectedCategory === 'Semua Produk' || p.category === selectedCategory;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.spec.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    if (sortBy === 'favorit') {
      list = [...list].sort((a, b) => {
        const aFav = wishlist.includes(a.id) ? 1 : 0;
        const bFav = wishlist.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      });
    } else if (sortBy === 'harga-rendah') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'harga-tinggi') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'nama-az') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [selectedCategory, searchQuery, sortBy, wishlist]);

  return (
    <div>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex items-center gap-2">
          <button type="button" onClick={() => navigateTo('beranda')} className="hover:text-white">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-white font-semibold">Katalog</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <Eyebrow>PILIHAN UNTUK MOTORMU</Eyebrow>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            Katalog Produk
          </h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
            Dari perawatan harian sampai upgrade tampilan. Temukan part yang pas untuk motor dan kebutuhanmu.
          </p>
          {savedMotor && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#252525] border border-[#FFD000]/40 rounded-lg px-3.5 py-2 text-xs text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-[#FFD000]" aria-hidden="true" />
              <span>
                Motor tersimpan: <strong className="text-white">{savedMotor.brand} {savedMotor.modelYear}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5" role="tablist" aria-label="Kategori katalog">
          {['Semua Produk', ...CATEGORIES.map((c) => c.name)].map((catName) => {
            const active = selectedCategory === catName;
            return (
              <button
                key={catName}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(catName)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  active
                    ? 'bg-[#FFD000] text-[#111111]'
                    : 'bg-[#252525] border border-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Search + Count + Sort Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <label htmlFor="catalog-filter-input" className="sr-only">
                Cari nama produk atau tipe motor
              </label>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                id="catalog-filter-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama produk atau tipe motor..."
                className="w-full min-h-[44px] bg-[#252525] border border-white/10 rounded-lg pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
              />
            </div>
            <span className="text-xs text-zinc-400">
              Menampilkan {filteredProducts.length} dari {PRODUCTS.length} produk
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <label htmlFor="catalog-sort" className="text-xs text-zinc-400">
              Urutkan:
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-h-[44px] bg-[#252525] border border-white/10 rounded-lg px-3.5 text-xs text-white focus:border-[#FFD000]"
            >
              <option value="rekomendasi">Rekomendasi</option>
              <option value="favorit">Difavoritkan</option>
              <option value="harga-rendah">Harga: Terendah</option>
              <option value="harga-tinggi">Harga: Tertinggi</option>
              <option value="nama-az">Nama: A-Z</option>
            </select>
          </div>
        </div>

        {/* Empty State or Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#252525] border border-white/10 rounded-2xl p-10 text-center space-y-3">
            <h2 className="text-lg font-bold text-white">Tidak ada part yang cocok dengan filter ini</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Coba hapus kata kunci pencarian atau pilih kategori Semua Produk untuk melihat seluruh sparepart yang tersedia.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua Produk');
              }}
              className="min-h-[44px] px-5 rounded-xl bg-[#FFD000] text-[#111111] font-bold text-xs"
            >
              Reset Filter Katalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                onOpenDetail={() => onOpenDetail(product)}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-zinc-500 mt-8">
          <span>Katalog demo: nama, harga, dan stok merupakan contoh untuk desain.</span>
          <span>Cek kompatibilitas sebelum membeli.</span>
        </div>
      </div>

      {/* Compatibility Strip */}
      <CompatibilityBanner onOpenGuide={() => onOpenConsult()} />
    </div>
  );
}

/* ============================================================================
   PRODUCT CARD COMPONENT
   ============================================================================ */
function ProductCard({ product, isWishlisted, onToggleWishlist, onOpenDetail }) {
  return (
    <article className="bg-[#252525] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-white/25 transition-colors">
      <div>
        <div className="relative aspect-[4/3] bg-[#E5E5E5] overflow-hidden">
          {product.tag && (
            <span className="absolute top-3 left-3 z-10 bg-[#FFD000] text-[#111111] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
              {product.tag}
            </span>
          )}
          <button
            type="button"
            onClick={onToggleWishlist}
            aria-label={
              isWishlisted
                ? `Hapus ${product.title} dari favorit`
                : `Simpan ${product.title} ke favorit`
            }
            aria-pressed={isWishlisted}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white text-[#111111] shadow flex items-center justify-center hover:scale-105 transition-transform"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isWishlisted ? '#EF4444' : 'none'}
              stroke={isWishlisted ? '#EF4444' : '#111111'}
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <ProductArtwork product={product} />
        </div>

        <div className="p-4 pb-3">
          <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
            {product.category}
          </div>
          <h3 className="text-white font-bold text-base mt-1 leading-snug">
            {product.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">{product.spec}</p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[#FFD000] font-black text-lg">
            {formatRupiah(product.price)}
          </span>
          <span
            className={`text-[11px] font-semibold inline-flex items-center gap-1.5 ${
              product.stockStatus === 'terbatas' ? 'text-[#FFD000]' : 'text-emerald-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.stockStatus === 'terbatas' ? 'bg-[#FFD000]' : 'bg-emerald-400'
              }`}
              aria-hidden="true"
            />
            {product.stockLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenDetail}
          className="w-full min-h-[44px] bg-[#1C1C1C] hover:bg-[#141414] border border-white/10 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between"
        >
          <span>Lihat Detail</span>
          <span className="w-6 h-6 rounded border border-[#FFD000]/50 text-[#FFD000] inline-flex items-center justify-center text-xs" aria-hidden="true">
            ↗
          </span>
        </button>
      </div>
    </article>
  );
}

/* ============================================================================
   PRODUCT DETAIL MODAL
   ============================================================================ */
function ProductDetailModal({
  product,
  savedMotor,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onGoMotorSaya,
  onClose,
}) {
  const [qty, setQty] = useState(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
    >
      <div className="bg-[#1E1E1E] border border-white/15 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 bg-[#E5E5E5] relative min-h-[220px]">
            {product.tag && (
              <span className="absolute top-3 left-3 bg-[#FFD000] text-[#111111] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded">
                {product.tag}
              </span>
            )}
            <ProductArtwork product={product} />
          </div>

          <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD000]">
                    {product.category}
                  </span>
                  <h2 id="product-modal-title" className="text-2xl font-black text-white mt-0.5">
                    {product.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">{product.spec}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup detail produk"
                  className="w-10 h-10 rounded-lg bg-[#252525] text-zinc-300 hover:text-white inline-flex items-center justify-center shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-black text-[#FFD000]">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  • {product.stockLabel}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mt-3">
                {product.description}
              </p>

              <div className="mt-4 bg-[#252525] border border-white/10 rounded-xl p-3.5 text-xs space-y-1.5">
                <div className="font-bold text-white">Kecocokan Kendaraan:</div>
                <p className="text-zinc-400">{product.compatibility}</p>
                {savedMotor ? (
                  <p className="text-[#FFD000] font-semibold pt-1">
                    Profil Motor Saya: {savedMotor.brand} {savedMotor.modelYear}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={onGoMotorSaya}
                    className="text-[#FFD000] font-bold hover:underline pt-1 inline-block"
                  >
                    Daftarkan motor kamu di Motor Saya →
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
              <div className="inline-flex items-center bg-[#252525] border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Kurangi jumlah"
                  className="w-11 h-11 text-white font-bold hover:text-[#FFD000]"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Tambah jumlah"
                  className="w-11 h-11 text-white font-bold hover:text-[#FFD000]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(qty)}
                className="flex-1 min-h-[44px] bg-[#FFD000] hover:bg-[#ffe033] text-[#111111] font-extrabold text-xs px-5 py-3 rounded-xl transition-colors"
              >
                Tambah ke Keranjang • {formatRupiah(product.price * qty)}
              </button>

              <button
                type="button"
                onClick={onToggleWishlist}
                aria-label="Simpan favorit"
                className="w-11 h-11 rounded-xl bg-[#252525] border border-white/10 inline-flex items-center justify-center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? '#EF4444' : 'none'}
                  stroke={isWishlisted ? '#EF4444' : '#FFFFFF'}
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. MOTOR SAYA VIEW
   ============================================================================ */
function MotorSayaView({
  navigateTo,
  motorDraft,
  setMotorDraft,
  savedMotor,
  motorError,
  onSaveMotor,
  onOpenConsult,
}) {
  const isSaved =
    savedMotor &&
    savedMotor.ownerName === motorDraft.ownerName &&
    savedMotor.brand === motorDraft.brand &&
    savedMotor.modelYear === motorDraft.modelYear &&
    savedMotor.plateNumber === motorDraft.plateNumber;

  return (
    <div>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 pb-14 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
          <button type="button" onClick={() => navigateTo('beranda')} className="hover:text-white">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-white font-semibold">Motor Saya</span>
        </nav>

        {/* Display Heading */}
        <div className="max-w-3xl">
          <Eyebrow>MOTOR SAYA</Eyebrow>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.06] mt-3">
            <span className="block text-white">Daftarkan motor</span>
            <span className="block text-[#FFD000]">untuk pengalaman belanja yang lebih tepat.</span>
          </h1>
          <p className="text-zinc-300 text-sm mt-3">
            Isi merek, tipe motor, dan nomor plat kendaraan. Data ini akan membantu kami menampilkan informasi yang lebih sesuai untuk motor kamu.
          </p>
        </div>

        {/* Form Card: Isi data motor */}
        <form
          onSubmit={onSaveMotor}
          className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-extrabold text-[#FFD000]">Isi data motor</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Data ini akan disimpan sebagai profil motor kamu. Gunakan data yang sesuai agar informasi yang ditampilkan lebih akurat.
              </p>
            </div>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded ${
                isSaved
                  ? 'bg-emerald-500 text-[#111111]'
                  : 'bg-[#FFD000] text-[#111111]'
              }`}
            >
              {isSaved ? 'TERSIMPAN' : 'BELUM DISIMPAN'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="motor-owner" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                NAMA
              </label>
              <input
                id="motor-owner"
                type="text"
                value={motorDraft.ownerName}
                onChange={(e) => setMotorDraft({ ...motorDraft, ownerName: e.target.value })}
                placeholder="Masukkan nama kamu"
                className="w-full min-h-[44px] bg-[#2C2C2C] border border-white/10 rounded-lg px-3.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
              />
            </div>

            <div>
              <label htmlFor="motor-brand" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                MEREK
              </label>
              <input
                id="motor-brand"
                type="text"
                value={motorDraft.brand}
                onChange={(e) => setMotorDraft({ ...motorDraft, brand: e.target.value })}
                placeholder="Masukkan merek motor"
                className="w-full min-h-[44px] bg-[#2C2C2C] border border-white/10 rounded-lg px-3.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
              />
            </div>

            <div>
              <label htmlFor="motor-model" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                TIPE / MODEL / TAHUN
              </label>
              <input
                id="motor-model"
                type="text"
                value={motorDraft.modelYear}
                onChange={(e) => setMotorDraft({ ...motorDraft, modelYear: e.target.value })}
                placeholder="Masukkan tipe/model motor"
                className="w-full min-h-[44px] bg-[#2C2C2C] border border-white/10 rounded-lg px-3.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
              />
            </div>

            <div>
              <label htmlFor="motor-plate" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                NOMOR PLAT
              </label>
              <input
                id="motor-plate"
                type="text"
                value={motorDraft.plateNumber}
                onChange={(e) => setMotorDraft({ ...motorDraft, plateNumber: e.target.value })}
                placeholder="Masukkan nomor plat kendaraan"
                className="w-full min-h-[44px] bg-[#2C2C2C] border border-white/10 rounded-lg px-3.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
              />
              <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                Wajib diisi. 
                Pernah belanja sebelumnya? Masukkan plat yang sama agar data mu kembali terlihat.
              </p>
            </div>
          </div>

          {motorError && (
            <p role="alert" className="text-xs text-red-400 font-semibold">
              {motorError}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="min-h-[48px] bg-[#FFD000] hover:bg-[#ffe033] text-[#111111] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-[#FFD000]/25 ring-2 ring-[#FFD000]/50 hover:scale-[1.02] transition-all inline-flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="17 21 17 13 7 13 7 21" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="7 3 7 8 15 8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Simpan Data Motor</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>

        {/* Live Summary Card: Ringkasan data motor */}
        <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-extrabold text-[#FFD000]">Ringkasan data motor</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                NAMA
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {motorDraft.ownerName.trim() || 'Belum diisi'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                MEREK
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {motorDraft.brand.trim() || 'Belum diisi'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                TIPE / MODEL / TAHUN
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {motorDraft.modelYear.trim() || 'Belum diisi'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                NOMOR PLAT
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {motorDraft.plateNumber.trim() || 'Belum diisi'}
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-400 pt-1">
            Data ini akan membantu kami menampilkan informasi yang lebih sesuai. Pastikan data yang diisi sudah benar sebelum disimpan.
          </p>
        </div>

        {/* 3-Step Checklist Row */}
        <section className="pt-4 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sebelum lanjut, cek dulu.
            </h2>
           
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
            {[
              {
                num: '01',
                title: 'Isi data motor',
                desc: 'Isi merek, tipe motor, dan nomor plat kendaraan. Data ini akan membantu kami menampilkan informasi yang lebih sesuai.',
              },
              {
                num: '02',
                title: 'Periksa data motor',
                desc: 'Pastikan merek, tipe motor, dan nomor plat sudah sesuai sebelum data disimpan.',
              },
              {
                num: '03',
                title: 'Simpan data motor',
                desc: 'Setelah data motor benar, simpan untuk melanjutkan ke langkah berikutnya.',
              },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <span className="text-2xl font-black text-[#FFD000] leading-none">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Yellow Help Banner */}
      <section className="bg-[#FFD000] text-[#111111]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="text-[11px] font-extrabold tracking-widest uppercase">
              BUTUH BANTUAN?
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Butuh bantuan mengisi data motor?
            </h2>
            <p className="text-sm text-[#111111]/85 font-medium">
              Siapkan merek, tipe, dan nomor plat kendaraan. Kami bantu memastikan data motor kamu sudah benar.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2">
            <a
              href="https://wa.me/6281936734212"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[52px] bg-[#181818] hover:bg-black text-white font-bold text-sm px-6 py-3.5 rounded-xl inline-flex items-center gap-3 transition-colors"
            >
              <span>Konsultasi data motor</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </a>
            <span className="text-[11px] font-semibold text-[#111111]/75">
              WhatsApp: +62 819-3673-4212
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
   4. KERANJANG VIEW
   ============================================================================ */
function KeranjangView({
  navigateTo,
  cart,
  subtotalCart,
  totalCartItems,
  updateCartQty,
  removeCartItem,
  address,
  onStartEditAddress,
  onOpenConsult,
}) {
  return (
    <div>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex items-center gap-2">
          <button type="button" onClick={() => navigateTo('beranda')} className="hover:text-white">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <button type="button" onClick={() => navigateTo('katalog')} className="hover:text-white">
            Katalog
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-white font-semibold">Keranjang</span>
        </nav>

        {/* Title & Step Progress */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Eyebrow>SELANGKAH LAGI, MOTOR SIAP</Eyebrow>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
              Keranjang Belanja
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Cek pilihan part, jumlah, dan alamatmu sebelum lanjut ke checkout.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-[#FFD000]">01 Keranjang</span>
            <span className="w-8 h-[1px] bg-white/20" aria-hidden="true" />
            <span className="text-zinc-500">02 Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cart Items Box */}
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-extrabold text-white">Barang di keranjang</h2>
                  <span className="text-xs text-zinc-400">
                    {cart.length} produk • {totalCartItems} item
                  </span>
                </div>
                <span className="text-xs text-zinc-400 hidden sm:inline">Subtotal</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-sm font-bold text-white">Keranjang belanjamu masih kosong</p>
                  <p className="text-xs text-zinc-400">
                    Pilih sparepart dari katalog untuk mulai menyusun pesanan.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateTo('katalog')}
                    className="min-h-[44px] px-5 rounded-xl bg-[#FFD000] text-[#111111] font-bold text-xs"
                  >
                    Jelajahi Katalog
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {cart.map((item) => {
                    const prod = PRODUCTS.find((p) => p.id === item.productId);
                    if (!prod) return null;
                    return (
                      <div
                        key={prod.id}
                        className="py-5 first:pt-5 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-[#E5E5E5] overflow-hidden shrink-0">
                            <ProductArtwork product={prod} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              {prod.category}
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                              {prod.title}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">{prod.spec}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs">
                              <span className="text-zinc-300 font-medium">
                                {formatRupiah(prod.price)} / item
                              </span>
                              <span className="text-emerald-400 font-semibold">
                                • {prod.stockLabel}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:items-center justify-between sm:justify-end gap-6">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="inline-flex items-center bg-[#1A1A1A] border border-white/10 rounded-lg">
                              <button
                                type="button"
                                onClick={() => updateCartQty(prod.id, -1)}
                                aria-label={`Kurangi jumlah ${prod.title}`}
                                className="w-9 h-9 text-zinc-300 hover:text-white font-bold"
                              >
                                -
                              </button>
                              <span className="px-2.5 text-xs font-extrabold text-white">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(prod.id, 1)}
                                aria-label={`Tambah jumlah ${prod.title}`}
                                className="w-9 h-9 text-zinc-300 hover:text-white font-bold"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCartItem(prod.id)}
                              className="text-[11px] text-zinc-400 hover:text-red-400 inline-flex items-center gap-1"
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              <span>Hapus</span>
                            </button>
                          </div>

                          <div className="text-right min-w-[96px]">
                            <span className="text-base font-black text-[#FFD000]">
                              {formatRupiah(prod.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profile & Address Box */}
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <h2 className="text-base font-extrabold text-white">Profil &amp; alamat</h2>
                </div>
                <button
                  type="button"
                  onClick={onStartEditAddress}
                  className="text-xs font-bold text-[#FFD000] hover:underline min-h-[36px] px-2"
                >
                  Ubah
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-4 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    PENERIMA
                  </div>
                  <div className="font-bold text-white text-sm">{address.recipient}</div>
                  <div className="text-zinc-300">{address.phone}</div>
                  <div className="text-zinc-400">{address.email}</div>
                </div>

                <div className="md:col-span-8 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      ALAMAT PENGIRIMAN
                    </span>
                    <span className="bg-[#FFD000]/15 text-[#FFD000] text-[10px] font-bold px-2 py-0.5 rounded">
                      {address.label}
                    </span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{address.street}</p>
                  {address.note && <p className="text-zinc-400">{address.note}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigateTo('katalog')}
                className="text-xs font-bold text-[#FFD000] hover:underline inline-flex items-center gap-1.5"
              >
                <span aria-hidden="true">←</span>
                <span>Kembali ke Katalog</span>
              </button>
              <p className="text-[11px] text-zinc-500">
                Keranjang demo: produk, harga, dan data penerima merupakan contoh untuk desain.
              </p>
            </div>
          </div>

          {/* Right Column: Ringkasan Belanja */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-black text-white">Ringkasan Belanja</h2>

              <div className="space-y-3 text-xs border-b border-white/10 pb-4">
                <div className="flex justify-between text-zinc-300">
                  <span>Total barang</span>
                  <span className="font-bold text-white">{totalCartItems} item</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal produk</span>
                  <span className="font-bold text-white">{formatRupiah(subtotalCart)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Ongkos kirim</span>
                  <span className="text-zinc-400">Dihitung saat checkout</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Total sementara</span>
                  <span className="text-2xl font-black text-[#FFD000]">
                    {formatRupiah(subtotalCart)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                  Belum termasuk ongkos kirim. Pilih kurir dan metode pembayaran di checkout.
                </p>
              </div>

              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => navigateTo('checkout')}
                className="w-full min-h-[48px] bg-[#FFD000] hover:bg-[#ffe033] disabled:opacity-40 text-[#111111] font-extrabold text-sm px-5 py-3 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Lanjut ke Checkout</span>
                <span aria-hidden="true">→</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Periksa kembali pesanan sebelum membayar.</span>
              </div>
            </div>

            <div className="bg-[#232323] border border-white/10 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Ragu part sudah cocok?</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cocokkan tipe, tahun, soket, dan ukuran part dengan motormu sebelum checkout.
              </p>
              <button
                type="button"
                onClick={() => onOpenConsult()}
                className="text-xs font-bold text-[#FFD000] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Panduan Kecocokan</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CompatibilityBanner onOpenGuide={() => onOpenConsult()} />
    </div>
  );
}

/* ============================================================================
   5. CHECKOUT VIEW
   ============================================================================ */
function CheckoutView({
  navigateTo,
  cart,
  subtotalCart,
  totalCartItems,
  address,
  onStartEditAddress,
  shippingMethod,
  setShippingMethod,
  withInsurance,
  setWithInsurance,
  orderNote,
  setOrderNote,
  selectedVAId,
  setSelectedVAId,
  vaNumbers,
  onOpenPaymentModal,
  isSubmittingOrder,
  onOpenConsult,
  showToast,
}) {
  const shippingCost = shippingMethod === 'yes' ? 28000 : 18000;
  const insuranceCost = withInsurance ? 1800 : 0;
  const serviceFee = 1000;
  const grandTotal = subtotalCart + shippingCost + insuranceCost + serviceFee;
  const selectedVABank = VA_BANKS.find((v) => v.id === selectedVAId) || VA_BANKS[0];
  const selectedVA = { ...selectedVABank, number: vaNumbers[selectedVABank.id] };
  const [copied, setCopied] = useState(false);

  const handleCopyVA = () => {
    const raw = selectedVA.number;
    try {
      navigator.clipboard.writeText(raw);
    } catch (e) {
      /* abaikan jika clipboard tidak tersedia */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 mb-6 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => navigateTo('beranda')} className="hover:text-white">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <button type="button" onClick={() => navigateTo('katalog')} className="hover:text-white">
            Katalog
          </button>
          <span aria-hidden="true">/</span>
          <button type="button" onClick={() => navigateTo('keranjang')} className="hover:text-white">
            Keranjang
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-white font-semibold">Checkout</span>
        </nav>

        {/* Title & Step Progress */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Eyebrow>SELANGKAH LAGI, MOTOR SIAP</Eyebrow>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
              Checkout
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Pastikan alamat, pengiriman, dan pembayaran sudah sesuai sebelum membayar.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => navigateTo('keranjang')}
              className="text-zinc-400 hover:text-white inline-flex items-center gap-1"
            >
              <span className="text-emerald-400" aria-hidden="true">✓</span>
              <span>01 Keranjang</span>
            </button>
            <span className="w-8 h-[1px] bg-white/20" aria-hidden="true" />
            <span className="text-[#FFD000]">02 Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Alamat Pengiriman */}
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <h2 className="text-base font-extrabold text-white">Alamat pengiriman</h2>
                </div>
                <button
                  type="button"
                  onClick={onStartEditAddress}
                  className="text-xs font-bold text-[#FFD000] hover:underline min-h-[36px] px-2"
                >
                  Ubah alamat
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-4 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    PENERIMA
                  </div>
                  <div className="font-bold text-white text-sm">{address.recipient}</div>
                  <div className="text-zinc-300">{address.phone}</div>
                  <div className="text-zinc-400">{address.email}</div>
                </div>

                <div className="md:col-span-8 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      ALAMAT PENGIRIMAN
                    </span>
                    <span className="bg-[#FFD000]/15 text-[#FFD000] text-[10px] font-bold px-2 py-0.5 rounded">
                      {address.label}
                    </span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{address.street}</p>
                  {address.note && <p className="text-zinc-400">{address.note}</p>}
                </div>
              </div>
            </div>

            {/* Barang Pesanan */}
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                  </svg>
                  <h2 className="text-base font-extrabold text-white">Barang pesanan</h2>
                  <span className="text-xs text-zinc-400 hidden sm:inline">
                    SENkanan &nbsp;/&nbsp; {cart.length} produk • {totalCartItems} item
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('keranjang')}
                  className="text-xs font-bold text-[#FFD000] hover:underline"
                >
                  Ubah keranjang
                </button>
              </div>

              <div className="divide-y divide-white/10">
                {cart.map((item) => {
                  const prod = PRODUCTS.find((p) => p.id === item.productId);
                  if (!prod) return null;
                  return (
                    <div key={prod.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#E5E5E5] overflow-hidden shrink-0">
                          <ProductArtwork product={prod} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            {prod.category}
                          </div>
                          <h3 className="text-sm font-bold text-white">{prod.title}</h3>
                          <p className="text-xs text-zinc-400">{prod.spec}</p>
                          <p className="text-xs text-zinc-300 mt-1">
                            {item.qty} × {formatRupiah(prod.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#FFD000]">
                        {formatRupiah(prod.price * item.qty)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-zinc-400">Subtotal produk</span>
                <span className="text-sm font-extrabold text-white">
                  {formatRupiah(subtotalCart)}
                </span>
              </div>
            </div>

            {/* Pilihan Pengiriman */}
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                  <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <h2 className="text-base font-extrabold text-white">Pilihan pengiriman</h2>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label="Pilih kurir pengiriman">
                <button
                  type="button"
                  role="radio"
                  aria-checked={shippingMethod === 'reg'}
                  onClick={() => setShippingMethod('reg')}
                  className={`w-full min-h-[60px] p-4 rounded-xl border text-left transition-colors flex items-center justify-between gap-4 ${
                    shippingMethod === 'reg'
                      ? 'border-[#FFD000] bg-[#1E1D17]'
                      : 'border-white/10 bg-[#1B1B1B] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        shippingMethod === 'reg' ? 'border-[#FFD000]' : 'border-zinc-500'
                      }`}
                    >
                      {shippingMethod === 'reg' && (
                        <span className="w-2 h-2 rounded-full bg-[#FFD000]" />
                      )}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-white">JNE REG • Reguler</div>
                      <div className="text-[11px] text-[#FFD000] mt-0.5">
                        Estimasi tiba 2-3 hari kerja
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-white">Rp18.000</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={shippingMethod === 'yes'}
                  onClick={() => setShippingMethod('yes')}
                  className={`w-full min-h-[60px] p-4 rounded-xl border text-left transition-colors flex items-center justify-between gap-4 ${
                    shippingMethod === 'yes'
                      ? 'border-[#FFD000] bg-[#1E1D17]'
                      : 'border-white/10 bg-[#1B1B1B] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        shippingMethod === 'yes' ? 'border-[#FFD000]' : 'border-zinc-500'
                      }`}
                    >
                      {shippingMethod === 'yes' && (
                        <span className="w-2 h-2 rounded-full bg-[#FFD000]" />
                      )}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-white">JNE YES • Express</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Estimasi tiba 1 hari kerja
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-white">Rp28.000</span>
                </button>
              </div>

              {/* Insurance Toggle */}
              <label className="flex items-center justify-between gap-4 pt-2 text-xs">
                <span className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={withInsurance}
                    onChange={(e) => setWithInsurance(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#FFD000] rounded"
                  />
                  <span>
                    <strong className="block text-white font-bold">
                      Lindungi paket dengan asuransi
                    </strong>
                    <span className="text-[11px] text-zinc-400">
                      Opsional • Perlindungan kerusakan atau kehilangan saat pengiriman.
                    </span>
                  </span>
                </span>
                <span className="text-zinc-300 font-semibold shrink-0">Rp1.800</span>
              </label>

              {/* Note */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs mb-2">
                  <label htmlFor="checkout-note" className="font-bold text-white">
                    Catatan untuk SENkanan <span className="text-zinc-400 font-normal">(opsional)</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">{orderNote.length}/200</span>
                </div>
                <textarea
                  id="checkout-note"
                  rows={2}
                  maxLength={200}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Tulis catatan, misalnya detail pengemasan atau pesanan."
                  className="w-full bg-[#2C2C2C] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigateTo('keranjang')}
                className="text-xs font-bold text-[#FFD000] hover:underline inline-flex items-center gap-1.5"
              >
                <span aria-hidden="true">←</span>
                <span>Kembali ke Keranjang</span>
              </button>
              <p className="text-[11px] text-zinc-500">
                Checkout demo: produk, harga, pengiriman, dan data penerima merupakan contoh untuk desain.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Pembayaran Box - Virtual Account */}
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                  <h2 className="text-base font-extrabold text-white">Pembayaran</h2>
                </div>
                <span className="text-[11px] text-zinc-400 font-semibold">Virtual Account</span>
              </div>

              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Pilih bank virtual account">
                {VA_BANKS.map((va) => {
                  const active = va.id === selectedVAId;
                  return (
                    <button
                      key={va.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedVAId(va.id)}
                      className={`min-h-[44px] rounded-lg border text-xs font-bold transition-colors ${
                        active
                          ? 'border-[#FFD000] bg-[#FFD000]/10 text-[#FFD000]'
                          : 'border-white/10 bg-[#2C2C2C] text-zinc-300 hover:border-white/25'
                      }`}
                    >
                      {va.bank}
                    </button>
                  );
                })}
              </div>

              <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  NO. VIRTUAL ACCOUNT {selectedVA.bank}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base sm:text-lg font-black text-white tracking-wider tabular-nums">
                    {formatVA(selectedVA.number)}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="min-h-[36px] px-3 rounded-lg bg-[#2C2C2C] border border-white/15 hover:border-[#FFD000] text-[11px] font-bold text-white transition-colors shrink-0"
                  >
                    {copied ? 'Tersalin ✓' : 'Salin'}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">Bayar lewat {selectedVA.hint}.</p>
              </div>
            </div>

            {/* Ringkasan Tagihan Box */}
            <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-black text-white">Ringkasan Tagihan</h2>

              <div className="space-y-3 text-xs border-b border-white/10 pb-4">
                <div className="flex justify-between text-zinc-300">
                  <span>Total barang</span>
                  <span className="font-bold text-white">
                    {totalCartItems} item / {cart.length} produk
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal produk</span>
                  <span className="font-bold text-white">{formatRupiah(subtotalCart)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Ongkos kirim</span>
                  <span className="font-bold text-white">{formatRupiah(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Asuransi pengiriman</span>
                  <span className="font-bold text-white">{formatRupiah(insuranceCost)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Biaya layanan pembayaran</span>
                  <span className="font-bold text-white">{formatRupiah(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Potongan promo</span>
                  <span className="font-bold text-white">Rp0</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Total tagihan</span>
                  <span className="text-2xl font-black text-[#FFD000]">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                  Sudah termasuk ongkos kirim, asuransi, dan biaya layanan pembayaran.
                </p>
              </div>

              <button
                type="button"
                disabled={isSubmittingOrder || cart.length === 0}
                onClick={onOpenPaymentModal}
                className="w-full min-h-[48px] bg-[#FFD000] hover:bg-[#ffe033] disabled:opacity-50 text-[#111111] font-extrabold text-sm px-5 py-3 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>{isSubmittingOrder ? 'Memproses Pesanan...' : 'Bayar Sekarang'}</span>
                <span aria-hidden="true">→</span>
              </button>

              <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                Dengan melanjutkan, kamu menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi SENkanan.
              </p>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Periksa kembali pesanan sebelum membayar.</span>
              </div>
            </div>

            <div className="bg-[#232323] border border-white/10 rounded-2xl p-5 flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <div className="text-xs">
                <div className="font-bold text-white">Butuh bantuan checkout?</div>
                <button
                  type="button"
                  onClick={onOpenConsult}
                  className="text-[#FFD000] font-bold hover:underline mt-1 inline-flex items-center gap-1"
                >
                  <span>Hubungi SENkanan</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CompatibilityBanner onOpenGuide={() => onOpenConsult()} />
    </div>
  );
}

/* ============================================================================
   6. PESANAN VIEW (DIBUAT / DIPROSES / DIKIRIM / TIBA DI TUJUAN)
   ============================================================================ */
function PesananView({ navigateTo, orders = [], order, onSelectOrder }) {
  if (!order || !order.id) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 pb-14 space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
          <button type="button" onClick={() => navigateTo('beranda')} className="hover:text-white">
            Beranda
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-white font-semibold">Pesanan</span>
        </nav>

        <div className="bg-[#232323] border border-white/10 rounded-2xl p-10 text-center space-y-3">
          <Eyebrow>PESANAN KAMU</Eyebrow>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Belum ada pesanan di database</h1>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Pilih sparepart dari katalog dan selesaikan checkout agar pesanan tercatat di database dan muncul di panel admin.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigateTo('katalog')}
              className="min-h-[44px] px-5 rounded-xl bg-[#FFD000] text-[#111111] font-bold text-xs"
            >
              Belanja di Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stageConfig = {
    dibuat: {
      heading: 'Pesanan Dibuat',
      badge: 'Pesanan dibuat',
      desc: 'Pesananmu berhasil disimpan ke database dan menunggu konfirmasi pembayaran.',
      estimateNote: 'Estimasi tiba setelah pengiriman dimulai.',
      stepIndex: 0,
    },
    diproses: {
      heading: 'Pesanan Diproses',
      badge: 'Pesanan diproses',
      desc: 'Pembayaran telah dikonfirmasi admin. Barang pesananmu sedang dikemas.',
      estimateNote: 'Estimasi tiba setelah pengiriman dimulai.',
      stepIndex: 1,
    },
    dikirim: {
      heading: 'Pesanan Dikirim',
      badge: 'Pesanan dikirim',
      desc: 'Paket pesananmu sedang dalam perjalanan menuju alamat tujuan.',
      estimateNote: 'Paket dalam perjalanan menuju alamatmu.',
      stepIndex: 2,
    },
    selesai: {
      heading: 'Pesanan Tiba di Tujuan',
      badge: 'Tiba di tujuan',
      desc: 'Paket pesanan telah diterima di alamat tujuan.',
      estimateNote: 'Pengiriman selesai.',
      stepIndex: 3,
    },
    dibatalkan: {
      heading: 'Pesanan Dibatalkan',
      badge: 'Dibatalkan',
      desc: 'Pesanan ini telah dibatalkan.',
      estimateNote: 'Pesanan dibatalkan.',
      stepIndex: 0,
    },
  };

  const currentMeta = stageConfig[order.stage] || stageConfig.dibuat;
  const payStatus = order.payment?.status || 'menunggu';
  const payBadge =
    payStatus === 'lunas'
      ? { label: 'Lunas', cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', dot: 'bg-emerald-400', note: order.payment?.confirmedAt ? `Dikonfirmasi admin ${order.payment.confirmedAt}` : 'Pembayaran terkonfirmasi' }
      : payStatus === 'ditolak'
      ? { label: 'Ditolak', cls: 'bg-red-500/15 border-red-500/30 text-red-400', dot: 'bg-red-400', note: order.payment?.note || 'Pembayaran ditolak admin' }
      : { label: 'Menunggu Verifikasi', cls: 'bg-[#FFD000]/15 border-[#FFD000]/30 text-[#FFD000]', dot: 'bg-[#FFD000]', note: order.paidAt ? `Konfirmasi pelanggan ${order.paidAt}` : 'Menunggu verifikasi admin' };

  const steps = [
    { label: 'Pesanan dibuat', sub: order.createdAt || 'Tercatat' },
    {
      label: 'Diproses',
      sub: currentMeta.stepIndex >= 1 ? (order.payment?.confirmedAt || 'Sedang diproses') : 'Menunggu',
    },
    {
      label: 'Dikirim',
      sub: currentMeta.stepIndex >= 2 ? 'Dalam pengiriman' : 'Menunggu',
    },
    {
      label: 'Tiba di tujuan',
      sub: currentMeta.stepIndex >= 3 ? 'Selesai' : currentMeta.stepIndex === 2 ? `Estimasi ${order.estimatedArrival}` : 'Menunggu',
    },
  ];

  const orderItems = Array.isArray(order.items) ? order.items : [];
  const itemCount = orderItems.reduce((s, i) => s + Number(i.qty || 0), 0);
  const subtotal = orderItems.reduce((s, i) => {
    const p = PRODUCTS.find((prod) => prod.id === i.productId);
    const unitPrice = Number(i.price || p?.price || 0);
    return s + unitPrice * Number(i.qty || 0);
  }, 0);
  const totalPaid =
    order.totalAmount != null
      ? Number(order.totalAmount)
      : subtotal + Number(order.shippingCost || 0) + Number(order.insuranceCost || 0) + Number(order.serviceFee || 0);

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 pb-14 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
        <button type="button" onClick={() => navigateTo('beranda')} className="hover:text-white">
          Beranda
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-white font-semibold">{currentMeta.heading}</span>
      </nav>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Eyebrow>PESANAN KAMU</Eyebrow>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2">
            {currentMeta.heading}
          </h1>
          <p className="text-xs text-zinc-400 mt-1.5">
            {order.id} &nbsp;/&nbsp; Dipesan {order.createdAt}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {orders.length > 1 && (
            <select
              aria-label="Pilih pesanan"
              value={order.id}
              onChange={(e) => {
                const found = orders.find((o) => o.id === e.target.value);
                if (found) onSelectOrder?.(found);
              }}
              className="min-h-[44px] bg-[#252525] border border-white/15 rounded-lg px-3 text-xs font-bold text-white focus:border-[#FFD000]"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} ({o.stage})
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => navigateTo('katalog')}
            className="min-h-[44px] bg-[#252525] border border-white/15 hover:border-[#FFD000] text-white text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center gap-2"
          >
            <span aria-hidden="true">←</span>
            <span>Belanja Lagi</span>
          </button>
        </div>
      </div>

      {/* Order Status Tracker Card */}
      <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#FFD000]/10 border border-[#FFD000]/30 text-[#FFD000] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#FFD000]/15 border border-[#FFD000]/40 text-[#FFD000] text-[11px] font-bold px-2.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD000]" aria-hidden="true" />
                {currentMeta.badge}
              </span>
              <p className="text-xs text-zinc-300 mt-2">{currentMeta.desc}</p>
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              ESTIMASI PESANAN SAMPAI
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#FFD000] mt-0.5">
              {order.estimatedArrival}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{currentMeta.estimateNote}</div>
          </div>
        </div>

        {/* 4-Step Horizontal Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 pt-2">
          {steps.map((st, idx) => {
            const isCompleted = idx < currentMeta.stepIndex;
            const isCurrent = idx === currentMeta.stepIndex;
            return (
              <div key={st.label} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      isCompleted
                        ? 'bg-[#FFD000] text-[#111111]'
                        : isCurrent
                        ? 'bg-[#2C2814] border-2 border-[#FFD000] text-[#FFD000]'
                        : 'bg-[#2C2C2C] border border-white/15 text-zinc-500'
                    }`}
                  >
                    {isCompleted ? '✓' : '•'}
                  </span>
                  <span
                    className={`h-[2px] flex-1 ${
                      isCompleted ? 'bg-[#FFD000]' : 'bg-white/10'
                    }`}
                  />
                </div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isCompleted || isCurrent ? 'text-white' : 'text-zinc-400'
                    }`}
                  >
                    {st.label}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{st.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer of Tracker */}
        <div className="pt-4 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-[11px] text-zinc-400">
          <div>
            {order.courier} &nbsp;•&nbsp; Resi:{' '}
            <strong className="text-zinc-200 font-semibold">
              {currentMeta.stepIndex >= 2 ? order.trackingNumber : 'Belum tersedia'}
            </strong>
          </div>
          <span className="text-zinc-500">Status disinkronkan otomatis dengan database toko</span>
        </div>
      </div>

      {/* Bottom 2-Column Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Barang Pesanan + Alamat Pengiriman */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#232323] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-black text-white">Barang Pesanan</h2>
              <span className="text-xs text-zinc-400">
                {orderItems.length} produk • {itemCount} item
              </span>
            </div>

            <div className="divide-y divide-white/10">
              {orderItems.map((item) => {
                const prod = PRODUCTS.find((p) => p.id === item.productId) || {
                  id: item.productId,
                  title: item.title || item.name || item.productId,
                  spec: '',
                  price: Number(item.price || 0),
                  image: item.image || '',
                };
                const unitPrice = Number(item.price || prod.price || 0);
                return (
                  <div key={prod.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#E5E5E5] overflow-hidden shrink-0">
                        <ProductArtwork product={prod} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{prod.title}</h3>
                        {prod.spec && <p className="text-xs text-zinc-400">{prod.spec}</p>}
                        <p className="text-xs text-zinc-400 mt-1">
                          {formatRupiah(unitPrice)} / item
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-xs text-zinc-400">× {item.qty}</span>
                      <span className="text-sm font-black text-white">
                        {formatRupiah(unitPrice * Number(item.qty || 0))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h2 className="text-lg font-black text-white">Alamat Pengiriman</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
              <div className="md:col-span-4 space-y-1">
                <div className="font-bold text-white text-sm">{order.address?.recipient}</div>
                <div className="text-zinc-400">{order.address?.label}</div>
                <div className="text-zinc-300">{order.address?.phone}</div>
                <div className="text-zinc-400">{order.address?.email}</div>
              </div>
              <div className="md:col-span-8 space-y-1.5">
                <p className="text-zinc-200 leading-relaxed">{order.address?.street}</p>
                {order.address?.note && <p className="text-zinc-400">{order.address.note}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pembayaran Card */}
        <div className="lg:col-span-4">
          <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Pembayaran</h2>
              <span className={`inline-flex items-center gap-1.5 border text-[11px] font-bold px-2.5 py-0.5 rounded ${payBadge.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${payBadge.dot}`} aria-hidden="true" />
                {payBadge.label}
              </span>
            </div>

            <div className="space-y-3 text-xs border-b border-white/10 pb-4">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal barang ({itemCount} item)</span>
                <span className="font-bold text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Ongkos kirim</span>
                <span className="font-bold text-white">{formatRupiah(order.shippingCost)}</span>
              </div>
              {order.insuranceCost > 0 && (
                <div className="flex justify-between text-zinc-300">
                  <span>Asuransi pengiriman</span>
                  <span className="font-bold text-white">{formatRupiah(order.insuranceCost)}</span>
                </div>
              )}
              {order.serviceFee > 0 && (
                <div className="flex justify-between text-zinc-300">
                  <span>Biaya layanan</span>
                  <span className="font-bold text-white">{formatRupiah(order.serviceFee)}</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-white">Total dibayar</span>
              <span className="text-2xl font-black text-[#FFD000]">
                {formatRupiah(totalPaid)}
              </span>
            </div>

            <div className="bg-[#2A2A2A] border border-white/10 rounded-xl p-4 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                METODE PEMBAYARAN
              </div>
              <div className="flex items-center gap-2.5">
                <span className="bg-white text-[#111111] text-[10px] font-black px-2 py-0.5 rounded">
                  {order.paymentType}
                </span>
                <span className="text-xs font-extrabold text-white">{order.paymentMethod}</span>
              </div>
              {order.vaNumber && (
                <div className="text-[11px] text-zinc-400">
                  No. VA: <span className="text-zinc-200 font-semibold tabular-nums">{formatVA(order.vaNumber)}</span>
                </div>
              )}
              <div className="text-[11px] text-zinc-400 pt-1">
                <div>{payBadge.note}</div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Simpan nomor pesanan sebagai referensi belanjamu. Status akan otomatis diperbarui setelah admin memverifikasi pembayaran dan mengirim paket.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SHARED COMPATIBILITY STRIP ABOVE FOOTER
   ============================================================================ */
function CompatibilityBanner({ onOpenGuide }) {
  return (
    <div className="bg-[#1A1A1A] border-t border-white/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2" className="mt-0.5 sm:mt-0 shrink-0" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <div>
            <p className="text-xs font-bold text-white">
              Part tepat dimulai dari tipe motor yang tepat.
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Cocokkan tipe, tahun, soket, dan ukuran part sebelum memilih.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenGuide}
          className="text-xs font-bold text-[#FFD000] hover:underline shrink-0 inline-flex items-center gap-1 min-h-[44px]"
        >
          <span>Panduan Kecocokan</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}