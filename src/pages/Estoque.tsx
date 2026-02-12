import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, TrendingDown, ShoppingCart,
  Plus, Minus, Scale, X, ArrowLeft, BookOpen,
  Search, Filter, ChevronDown, Truck
} from 'lucide-react';
import { mockProducts, estoqueKPIs, type ProductStock } from '@/components/estoque/mockEstoqueData';

const Estoque = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductStock[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'ok'>('all');
  const [showNFModal, setShowNFModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState<ProductStock | null>(null);
  const [adjustValue, setAdjustValue] = useState('');

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    if (filter === 'critical') return matchSearch && p.currentStock <= p.minStockAlert;
    if (filter === 'ok') return matchSearch && p.currentStock > p.minStockAlert;
    return matchSearch;
  });

  const adjustStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, currentStock: Math.max(0, Math.min(p.maxStock, p.currentStock + delta)) } : p
    ));
  };

  const stockPercent = (p: ProductStock) => Math.round((p.currentStock / p.maxStock) * 100);

  const stockColor = (p: ProductStock) => {
    const pct = stockPercent(p);
    if (pct <= 20) return 'from-red-500 to-red-600';
    if (pct <= 50) return 'from-amber-400 to-amber-500';
    return 'from-emerald-400 to-emerald-500';
  };

  const stockBgColor = (p: ProductStock) => {
    const pct = stockPercent(p);
    if (pct <= 20) return 'bg-red-500/10 border-red-500/30';
    if (pct <= 50) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Package className="w-6 h-6 text-fuchsia-400" />
            <h1 className="text-xl font-bold">Gestão de Estoque</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span>Atualizado agora</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Package, label: 'Valor em Estoque', value: `R$ ${estoqueKPIs.valorEmEstoque.toLocaleString('pt-BR')}`, sub: 'Capital investido em produtos', color: 'text-fuchsia-400', bg: 'from-fuchsia-500/20 to-purple-500/10' },
            { icon: AlertTriangle, label: 'Itens Críticos', value: `${estoqueKPIs.itensCriticos} produtos`, sub: 'Estoque baixo ou esgotando', color: 'text-red-400', bg: 'from-red-500/20 to-orange-500/10' },
            { icon: ShoppingCart, label: 'Previsão de Compra', value: `Até ${estoqueKPIs.previsaoCompra}`, sub: 'Sugestão da IA baseada na agenda', color: 'text-amber-400', bg: 'from-amber-500/20 to-yellow-500/10' },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${kpi.bg} backdrop-blur-xl p-5`}
            >
              <div className="flex items-center gap-3 mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                <span className="text-sm text-white/60">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-white/40 mt-1">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar produto ou marca..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'Todos' },
              { key: 'critical' as const, label: '🔴 Críticos' },
              { key: 'ok' as const, label: '✅ OK' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === f.key
                    ? 'bg-fuchsia-500/30 border border-fuchsia-500/50 text-fuchsia-300'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-fuchsia-500/30 transition-all group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                      <p className="text-xs text-white/40 mt-0.5">{product.brand}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${stockBgColor(product)}`}>
                      {stockPercent(product)}%
                    </span>
                  </div>

                  {/* Battery Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{product.currentStock}{product.unit}</span>
                      <span>{product.maxStock}{product.unit}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${stockColor(product)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPercent(product)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* AI Alert */}
                  {product.aiAlert && (
                    <div className="text-[11px] px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
                      {product.aiAlert}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 pt-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => adjustStock(product.id, product.unit === 'un' ? -1 : -10)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-red-500/20 hover:border-red-500/30 transition"
                    >
                      <Minus className="w-3 h-3" />
                      {product.unit === 'un' ? '1' : '10'}
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, product.unit === 'un' ? 1 : 10)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-emerald-500/20 hover:border-emerald-500/30 transition"
                    >
                      <Plus className="w-3 h-3" />
                      {product.unit === 'un' ? '1' : '10'}
                    </button>
                    <button
                      onClick={() => { setShowAdjustModal(product); setAdjustValue(String(product.currentStock)); }}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-fuchsia-500/20 hover:border-fuchsia-500/30 transition"
                    >
                      <Scale className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </main>

      {/* FAB - Nota Fiscal */}
      <button
        onClick={() => setShowNFModal(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-lg shadow-fuchsia-500/30 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modal: Receita Técnica */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#2d1b4e] to-[#1a0a2e] border border-white/10 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">{selectedProduct.name}</h2>
                  <p className="text-sm text-white/50">{selectedProduct.brand}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-lg hover:bg-white/10 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Stock Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Estoque Atual</span>
                    <span className="font-semibold">{selectedProduct.currentStock}{selectedProduct.unit} / {selectedProduct.maxStock}{selectedProduct.unit}</span>
                  </div>
                  <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stockColor(selectedProduct)} transition-all`}
                      style={{ width: `${stockPercent(selectedProduct)}%` }}
                    />
                  </div>
                </div>

                {selectedProduct.aiAlert && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{selectedProduct.aiAlert}</span>
                  </div>
                )}

                {/* Recipes */}
                <div>
                  <h3 className="text-sm font-semibold text-fuchsia-300 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Receita Técnica — Onde é usado
                  </h3>
                  <div className="space-y-2">
                    {selectedProduct.recipes.map((r, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <p className="text-sm font-medium">{r.serviceName}</p>
                          <p className="text-xs text-white/40">{r.quantityUsed}{selectedProduct.unit} por aplicação</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-fuchsia-300">R$ {r.costPerDose.toFixed(2)}</p>
                          <p className="text-[10px] text-white/40">custo/dose</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bella Academy Link */}
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 hover:text-fuchsia-300 hover:border-fuchsia-500/30 transition">
                  <BookOpen className="w-3.5 h-3.5" />
                  Bella Academy: Aprenda a economizar pesando produtos
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Adjust Weight */}
      <AnimatePresence>
        {showAdjustModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAdjustModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#2d1b4e] to-[#1a0a2e] border border-white/10 p-5 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Ajustar Estoque</h3>
                <button onClick={() => setShowAdjustModal(null)} className="p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-white/50">{showAdjustModal.name} ({showAdjustModal.brand})</p>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Quantidade ({showAdjustModal.unit})</label>
                <input
                  type="number"
                  value={adjustValue}
                  onChange={e => setAdjustValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50"
                  min={0}
                  max={showAdjustModal.maxStock}
                />
              </div>
              <button
                onClick={() => {
                  const val = Number(adjustValue);
                  if (!isNaN(val)) {
                    setProducts(prev => prev.map(p =>
                      p.id === showAdjustModal.id ? { ...p, currentStock: Math.max(0, Math.min(p.maxStock, val)) } : p
                    ));
                  }
                  setShowAdjustModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 font-semibold text-sm hover:opacity-90 transition"
              >
                Confirmar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Nota Fiscal */}
      <AnimatePresence>
        {showNFModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNFModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#2d1b4e] to-[#1a0a2e] border border-white/10 p-5 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-fuchsia-400" />
                  <h3 className="font-bold">Entrada de Nota Fiscal</h3>
                </div>
                <button onClick={() => setShowNFModal(false)} className="p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Fornecedor</label>
                  <input placeholder="Ex: Distribuidora Beauty" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Número da NF</label>
                  <input placeholder="Ex: NF-00234" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Valor Total</label>
                  <input placeholder="R$ 0,00" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30" />
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-white/30" />
                  <p className="text-xs text-white/40">Arraste a foto da NF ou clique para anexar</p>
                </div>
              </div>

              <button
                onClick={() => setShowNFModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 font-semibold text-sm hover:opacity-90 transition"
              >
                Registrar Entrada
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Estoque;
