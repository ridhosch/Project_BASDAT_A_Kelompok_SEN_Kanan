-- =====================================================
-- Database: senkanan
-- ERD: Sistem Penjualan Barang Otomotif Motor (SEN Kanan)
-- =====================================================

DROP DATABASE IF EXISTS senkanan;
CREATE DATABASE senkanan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE senkanan;

-- ---------- Kelompok motor ----------
CREATE TABLE merek_motor (
    id_merek    INT AUTO_INCREMENT PRIMARY KEY,
    nama_merek  VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE model_motor (
    id_model     INT AUTO_INCREMENT PRIMARY KEY,
    id_merek     INT NOT NULL,
    nama_model   VARCHAR(100) NOT NULL,
    tahun_mulai  INT,
    tahun_akhir  INT,
    CONSTRAINT fk_model_merek FOREIGN KEY (id_merek)
        REFERENCES merek_motor(id_merek) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------- Pengguna ----------
-- id_keranjang di-FK-kan belakangan (ALTER) karena saling merujuk dengan keranjang
CREATE TABLE pengguna (
    id_pengguna        INT AUTO_INCREMENT PRIMARY KEY,
    nama_pengguna      VARCHAR(100) NOT NULL,
    alamat_pengiriman  TEXT,
    id_keranjang       INT NULL
) ENGINE=InnoDB;

CREATE TABLE motor_pengguna (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    id_pengguna  INT NOT NULL,
    id_model     INT NOT NULL,
    tahun        INT,
    plat_nomor   VARCHAR(15),
    CONSTRAINT fk_mp_pengguna FOREIGN KEY (id_pengguna)
        REFERENCES pengguna(id_pengguna) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_mp_model FOREIGN KEY (id_model)
        REFERENCES model_motor(id_model) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------- Produk ----------
CREATE TABLE merek_produk (
    id_brand    INT AUTO_INCREMENT PRIMARY KEY,
    nama_brand  VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE produk (
    id_produk    INT AUTO_INCREMENT PRIMARY KEY,
    id_brand     INT NOT NULL,
    nama_produk  VARCHAR(150) NOT NULL,
    deskripsi    TEXT,
    harga        DECIMAL(15,2) NOT NULL DEFAULT 0,
    stok         INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_produk_brand FOREIGN KEY (id_brand)
        REFERENCES merek_produk(id_brand) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE mutasi_stok (
    id_mutasi   INT AUTO_INCREMENT PRIMARY KEY,
    id_produk   INT NOT NULL,
    jenis       VARCHAR(50) NOT NULL,   -- contoh: masuk / keluar
    jumlah      INT NOT NULL,
    keterangan  VARCHAR(255),
    CONSTRAINT fk_mutasi_produk FOREIGN KEY (id_produk)
        REFERENCES produk(id_produk) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Keranjang ----------
CREATE TABLE keranjang (
    id_keranjang  INT AUTO_INCREMENT PRIMARY KEY,
    id_pengguna   INT NOT NULL,
    id_produk     INT NOT NULL,
    nama_produk   VARCHAR(150),
    jumlah        INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_keranjang_pengguna FOREIGN KEY (id_pengguna)
        REFERENCES pengguna(id_pengguna) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_keranjang_produk FOREIGN KEY (id_produk)
        REFERENCES produk(id_produk) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE pengguna
    ADD CONSTRAINT fk_pengguna_keranjang FOREIGN KEY (id_keranjang)
        REFERENCES keranjang(id_keranjang) ON UPDATE CASCADE ON DELETE SET NULL;

-- ---------- Pesanan ----------
CREATE TABLE pesanan (
    id_pesanan   INT AUTO_INCREMENT PRIMARY KEY,
    id_pengguna  INT NOT NULL,
    status       VARCHAR(50) NOT NULL DEFAULT 'menunggu',
    total        DECIMAL(15,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_pesanan_pengguna FOREIGN KEY (id_pengguna)
        REFERENCES pengguna(id_pengguna) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE detail_pesanan (
    id_pesanan       INT NOT NULL,
    id_produk        INT NOT NULL,
    jumlah           INT NOT NULL DEFAULT 1,
    harga_satuan     DECIMAL(15,2) NOT NULL,
    total_harga      DECIMAL(15,2) NOT NULL,
    alamat_pemesan   TEXT,
    estimasi_sampai  DATE,
    PRIMARY KEY (id_pesanan, id_produk),
    CONSTRAINT fk_detail_pesanan FOREIGN KEY (id_pesanan)
        REFERENCES pesanan(id_pesanan) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detail_produk FOREIGN KEY (id_produk)
        REFERENCES produk(id_produk) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------- Pembayaran (relasi 1:1 dengan pesanan) ----------
CREATE TABLE pembayaran (
    id_pembayaran  INT AUTO_INCREMENT PRIMARY KEY,
    id_pesanan     INT NOT NULL UNIQUE,
    kartu_debit    BIGINT,              -- di ERD INT; BIGINT agar muat 16 digit
    jumlah         DECIMAL(15,2) NOT NULL,
    status         VARCHAR(50) NOT NULL DEFAULT 'pending',
    waktu_bayar    DATETIME,
    CONSTRAINT fk_pembayaran_pesanan FOREIGN KEY (id_pesanan)
        REFERENCES pesanan(id_pesanan) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;
