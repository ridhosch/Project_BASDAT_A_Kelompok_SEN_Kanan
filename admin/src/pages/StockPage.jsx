import React, { useMemo, useState } from 'react';
import { Badge, StatCard, Tabs, SearchBox, Eyebrow, card } from '../components/ui.jsx';
import { IconBox, IconStock, IconCheck, IconWarn, IconDownload, IconPlus, IconSave } from '../components/Icons.jsx';
import { stockStatus } from '../data.js';

const STATUS_BADGE = {
  tersedia: { tone: 'green', label: 'Tersedia' },
  terbatas: { tone: 'yellow', label: 'Terbatas' },
  habis: { tone: 'red', label: 'Habis' },
};

export default function StockPage({ products = [], lastUpdated = '', onAddStock, onExport, onToast }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua kategori');
  const [tab, setTab] = useState('semua');
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');

  const counts = useMemo(() => {
    const c = { semua: products.length, tersedia: 0, terbatas: 0, habis: 0 };
    products.forEach((p) => { c[stockStatus(p.stock)] += 1; });
    return c;
  }, [products]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const needRestock = counts.terbatas + counts.habis;
  const categoryCount = new Set(products.map((p) => p.category)).size;

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchC = category === 'Semua kategori' || p.category === category;
    const matchT = tab === 'semua' || stockStatus(p.stock) === tab;
    return matchQ && matchC && matchT;
  });

  const selected = products.find((p) => p.id === selectedId) || products[0] || null;
  const selectedStock = Number(selected?.stock || 0);
  const add = Math.max(0, parseInt(qty, 10) || 0);
  const after = selectedStock + add;
  const afterStatus = stockStatus(after);

  const save = () => {
    if (!selected) {
      onToast('Pilih produk terlebih dahulu.');
      return;
    }
    if (add <= 0) {
      onToast('Masukkan jumlah penambahan lebih dari 0.');
      return;
    }
    onAddStock(selected.id, add, note);
    onToast(`Stok ${selected.name} bertambah ${add} unit menjadi ${after} unit.`);
    setQty('');
    setNote('');
  };

  const tabs = [
    { id: 'semua', label: `Semua (${counts.semua})` },
    { id: 'tersedia', label: `Tersedia (${counts.tersedia})` },
    { id: 'terbatas', label: `Terbatas (${counts.terbatas})` },
    { id: 'habis', label: `Habis (${counts.habis})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>PERSEDIAAN TOKO</Eyebrow>
          <h1 className="font-display font-bold text-5xl text-white mt-2 leading-none">Manajemen Stok</h1>
          <p className="text-sm text-zinc-300 mt-2">Pantau persediaan dan catat stok masuk dalam satu halaman.</p>
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={onExport}
            className="min-h-[44px] px-4 rounded-md bg-[#1E1E1E] border border-white/15 hover:border-[#FFD000] text-xs font-bold inline-flex items-center gap-2 transition-colors"
          >
            <IconDownload size={16} /> Ekspor stok
          </button>
          {lastUpdated && <div className="text-[11px] text-zinc-400 mt-2">{lastUpdated}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total produk" value={products.length} unit="produk" note={`Dalam ${categoryCount} kategori`} icon={<IconBox size={18} />} />
        <StatCard label="Stok tersedia" value={totalUnits} unit="unit" note="Total stok saat ini" icon={<IconStock size={18} />} />
        <StatCard label="Stok aman" value={counts.tersedia} unit="produk" note="Lebih dari 5 unit per produk" icon={<IconCheck size={18} />} />
        <StatCard label="Perlu ditambah" value={needRestock} unit="produk" note="Stok terbatas • 0–5 unit" icon={<IconWarn size={18} />} highlight />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Daftar stok */}
        <section className={`${card} xl:col-span-8 overflow-hidden`}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">Daftar stok produk</h2>
              <span className="text-xs text-zinc-400">{filtered.length} produk</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <SearchBox id="stock-search" value={query} onChange={setQuery} placeholder="Cari nama produk atau SKU..." />
              <select
                aria-label="Filter kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="min-h-[44px] sm:w-[200px] bg-[#2A2A2A] border border-white/10 rounded-lg px-3 text-xs text-white focus:border-[#FFD000]"
              >
                <option>Semua kategori</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <Tabs tabs={tabs} value={tab} onChange={setTab} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead className="bg-[#232323] text-[10px] tracking-wider text-zinc-400 uppercase">
                <tr>
                  <th className="px-5 py-3 font-bold">Produk / SKU</th>
                  <th className="px-3 py-3 font-bold">Stok saat ini</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map((p) => {
                  const st = STATUS_BADGE[stockStatus(p.stock)];
                  const active = p.id === selected?.id;
                  return (
                    <tr key={p.id} className={active ? 'bg-[#26231A] shadow-[inset_3px_0_0_#FFD000]' : ''}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 rounded object-cover bg-[#E5E5E5] shrink-0" />
                          <div>
                            <div className="text-sm font-bold text-white">{p.name}</div>
                            <div className="text-[11px] text-zinc-400">{p.sku} • {p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xl font-black text-white">{p.stock}</span>
                        <span className="text-[11px] text-zinc-400 ml-1">unit</span>
                      </td>
                      <td className="px-3 py-3"><Badge tone={st.tone}>{st.label}</Badge></td>
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedId(p.id)}
                          className={`min-h-[36px] px-3 rounded text-[11px] font-bold inline-flex items-center gap-1.5 border transition-colors ${
                            active
                              ? 'bg-[#FFD000] text-[#111111] border-[#FFD000]'
                              : 'bg-[#2A2A2A] text-white border-white/10 hover:border-[#FFD000]'
                          }`}
                        >
                          {active ? <><IconCheck size={13} /> Dipilih</> : <><IconPlus size={13} className="text-[#FFD000]" /> Tambah</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-xs text-zinc-400">
                      Tidak ada produk yang cocok dengan filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-white/10 flex justify-between text-[11px] text-zinc-400">
            <span>Menampilkan {filtered.length} dari {products.length} produk</span>
            <span>Halaman 1 dari 1</span>
          </div>
        </section>

        {/* Tambah stok */}
        <aside className="xl:col-span-4 space-y-4">
          <section className={`${card} border-t-2 border-t-[#FFD000] p-5 space-y-4`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-white">Tambah stok</h2>
                <p className="text-xs text-zinc-400 mt-1">Catat barang masuk untuk memperbarui jumlah stok produk.</p>
              </div>
              <IconBox size={20} className="text-[#FFD000] shrink-0" />
            </div>

            <div>
              <label htmlFor="stock-product" className="block text-xs font-bold text-white mb-2">Pilih produk *</label>
              <div className="flex items-center gap-3 bg-[#2A2A2A] border border-white/10 rounded-lg p-2.5">
                {selected?.image && <img src={selected.image} alt="" className="w-10 h-10 rounded object-cover bg-[#E5E5E5]" />}
                <select
                  id="stock-product"
                  value={selected?.id || ''}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-bold text-white min-h-[40px] focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#2A2A2A]">{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-400">
                <span>Stok saat ini: {selectedStock} unit</span>
                {selected && <Badge tone={STATUS_BADGE[stockStatus(selectedStock)].tone}>{STATUS_BADGE[stockStatus(selectedStock)].label}</Badge>}
              </div>
            </div>

            <div>
              <label htmlFor="stock-qty" className="block text-xs font-bold text-white mb-2">Jumlah penambahan *</label>
              <div className="flex items-center bg-[#2A2A2A] border border-[#FFD000] rounded-lg px-3 min-h-[48px]">
                <span className="text-[#FFD000] font-bold mr-2">+</span>
                <input
                  id="stock-qty"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="flex-1 bg-transparent text-base font-extrabold text-[#FFD000] focus:outline-none min-w-0"
                />
                <span className="text-xs text-zinc-400">unit</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">Masukkan jumlah barang masuk, bukan total stok.</p>
            </div>

            <div>
              <label htmlFor="stock-note" className="block text-xs font-bold text-white mb-2">
                Catatan <span className="text-zinc-400 font-normal">(opsional)</span>
              </label>
              <textarea
                id="stock-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Barang masuk dari distributor."
                className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#FFD000]"
              />
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-lg p-4 space-y-2 text-xs">
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Ringkasan penambahan</div>
              <div className="flex justify-between text-zinc-300"><span>Stok saat ini</span><span className="font-extrabold text-white">{selectedStock} unit</span></div>
              <div className="flex justify-between text-[#FFD000]"><span>Penambahan</span><span className="font-extrabold">+{add} unit</span></div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <div className="text-emerald-300 font-semibold">Stok setelah penambahan</div>
                  <div className="text-[10px] text-zinc-400">{afterStatus === 'tersedia' ? 'Menjadi tersedia' : afterStatus === 'terbatas' ? 'Masih terbatas' : 'Masih habis'}</div>
                </div>
                <div><span className="text-3xl font-black text-emerald-300">{after}</span> <span className="text-[11px] text-zinc-400">unit</span></div>
              </div>
            </div>

            <button
              type="button"
              onClick={save}
              disabled={!selected}
              className="w-full min-h-[48px] bg-[#FFD000] hover:bg-[#ffe033] disabled:opacity-40 text-[#111111] font-extrabold text-sm rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
            >
              <IconSave size={17} /> Simpan penambahan stok
            </button>
            <p className="text-[11px] text-zinc-400 text-center">
              Belum disimpan. Stok pada tabel tetap {selectedStock} unit sampai penambahan disimpan.
            </p>
          </section>

          <p className="text-[11px] text-zinc-400 flex items-start gap-2 px-1">
            <span className="w-4 h-4 rounded-full border border-zinc-500 text-[10px] inline-flex items-center justify-center shrink-0" aria-hidden="true">i</span>
            Pastikan jumlah sesuai barang yang diterima. Setiap penambahan akan dicatat dalam riwayat stok.
          </p>
        </aside>
      </div>
    </div>
  );
}
