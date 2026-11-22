import React from 'react';
import AuthShell from '../components/AuthShell.jsx';
import { Eyebrow } from '../components/ui.jsx';
import { IconCheck, IconArrowRight } from '../components/Icons.jsx';

export default function WelcomePage({ onNavigate, pendingPayments }) {
  return (
    <AuthShell>
      <div className="w-14 h-14 rounded-md bg-[#1E1E1E] border border-white/10 text-[#FFD000] inline-flex items-center justify-center">
        <IconCheck size={24} />
      </div>
      <div className="mt-8">
        <Eyebrow>BERHASIL MASUK</Eyebrow>
      </div>
      <h1 className="font-display font-bold text-5xl sm:text-6xl text-white mt-3 leading-none">Selamat datang</h1>
      <p className="text-sm text-zinc-300 mt-3">
        Kamu berhasil masuk ke panel admin SENkanan. Kelola stok, pesanan, dan pembayaran pelanggan dari sini.
      </p>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={() => onNavigate('stock')}
          className="w-full min-h-[46px] bg-[#FFD000] hover:bg-[#ffe033] text-[#111111] font-extrabold text-sm rounded-md inline-flex items-center justify-center gap-3 transition-colors"
        >
          Lihat Stok <IconArrowRight size={18} />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className="w-full min-h-[46px] border border-white/15 hover:border-white/40 text-white font-bold text-sm rounded-md transition-colors"
        >
          Lihat Pesanan
        </button>
        <button
          type="button"
          onClick={() => onNavigate('payments')}
          className="w-full min-h-[46px] border border-white/15 hover:border-white/40 text-white font-bold text-sm rounded-md transition-colors inline-flex items-center justify-center gap-2.5"
        >
          Konfirmasi Pembayaran
          {pendingPayments > 0 && (
            <span className="bg-[#FFD000] text-[#111111] text-[11px] font-extrabold px-1.5 min-w-[20px] rounded-full">
              {pendingPayments}
            </span>
          )}
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 mt-8">
        Pratinjau desain: Admin SENkanan adalah identitas contoh. Status masuk ini ilustratif, tanpa sesi akun aktif.
      </p>
    </AuthShell>
  );
}
