import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, ShoppingCart, Plus, Minus, Scale, X, ArrowLeft,
  BookOpen, Search, Settings, Truck, CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockProducts, estoqueKPIs, defaultCategories, type ProductStock } from '@/components/estoque/mockEstoqueData';

const Estoque = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductStock[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTab, setAddTab] = useState<'nf' | 'manual' | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState<ProductStock | null>(null);
  const [adjustValue, setAdjustValue] = useState('');

  // Manual form state
  const [manualForm, setManualForm] = useState({ name: '', category: 'Cabelo', brand: '', quantity: '', unit: 'un' as 'ml' | 'g' | 'un' });
  const [manualExpDate, setManualExpDate] = useState<Date | undefined>();

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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

  const isExpiringSoon = (p: ProductStock) => {
    if (!p.expirationDate) return false;
    const diff = new Date(p.expirationDate).getTime() - Date.now();
    return diff < 90 * 24 * 60 * 60 * 1000 && diff > 0;
  };
  const isExpired = (p: ProductStock) => {
    if (!p.expirationDate) return false;
    return new Date(p.expirationDate).getTime() < Date.now();
  };

  const handleAddManual = () => {
    if (!manualForm.name || !manualForm.quantity) return;
    const newProd: ProductStock = {
      id: String(Date.now()),
      name: manualForm.name,
      brand: manualForm.brand || 'Sem marca',
      category: manualForm.category,
      unit: manualForm.unit,
      currentStock: Number(manualForm.quantity),
      maxStock: Number(manualForm.quantity) * 2,
      costPerUnit: 0,
      minStockAlert: Math.round(Number(manualForm.quantity) * 0.2),
      expirationDate: manualExpDate ? manualExpDate.toISOString().split('T')[0] : undefined,
      recipes: [],
    };
    setProducts(prev => [newProd, ...prev]);
    setManualForm({ name: '', category: 'Cabelo', brand: '', quantity: '', unit: 'un' });
    setManualExpDate(undefined);
    setShowAddModal(false);
    setAddTab(null);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const criticalCount = products.filter(p => p.currentStock <= p.minStockAlert).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Package className="w-6 h-6 text-fuchsia-400" />
            <h1 className="text-xl font-bold">Gestão de Estoque</h1>
          </div>
          <span className="text-sm text-white/50">Atualizado agora</span>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 py-6 flex gap-6">
        {/* ===== SIDEBAR CATEGORIAS (20%) ===== */}
        <aside className="w-[220px] shrink-0 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-fuchsia-300">Categorias</h2>
              <button onClick={() => setShowCategoryModal(true)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <Settings className="w-4 h-4 text-white/50" />
              </button>
            </div>
            <nav className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all',
                    selectedCategory === cat
                      ? 'bg-fuchsia-500/30 border border-fuchsia-500/50 text-fuchsia-200'
                      : 'text-white/60 hover:bg-white/10 hover:text-white/80'
                  )}
                >
                  {cat}
                  {cat !== 'Todos' && (
                    <span className="ml-auto float-right text-xs text-white/40">
                      {products.filter(p => p.category === cat).length}
                    </span>
                  )}
                  {cat === 'Todos' && (
                    <span className="ml-auto float-right text-xs text-white/40">
                      {products.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ===== CONTEÚDO PRINCIPAL (80%) ===== */}
        <section className="flex-1 space-y-6 min-w-0">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Package, label: 'Capital Investido', value: `R$ ${estoqueKPIs.valorEmEstoque.toLocaleString('pt-BR')}`, sub: 'Valor em produtos', color: 'text-fuchsia-400', bg: 'from-fuchsia-500/20 to-purple-500/10' },
              { icon: AlertTriangle, label: 'Itens Críticos', value: `${criticalCount} Produtos`, sub: 'Baixo estoque ou vencendo', color: 'text-red-400', bg: 'from-red-500/20 to-orange-500/10' },
              { icon: ShoppingCart, label: 'Previsão de Compra', value: `Repor até ${estoqueKPIs.previsaoCompra}`, sub: 'Sugestão da IA baseada na agenda', color: 'text-amber-400', bg: 'from-amber-500/20 to-yellow-500/10' },
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

          {/* Search + Add Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar esmalte, marca..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30"
              />
            </div>
            <button
              onClick={() => { setShowAddModal(true); setAddTab(null); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 font-semibold text-sm hover:opacity-90 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              Adicionar Produto
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-fuchsia-500/30 transition-all cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="p-4 space-y-3">
                    {/* Product icon + name */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-fuchsia-300" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm leading-tight truncate">{product.name}</h3>
                        <p className="text-xs text-white/40">{product.brand}</p>
                      </div>
                    </div>

                    {/* Expiration */}
                    {product.expirationDate && (
                      <div className={cn(
                        'text-[11px] px-2 py-1 rounded-lg inline-block',
                        isExpired(product) ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        isExpiringSoon(product) ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-white/5 text-white/40 border border-white/10'
                      )}>
                        Val: {format(new Date(product.expirationDate), 'dd/MM/yyyy')}
                      </div>
                    )}

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
                          transition={{ duration: 0.8 }}
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
                        <Minus className="w-3 h-3" /> {product.unit === 'un' ? '1' : '10'}
                      </button>
                      <button
                        onClick={() => adjustStock(product.id, product.unit === 'un' ? 1 : 10)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-emerald-500/20 hover:border-emerald-500/30 transition"
                      >
                        <Plus className="w-3 h-3" /> {product.unit === 'un' ? '1' : '10'}
                      </button>
                      <button
                        onClick={() => { setShowAdjustModal(product); setAdjustValue(String(product.currentStock)); }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-fuchsia-500/20 hover:border-fuchsia-500/30 transition"
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
        </section>
      </div>

      {/* ===== MODAL: ADICIONAR PRODUTO ===== */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setAddTab(null); }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#2d1b4e] to-[#1a0a2e] border border-white/10 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-bold text-lg">Adicionar Produto</h2>
                <button onClick={() => { setShowAddModal(false); setAddTab(null); }} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>

              {/* Tab selector or content */}
              {!addTab ? (
                <div className="p-5 space-y-3">
                  <p className="text-sm text-white/50 mb-4">Como deseja cadastrar?</p>
                  <button onClick={() => setAddTab('nf')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-500/30 transition text-left">
                    <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-fuchsia-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">📄 Ler Nota Fiscal (XML)</p>
                      <p className="text-xs text-white/40">Para quem tem CNPJ</p>
                    </div>
                  </button>
                  <button onClick={() => setAddTab('manual')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-500/30 transition text-left">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">✍️ Cadastro Manual</p>
                      <p className="text-xs text-white/40">Para itens avulsos</p>
                    </div>
                  </button>
                </div>
              ) : addTab === 'nf' ? (
                <div className="p-5 space-y-3">
                  <button onClick={() => setAddTab(null)} className="text-xs text-fuchsia-300 hover:underline mb-2">← Voltar</button>
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
                    <p className="text-xs text-white/40">Arraste o XML da NF ou clique para anexar</p>
                  </div>
                  <button onClick={() => { setShowAddModal(false); setAddTab(null); }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 font-semibold text-sm hover:opacity-90 transition">
                    Registrar Entrada
                  </button>
                </div>
              ) : (
                <div className="p-5 space-y-3">
                  <button onClick={() => setAddTab(null)} className="text-xs text-fuchsia-300 hover:underline mb-2">← Voltar</button>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Nome do Produto</label>
                    <input value={manualForm.name} onChange={e => setManualForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ex: Esmalte Rosa Choque" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Categoria</label>
                    <select value={manualForm.category} onChange={e => setManualForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 text-white [&>option]:bg-[#2d1b4e] [&>option]:text-white">
                      {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Marca</label>
                    <input value={manualForm.brand} onChange={e => setManualForm(f => ({ ...f, brand: e.target.value }))}
                      placeholder="Ex: Risqué" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Validade</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn(
                          'w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white',
                          !manualExpDate && 'text-white/30'
                        )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {manualExpDate ? format(manualExpDate, 'dd/MM/yyyy') : 'Selecione a validade'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#2d1b4e] border-white/10" align="start">
                        <Calendar mode="single" selected={manualExpDate} onSelect={setManualExpDate} initialFocus
                          className={cn("p-3 pointer-events-auto")} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/60 mb-1 block">Quantidade</label>
                      <input type="number" value={manualForm.quantity} onChange={e => setManualForm(f => ({ ...f, quantity: e.target.value }))}
                        placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30" />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 mb-1 block">Unidade</label>
                      <select value={manualForm.unit} onChange={e => setManualForm(f => ({ ...f, unit: e.target.value as 'ml' | 'g' | 'un' }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 text-white [&>option]:bg-[#2d1b4e] [&>option]:text-white">
                        <option value="un">Unidade (un)</option>
                        <option value="ml">Mililitros (ml)</option>
                        <option value="g">Gramas (g)</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleAddManual}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 font-semibold text-sm hover:opacity-90 transition">
                    Cadastrar Produto
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODAL: RECEITA TÉCNICA (Detalhes do Produto) ===== */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#2d1b4e] to-[#1a0a2e] border border-white/10 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">{selectedProduct.name}</h2>
                  <p className="text-sm text-white/50">{selectedProduct.brand}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Estoque Atual</span>
                    <span className="font-semibold">{selectedProduct.currentStock}{selectedProduct.unit} / {selectedProduct.maxStock}{selectedProduct.unit}</span>
                  </div>
                  <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${stockColor(selectedProduct)} transition-all`}
                      style={{ width: `${stockPercent(selectedProduct)}%` }} />
                  </div>
                </div>
                {selectedProduct.aiAlert && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{selectedProduct.aiAlert}</span>
                  </div>
                )}
                {selectedProduct.recipes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-fuchsia-300 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Receita Técnica
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
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODAL: AJUSTAR ESTOQUE ===== */}
      <AnimatePresence>
        {showAdjustModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAdjustModal(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#2d1b4e] to-[#1a0a2e] border border-white/10 p-5 space-y-4"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Ajustar Estoque</h3>
                <button onClick={() => setShowAdjustModal(null)} className="p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-white/50">{showAdjustModal.name} ({showAdjustModal.brand})</p>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Quantidade ({showAdjustModal.unit})</label>
                <input type="number" value={adjustValue} onChange={e => setAdjustValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50" min={0} max={showAdjustModal.maxStock} />
              </div>
              <button onClick={() => {
                const val = Number(adjustValue);
                if (!isNaN(val)) setProducts(prev => prev.map(p => p.id === showAdjustModal.id ? { ...p, currentStock: Math.max(0, Math.min(p.maxStock, val)) } : p));
                setShowAdjustModal(null);
              }} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 font-semibold text-sm hover:opacity-90 transition">
                Confirmar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODAL: GERENCIAR CATEGORIAS ===== */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCategoryModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#2d1b4e] to-[#1a0a2e] border border-white/10 p-5 space-y-4"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Gerenciar Categorias</h3>
                <button onClick={() => setShowCategoryModal(false)} className="p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {categories.filter(c => c !== 'Todos').map(cat => (
                  <div key={cat} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-sm">{cat}</span>
                    <button onClick={() => setCategories(prev => prev.filter(c => c !== cat))}
                      className="text-xs text-red-400 hover:text-red-300">Remover</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nova categoria..."
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-fuchsia-500/50 placeholder:text-white/30"
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()} />
                <button onClick={handleAddCategory}
                  className="px-4 py-2 rounded-xl bg-fuchsia-500/30 border border-fuchsia-500/50 text-sm font-medium hover:bg-fuchsia-500/40 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Estoque;
