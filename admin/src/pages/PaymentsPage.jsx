import React, { useEffect, useState } from 'react';
import { Badge, StatCard, Tabs, SearchBox, Eyebrow, card } from '../components/ui.jsx';
import { IconCard, IconCheck, IconX, IconWarn, IconCopy } from '../components/Icons.jsx';
import { formatRupiah, formatVA, orderItemCount, orderSubtotal, orderTotal } from '../data.js';

const PAY = {
  menunggu: { tone: 'yellow', label: 'Menunggu' },
  lunas: { tone: 'green', label: 'Terkonfirmasi' },
  ditolak: { tone: 'red', label: 'Ditolak' },
};

// Frame tambahan: admin memeriksa & mengonfirmasi pembayaran Virtual Account pelanggan.
export default function PaymentsPage({
  orders = [],
  lastUpdated = '',
  onDecide,
  onToast,
  selectedId,
  setSelectedId,
}) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('menunggu');
  const [checkAmount, setCheckAmount] = useState(false);
  const [checkMutasi, setCheckMutasi] = useState(false);
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const count = (s) => safeOrders.filter((o) => o.payment?.status === s).length;
  const waitingTotal = safeOrders
    .filter((o) => o.payment?.status === 'menunggu')
    .reduce((s, o) => s + orderTotal(o), 0);

  const filtered = safeOrders.filter((o) => {
    const q = query.trim().toLowerCase();
    const vaDigits = String(o.payment?.va || '').replace(/\s/g, '');
    const matchQ =
      !q ||
      String(o.id || '').toLowerCase().includes(q) ||
      String(o.customer || '').toLowerCase().includes(q) ||
      vaDigits.includes(q.replace(/\s/g, ''));
    const matchT = tab === 'semua' || o.payment?.status === tab;
    return matchQ && matchT;
  });

  const selected = safeOrders.find((o) => o.id === selectedId) || filtered[0] || safeOrders[0] || null;
  const selPayStatus = selected?.payment?.status || 'menunggu';
  const selPayInfo = PAY[selPayStatus] || PAY.menunggu;
  const waiting = selected ? selPayStatus === 'menunggu' : false;

  // Reset centang & catatan setiap berpindah pembayaran.
  useEffect(() => {
    setCheckAmount(false);
    setCheckMutasi(false);
    setNote('');
    setCopied(false);
  }, [selected?.id]);

  const copyVA = () => {
    if (!selected?.payment?.va) return;
    try {
      navigator.clipboard.writeText(selected.payment.va);
    } catch (e) {
      /* abaikan jika clipboard tidak tersedia */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirm = () => {
    if (!selected) return;
    onDecide?.(selected.id, 'lunas', note);
    onToast?.(`Pembayaran #${selected.id} dikonfirmasi. Pesanan siap diproses.`);
  };

  const reject = () => {
    if (!selected) return;
    onDecide?.(selected.id, 'ditolak', note);
    onToast?.(`Pembayaran #${selected.id} ditolak.`);
  };

  const tabs = [
    { id: 'menunggu', label: `Menunggu (${count('menunggu')})` },
    { id: 'lunas', label: `Terkonfirmasi (${count('lunas')})` },
    { id: 'ditolak', label: `Ditolak (${count('ditolak')})` },
    { id: 'semua', label: `Semua (${safeOrders.length})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>PEMBAYARAN TOKO</Eyebrow>
          <h1 className="font-display font-bold text-5xl text-white mt-2 leading-none">Konfirmasi Pembayaran</h1>
          <p className="text-sm text-zinc-300 mt-2">
            Cocokkan pembayaran Virtual Account pelanggan sebelum pesanan diproses.
          </p>
        </div>
        {lastUpdated && (
          <div className="text-right text-xs">
            <div className="text-white font-semibold">{lastUpdated}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Menunggu konfirmasi" value={count('menunggu')} unit="pembayaran" note="Pelanggan sudah menekan konfirmasi" icon={<IconWarn size={18} />} highlight />
        <StatCard label="Nominal menunggu" value={formatRupiah(waitingTotal)} note="Total yang perlu dicek di mutasi VA" icon={<IconCard size={18} />} />
        <StatCard label="Terkonfirmasi" value={count('lunas')} unit="pembayaran" note="Pesanan siap diproses" icon={<IconCheck size={18} />} />
        <StatCard label="Ditolak" value={count('ditolak')} unit="pembayaran" note="Nominal atau mutasi tidak sesuai" icon={<IconX size={18} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Daftar pembayaran */}
        <section className={`${card} xl:col-span-8 overflow-hidden`}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">Daftar pembayaran</h2>
              <span className="text-xs text-zinc-400">{filtered.length} pembayaran</span>
            </div>
            <SearchBox id="pay-search" value={query} onChange={setQuery} placeholder="Cari nomor pesanan / nama / nomor VA..." />
            <Tabs tabs={tabs} value={tab} onChange={setTab} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[680px]">
              <thead className="bg-[#232323] text-[10px] tracking-wider text-zinc-400 uppercase">
                <tr>
                  <th className="px-5 py-3 font-bold">Pesanan / Waktu bayar</th>
                  <th className="px-3 py-3 font-bold">Pelanggan</th>
                  <th className="px-3 py-3 font-bold">Bank / No. VA</th>
                  <th className="px-3 py-3 font-bold">Nominal</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map((o) => {
                  const active = selected && o.id === selected.id;
                  const st = PAY[o.payment?.status] || PAY.menunggu;
                  return (
                    <tr key={o.id} className={active ? 'bg-[#26231A] shadow-[inset_3px_0_0_#FFD000]' : ''}>
                      <td className="px-5 py-3.5">
                        <div className={`text-xs font-extrabold ${active ? 'text-[#FFD000]' : 'text-white'}`}>#{o.id}</div>
                        <div className="text-[11px] text-zinc-400">{String(o.payment?.paidAt || '').replace(' WIB', '')}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="text-xs font-bold text-white">{o.customer}</div>
                        <div className="text-[11px] text-zinc-400">{o.city}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="text-xs font-bold text-white">{o.payment?.bank}</div>
                        <div className="text-[11px] text-zinc-400 tabular-nums">{formatVA(o.payment?.va)}</div>
                      </td>
                      <td className="px-3 py-3.5 text-xs font-extrabold text-white whitespace-nowrap">{formatRupiah(orderTotal(o))}</td>
                      <td className="px-3 py-3.5"><Badge tone={st.tone}>{st.label}</Badge></td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedId?.(o.id)}
                          className={`min-h-[36px] px-3 rounded text-[11px] font-bold border transition-colors whitespace-nowrap ${
                            active
                              ? 'bg-[#FFD000] text-[#111111] border-[#FFD000]'
                              : 'bg-[#2A2A2A] text-white border-white/10 hover:border-[#FFD000]'
                          }`}
                        >
                          {o.payment?.status === 'menunggu' ? 'Periksa' : 'Lihat detail'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-xs text-zinc-400">Tidak ada pembayaran pada tab ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-white/10 flex justify-between text-[11px] text-zinc-400">
            <span>Menampilkan {filtered.length} dari {safeOrders.length} pembayaran</span>
          </div>
        </section>

        {/* Detail pembayaran */}
        {!selected ? (
          <aside className={`${card} xl:col-span-4 border-t-2 border-t-[#FFD000] p-6 text-center space-y-2`}>
            <h2 className="font-display font-bold text-2xl text-white">Tidak ada pembayaran</h2>
            <p className="text-xs text-zinc-400">Belum ada data pembayaran yang tersedia.</p>
          </aside>
        ) : (
          <aside className={`${card} xl:col-span-4 border-t-2 border-t-[#FFD000] p-5 space-y-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-3xl text-white leading-none">Detail Pembayaran</h2>
                <div className="text-lg font-extrabold text-[#FFD000] mt-2">#{selected.id}</div>
                <div className="text-[11px] text-zinc-400">{selected.customer} • {selected.city}</div>
              </div>
              <Badge tone={selPayInfo.tone}>{selPayInfo.label}</Badge>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-lg p-4">
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Nominal yang harus diterima</div>
              <div className="text-3xl font-black text-[#FFD000] mt-1">{formatRupiah(orderTotal(selected))}</div>
              <div className="text-[11px] text-zinc-400 mt-1">
                Barang {formatRupiah(orderSubtotal(selected))} + ongkir {formatRupiah(selected.shippingCost)}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Virtual account tujuan</div>
              <div className="bg-[#2A2A2A] rounded-lg p-3">
                <div className="font-bold text-white">{selected.payment?.bank} Virtual Account</div>
                <div className="flex items-center justify-between gap-3 mt-1">
                  <span className="text-zinc-200 tabular-nums">{formatVA(selected.payment?.va)}</span>
                  <button
                    type="button"
                    onClick={copyVA}
                    className="min-h-[32px] px-2.5 rounded bg-[#1E1E1E] border border-white/10 hover:border-[#FFD000] text-[11px] font-bold text-white inline-flex items-center gap-1.5"
                  >
                    <IconCopy size={13} />
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Ringkasan barang</div>
              <div className="text-zinc-300">
                {(selected.items || []).map((it) => {
                  return it.name ? `${it.name} (×${it.qty})` : null;
                }).filter(Boolean).join(', ') || `${orderItemCount(selected)} item`}
              </div>
            </div>

            {waiting && (
              <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
                <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkAmount}
                    onChange={(e) => setCheckAmount(e.target.checked)}
                    className="rounded border-white/20 bg-[#2A2A2A] text-[#FFD000] focus:ring-[#FFD000]"
                  />
                  <span>Nominal transfer sesuai dengan tagihan</span>
                </label>
                <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkMutasi}
                    onChange={(e) => setCheckMutasi(e.target.checked)}
                    className="rounded border-white/20 bg-[#2A2A2A] text-[#FFD000] focus:ring-[#FFD000]"
                  />
                  <span>Dana sudah masuk pada mutasi rekening / VA</span>
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Catatan verifikasi (opsional)..."
                  className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#FFD000]"
                />
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    disabled={!checkAmount || !checkMutasi}
                    onClick={confirm}
                    className="min-h-[42px] rounded-lg bg-[#FFD000] hover:bg-[#ffe033] disabled:opacity-40 text-[#111111] font-extrabold text-xs transition-colors"
                  >
                    Konfirmasi
                  </button>
                  <button
                    type="button"
                    onClick={reject}
                    className="min-h-[42px] rounded-lg border border-red-400/50 text-red-300 hover:bg-red-500/15 font-bold text-xs transition-colors"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}