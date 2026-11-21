import React from 'react';

// Strip kuning di paling atas, dipakai semua halaman admin.
export default function TopBar({ right = 'Sparepart & aksesori motor' }) {
  return (
    <div className="bg-[#FFD000] text-[#111111] text-[11px] font-extrabold px-4 sm:px-8 py-1.5">
      <div className="mx-auto flex justify-between items-center gap-4">
        <span className="tracking-wide uppercase">PART TEPAT. MOTOR SIAP.</span>
        <span className="font-semibold uppercase sm:normal-case">{right}</span>
      </div>
    </div>
  );
}
