## Anggota Kelompok

| No. | Nama | NIM |
|---|---|---|
| 1 | Saka Laksmana Harimurti | 4525210067 |
| 2 | Satria Mahardika | 4525210068 |
| 3 | Muhammad Raffif Akbar | 4525210125 |
| 4 | Ridho Sachlan | 4525210066 |
| 5 | Prevansyah Sjafar | 4525210057 |
| 6 | Nabil Nugraha Syamjdaya | 4525210052 |

# SEN Kanan

*Solusi Suku Cadang & Aksesori Motor Terpercaya*

SEN Kanan adalah platform e-commerce web untuk penjualan suku cadang dan aksesori sepeda motor yang dilengkapi panel operasional admin. Pelanggan dapat menelusuri katalog, menyimpan profil motor dan alamat pengiriman, mengelola keranjang serta wishlist, melakukan checkout dengan pengiriman JNE (REG/YES), dan membayar melalui transfer Virtual Account (BCA, BNI, Mandiri). Admin mengelola stok produk, memverifikasi mutasi pembayaran VA, memproses pengiriman pesanan beserta nomor resi, hingga membatalkan pesanan.

Proyek Kelompok SEN Kanan, Program Studi Teknik Informatika, Universitas Pancasila.

> Seluruh kode aplikasi dan dokumentasi perancangan berada di dalam repositori [`Project_BASDAT_A_Kelompok_SEN_Kanan`](./).

## Fitur

- Menampilkan katalog suku cadang dan aksesori motor lengkap dengan pencarian (nama, spesifikasi, kategori, kecocokan motor), filter kategori, pengurutan harga/nama, dan tanda stok (*Tersedia*, *Terbatas*, *Habis*).
- Menyimpan daftar produk favorit (*Wishlist*) dan mengelola keranjang belanja secara *real-time*.
- Mendaftarkan profil **Motor Saya** (nama pemilik, merek, tipe/model, plat nomor) serta mengelola profil & alamat pengiriman.
- Melakukan checkout pesanan dengan pilihan kurir (**JNE REG** atau **JNE YES**), opsi asuransi pengiriman, biaya layanan, dan pemilihan bank **Virtual Account** 16 digit (BCA, BNI, Mandiri).
- Melacak progres status pesanan secara bertahap (`DIBUAT` → `DIPROSES` → `DIKIRIM` → `SELESAI`) lengkap dengan nomor resi dan estimasi tiba, serta konsultasi kecocokan part via WhatsApp.
- Panel **Admin SEN Kanan** untuk masuk/keluar operasional, memantau & menambah stok produk beserta riwayat mutasi stok, ekspor laporan stok ke CSV, memverifikasi/menolak pembayaran VA, serta memproses, mengirim (input resi), atau membatalkan pesanan.

## Teknologi

| Bagian | Teknologi |
| :-- | :-- |
| Backend | Node.js, Express, REST API (JSON), MySQL (`mysql2/promise`), CORS, dotenv |
| Frontend Pelanggan (`senkanan-app`) | React 18, Vite, Tailwind CSS |
| Frontend Admin (`admin`) | React 18, Vite, Tailwind CSS |
| Desain dan Dokumen | Figma, PRD, ERD (PlantUML), UML (Use Case, Class, Sequence Diagram) |

Frontend pelanggan (`senkanan-app`), panel admin (`admin`), dan backend **terpisah**; penghubung antar layanan menggunakan REST API (`/api/*`).

## Struktur Folder

```
Project_BASDAT_A_Kelompok_SEN_Kanan/
├── admin/                             panel admin operasional (React + Vite + Tailwind CSS)
│   ├── public/                        aset gambar logo & produk
│   ├── src/
│   │   ├── components/                AdminLayout, AuthShell, Icons, TopBar, ui
│   │   ├── pages/                     LoginPage, WelcomePage, StockPage, OrdersPage, PaymentsPage
│   │   ├── App.jsx                    titik utama & navigasi halaman admin
│   │   ├── data.js                    utilitas format tanggal & label
│   │   ├── index.css                  konfigurasi gaya Tailwind
│   │   └── main.jsx                   titik masuk aplikasi admin
│   ├── .env
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                           REST API (Node.js + Express + MySQL)
│   ├── sql/
│   │   └── senkanan.sql               skema database MySQL, relasi, constraint & view
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  koneksi pool database MySQL
│   │   ├── routes/
│   │   │   ├── cart.js                endpoint keranjang belanja
│   │   │   ├── orders.js              endpoint checkout, pesanan & verifikasi pembayaran
│   │   │   ├── products.js            endpoint katalog, kategori, detail & stok produk
│   │   │   ├── profile.js             endpoint profil motor & alamat pengiriman
│   │   │   └── wishlist.js            endpoint produk favorit (wishlist)
│   │   └── server.js                  titik mulai server Express & konfigurasi CORS
│   ├── .env
│   ├── .env.example                   contoh konfigurasi environment
│   ├── package-lock.json
│   └── package.json
│
├── docs/                              dokumen perancangan sistem (PlantUML)
│   ├── class/                         Class Diagram (class_diagram_senkanan.puml)
│   ├── erd/                           Entity Relationship Diagram (erd_senkanan.puml)
│   ├── sequence/                      12 Sequence Diagram alur Pelanggan & Admin
│   └── use-case/                      Use Case Diagram Pelanggan & Admin (user.puml, admin.puml)
│
├── senkanan-app/                      website pelanggan (React + Vite + Tailwind CSS)
│   ├── public/
│   │   └── images/                    logo, hero-banner & foto produk
│   ├── src/
│   │   ├── App.jsx                    seluruh antarmuka & alur belanja pelanggan
│   │   ├── index.css                  konfigurasi gaya Tailwind
│   │   └── main.jsx                   titik masuk aplikasi pelanggan
│   ├── .env
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── package-lock.json
├── PRD.md                             Product Requirements Document
└── README.md                         
```

## Menjalankan

Prasyarat: Node.js 18/20+ dan MySQL Server (atau MariaDB 10.2+). Jalankan dari folder utama repositori.

**1. Persiapan Database MySQL**
- Impor skema database dari `backend/sql/senkanan.sql` ke MySQL Server Anda sehingga terbentuk database `senkanan`.

**2. Backend** (terminal 1)
```
cd backend
npm install
cp .env.example .env        # sesuaikan DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT=5000
npm start                   # berjalan di http://localhost:5000 (atau port sesuai .env)
```
- Endpoint pengecekan server: `http://localhost:5000/api/health`
- Berkas `.env` lokal tidak ikut diunggah ke repositori publik.

**3. Website Pelanggan (`senkanan-app`)** (terminal 2)
```
cd senkanan-app
npm install
npm run dev                 # http://localhost:5173
```

**4. Panel Admin (`admin`)** (terminal 3)
```
cd admin
npm install
npm run dev                 # http://localhost:5174
```
- Login panel admin pada mode pratinjau menerima input email dan kata sandi yang terisi untuk masuk ke halaman Manajemen Stok.

## Dokumentasi

| Dokumen | Sumber | Keterangan |
| :-- | :-- | :-- |
| Product Requirements Document (PRD) | [PRD.md](./PRD.md) | Spesifikasi kebutuhan sistem lengkap |
| Skema Database SQL | [senkanan.sql](./backend/sql/senkanan.sql) | DDL MySQL, constraint & database views |
| ERD (PlantUML) | [erd_senkanan.puml](./docs/erd/erd_senkanan.puml) | Relasi 13 entitas database SEN Kanan |
| Class Diagram | [class_diagram_senkanan.puml](./docs/class/class_diagram_senkanan.puml) | Struktur kelas domain, atribut & method |
| Sequence Diagram | [docs/sequence/](./docs/sequence/) | 12 diagram interaksi alur pelanggan & admin |
| Use Case Diagram | [user.puml](./docs/use-case/user.puml) & [admin.puml](./docs/use-case/admin.puml) | Aktor dan cakupan fitur Pelanggan & Admin |
| Desain UI/UX | [Figma SEN Kanan](https://www.figma.com/design/MY9sEsMFEnJyxbBtzfWnRF/Kelompok-SEN-Kanan?node-id=0-1&t=u6LFxmPz3hAPL0eb-1) | Prototype antarmuka Pelanggan & Admin |

## Kontribusi

- Cabang `main` diperbarui melalui pull request setelah tinjauan anggota kelompok.
- Nama cabang mengikuti konvensi: `fitur/nama-fitur`, `perbaikan/nama-masalah`, atau `dokumen/nama-dokumen`.
- Sebelum mulai bekerja, jalankan `git pull`. Jangan commit folder `node_modules` maupun kredensial sensitif di `.env`.

