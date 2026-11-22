import React, { useState } from 'react';
import AuthShell from '../components/AuthShell.jsx';
import { Eyebrow } from '../components/ui.jsx';
import { IconEye, IconEyeOff, IconArrowRight } from '../components/Icons.jsx';
import { STORE_URL } from '../data.js';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Isi email dan kata sandi terlebih dahulu.');
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <AuthShell>
      <Eyebrow>SENANG KAMU KEMBALI</Eyebrow>
      <h1 className="font-display font-bold text-5xl sm:text-6xl text-white mt-3 leading-none">Masuk ke akun admin</h1>
      <p className="text-sm text-zinc-300 mt-3">Masuk untuk mengelola stok, pesanan, dan pembayaran SENkanan.</p>

      <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
        <div>
          <label htmlFor="admin-email" className="block text-xs font-bold text-white mb-2">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan alamat email"
            className="w-full min-h-[46px] bg-[#1A1A1A] border border-white/10 rounded-md px-4 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="block text-xs font-bold text-white mb-2">Kata Sandi</label>
          <div className="relative">
            <input
              id="admin-password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full min-h-[46px] bg-[#1A1A1A] border border-white/10 rounded-md pl-4 pr-12 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center text-zinc-300 hover:text-white"
            >
              {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2.5 text-zinc-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-[#FFD000]"
            />
            Ingat saya
          </label>
          <button type="button" className="font-bold text-[#FFD000] hover:underline">Lupa kata sandi?</button>
        </div>

        {error && <p role="alert" className="text-xs font-semibold text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full min-h-[46px] bg-[#FFD000] hover:bg-[#ffe033] text-[#111111] font-extrabold text-sm rounded-md inline-flex items-center justify-center gap-3 transition-colors"
        >
          Masuk <IconArrowRight size={18} />
        </button>
      </form>

      <div className="text-center mt-8">
        <a href={STORE_URL} className="text-xs text-zinc-300 hover:text-white inline-flex items-center gap-2">
          <span aria-hidden="true">←</span> Kembali ke toko
        </a>
      </div>
      <p className="text-[11px] text-zinc-500 mt-8">
        Pratinjau desain: formulir ini tidak melakukan proses masuk. Isi email dan kata sandi apa saja untuk melanjutkan.
      </p>
    </AuthShell>
  );
}
