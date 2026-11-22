import React, { useEffect, useRef, useState } from 'react';
import { Badge, StatCard, Tabs, SearchBox, Eyebrow, card } from '../components/ui.jsx';
import { IconBag, IconClipboard, IconBox, IconTruck, IconCalendar, IconWarn, IconX } from '../components/Icons.jsx';
import { formatRupiah, formatVA, orderItemCount, orderSubtotal, orderTotal } from '../data.js';

const STAGE = {
  dibuat: { tone: 'yellow', label: 'Dibuat' },
  diproses: { tone: 'gray', label: 'Diproses' },
  dikirim: { tone: 'gray', label: 'Dikirim' },
};

const PAY = {
  lunas: { tone: 'green', label: 'Lunas' },
  menunggu: { tone: 'yellow', label: 'Menunggu' },
  ditolak: { tone: 'red', label: 'Ditolak' },
};

const STEPS = ['dibuat', 'diproses', 'dikirim'];

const dateOf = (o) => (o?.createdAt ? String(o.createdAt).split(' • ')[0] : '');

export default function OrdersPage({
  orders = [],
  lastUpdated = '',
  periodNote = '',
  onAdvance,
  onCancelOrder,
  onGoPayments,
  selectedId,
  setSelectedId,
}) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('semua');
  const [date, setDate] = useState('Semua tanggal');
  const [cancelTarget, setCancelTarget] = useState(null);
  const cancelCloseRef = useRef(null);

  useEffect(() => {
    if (!cancelTarget) return undefined;
    cancelCloseRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setCancelTarget(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelTarget]);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const count = (s) => safeOrders.filter((o) => o.stage === s).length;
  const dates = [...new Set(safeOrders.map(dateOf).filter(Boolean))];

  const filtered = safeOrders.filter((o) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      String(o.id || '').toLowerCase().includes(q) ||
      String(o.customer || '').toLowerCase().includes(q);
    const matchT = tab === 'semua' || o.stage === tab;
    const matchD = date === 'Semua tanggal' || dateOf(o) === date;
    return matchQ && matchT && matchD;
  });

  const selected = safeOrders.find((o) => o.id === selectedId) || safeOrders[0] || null;
  const stepIndex = selected ? STEPS.indexOf(selected.stage) : -1;
  const payStatus = selected?.payment?.status || 'menunggu';
  const payInfo = PAY[payStatus] || PAY.menunggu;
  const stageInfo = selected ? STAGE[selected.stage] || STAGE.dibuat : null;
  const payOk = payStatus === 'lunas';

  const tabs = [
    { id: 'semua', label: `Semua (${safeOrders.length})` },
    { id: 'dibuat', label: `Dibuat (${count('dibuat')})` },
    { id: 'diproses', label: `Diproses (${count('diproses')})` },
    { id: 'dikirim', label: `Dikirim (${count('dikirim')})` },
  ];

  const confirmCancel = () => {
    if (!cancelTarget) return;
    onCancelOrder?.(cancelTarget.id);
    setCancelTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>PESANAN TOKO</Eyebrow>
          <h1 className="font-display font-bold text-5xl text-white mt-2 leading-none">Pesanan Pelanggan</h1>
          <p className="text-sm text-zinc-300 mt-2">Tinjau pesanan, pembayaran, dan pengiriman pelanggan dalam satu halaman.</p>
        </div>
        {lastUpdated && (
          <div className="text-right text-xs">
            <div className="text-white font-semibold">{lastUpdated}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total pesanan" value={safeOrders.length} unit="pesanan" note={periodNote} icon={<IconBag size={18} />} />
        <StatCard label="Dibuat" value={count('dibuat')} unit="pesanan" note="Belum mulai diproses" icon={<IconClipboard size={18} />} highlight />
        <StatCard label="Diproses" value={count('diproses')} unit="pesanan" note="Dalam persiapan toko" icon={<IconBox size={18} />} />
        <StatCard label="Dikirim" value={count('dikirim')} unit="pesanan" note="Dalam perjalanan ke pelanggan" icon={<IconTruck size={18} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Daftar pesanan */}
        <section className={`${card} xl:col-span-8 overflow-hidden`}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">Daftar pesanan</h2>
              <span className="text-xs text-zinc-400">{filtered.length} pesanan</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBox id="order-search" value={query} onChange={setQuery} placeholder="Cari nomor pesanan / nama pelanggan..." />
              <div className="relative sm:w-[190px]">
                <IconCalendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <select
                  aria-label="Filter tanggal"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[44px] bg-[#2A2A2A] border border-white/10 rounded-lg pl-9 pr-3 text-xs text-white focus:border-[#FFD000]"
                >
                  <option>Semua tanggal</option>
                  {dates.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <Tabs tabs={tabs} value={tab} onChange={setTab} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead className="bg-[#232323] text-[10px] tracking-wider text-zinc-400 uppercase">
                <tr>
                  <th className="px-5 py-3 font-bold">Pesanan / Tanggal</th>
                  <th className="px-3 py-3 font-bold">Pelanggan</th>
                  <th className="px-3 py-3 font-bold">Barang</th>
                  <th className="px-3 py-3 font-bold">Total</th>
                  <th className="px-3 py-3 font-bold">Pembayaran</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map((o) => {
                  const active = selected && o.id === selected.id;
                  const st = STAGE[o.stage] || STAGE.dibuat;
                  const pay = PAY[o.payment?.status] || PAY.menunggu;
                  const items = Array.isArray(o.items) ? o.items : [];
                  return (
                    <tr key={o.id} className={active ? 'bg-[#26231A] shadow-[inset_3px_0_0_#FFD000]' : ''}>
                      <td className="px-5 py-3.5">
                        <div className={`text-xs font-extrabold ${active ? 'text-[#FFD000]' : 'text-white'}`}>#{o.id}</div>
                        <div className="text-[11px] text-zinc-400">{String(o.createdAt || '').replace(' WIB', '')}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="text-xs font-bold text-white">{o.customer}</div>
                        <div className="text-[11px] text-zinc-400">{o.city}</div>
                      </td>
                      <td className="px-3 py-3.5 text-[11px] text-zinc-300">
                        {items.length} produk<br />{orderItemCount(o)} item
                      </td>
                      <td className="px-3 py-3.5 text-xs font-extrabold text-white whitespace-nowrap">{formatRupiah(orderTotal(o))}</td>
                      <td className="px-3 py-3.5"><Badge tone={pay.tone}>{pay.label}</Badge></td>
                      <td className="px-3 py-3.5"><Badge tone={st.tone}>{st.label}</Badge></td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedId?.(o.id)}
                            className={`min-h-[36px] px-3 rounded text-[11px] font-bold border transition-colors whitespace-nowrap ${
                              active
                                ? 'bg-[#FFD000] text-[#111111] border-[#FFD000]'
                                : 'bg-[#2A2A2A] text-white border-white/10 hover:border-[#FFD000]'
                            }`}
                          >
                            Lihat detail
                          </button>
                          <button
                            type="button"
                            onClick={() => setCancelTarget(o)}
                            aria-label={`Batalkan pesanan ${o.id}`}
                            className="min-h-[36px] px-2.5 rounded text-[11px] font-bold border border-red-400/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400 transition-colors whitespace-nowrap"
                          >
                            Batalkan
                          </button>
                        </div>
                        {active && <div className="text-[10px] text-[#FFD000] mt-1">Sedang dilihat</div>}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-xs text-zinc-400">Tidak ada pesanan yang cocok dengan filter ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-white/10 flex justify-between text-[11px] text-zinc-400">
            <span>Menampilkan {filtered.length} dari {safeOrders.length} pesanan • {date}</span>
          </div>
        </section>

        {/* Detail pesanan */}
        {selected ? (
          <aside className={`${card} xl:col-span-4 border-t-2 border-t-[#FFD000] p-5 space-y-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-3xl text-white leading-none">Detail Pesanan</h2>
                <div className="text-lg font-extrabold text-[#FFD000] mt-2">#{selected.id}</div>
                <div className="text-[11px] text-zinc-400">{selected.createdAt}</div>
              </div>
              {stageInfo && <Badge tone={stageInfo.tone}>{stageInfo.label}</Badge>}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-xs mb-3">
                <h3 className="font-extrabold text-white">Barang pesanan</h3>
                <span className="text-zinc-400">{(selected.items || []).length} produk • {orderItemCount(selected)} item</span>
              </div>
              <div className="space-y-3">
                {(selected.items || []).map((it) => {
                  return (
                    <div key={it.productId} className="flex items-center gap-3">
                      <img src={it.image} alt="" className="w-12 h-12 rounded object-cover bg-[#E5E5E5]" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{it.name}</div>
                        <div className="text-[11px] text-zinc-400">{formatRupiah(it.price)} / item ×{it.qty}</div>
                      </div>
                      <div className="text-xs font-extrabold text-white">{formatRupiah(Number(it.price || 0) * Number(it.qty || 0))}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white">Pembayaran</h3>
                <Badge tone={payInfo.tone}>{payInfo.label}</Badge>
              </div>
              <div className="flex justify-between text-zinc-300"><span>Subtotal barang ({orderItemCount(selected)} item)</span><span className="font-bold text-white">{formatRupiah(orderSubtotal(selected))}</span></div>
              <div className="flex justify-between text-zinc-300"><span>Ongkir • {selected.courier}</span><span className="font-bold text-white">{formatRupiah(selected.shippingCost)}</span></div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-zinc-300">Total dibayar</span>
                <span className="text-2xl font-black text-[#FFD000]">{formatRupiah(orderTotal(selected))}</span>
              </div>
              <div className="bg-[#2A2A2A] rounded-lg p-3">
                <div className="font-bold text-white">{selected.payment?.bank} Virtual Account</div>
                <div className="text-zinc-300 tabular-nums mt-0.5">{formatVA(selected.payment?.va)}</div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  {payStatus === 'lunas' && selected.payment?.confirmedAt && `Lunas pada ${selected.payment.confirmedAt}`}
                  {payStatus === 'menunggu' && selected.payment?.paidAt && `Pelanggan konfirmasi bayar ${selected.payment.paidAt}`}
                  {payStatus === 'ditolak' && 'Pembayaran ditolak admin'}
                </div>
              </div>
              {payStatus === 'menunggu' && (
                <button
                  type="button"
                  onClick={() => onGoPayments?.(selected.id)}
                  className="w-full min-h-[40px] rounded-md border border-[#FFD000] text-[#FFD000] hover:bg-[#FFD000] hover:text-[#111111] text-xs font-bold transition-colors"
                >
                  Periksa &amp; konfirmasi pembayaran
                </button>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <h3 className="font-extrabold text-white">Penerima &amp; alamat</h3>
                {selected.addressLabel && <span className="text-zinc-400">{selected.addressLabel}</span>}
              </div>
              <div className="font-bold text-white">{selected.customer}</div>
              <div className="text-zinc-300">{selected.email}</div>
              <div className="text-zinc-300">{selected.phone}</div>
              <p className="text-zinc-300 leading-relaxed pt-1">{selected.address}</p>
              {selected.note && (
                <div className="bg-[#2A2A2A] rounded-lg p-3 mt-2">
                  <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Catatan pelanggan</div>
                  <div className="text-zinc-200 mt-1">{selected.note}</div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <h3 className="text-sm font-extrabold text-white">Progres pesanan</h3>
              <div className="grid grid-cols-3 gap-2">
                {STEPS.map((s, i) => (
                  <div key={s}>
                    <div className={`h-[3px] rounded ${i <= stepIndex ? 'bg-[#FFD000]' : 'bg-white/15'}`} />
                    <div className={`text-xs font-bold mt-2 ${i <= stepIndex ? 'text-white' : 'text-zinc-400'}`}>{STAGE[s].label}</div>
                    <div className="text-[10px] text-zinc-400">
                      {i <= stepIndex ? (i === 0 ? String(selected.createdAt || '').replace(' WIB', '') : 'Selesai') : 'Menunggu'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#2A2A2A] rounded-lg p-3 text-xs space-y-1.5">
                <div className="font-bold text-white">{selected.courier} • {selected.resi ? `Resi ${selected.resi}` : 'Resi belum tersedia'}</div>
                <div className="flex justify-between text-zinc-300">
                  <span>Estimasi tiba</span><span className="font-extrabold text-[#FFD000]">{selected.estimatedArrival}</span>
                </div>
              </div>

              {selected.stage === 'dibuat' && (
                <button
                  type="button"
                  disabled={!payOk}
                  onClick={() => onAdvance?.(selected.id)}
                  className="w-full min-h-[44px] bg-[#FFD000] hover:bg-[#ffe033] disabled:opacity-40 text-[#111111] font-extrabold text-xs rounded-lg transition-colors"
                >
                  Proses pesanan
                </button>
              )}
              {selected.stage === 'diproses' && (
                <button
                  type="button"
                  onClick={() => onAdvance?.(selected.id)}
                  className="w-full min-h-[44px] bg-[#FFD000] hover:bg-[#ffe033] text-[#111111] font-extrabold text-xs rounded-lg transition-colors"
                >
                  Kirim pesanan
                </button>
              )}
              {selected.stage === 'dibuat' && !payOk && (
                <p className="text-[11px] text-zinc-400">Pesanan baru bisa diproses setelah pembayaran dikonfirmasi.</p>
              )}
              {selected.stage === 'dikirim' && (
                <p className="text-[11px] text-zinc-400">Pesanan sudah dikirim dan sedang dalam perjalanan ke pelanggan.</p>
              )}

              <button
                type="button"
                onClick={() => setCancelTarget(selected)}
                className="w-full min-h-[44px] border border-red-400/50 text-red-300 hover:bg-red-500/15 hover:border-red-400 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              >
                <IconX size={15} /> Batalkan pesanan
              </button>
            </div>
          </aside>
        ) : (
          <aside className={`${card} xl:col-span-4 border-t-2 border-t-[#FFD000] p-6 text-center space-y-2`}>
            <h2 className="font-display font-bold text-2xl text-white">Tidak ada pesanan</h2>
            <p className="text-xs text-zinc-400">Belum ada pesanan masuk atau semua pesanan telah dibatalkan.</p>
          </aside>
        )}
      </div>

      {/* Modal konfirmasi pembatalan pesanan */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setCancelTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            aria-describedby="cancel-modal-desc"
            className="w-full max-w-md bg-[#1E1E1E] border border-white/15 border-t-2 border-t-red-500 rounded-xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-red-500/15 text-red-300 inline-flex items-center justify-center shrink-0">
                <IconWarn size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 id="cancel-modal-title" className="text-lg font-extrabold text-white">
                  Konfirmasi Pembatalan Pesanan
                </h2>
                <p id="cancel-modal-desc" className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  Apakah Anda yakin ingin membatalkan dan menghapus pesanan <strong className="text-white">#{cancelTarget.id}</strong> atas nama <strong className="text-white">{cancelTarget.customer}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-lg p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nomor pesanan</span>
                <span className="font-extrabold text-[#FFD000]">#{cancelTarget.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Pelanggan</span>
                <span className="font-bold text-white">{cancelTarget.customer} ({cancelTarget.city})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total pesanan</span>
                <span className="font-extrabold text-white">{formatRupiah(orderTotal(cancelTarget))}</span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
              <button
                ref={cancelCloseRef}
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 min-h-[44px] px-4 rounded-lg bg-[#2A2A2A] border border-white/15 hover:border-white/35 text-xs font-bold text-white transition-colors"
              >
                Tidak, kembali
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="flex-1 min-h-[44px] px-4 rounded-lg bg-red-700 hover:bg-red-600 text-xs font-extrabold text-white transition-colors"
              >
                Ya, batalkan pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}