import React, { useState } from 'react';
import TopBar from './TopBar.jsx';
import { IconStock, IconBag, IconCard, IconChevron, IconArrowUpRight, IconLogout } from './Icons.jsx';
import { STORE_URL } from '../data.js';

const NAV = [
  { id: 'stock', label: 'Manajemen stok', icon: IconStock },
  { id: 'orders', label: 'Pesanan', icon: IconBag },
  { id: 'payments', label: 'Konfirmasi pembayaran', icon: IconCard },
];

const CRUMB = {
  stock: 'Manajemen stok',
  orders: 'Pesanan',
  payments: 'Konfirmasi pembayaran',
};

// Kerangka halaman admin: strip kuning, sidebar, top bar, konten, footer.
export default function AdminLayout({ page, onNavigate, onLogout, counts = {}, user = {}, children, footerNote }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const userName = user?.name || '';
  const initials = userName.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      <TopBar right="PUSAT ADMINISTRASI SENKANAN" />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-[252px] shrink-0 bg-[#181818] border-b lg:border-b-0 lg:border-r border-white/10 flex lg:flex-col">
          <div className="p-4 lg:p-3 lg:pt-5 flex-1 lg:flex-none min-w-0">
            <div className="bg-white rounded-md w-[140px] h-[48px] flex items-center justify-center px-1.5 py-0.5">
              <img src="/images/logo-senkanan.png" alt="SENkanan" className="h-full w-auto object-contain" />
            </div>
            <div className="hidden lg:block text-[10px] font-bold tracking-[0.14em] text-zinc-400 mt-3 mb-4 ml-1">
              PANEL ADMIN
            </div>

            <nav aria-label="Navigasi admin" className="flex flex-wrap lg:flex-col gap-1.5 mt-3 lg:mt-0">
              {NAV.map((item) => {
                const active = page === item.id;
                const Icon = item.icon;
                const badge = counts[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`min-h-[44px] px-3 rounded-md text-sm font-bold inline-flex items-center gap-2.5 whitespace-nowrap border transition-all duration-150 ${
                      active
                        ? 'bg-[#FFD000] text-[#111111] border-[#FFD000] hover:bg-[#ffe033]'
                        : 'text-zinc-300 border-transparent hover:bg-[#2A2A2A] hover:text-[#FFD000] hover:border-[#FFD000]/40'
                    }`}
                  >
                    <Icon size={17} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {badge > 0 && (
                      <span
                        className={`text-[11px] font-extrabold px-1.5 rounded-full min-w-[20px] text-center ${
                          active ? 'bg-[#111111]/15 text-[#111111]' : 'bg-[#FFD000] text-[#111111]'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:block p-5 mt-auto">
            <span className="block w-6 h-[3px] bg-[#FFD000] mb-3" aria-hidden="true" />
            <div className="font-display font-bold text-[26px] leading-[1.05] text-white">
              PART TEPAT.<br />MOTOR SIAP.
            </div>
            
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
              <span>Admin</span>
              <span aria-hidden="true">›</span>
              <span className="text-white font-bold">{CRUMB[page]}</span>
            </nav>

            <div className="flex items-center gap-4 relative">
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-300 hover:text-white inline-flex items-center gap-1.5"
              >
                Lihat toko <IconArrowUpRight size={13} />
              </a>
              <span className="hidden sm:block w-px h-8 bg-white/10" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2.5 min-h-[44px]"
              >
                <span className="w-9 h-9 rounded-full bg-[#2A2A2A] text-[#FFD000] text-xs font-extrabold inline-flex items-center justify-center">
                  {initials}
                </span>
                <span className="hidden sm:block text-left leading-tight">
                  <span className="block text-xs font-bold text-white">{userName}</span>
                  <span className="block text-[10px] text-zinc-400">{user?.role || ''}</span>
                </span>
                <IconChevron size={14} className="text-zinc-400" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 w-44 bg-[#1E1E1E] border border-white/15 rounded-lg shadow-2xl z-30 p-1"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onLogout}
                    className="w-full min-h-[40px] px-3 rounded-md text-xs font-bold text-zinc-200 hover:bg-white/5 inline-flex items-center gap-2"
                  >
                    <IconLogout size={15} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>

          <main className="flex-1 px-4 sm:px-8 py-7">{children}</main>

          <footer className="px-4 sm:px-8 pb-5 pt-2 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-zinc-400">
            <span>{footerNote}</span>
            <span>© 2026 SENkanan</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
