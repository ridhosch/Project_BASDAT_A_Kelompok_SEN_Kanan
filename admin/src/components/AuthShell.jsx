import React from 'react';
import TopBar from './TopBar.jsx';

// Kerangka halaman Masuk & Berhasil Masuk (tanpa sidebar).
export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      <TopBar />
      <header className="border-b border-white/10">
        <div className="px-4 sm:px-14 py-4">
          <div className="bg-white rounded-md inline-flex px-2 py-1 w-[184px] h-[62px] items-center justify-center">
            <img src="/images/logo-senkanan.png" alt="SENkanan" className="h-full w-auto object-contain" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12 sm:py-14">{children}</div>
      </main>

      <footer className="border-t border-white/10">
        <div className="px-4 sm:px-14 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-zinc-400">
          <span>© 2026 SENkanan. Sparepart &amp; Aksesori Motor.</span>
          <span className="font-display text-xl text-zinc-400 tracking-wide">PART TEPAT. MOTOR SIAP.</span>
        </div>
      </footer>
    </div>
  );
}
