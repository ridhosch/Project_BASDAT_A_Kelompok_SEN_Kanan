-- =====================================================
-- Database: senkanan (versi terbaru)
-- ERD: SEN Kanan (model data sesuai program senkanan-app & senkanan-admin)
-- Target: MySQL 8.0.16+ / MariaDB 10.2+ (CHECK constraint aktif)
-- =====================================================

DROP DATABASE IF EXISTS senkanan;
CREATE DATABASE senkanan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE senkanan;
SET NAMES utf8mb4;   -- pastikan karakter seperti "•" tersimpan benar saat impor lewat CLI

-- ---------- Akun ----------
CREATE TABLE admin (
    id_admin    INT AUTO_INCREMENT PRIMARY KEY,
    nama_admin  VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    kata_sandi  VARCHAR(255) NOT NULL          -- simpan hash, bukan teks asli
) ENGINE=InnoDB;

CREATE TABLE pelanggan (
    id_pelanggan  INT AUTO_INCREMENT PRIMARY KEY,
    nama          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    no_hp         VARCHAR(20)
) ENGINE=InnoDB;

-- ---------- Data pelanggan ----------
CREATE TABLE motor_pengguna (
    id_motor      INT AUTO_INCREMENT PRIMARY KEY,
    id_pelanggan  INT NOT NULL,
    nama_pemilik  VARCHAR(100),
    merek         VARCHAR(50),
    tipe_model    VARCHAR(100),
    plat_nomor    VARCHAR(15) NOT NULL,   -- tersimpan dalam bentuk normalisasi (huruf besar, tanpa spasi/simbol)
    CONSTRAINT uq_motor_plat UNIQUE (plat_nomor),   -- mencegah duplikasi data motor
    CONSTRAINT chk_motor_plat CHECK (plat_nomor REGEXP '^[A-Z0-9]{1,15}$'),
    CONSTRAINT fk_motor_pelanggan FOREIGN KEY (id_pelanggan)
        REFERENCES pelanggan(id_pelanggan) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE alamat_pengiriman (
    id_alamat       INT AUTO_INCREMENT PRIMARY KEY,
    id_pelanggan    INT NOT NULL,
    label           VARCHAR(50),               -- contoh: Rumah, Kantor
    nama_penerima   VARCHAR(100) NOT NULL,
    no_hp           VARCHAR(20),
    email           VARCHAR(150),
    alamat_lengkap  TEXT NOT NULL,
    catatan         VARCHAR(255),
    CONSTRAINT fk_alamat_pelanggan FOREIGN KEY (id_pelanggan)
        REFERENCES pelanggan(id_pelanggan) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Produk ----------
CREATE TABLE kategori_produk (
    id_kategori    INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori  VARCHAR(100) NOT NULL,
    deskripsi      VARCHAR(255),
    ikon           VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE produk (
    id_produk    INT AUTO_INCREMENT PRIMARY KEY,
    id_kategori  INT NOT NULL,
    sku          VARCHAR(50) NOT NULL UNIQUE,
    nama_produk  VARCHAR(150) NOT NULL,
    spesifikasi  VARCHAR(255),
    label        VARCHAR(50) NULL,
    kecocokan    TEXT,
    deskripsi    TEXT,
    harga        DECIMAL(15,2) NOT NULL DEFAULT 0,
    stok         INT NOT NULL DEFAULT 0,       -- Tersedia > 5, Terbatas 1-5, Habis 0 (diturunkan dari stok)
    gambar       VARCHAR(255),
    CONSTRAINT chk_produk_stok CHECK (stok >= 0),
    CONSTRAINT fk_produk_kategori FOREIGN KEY (id_kategori)
        REFERENCES kategori_produk(id_kategori) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE riwayat_stok (
    id_riwayat  INT AUTO_INCREMENT PRIMARY KEY,
    id_produk   INT NOT NULL,
    id_admin    INT NOT NULL,
    jumlah      INT NOT NULL,                  -- positif = tambah, negatif = kurang
    catatan     VARCHAR(255),
    waktu       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_riwayat_produk FOREIGN KEY (id_produk)
        REFERENCES produk(id_produk) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_riwayat_admin FOREIGN KEY (id_admin)
        REFERENCES admin(id_admin) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------- Keranjang & favorit ----------
CREATE TABLE keranjang (
    id_keranjang  INT AUTO_INCREMENT PRIMARY KEY,
    id_pelanggan  INT NOT NULL,
    id_produk     INT NOT NULL,
    jumlah        INT NOT NULL DEFAULT 1,
    CONSTRAINT uq_keranjang UNIQUE (id_pelanggan, id_produk),
    CONSTRAINT chk_keranjang_jumlah CHECK (jumlah > 0),
    CONSTRAINT fk_keranjang_pelanggan FOREIGN KEY (id_pelanggan)
        REFERENCES pelanggan(id_pelanggan) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_keranjang_produk FOREIGN KEY (id_produk)
        REFERENCES produk(id_produk) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE favorit (
    id_pelanggan  INT NOT NULL,
    id_produk     INT NOT NULL,
    PRIMARY KEY (id_pelanggan, id_produk),
    CONSTRAINT fk_favorit_pelanggan FOREIGN KEY (id_pelanggan)
        REFERENCES pelanggan(id_pelanggan) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_favorit_produk FOREIGN KEY (id_produk)
        REFERENCES produk(id_produk) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Pesanan ----------
CREATE TABLE pesanan (
    id_pesanan       INT AUTO_INCREMENT PRIMARY KEY,
    nomor_pesanan    VARCHAR(20) NOT NULL UNIQUE,   -- format SK-YYMMDD-NNNN
    id_pelanggan     INT NOT NULL,
    tanggal_pesanan  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tahap            VARCHAR(20) NOT NULL DEFAULT 'DIBUAT',
    biaya_layanan    DECIMAL(15,2) NOT NULL DEFAULT 1000,
    total            DECIMAL(15,2) NOT NULL DEFAULT 0, -- subtotal + ongkir + asuransi + biaya_layanan
    catatan          VARCHAR(255),
    waktu_diproses   DATETIME NULL,
    waktu_dikirim    DATETIME NULL,
    waktu_tiba       DATETIME NULL,
    CONSTRAINT chk_pesanan_tahap CHECK (tahap IN ('DIBUAT','DIPROSES','DIKIRIM','SELESAI')),
    CONSTRAINT fk_pesanan_pelanggan FOREIGN KEY (id_pelanggan)
        REFERENCES pelanggan(id_pelanggan) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE detail_pesanan (
    id_pesanan    INT NOT NULL,
    id_produk     INT NOT NULL,
    jumlah        INT NOT NULL DEFAULT 1,
    harga_satuan  DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (id_pesanan, id_produk),
    CONSTRAINT chk_detail_jumlah CHECK (jumlah > 0),
    CONSTRAINT fk_detail_pesanan FOREIGN KEY (id_pesanan)
        REFERENCES pesanan(id_pesanan) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detail_produk FOREIGN KEY (id_produk)
        REFERENCES produk(id_produk) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Relasi 1:1 dengan pesanan (id_pesanan UNIQUE)
CREATE TABLE pengiriman (
    id_pengiriman    INT AUTO_INCREMENT PRIMARY KEY,
    id_pesanan       INT NOT NULL UNIQUE,
    nama_penerima    VARCHAR(100) NOT NULL,
    no_hp_penerima   VARCHAR(20),
    email_penerima   VARCHAR(150),
    alamat_lengkap   TEXT NOT NULL,
    catatan_alamat   VARCHAR(255),
    kurir            VARCHAR(30) NOT NULL,          -- JNE REG (Rp18.000, 2-3 hari kerja), JNE YES (Rp28.000, 1 hari)
    ongkir           DECIMAL(15,2) NOT NULL DEFAULT 0,
    asuransi         DECIMAL(15,2) NOT NULL DEFAULT 0, -- opsional Rp1.800
    no_resi          VARCHAR(50) NULL,
    estimasi_awal    DATE,
    estimasi_akhir   DATE,
    CONSTRAINT chk_pengiriman_kurir CHECK (kurir IN ('JNE REG','JNE YES')),
    CONSTRAINT fk_pengiriman_pesanan FOREIGN KEY (id_pesanan)
        REFERENCES pesanan(id_pesanan) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Relasi 1:1 dengan pesanan (id_pesanan UNIQUE)
CREATE TABLE pembayaran (
    id_pembayaran      INT AUTO_INCREMENT PRIMARY KEY,
    id_pesanan         INT NOT NULL UNIQUE,
    id_admin           INT NULL,                    -- admin yang mengonfirmasi
    bank               VARCHAR(20) NOT NULL,        -- BCA (80777), BNI (8808), MANDIRI (88908)
    no_va              CHAR(16) NOT NULL,           -- 16 digit
    jumlah             DECIMAL(15,2) NOT NULL,
    status             VARCHAR(20) NOT NULL DEFAULT 'MENUNGGU',
    waktu_bayar        DATETIME NULL,
    waktu_konfirmasi   DATETIME NULL,
    catatan_admin      VARCHAR(255),
    CONSTRAINT chk_pembayaran_bank CHECK (bank IN ('BCA','BNI','MANDIRI')),
    CONSTRAINT chk_pembayaran_status CHECK (status IN ('MENUNGGU','LUNAS','DITOLAK')),
    CONSTRAINT chk_pembayaran_va CHECK (no_va REGEXP '^[0-9]{16}$'),
    CONSTRAINT fk_pembayaran_pesanan FOREIGN KEY (id_pesanan)
        REFERENCES pesanan(id_pesanan) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pembayaran_admin FOREIGN KEY (id_admin)
        REFERENCES admin(id_admin) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- VIEW: nilai turunan dari method di class diagram
-- =====================================================

-- Produk.statusStok(): Tersedia > 5, Terbatas 1-5, Habis 0
CREATE OR REPLACE VIEW v_produk_status_stok AS
SELECT id_produk, sku, nama_produk, stok,
       CASE
           WHEN stok = 0 THEN 'Habis'
           WHEN stok <= 5 THEN 'Terbatas'
           ELSE 'Tersedia'
       END AS status_stok
FROM produk;

-- Keranjang.hitungSubtotal()
CREATE OR REPLACE VIEW v_keranjang_subtotal AS
SELECT k.id_keranjang, k.id_pelanggan, k.id_produk, pr.nama_produk,
       k.jumlah, pr.harga,
       k.jumlah * pr.harga AS subtotal
FROM keranjang k
JOIN produk pr ON pr.id_produk = k.id_produk;

-- DetailPesanan.hitungTotalHarga()
CREATE OR REPLACE VIEW v_detail_pesanan_total AS
SELECT id_pesanan, id_produk, jumlah, harga_satuan,
       jumlah * harga_satuan AS total_harga
FROM detail_pesanan;

-- Pesanan.hitungSubtotal() dan hitungTotal()
-- total = subtotal item + ongkir + asuransi + biaya_layanan
CREATE OR REPLACE VIEW v_pesanan_total AS
SELECT p.id_pesanan, p.nomor_pesanan, p.id_pelanggan, p.tahap,
       COALESCE(s.subtotal, 0)  AS subtotal,
       COALESCE(g.ongkir, 0)    AS ongkir,
       COALESCE(g.asuransi, 0)  AS asuransi,
       p.biaya_layanan,
       COALESCE(s.subtotal, 0) + COALESCE(g.ongkir, 0)
         + COALESCE(g.asuransi, 0) + p.biaya_layanan AS total_hitung,
       p.total AS total_tersimpan
FROM pesanan p
LEFT JOIN (SELECT id_pesanan, SUM(jumlah * harga_satuan) AS subtotal
           FROM detail_pesanan GROUP BY id_pesanan) s ON s.id_pesanan = p.id_pesanan
LEFT JOIN pengiriman g ON g.id_pesanan = p.id_pesanan;

-- =====================================================
-- DATA AWAL (seed) - sesuai katalog di senkanan-app
-- =====================================================

-- Admin bawaan (login admin di program masih simulasi; hash scrypt format salt$hash)
INSERT INTO admin (nama_admin, email, kata_sandi) VALUES
  ('Admin SENkanan', 'admin@senkanan.local', 'scrypt$5689b60b853722e3$826295c378236418fbf70a2adfc6e21b4fcdf3a323d32825590401b7956278bc');

-- Pelanggan bawaan: program belum punya login pelanggan, jadi dipakai pelanggan "tamu"
INSERT INTO pelanggan (nama, email) VALUES
  ('Pelanggan SENkanan', 'tamu@senkanan.local');

INSERT INTO kategori_produk (nama_kategori, deskripsi, ikon) VALUES
  ('Lampu dan sein', 'Terang & lebih terlihat', 'bulb'),
  ('Pengereman', 'Kontrol di setiap jalan', 'brake'),
  ('Kelistrikan', 'Daya untuk perjalanan', 'battery'),
  ('Aksesori motor', 'Detail sesuai gayamu', 'handlebar'),
  ('Mesin dan komponen', 'Jaga performa motor', 'gear');

-- stok: Tersedia > 5, Terbatas 1-5, Habis 0
INSERT INTO produk (id_kategori, sku, nama_produk, spesifikasi, label, kecocokan, deskripsi, harga, stok, gambar) VALUES
  (1, 'sein-led-sequential', 'Sein LED Sequential Mini', 'Universal • Sepasang • 12V', 'PILIHAN SENKANAN', 'Cocok untuk motor matic, bebek, dan sport dengan dudukan baut sein standar M10.', 'Lampu sein LED model running sequential dengan cahaya amber terang agar sinyal belok lebih mudah terlihat siang maupun malam.', 85000, 20, '/images/product-1.jpg'),
  (2, 'kampas-rem-cakram', 'Kampas Rem Cakram Depan', 'Vario 125/150 • Set depan', NULL, 'Vario 125, Vario 150, Beat FI, Scoopy, dan kaliper depan 1 piston sejenis.', 'Kampas rem cakram depan dengan daya cengkeram stabil untuk penggunaan harian dalam kota maupun perjalanan jauh.', 45000, 20, '/images/product-2.jpg'),
  (4, 'spion-bar-end-cnc', 'Spion Bar End CNC', 'Universal • Sepasang • Hitam', 'FAVORIT UPGRADE', 'Stang berlubang diameter dalam 13-18 mm (matic, naked, retro, dan sport).', 'Spion ujung stang berbahan aluminium CNC hitam matte dengan kaca cembung anti-silau untuk tampilan rapi dan visibilitas luas.', 175000, 20, '/images/product-3.jpg'),
  (5, 'busi-iridium-performance', 'Busi Iridium Performance', 'Matic 110-150cc • 1 buah', NULL, 'Motor matic 110cc hingga 150cc (Vario, Beat, NMAX, Aerox, PCX, Mio).', 'Elektroda iridium ujung halus membantu pembakaran lebih fokus, tarikan awal responsif, dan umur pakai lebih panjang.', 95000, 20, '/images/product-4.jpg'),
  (1, 'lampu-led-headlight-h4', 'Lampu LED Headlight H4', 'Soket H4 • Putih • 12V', NULL, 'Motor dengan reflektor utama soket H4 (Vixion, CB150R, Verza, Scoopy karbu, Vespa).', 'Lampu utama LED soket H4 dilengkapi kipas pendingin aluminium dan cut-off cahaya rapi agar tidak menyilaukan pengendara lawan arah.', 125000, 20, '/images/product-5.jpg'),
  (2, 'piringan-cakram-220mm', 'Piringan Cakram 220 mm', 'Vario 125/150 • Stainless', NULL, 'Vario 125/150 lubang baut 4 (pemasangan plug and play ukuran standar 220 mm).', 'Rotor cakram floating look berbahan baja tahan karat dengan lubang ventilasi untuk pelepasan panas optimal saat pengereman berulang.', 185000, 3, '/images/product-6.jpg'),
  (3, 'kiprok-regulator-4-pin', 'Kiprok Regulator 4 Pin', 'Bebek / matic • 12V', NULL, 'Sistem kelistrikan DC/AC 12V soket 4 pin pada motor bebek dan matic harian.', 'Regulator rectifier dengan sirip pendingin tebal untuk menjaga tegangan pengisian aki tetap stabil dan mencegah lampu putus.', 78000, 20, '/images/product-7.jpg'),
  (4, 'handgrip-karet-sport', 'Handgrip Karet Sport', 'Universal • Sepasang • Hitam', NULL, 'Semua stang motor ukuran standar 22 mm (kanan selongsong gas, kiri stang).', 'Handgrip tekstur diamond anti-slip dengan cincin ujung aluminium anodized emas untuk genggaman mantap saat hujan maupun panas.', 65000, 20, '/images/product-8.jpg');
