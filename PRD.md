# Product Requirements Document (PRD)
## SEN Kanan – Sistem Penjualan Barang Otomotif Motor

## Anggota Kelompok

| Nama | NIM |
|---|---|
| Saka Laksmana Harimurti | 4525210067 |
| Satria Mahardika | 4525210068 |
| Muhammad Raffif Akbar | 4525210125 |
| Ridho Sachlan | 4525210066 |
| Prevansyah Sjafar | 4525210057 |
| Nabil Nugraha Syamjdaya| 4525210052 |

| | |
|---|---|
| **Tanggal** | 1 November 2026 |
| **Status** | Draft untuk review |
| **Platform** | Web (desktop-first) |
| **Dokumen terkait** | ERD, Use Case, Sequence, dan Class Diagram, Desain Figma  |

---

## 1. Ringkasan

SEN Kanan adalah toko online untuk menjual barang otomotif motor (suku cadang dan aksesori). Pelanggan dapat menelusuri katalog, memasukkan barang ke keranjang, melakukan checkout, membayar dengan **kartu debit**, dan memantau status pesanan. Admin mengelola data motor, produk, stok, verifikasi pembayaran, dan status pesanan.

Pelanggan juga dapat menyimpan data motor miliknya (merek, model, tahun, plat nomor) sebagai dasar pengembangan fitur rekomendasi produk yang cocok di tahap berikutnya.

## 2. Latar Belakang & Masalah

- Pembelian barang motor secara manual (WhatsApp, datang ke toko) membuat pencatatan pesanan, stok, dan pembayaran tidak terpusat.
- Stok sering tidak sinkron dengan penjualan karena tidak ada catatan mutasi.
- Pelanggan sulit melihat status pesanan dan estimasi barang tiba.

## 3. Tujuan 

1. Pelanggan dapat menyelesaikan pembelian (katalog → keranjang → checkout → bayar) tanpa bantuan manual.
2. Stok produk selalu akurat dan setiap perubahannya tercatat (`mutasi_stok`).
3. Admin dapat memproses pesanan dan memverifikasi pembayaran dari satu panel.
4. Pelanggan dapat melacak status pesanan dan estimasi tiba.


## 4. Pengguna

| Peran | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Pelanggan** | Pemilik motor yang membeli suku cadang/aksesori | Menemukan barang, membeli dengan mudah, memantau pesanan |
| **Admin** | Pengelola toko | Mengelola katalog dan stok, memverifikasi pembayaran, memproses pesanan |

## 5. Ruang Lingkup Fitur

### 5.1 Sisi Pelanggan

| ID | Fitur | Prioritas |
|---|---|---|
| FR-01 | Registrasi akun (nama, alamat pengiriman) | Must |
| FR-02 | Kelola profil & alamat pengiriman | Must |
| FR-03 | Kelola motor saya (tambah/hapus motor) | Should |
| FR-04 | Lihat katalog produk (daftar, cari, filter merek) | Must |
| FR-05 | Lihat detail produk | Must |
| FR-06 | Kelola keranjang (tambah, ubah jumlah, hapus) | Must |
| FR-07 | Checkout pesanan | Must |
| FR-08 | Bayar pesanan dengan kartu debit | Must |
| FR-09 | Lihat riwayat & status pesanan | Must |
| FR-10 | Lihat detail pesanan (alamat, estimasi tiba, status pembayaran) | Must |

### 5.2 Sisi Admin

| ID | Fitur | Prioritas |
|---|---|---|
| FR-11 | Kelola merek & model motor | Should |
| FR-12 | Kelola merek produk & produk | Must |
| FR-13 | Kelola stok (stok masuk, riwayat mutasi) | Must |
| FR-14 | Verifikasi pembayaran | Must |
| FR-15 | Lihat daftar pesanan, proses & ubah status pesanan | Must |

## 6. Kebutuhan Fungsional

### 6.1 Akun & Profil (FR-01, FR-02)
- Pelanggan mengisi nama (`nama_pengguna`) dan alamat pengiriman (`alamat_pengiriman`).
- Pelanggan dapat mengubah nama dan alamat kapan saja; perubahan hanya berlaku untuk pesanan berikutnya.

### 6.2 Motor Saya (FR-03)
- Pelanggan memilih merek, lalu model (daftar model bergantung pada merek terpilih), mengisi tahun dan plat nomor.
- Data disimpan di `motor_pengguna`. Satu pelanggan boleh memiliki banyak motor.

### 6.3 Katalog & Detail Produk (FR-04, FR-05)
- Katalog menampilkan nama, harga, stok, dan merek produk.
- Pencarian berdasarkan nama produk; filter berdasarkan merek (`merek_produk`).
- Produk dengan `stok = 0` tetap tampil dengan label "Stok habis" dan tombol keranjang nonaktif.
- Detail produk menampilkan nama, deskripsi, harga, stok, merek, pengatur jumlah, dan tombol "Tambah ke keranjang".

### 6.4 Keranjang (FR-06)
- Setiap baris keranjang berisi produk (`id_produk`, `nama_produk`) dan `jumlah`.
- Jumlah minimal 1 dan tidak boleh melebihi `produk.stok`.
- Menambahkan produk yang sudah ada di keranjang menambah jumlahnya, bukan membuat baris baru.
- Subtotal = harga × jumlah (dihitung saat tampil, tidak disimpan).
- Baris dengan stok tidak mencukupi ditandai "Stok tidak cukup" dan checkout diblokir sampai diperbaiki.
- Keranjang kosong menampilkan ajakan "Mulai belanja".

### 6.5 Checkout (FR-07)
- Pelanggan meninjau item, total, dan alamat pengiriman sebelum membuat pesanan.
- Saat pesanan dibuat, sistem:
  1. Membuat `pesanan` dengan status `MENUNGGU_BAYAR` dan `total`.
  2. Membuat `detail_pesanan` untuk tiap item (menyalin `harga_satuan` saat itu, `total_harga`, dan `alamat_pemesan`).
  3. Mengurangi `produk.stok` dan mencatat `mutasi_stok` dengan jenis `KELUAR`.
  4. Mengosongkan keranjang pengguna.
- Seluruh langkah dijalankan dalam satu transaksi database; jika ada yang gagal (misalnya stok berubah), semuanya dibatalkan dan pelanggan diberi pesan.

### 6.6 Pembayaran Kartu Debit (FR-08, FR-14)
- Metode pembayaran hanya **kartu debit** (`metode = KARTU_DEBIT`).
- Pembayaran hanya dapat dibuat untuk pesanan berstatus `MENUNGGU_BAYAR`.
- Sistem membuat `pembayaran` dengan `jumlah = pesanan.total` dan status `MENUNGGU`.
- Admin memverifikasi pembayaran:
  - **Valid** → status pembayaran `LUNAS`, `waktu_bayar` terisi, status pesanan menjadi `DIPROSES`.
  - **Tidak valid** → status pembayaran `DITOLAK`; pelanggan dapat mencoba membayar lagi.
- **Data kartu (nomor, masa berlaku, CVV) tidak boleh disimpan** di database sistem. Form kartu hanya diteruskan ke penyedia pembayaran.

### 6.7 Pesanan (FR-09, FR-10, FR-15)
- Pelanggan melihat daftar pesanan miliknya dengan status dan total, serta detail tiap pesanan.
- Admin melihat seluruh pesanan, dapat memfilter berdasarkan status, dan mengubah status.
- Alur status: `MENUNGGU_BAYAR` → `DIPROSES` → `DIKIRIM` → `SELESAI`.
- Saat status menjadi `DIKIRIM`, admin mengisi `estimasi_sampai` pada detail pesanan.
- Perubahan status di luar alur di atas ditolak.

### 6.8 Pengelolaan Produk & Stok (FR-11, FR-12, FR-13)
- Admin menambah, mengubah, dan menghapus merek motor, model motor, merek produk, dan produk.
- Penambahan stok oleh admin memperbarui `produk.stok` dan mencatat `mutasi_stok` jenis `MASUK`.
- Riwayat mutasi menampilkan produk, jenis, jumlah, dan keterangan.
- Produk yang sudah pernah dipesan tidak boleh dihapus permanen (lihat Pertanyaan Terbuka #3).

## 7. Aturan Bisnis

| ID | Aturan |
|---|---|
| BR-01 | `produk.stok` tidak boleh negatif. |
| BR-02 | `harga_satuan` pada `detail_pesanan` adalah salinan harga saat checkout dan tidak berubah jika harga produk diubah. |
| BR-03 | `pembayaran.jumlah` harus sama dengan `pesanan.total`. |
| BR-04 | Pembayaran `LUNAS` mengubah pesanan menjadi `DIPROSES`. |
| BR-05 | Setiap perubahan stok (checkout, stok masuk) harus tercatat di `mutasi_stok`. |
| BR-06 | Pelanggan hanya dapat melihat pesanan dan keranjang miliknya sendiri. |
| BR-07 | Hanya admin yang dapat mengakses halaman pengelolaan dan mengubah status pesanan. |
| BR-08 | Data kartu debit tidak disimpan oleh sistem. |

## 8. Model Data (ringkasan)

Berdasarkan ERD v3. Tabel `pembayaran` adalah satu-satunya tambahan dari ERD awal.

| Tabel | Kolom utama | Relasi |
|---|---|---|
| `pengguna` | id_pengguna, nama_pengguna, alamat_pengiriman, id_keranjang | 1:N ke motor_pengguna, keranjang, pesanan |
| `merek_motor` | id_merek, nama_merek | 1:N ke model_motor |
| `model_motor` | id_model, id_merek, nama_model, tahun_mulai, tahun_akhir | 1:N ke motor_pengguna |
| `motor_pengguna` | id, id_pengguna, id_model, tahun, plat_nomor | – |
| `merek_produk` | id_brand, nama_brand | 1:N ke produk |
| `produk` | id_produk, id_brand, nama_produk, deskripsi, harga, stok | 1:N ke keranjang, detail_pesanan, mutasi_stok |
| `keranjang` | id_keranjang, id_pengguna, id_produk, nama_produk, jumlah | – |
| `pesanan` | id_pesanan, id_pengguna, status, total | 1:N ke detail_pesanan, pembayaran |
| `detail_pesanan` | id_pesanan, id_produk, jumlah, harga_satuan, total_harga, alamat_pemesan, estimasi_sampai | – |
| `pembayaran` **(baru)** | id_pembayaran, id_pesanan, metode, jumlah, status, waktu_bayar | – |
| `mutasi_stok` | id_mutasi, id_produk, jenis, jumlah, keterangan | – |

**Nilai enumerasi**

| Field | Nilai |
|---|---|
| `pesanan.status` | MENUNGGU_BAYAR, DIPROSES, DIKIRIM, SELESAI |
| `pembayaran.metode` | KARTU_DEBIT |
| `pembayaran.status` | MENUNGGU, LUNAS, DITOLAK |
| `mutasi_stok.jenis` | MASUK, KELUAR |

## 9. Alur Utama Pengguna

**Pembelian (pelanggan)**
Katalog → Detail produk → Tambah ke keranjang → Keranjang → Checkout → Pembayaran kartu debit → Konfirmasi (menunggu verifikasi) → Riwayat/Detail pesanan.

**Pemrosesan (admin)**
Verifikasi pembayaran (valid) → pesanan `DIPROSES` → ubah status `DIKIRIM` (isi estimasi tiba) → `SELESAI`.

**Stok (admin)**
Kelola stok → input stok masuk → `produk.stok` bertambah dan `mutasi_stok` (MASUK) tercatat.

## 10. Daftar Layar (frame Figma)

Berdasarkan pembaruan struktur file desain Figma terbaru (`Desain Figma/user/` dan `Desain Figma/admin/`):

1. Beranda (Pelanggan)
2. Registrasi akun & Masuk / Berhasil Masuk
3. Katalog produk
4. Detail Produk
5. Keranjang
6. Checkout
7. Pembayaran kartu debit
8. Konfirmasi pembayaran
9. Riwayat pesanan
10. Detail pesanan
11. Profil & alamat (Motor saya / Pengguna)
12. Dashboard Admin & Manajemen Stok Admin
13. Admin Pesanan Pelanggan

**Kebutuhan tampilan umum:** komponen yang dipakai ulang (navbar, kartu produk, tombol, input, tabel, badge status, modal, toast); keadaan kosong (keranjang, riwayat); keadaan stok habis; keadaan pembayaran (diproses, ditolak, berhasil); pesan error form.

**Layar Keranjang (detail):** tiap baris barang berisi gambar (placeholder), nama produk, merek, harga satuan, pengatur jumlah (− / +, maksimal sesuai stok), subtotal, dan tombol hapus; varian normal, stok menipis, stok tidak cukup, dan loading.

## 11. Kebutuhan Non-Fungsional

| Area | Kebutuhan |
|---|---|
| **Keamanan** | Data kartu tidak disimpan; komunikasi lewat HTTPS; akses admin dipisahkan dari pelanggan; pelanggan hanya mengakses datanya sendiri. |
| **Integritas data** | Checkout dan perubahan stok dalam satu transaksi; constraint `stok >= 0`. |
| **Performa** | Halaman katalog dan keranjang termuat ≤ 3 detik pada koneksi umum. |
| **Kegunaan** | Responsif untuk layar desktop dan mobile; alur dari keranjang ke pembayaran maksimal 3 langkah. |
| **Ketersediaan** | Target uptime 99% selama jam operasional toko. |
| **Kompatibilitas** | Browser modern terbaru (Chrome, Edge, Firefox, Safari). |

## 12. Metrik Keberhasilan (usulan)

| Metrik | Target awal |
|---|---|
| Tingkat penyelesaian checkout (keranjang → pesanan) | ≥ 60% |
| Pesanan yang pembayarannya terverifikasi ≤ 1 hari kerja | ≥ 90% |
| Selisih stok sistem vs stok fisik saat opname | ≤ 2% |
| Pesanan dengan status yang diperbarui tepat waktu | ≥ 95% |

Target dapat disesuaikan setelah ada data operasional.

## 13. Asumsi

- Verifikasi pembayaran dilakukan manual oleh admin pada versi 1.0.
- Ongkos kirim tidak dihitung otomatis (belum ada kolom di ERD).
- Pembayaran kartu debit diproses lewat penyedia pembayaran pihak ketiga; sistem hanya mencatat hasilnya.
- Gambar produk belum disimpan di database; tampilan memakai placeholder sampai kolom gambar ditambahkan.

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Dua pelanggan membeli stok terakhir bersamaan | Stok negatif | Transaksi database dan pengecekan ulang stok saat checkout |
| Pesanan menggantung di `MENUNGGU_BAYAR` dan menahan stok | Stok tidak tersedia untuk pembeli lain | Tentukan batas waktu bayar atau fitur pembatalan di versi berikutnya |
| Pembayaran sudah dipotong tetapi status belum diperbarui | Keluhan pelanggan | Catat referensi transaksi dan sediakan halaman verifikasi admin |
| Data kartu bocor jika disimpan sendiri | Risiko hukum dan reputasi | Jangan simpan data kartu; gunakan penyedia pembayaran tersertifikasi |

## 15. Pertanyaan Terbuka

1. **Autentikasi:** tabel `pengguna` belum memiliki email/password dan peran (admin/pelanggan). Bagaimana pengguna masuk ke sistem dan bagaimana admin dibedakan?
2. **Relasi `pengguna` ↔ `keranjang`:** ERD saat ini memuat `id_keranjang` di `pengguna` sekaligus `id_pengguna` di `keranjang` (saling menunjuk). Disarankan hanya `keranjang.id_pengguna`.
3. **Penghapusan produk:** produk yang sudah dipesan tidak boleh dihapus permanen; perlu kolom status aktif/nonaktif atau aturan penghapusan.
4. **Verifikasi pembayaran:** manual oleh admin, atau otomatis lewat penyedia pembayaran? Menentukan perlu tidaknya layar Verifikasi pembayaran (#17).
5. **Batas waktu pembayaran:** berapa lama pesanan `MENUNGGU_BAYAR` ditahan sebelum dibatalkan dan stok dikembalikan?
6. **Ongkos kirim dan kurir:** apakah dibutuhkan pada versi 1.0?
7. **Gambar produk dan kategori:** apakah perlu ditambahkan ke ERD sebelum desain final?

## 16. Rencana Rilis (usulan)

| Tahap | Cakupan |
|---|---|
| **Desain** | Wireframe dan prototype Figma untuk seluruh layar, komponen dan design system |
| **MVP** | FR-01, 02, 04–10, 12–15 (alur beli sampai pesanan diproses, pengelolaan produk & stok) |
| **Rilis 1.0** | MVP + FR-03, FR-11, penyempurnaan error/empty state |
| **Berikutnya** | Rekomendasi produk sesuai motor, kategori produk, pembatalan/retur, ongkir, laporan penjualan |
