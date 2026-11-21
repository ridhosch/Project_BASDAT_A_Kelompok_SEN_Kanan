import React, { useEffect } from 'react';

export const card = 'bg-[#1E1E1E] border border-white/10 rounded-xl';

export function Eyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="inline-block w-5 h-[2px] bg-[#FFD000]" aria-hidden="true" />
      <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#FFD000]">{children}</span>
    </div>
  );
}

const TONES = {
  green: 'bg-emerald-500/15 text-emerald-300',
  yellow: 'bg-[#FFD000]/15 text-[#FFD000]',
  gray: 'bg-white/10 text-zinc-300',
  red: 'bg-red-500/15 text-red-300',
};

export function Badge({ tone = 'gray', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${TONES[tone]}`}>
      <span className="w-1 h-1 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}

export function StatCard({ label, value, unit, note, icon, highlight = false }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? 'bg-[#1F1D14] border-[#FFD000]/50' : 'bg-[#1E1E1E] border-white/10'
      }`}
    >
      <div className="flex items-center justify-between text-xs text-zinc-300">
        <span>{label}</span>
        <span className={highlight ? 'text-[#FFD000]' : 'text-zinc-400'}>{icon}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-4xl font-black leading-none ${highlight ? 'text-[#FFD000]' : 'text-white'}`}>{value}</span>
        {unit && <span className="text-sm text-zinc-300">{unit}</span>}
      </div>
      <div className={`mt-2 text-[11px] ${highlight ? 'text-[#FFD000]' : 'text-zinc-400'}`}>{note}</div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-colors ${
            value === t.id
              ? 'bg-[#FFD000] text-[#111111] border-[#FFD000]'
              : 'bg-transparent text-zinc-300 border-white/15 hover:border-white/30'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder, id }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[44px] bg-[#2A2A2A] border border-white/10 rounded-lg pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
      />
    </div>
  );
}

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 bg-[#111111] border border-[#FFD000] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm max-w-sm"
    >
      <span className="w-2 h-2 rounded-full bg-[#FFD000] shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
