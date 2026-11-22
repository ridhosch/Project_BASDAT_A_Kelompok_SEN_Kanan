# Product Requirements Document (PRD)
## SEN Kanan – Sistem Penjualan Suku Cadang & Aksesori Motor

## Anggota Kelompok

| No. | Nama | NIM |
|---|---|---|
| 1 | Saka Laksmana Harimurti | 4525210067 |
| 2 | Satria Mahardika | 4525210068 |
| 3 | Muhammad Raffif Akbar | 4525210125 |
| 4 | Ridho Sachlan | 4525210066 |
| 5 | Prevansyah Sjafar | 4525210057 |
| 6 | Nabil Nugraha Syamjdaya | 4525210052 |

| | |
|---|---|
| **Tanggal** | November 2026 |
| **Status** | Final  |
| **Platform** | Web (Aplikasi Pelanggan `senkanan-app` & Panel Operasional `admin`) |
| **Dokumen & Desain Terkait** | ERD (`erd_senkanan.puml`), Skema SQL (`senkanan.sql`), Class Diagram, Use Case Diagram, 12 Sequence Diagram, & [Desain Figma SEN Kanan](https://www.figma.com/design/MY9sEsMFEnJyxbBtzfWnRF/Kelompok-SEN-Kanan?node-id=0-1&t=u6LFxmPz3hAPL0eb-1) |

---

## 1. Ringkasan

**SEN Kanan** adalah platform web e-commerce untuk penjualan barang otomotif motor (suku cadang dan aksesori) yang terdiri dari dua antarmuka terpisah—**Aplikasi Pelanggan (`senkanan-app`)** dan **Panel Admin (`admin`)**—yang terhubung ke satu **Backend REST API (Node.js + Express)** dan basis data relasional **MySQL (`senkanan`)**.

Pelanggan dapat menjelajahi katalog produk berdasarkan kategori maupun kata kunci, menyimpan produk favorit (*wishlist*), mendaftarkan data motor (*Motor Saya*), mengatur alamat pengiriman, mengelola keranjang belanja, melakukan checkout dengan opsi kurir **JNE REG / JNE YES** serta asuransi, membayar menggunakan **Virtual Account (BCA, BNI, Mandiri)**, hingga melacak progres status pesanan secara transparan. Di sisi operasional, Admin dapat mengelola stok produk beserta riwayat mutasi stok, mengekspor laporan stok ke CSV, memverifikasi atau menolak mutasi pembayaran Virtual Account, serta memproses, mengirim (input nomor resi), hingga membatalkan pesanan.

## 2. Latar Belakang & Masalah

- Pembelian suku cadang motor secara konvensional (chat manual atau datang langsung) menyebabkan pencatatan pesanan, alamat pengiriman, dan mutasi stok tidak terpusat.
- Pembeli sering kesulitan memastikan kecocokan suku cadang (*compatibility*) dengan spesifikasi tipe motor yang dimiliki.
- Kurangnya visibilitas status stok (*Tersedia*, *Terbatas*, *Habis*) dan pelacakan tahapan pengiriman membuat pelanggan harus menanyakan status pesanan secara manual.
- Verifikasi bukti transfer pembayaran memerlukan pencocokan nominal dan mutasi bank yang terstruktur agar tidak terjadi kesalahan pengiriman barang.

## 3. Tujuan

1. Menyediakan alur belanja mandiri bagi pelanggan mulai dari pencarian katalog, manajemen keranjang, hingga checkout Virtual Account tanpa hambatan.
2. Menjaga akurasi stok secara otomatis melalui pengurangan stok saat checkout serta pencatatan riwayat mutasi (`riwayat_stok`) setiap kali admin menambah stok.
3. Menyediakan panel admin terpadu untuk verifikasi pembayaran VA, pembaruan tahapan pesanan, penerbitan nomor resi, dan pemantauan stok.
4. Memberikan transparansi informasi kecocokan motor, rincian biaya (subtotal, ongkir, asuransi, biaya layanan), dan pelacakan progres 4 tahap pesanan.

## 4. Pengguna & Aktor Sistem

Berdasarkan Use Case Diagram (`user.puml` dan `admin.puml`):

| Peran | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Pelanggan** | Pemilik atau pengendara sepeda motor yang mencari suku cadang dan aksesori (akses berbasis sesi/pratinjau tanpa registrasi wajib) | Menemukan part yang cocok dengan motor, menyimpan wishlist & data motor, berbelanja via keranjang, membayar via VA, dan melacak pengiriman |
| **Admin** | Pengelola operasional toko SEN Kanan | Mengelola ketersediaan stok & riwayat stok, memverifikasi/menolak mutasi pembayaran VA, memproses pengiriman pesanan & menerbitkan resi |

## 5. Ruang Lingkup Fitur

### 5.1 Sisi Pelanggan (`senkanan-app` & `user.puml`)

| ID | Fitur | Prioritas | Referensi Diagram |
|---|---|---|---|
| FR-01 | Lihat Beranda (hero banner, kategori produk, dan produk unggulan) | Must | `user.puml` |
| FR-02 | Lihat Katalog, Pencarian (judul, spesifikasi, kategori, kecocokan), Filter Kategori & Urutkan Produk | Must | `user.puml`, `Katalog.puml` |
| FR-03 | Lihat Detail Produk (spesifikasi, kecocokan motor, status stok) & Tambah ke Keranjang | Must | `user.puml`, `Detail_Produk.puml` |
| FR-04 | Kelola Produk Favorit / Wishlist (toggle ikon hati) | Should | `user.puml`, `Katalog.puml` |
| FR-05 | Kelola Keranjang Belanja (ubah jumlah `+`/`−`, hapus item, hitung subtotal otomatis) | Must | `user.puml`, `Keranjang.puml` |
| FR-06 | Daftarkan & Ubah Data Motor (*Motor Saya*: nama pemilik, merek, tipe/model, plat nomor) | Should | `user.puml`, `Motor.puml` |
| FR-07 | Kelola Profil & Alamat Pengiriman (label, penerima, no. HP, email, alamat lengkap, catatan) | Must | `user.puml`, `Alamat.puml` |
| FR-08 | Checkout Pesanan (pilih kurir JNE REG/YES, opsi asuransi, catatan pesanan) | Must | `user.puml`, `checkout-va.puml` |
| FR-09 | Pembayaran Virtual Account (pilih bank BCA/BNI/Mandiri, generate 16 digit VA, konfirmasi bayar) | Must | `user.puml`, `checkout-va.puml` |
| FR-10 | Lacak Status Pesanan (timeline 4 tahap, rincian biaya, info kurir, nomor resi, estimasi tiba) | Must | `user.puml`, `lacak-pesanan.puml` |
| FR-11 | Konsultasi Kecocokan Part via WhatsApp & Baca Informasi Toko (panduan belanja, ongkir, retur) | Could | `user.puml` |

### 5.2 Sisi Admin (`admin` & `admin.puml`)

| ID | Fitur | Prioritas | Referensi Diagram |
|---|---|---|---|
| FR-12 | Masuk (Login Admin) & Keluar dari Panel Operasional | Must | `admin.puml`, `Admin_Masuk.puml` |
| FR-13 | Lihat Ringkasan & Daftar Manajemen Stok (filter kategori, status stok, pencarian SKU/nama) | Must | `admin.puml`, `Admin_Stok.puml` |
| FR-14 | Tambah Stok Produk & Catat Riwayat Mutasi Stok (`riwayat_stok`) | Must | `admin.puml`, `Admin_Stok.puml` |
| FR-15 | Ekspor Laporan Stok ke Berkas CSV (`stok-senkanan.csv`) | Should | `admin.puml`, `Admin_Stok.puml` |
| FR-16 | Lihat Daftar & Detail Pembayaran VA (filter status `MENUNGGU`, `LUNAS`, `DITOLAK`; salin no. VA) | Must | `admin.puml`, `Admin_Pembayaran.puml` |
| FR-17 | Verifikasi / Konfirmasi atau Tolak Pembayaran VA beserta Catatan Admin | Must | `admin.puml`, `Admin_Pembayaran.puml` |
| FR-18 | Lihat Daftar & Detail Pesanan (filter tahap pesanan, tanggal, pencarian nomor pesanan/pelanggan) | Must | `admin.puml`, `Admin_Pesanan.puml` |
| FR-19 | Proses Pesanan (`DIBUAT` → `DIPROSES`) & Kirim Pesanan (`DIPROSES` → `DIKIRIM` + nomor resi) | Must | `admin.puml`, `Admin_Pesanan.puml` |
| FR-20 | Batalkan Pesanan dengan Dialog Konfirmasi | Should | `admin.puml`, `Admin_batal.puml` |

## 6. Kebutuhan Fungsional

### 6.1 Beranda, Katalog & Detail Produk (FR-01, FR-02, FR-03, FR-04)
- **Kategori Produk (`kategori_produk`):** Menampilkan kategori utama seperti *Lampu dan sein*, *Pengereman*, *Aksesori motor*, *Mesin dan komponen*, dan *Kelistrikan*.
- **Pencarian & Filter:** Pelanggan dapat memfilter berdasarkan kategori, mencari kata kunci yang mencocokkan `nama_produk`, `spesifikasi`, `kecocokan`, maupun `kategori`, serta mengurutkan berdasarkan standar, harga terendah, harga tertinggi, atau nama (A–Z).
- **Status Stok Turunan (`Produk.statusStok()`):**
  - `stok > 5` → **Tersedia**
  - `1 <= stok <= 5` → **Terbatas**
  - `stok == 0` → **Habis** (tombol tambah ke keranjang dinonaktifkan)
- **Detail Produk:** Ditampilkan dalam modal interaktif berisi foto produk, label unggulan, spesifikasi, informasi kecocokan motor, deskripsi lengkap, harga satuan, serta pengatur jumlah (minimal 1 unit).
- **Wishlist (`favorit`):** Pelanggan dapat menandai atau menghapus produk dari daftar favorit melalui ikon hati pada kartu produk.

### 6.2 Profil Motor & Alamat Pengiriman (FR-06, FR-07)
- **Motor Saya (`motor_pengguna`):** Pelanggan mengisi `nama_pemilik`, `merek`, `tipe_model`, dan `plat_nomor`. Validasi mewajibkan minimal `merek` dan `tipe_model` terisi sebelum disimpan.
- **Alamat Pengiriman (`alamat_pengiriman`):** Menyimpan `label` (mis. *Rumah • Utama*), `nama_penerima`, `no_hp`, `email`, `alamat_lengkap`, dan `catatan`. Alamat dapat diubah langsung dari halaman Keranjang maupun Checkout melalui modal dialog.

### 6.3 Keranjang Belanja (FR-05)
- **Manajemen Item (`keranjang`):** Setiap baris menyimpan relasi pelanggan dan produk dengan batasan `jumlah > 0` dan unik per pasangan `(id_pelanggan, id_produk)`.
- Menambahkan produk yang sudah ada di keranjang akan mengakumulasi jumlah (`qty + delta`).
- Pelanggan dapat menambah/mengurangi jumlah (`+`/`−`), menghapus item, dan melihat subtotal barang secara langsung sebelum melanjutkan ke checkout.

### 6.4 Checkout & Pembayaran Virtual Account (FR-08, FR-09)
- **Perhitungan Biaya Pesanan (`pesanan` & `pengiriman`):**
  - **Kurir Pengiriman:**
    - `JNE REG`: Ongkos kirim **Rp 18.000** (estimasi 2–3 hari kerja).
    - `JNE YES`: Ongkos kirim **Rp 28.000** (estimasi 1 hari).
  - **Asuransi Pengiriman:** Opsional sebesar **Rp 1.800**.
  - **Biaya Layanan:** Tetap sebesar **Rp 1.000** per pesanan.
  - **Rumus Total:** `total = subtotal_produk + ongkir + asuransi + biaya_layanan`.
- **Virtual Account (`pembayaran`):**
  - Bank yang didukung: **BCA** (kode prefix `80777`), **BNI** (kode prefix `8808`), dan **Mandiri** (kode prefix `88908`).
  - Sistem menghasilkan nomor Virtual Account sepanjang **16 digit angka** (`CHAR(16)`).
  - Transfer dilakukan oleh pelanggan di luar sistem, kemudian pelanggan menekan tombol **Konfirmasi Pembayaran** pada modal pembayaran untuk membuat pesanan dengan status pembayaran `MENUNGGU` dan tahap pesanan `DIBUAT`.
- **Transaksi Checkout:** Saat pesanan dibuat (`POST /api/orders`), sistem menyimpan data ke `pesanan`, menyalin harga saat transaksi ke `detail_pesanan`, mengurangi stok produk terkait, dan mengosongkan keranjang belanja pelanggan.

### 6.5 Pelacakan Pesanan Pelanggan (FR-10, FR-11)
- Menampilkan nomor pesanan unik (format `SK-YYMMDD-NNNN`), tanggal pemesanan, timeline 4 tahap (`DIBUAT` → `DIPROSES` → `DIKIRIM` → `SELESAI`), kurir terpilih, estimasi tiba, alamat pengiriman, daftar barang, serta rincian Virtual Account.
- Nomor resi pengiriman ditampilkan secara otomatis setelah pesanan memasuki tahap `DIKIRIM`.
- Menyediakan tautan konsultasi kecocokan suku cadang langsung ke WhatsApp toko serta halaman informasi panduan belanja, pengiriman, dan kebijakan retur.

### 6.6 Operasional Panel Admin (FR-12 s.d. FR-20)
- **Autentikasi Admin (`admin`):** Admin masuk menggunakan form email dan kata sandi pada `LoginPage` untuk mengakses dashboard operasional (`StockPage`, `OrdersPage`, `PaymentsPage`) dan dapat keluar melalui menu profil.
- **Manajemen Stok (`StockPage`):**
  - Menampilkan kartu ringkasan total produk, total unit stok, serta distribusi status (*Tersedia*, *Terbatas*, *Habis*).
  - Admin dapat menambah stok (`jumlah > 0`) beserta catatan keterangan; sistem memperbarui `produk.stok` dan mencatat log ke `riwayat_stok`.
  - Fitur **Ekspor Stok** mengunduh berkas `stok-senkanan.csv` berisi SKU, Nama Produk, Kategori, dan Jumlah Stok.
- **Konfirmasi Pembayaran (`PaymentsPage`):**
  - Admin meninjau pesanan berstatus pembayaran `MENUNGGU`, menyalin nomor VA, dan melakukan verifikasi mutasi dengan mencentang konfirmasi **"Nominal sesuai"** dan **"Mutasi ditemukan"** serta mengisi catatan admin.
  - **Konfirmasi Pembayaran:** Mengubah status pembayaran menjadi `LUNAS` dan mencatat `waktu_konfirmasi`.
  - **Tolak Pembayaran:** Mengubah status pembayaran menjadi `DITOLAK` beserta alasan pada `catatan_admin`.
- **Manajemen Pesanan (`OrdersPage`):**
  - **Proses Pesanan:** Mengubah tahap dari `DIBUAT` ke `DIPROSES` (hanya aktif apabila status pembayaran sudah `LUNAS`).
  - **Kirim Pesanan:** Mengubah tahap dari `DIPROSES` ke `DIKIRIM` sekaligus menghasilkan/menyimpan `no_resi`.
  - **Batalkan Pesanan:** Menghapus pesanan bermasalah/batal setelah konfirmasi melalui modal dialog.

## 7. Aturan Bisnis

| ID | Aturan Bisnis | Implementasi Sistem |
|---|---|---|
| BR-01 | Stok produk tidak boleh bernilai negatif | Constraint SQL `CHECK (stok >= 0)` pada tabel `produk` |
| BR-02 | Harga barang pada pesanan bersifat historis (tidak berubah jika harga katalog diperbarui) | Disimpan pada kolom `detail_pesanan.harga_satuan` saat checkout |
| BR-03 | Nomor Virtual Account harus terdiri dari tepat 16 digit angka dari bank terdaftar | Constraint `CHECK (bank IN ('BCA','BNI','MANDIRI'))` dan `REGEXP '^[0-9]{16}$'` |
| BR-04 | Pesanan hanya dapat diproses (`DIPROSES`) setelah pembayaran diverifikasi `LUNAS` oleh admin | Validasi UI pada `OrdersPage` dan alur `Admin_Pesanan.puml` |
| BR-05 | Penambahan stok oleh admin wajib bernilai positif dan tercatat dalam riwayat mutasi | Validasi `jumlah > 0` pada `PATCH /api/products/:id/stock` dan tabel `riwayat_stok` |
| BR-06 | Setiap pasangan pelanggan dan produk dalam keranjang maupun favorit tidak boleh duplikat | Constraint `UNIQUE (id_pelanggan, id_produk)` pada `keranjang` dan Composite PK pada `favorit` |
| BR-07 | Satu pesanan memiliki tepat satu data pengiriman dan satu data pembayaran | Relasi 1:1 dengan constraint `UNIQUE (id_pesanan)` pada `pengiriman` dan `pembayaran` |

## 8. Model Data & Arsitektur Database

Berdasarkan ERD (`docs/erd/erd_senkanan.puml`), Class Diagram (`docs/class/class_diagram_senkanan.puml`), dan skema DDL MySQL (`backend/sql/senkanan.sql`), sistem terdiri dari **13 tabel utama** dan **4 database view**:

### 8.1 Daftar Tabel Utama

| No. | Nama Tabel | Kolom Kunci & Utama | Relasi |
|---|---|---|---|
| 1 | `admin` | `id_admin` (PK), `nama_admin`, `email` (UQ), `kata_sandi` | 1:N ke `riwayat_stok`, 0..1:N ke `pembayaran` |
| 2 | `pelanggan` | `id_pelanggan` (PK), `nama`, `email` (UQ), `no_hp` | 1:N ke `motor_pengguna`, `alamat_pengiriman`, `keranjang`, `favorit`, `pesanan` |
| 3 | `motor_pengguna` | `id_motor` (PK), `id_pelanggan` (FK), `nama_pemilik`, `merek`, `tipe_model`, `plat_nomor` | N:1 ke `pelanggan` |
| 4 | `alamat_pengiriman` | `id_alamat` (PK), `id_pelanggan` (FK), `label`, `nama_penerima`, `no_hp`, `email`, `alamat_lengkap`, `catatan` | N:1 ke `pelanggan` |
| 5 | `kategori_produk` | `id_kategori` (PK), `nama_kategori`, `deskripsi`, `ikon` | 1:N ke `produk` |
| 6 | `produk` | `id_produk` (PK), `id_kategori` (FK), `sku` (UQ), `nama_produk`, `spesifikasi`, `label`, `kecocokan`, `deskripsi`, `harga`, `stok`, `gambar` | 1:N ke `keranjang`, `favorit`, `detail_pesanan`, `riwayat_stok` |
| 7 | `riwayat_stok` | `id_riwayat` (PK), `id_produk` (FK), `id_admin` (FK), `jumlah`, `catatan`, `waktu` | N:1 ke `produk` & `admin` |
| 8 | `keranjang` | `id_keranjang` (PK), `id_pelanggan` (FK), `id_produk` (FK), `jumlah` | N:1 ke `pelanggan` & `produk` |
| 9 | `favorit` | `id_pelanggan` (PK, FK), `id_produk` (PK, FK) | N:M penghubung `pelanggan` & `produk` |
| 10 | `pesanan` | `id_pesanan` (PK), `nomor_pesanan` (UQ), `id_pelanggan` (FK), `tanggal_pesanan`, `tahap`, `biaya_layanan`, `total`, `catatan`, `waktu_diproses`, `waktu_dikirim`, `waktu_tiba` | 1:N ke `detail_pesanan`; 1:1 ke `pengiriman` & `pembayaran` |
| 11 | `detail_pesanan` | `id_pesanan` (PK, FK), `id_produk` (PK, FK), `jumlah`, `harga_satuan` | N:1 ke `pesanan` & `produk` |
| 12 | `pengiriman` | `id_pengiriman` (PK), `id_pesanan` (FK, UQ), `nama_penerima`, `no_hp_penerima`, `email_penerima`, `alamat_lengkap`, `catatan_alamat`, `kurir`, `ongkir`, `asuransi`, `no_resi`, `estimasi_awal`, `estimasi_akhir` | 1:1 ke `pesanan` |
| 13 | `pembayaran` | `id_pembayaran` (PK), `id_pesanan` (FK, UQ), `id_admin` (FK, NULL), `bank`, `no_va`, `jumlah`, `status`, `waktu_bayar`, `waktu_konfirmasi`, `catatan_admin` | 1:1 ke `pesanan`; N:0..1 ke `admin` |

### 8.2 Database Views (Nilai Turunan Class Diagram)

| Nama View | Fungsi / Method Terkait | Keterangan |
|---|---|---|
| `v_produk_status_stok` | `Produk.statusStok()` | Menghasilkan status `'Habis'` (`stok = 0`), `'Terbatas'` (`stok <= 5`), atau `'Tersedia'` (`stok > 5`) |
| `v_keranjang_subtotal` | `Keranjang.hitungSubtotal()` | Menghitung `jumlah * harga` per baris keranjang |
| `v_detail_pesanan_total` | `DetailPesanan.hitungTotalHarga()` | Menghitung `jumlah * harga_satuan` per item pesanan |
| `v_pesanan_total` | `Pesanan.hitungSubtotal()` & `hitungTotal()` | Mengagregasi subtotal item ditambah `ongkir`, `asuransi`, dan `biaya_layanan` |

### 8.3 Nilai Enumerasi

| Kolom | Nilai yang Diizinkan |
|---|---|
| `pesanan.tahap` | `'DIBUAT'`, `'DIPROSES'`, `'DIKIRIM'`, `'SELESAI'` |
| `pengiriman.kurir` | `'JNE REG'`, `'JNE YES'` |
| `pembayaran.bank` | `'BCA'`, `'BNI'`, `'MANDIRI'` |
| `pembayaran.status` | `'MENUNGGU'`, `'LUNAS'`, `'DITOLAK'` |

## 9. Spesifikasi Antarmuka API (Backend REST API)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Pengecekan status layanan API dan koneksi database |
| `GET` | `/api/products` | Mengambil daftar produk (query: `category`, `search`, `sort`) |
| `GET` | `/api/products/categories` | Mengambil daftar kategori produk |
| `GET` | `/api/products/:id` | Mengambil detail produk berdasarkan ID |
| `PATCH` | `/api/products/:id/stock` | Menambah stok produk dari Panel Admin |
| `GET` | `/api/cart` | Mengambil daftar item keranjang berdasarkan sesi |
| `POST` | `/api/cart` | Menambahkan produk ke keranjang (atau menambah qty jika sudah ada) |
| `PATCH` | `/api/cart/:productId` | Mengubah jumlah (`qty`) item di keranjang |
| `DELETE` | `/api/cart/:productId` | Menghapus item dari keranjang |
| `GET` | `/api/wishlist` | Mengambil daftar ID produk favorit pelanggan |
| `POST` | `/api/wishlist/toggle` | Menambah/menghapus produk dari daftar favorit |
| `GET` & `PUT` | `/api/profile/motor` | Mengambil & menyimpan profil *Motor Saya* |
| `GET` & `PUT` | `/api/profile/address` | Mengambil & memperbarui alamat pengiriman pelanggan |
| `GET` | `/api/orders` | Mengambil riwayat pesanan pelanggan berdasarkan sesi |
| `GET` | `/api/orders/all` | Mengambil seluruh pesanan untuk kebutuhan Panel Admin |
| `GET` | `/api/orders/latest` | Mengambil pesanan terakhir yang dibuat pelanggan |
| `POST` | `/api/orders` | Membuat pesanan baru (checkout VA), mengurangi stok, dan mengosongkan keranjang |
| `PATCH` | `/api/orders/:id/stage` | Memperbarui tahap pesanan (`DIPROSES`, `DIKIRIM`, `SELESAI`) & nomor resi |
| `PATCH` | `/api/orders/:id/payment` | Mengonfirmasi (`LUNAS`) atau menolak (`DITOLAK`) pembayaran VA oleh Admin |
| `DELETE` | `/api/orders/:id` | Membatalkan dan menghapus pesanan oleh Admin |

## 10. Daftar Layar & Komponen Antarmuka (Desain Figma)

Selaras dengan [Desain Figma SEN Kanan](https://www.figma.com/design/MY9sEsMFEnJyxbBtzfWnRF/Kelompok-SEN-Kanan?node-id=0-1&t=u6LFxmPz3hAPL0eb-1) serta implementasi frontend:

### 10.1 Aplikasi Pelanggan (`senkanan-app`)
1. **Beranda:** Hero banner promosi, akses cepat kategori unggulan, dan etalase produk pilihan.
2. **Katalog Produk:** Kolom pencarian langsung, filter kategori, pengurutan produk, badge status stok, dan tombol wishlist.
3. **Modal Detail Produk:** Informasi kecocokan motor, spesifikasi teknis, pengatur kuantitas, dan tombol tambah ke keranjang.
4. **Keranjang Belanja:** Daftar item terpilih, kontrol kuantitas (`+`/`−`), hapus item, ringkasan belanja, dan tampilan *empty state* saat keranjang kosong.
5. **Checkout & Modal Konfirmasi VA:** Ringkasan alamat pengiriman (dengan modal *Ubah Alamat*), pemilihan kurir JNE REG/YES, opsi asuransi, pemilihan bank VA (BCA/BNI/Mandiri) dengan nomor VA 16 digit, serta modal konfirmasi pembayaran.
6. **Pelacakan Pesanan (`PesananView`):** Visualisasi progres 4 tahap pesanan, informasi kurir, nomor resi, estimasi tiba, dan rincian pembayaran.
7. **Profil Motor Saya (`MotorSayaView`):** Formulir pendaftaran dan pratinjau kartu identitas motor pelanggan.
8. **Informasi Toko & Bantuan:** Panduan pemesanan, informasi ongkos kirim, kebijakan retur, serta tombol konsultasi WhatsApp.

### 10.2 Panel Operasional Admin (`admin`)
1. **Halaman Masuk (`LoginPage`) & Selamat Datang (`WelcomePage`):** Gerbang masuk operasional admin.
2. **Manajemen Stok (`StockPage`):** Ringkasan metrik stok, tabel produk dengan filter kategori/status, formulir penambahan stok dengan catatan, serta tombol ekspor CSV.
3. **Manajemen Pesanan (`OrdersPage`):** Filter berdasarkan tahap (`DIBUAT`, `DIPROSES`, `DIKIRIM`, `SELESAI`), panel detail pesanan, aksi *Proses Pesanan*, *Kirim Pesanan* (generate resi), dan modal konfirmasi *Batalkan Pesanan*.
4. **Konfirmasi Pembayaran (`PaymentsPage`):** Tab status (`Menunggu`, `Lunas`, `Ditolak`), pemeriksaan nomor VA, checklist verifikasi mutasi bank, catatan admin, dan aksi *Konfirmasi* atau *Tolak Pembayaran*.

## 11. Kebutuhan Non-Fungsional

| Area | Kebutuhan |
|---|---|
| **Integritas Data** | Proses checkout menggunakan transaksi database (`beginTransaction` / `commit` / `rollback`) sehingga pembuatan pesanan dan pengurangan stok berjalan atomik. |
| **Keamanan & Privasi** | Kredensial database dan konfigurasi port disimpan di berkas `.env` yang dikecualikan dari repositori Git; kata sandi admin dirancang untuk disimpan dalam bentuk hash. |
| **Kegunaan (Usability)** | Antarmuka responsif berbasis Tailwind CSS dengan umpan balik instan berupa notifikasi *toast*, validasi form, dan keadaan kosong (*empty state*) yang informatif. |
| **Interoperabilitas** | Arsitektur terpisah antara frontend pelanggan, panel admin, dan backend REST API memungkinkan pengembangan maupun deployment independen. |
| **Kompatibilitas** | Mendukung browser modern (Chrome, Edge, Firefox, Safari) serta MySQL 8.0+ / MariaDB 10.2+. |