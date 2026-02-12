import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, ShoppingCart, Plus, Minus, Scale, X, ArrowLeft,
  BookOpen, Search, Settings, Truck, CalendarIcon, Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockProducts, estoqueKPIs, defaultCategories, type ProductStock } from '@/components/estoque/mockEstoqueData';
import BottomNav from '@/components/BottomNav';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-secondary transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Package className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold font-display">Gestão de Estoque</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition"
            >
              <Filter className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground hidden sm:inline">Atualizado agora</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 py-6 flex gap-6">
        {/* ===== SIDEBAR CATEGORIAS (20%) ===== */}
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={cn(
          'shrink-0 space-y-4 transition-all duration-300',
          'fixed top-0 left-0 z-50 h-full w-[260px] p-4 pt-20 bg-background border-r border-border lg:relative lg:z-auto lg:h-auto lg:w-[220px] lg:p-0 lg:pt-0 lg:bg-transparent lg:border-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-primary">Categorias</h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowCategoryModal(true)} className="p-1.5 rounded-lg hover:bg-secondary transition">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary transition lg:hidden">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <nav className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSidebarOpen(false); }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all',
                    selectedCategory === cat
                      ? 'bg-primary/15 border border-primary/30 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {cat}
                  <span className="ml-auto float-right text-xs text-muted-foreground">
                    {cat === 'Todos' ? products.length : products.filter(p => p.category === cat).length}
                  </span>
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
              { icon: Package, label: 'Capital Investido', value: `R$ ${estoqueKPIs.valorEmEstoque.toLocaleString('pt-BR')}`, sub: 'Valor em produtos', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: AlertTriangle, label: 'Itens Críticos', value: `${criticalCount} Produtos`, sub: 'Baixo estoque ou vencendo', color: 'text-destructive', bg: 'bg-destructive/10' },
              { icon: ShoppingCart, label: 'Previsão de Compra', value: `Repor até ${estoqueKPIs.previsaoCompra}`, sub: 'Sugestão da IA baseada na agenda', color: 'text-accent', bg: 'bg-accent/10' },
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-5 shadow-card`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${kpi.bg}`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Search + Add Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar esmalte, marca..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60"
              />
            </div>
            <Button
              onClick={() => { setShowAddModal(true); setAddTab(null); }}
              className="rounded-xl bg-gradient-hero font-semibold text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Adicionar Produto
            </Button>
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
                  className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer shadow-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="p-4 space-y-3">
                    {/* Product icon + name */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm leading-tight truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>

                    {/* Expiration */}
                    {product.expirationDate && (
                      <div className={cn(
                        'text-[11px] px-2 py-1 rounded-lg inline-block',
                        isExpired(product) ? 'bg-destructive/15 text-destructive border border-destructive/30' :
                        isExpiringSoon(product) ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                        'bg-secondary text-muted-foreground border border-border'
                      )}>
                        Val: {format(new Date(product.expirationDate), 'dd/MM/yyyy')}
                      </div>
                    )}

                    {/* Battery Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{product.currentStock}{product.unit}</span>
                        <span>{product.maxStock}{product.unit}</span>
                      </div>
                      <div className="h-3 rounded-full bg-secondary overflow-hidden">
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
                      <div className="text-[11px] px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                        {product.aiAlert}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 pt-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => adjustStock(product.id, product.unit === 'un' ? -1 : -10)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-secondary border border-border text-xs hover:bg-destructive/15 hover:border-destructive/30 transition"
                      >
                        <Minus className="w-3 h-3" /> {product.unit === 'un' ? '1' : '10'}
                      </button>
                      <button
                        onClick={() => adjustStock(product.id, product.unit === 'un' ? 1 : 10)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-secondary border border-border text-xs hover:bg-emerald-500/15 hover:border-emerald-500/30 transition"
                      >
                        <Plus className="w-3 h-3" /> {product.unit === 'un' ? '1' : '10'}
                      </button>
                      <button
                        onClick={() => { setShowAdjustModal(product); setAdjustValue(String(product.currentStock)); }}
                        className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs hover:bg-primary/15 hover:border-primary/30 transition"
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
            <div className="text-center py-16 text-muted-foreground">
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
              className="w-full max-w-md rounded-2xl bg-card border border-border overflow-hidden shadow-elegant"
              onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-lg font-display">Adicionar Produto</h2>
                <button onClick={() => { setShowAddModal(false); setAddTab(null); }} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
              </div>

              {/* Tab selector or content */}
              {!addTab ? (
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">Como deseja cadastrar?</p>
                  <button onClick={() => setAddTab('nf')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition text-left">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">📄 Ler Nota Fiscal (XML)</p>
                      <p className="text-xs text-muted-foreground">Para quem tem CNPJ</p>
                    </div>
                  </button>
                  <button onClick={() => setAddTab('manual')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition text-left">
                    <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">✍️ Cadastro Manual</p>
                      <p className="text-xs text-muted-foreground">Para itens avulsos</p>
                    </div>
                  </button>
                </div>
              ) : addTab === 'nf' ? (
                <div className="p-5 space-y-3">
                  <button onClick={() => setAddTab(null)} className="text-xs text-primary hover:underline mb-2">← Voltar</button>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Fornecedor</label>
                    <input placeholder="Ex: Distribuidora Beauty" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Número da NF</label>
                    <input placeholder="Ex: NF-00234" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Valor Total</label>
                    <input placeholder="R$ 0,00" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60" />
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/40 border border-dashed border-border text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">Arraste o XML da NF ou clique para anexar</p>
                  </div>
                  <Button onClick={() => { setShowAddModal(false); setAddTab(null); }}
                    className="w-full rounded-xl bg-gradient-hero font-semibold text-sm">
                    Registrar Entrada
                  </Button>
                </div>
              ) : (
                <div className="p-5 space-y-3">
                  <button onClick={() => setAddTab(null)} className="text-xs text-primary hover:underline mb-2">← Voltar</button>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nome do Produto</label>
                    <input value={manualForm.name} onChange={e => setManualForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ex: Esmalte Rosa Choque" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Categoria</label>
                    <select value={manualForm.category} onChange={e => setManualForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50">
                      {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Marca</label>
                    <input value={manualForm.brand} onChange={e => setManualForm(f => ({ ...f, brand: e.target.value }))}
                      placeholder="Ex: Risqué" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Validade</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn(
                          'w-full justify-start text-left font-normal',
                          !manualExpDate && 'text-muted-foreground'
                        )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {manualExpDate ? format(manualExpDate, 'dd/MM/yyyy') : 'Selecione a validade'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={manualExpDate} onSelect={setManualExpDate} initialFocus
                          className={cn("p-3 pointer-events-auto")} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Quantidade</label>
                      <input type="number" value={manualForm.quantity} onChange={e => setManualForm(f => ({ ...f, quantity: e.target.value }))}
                        placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Unidade</label>
                      <select value={manualForm.unit} onChange={e => setManualForm(f => ({ ...f, unit: e.target.value as 'ml' | 'g' | 'un' }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50">
                        <option value="un">Unidade (un)</option>
                        <option value="ml">Mililitros (ml)</option>
                        <option value="g">Gramas (g)</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleAddManual}
                    className="w-full rounded-xl bg-gradient-hero font-semibold text-sm">
                    Cadastrar Produto
                  </Button>
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
              className="w-full max-w-md rounded-2xl bg-card border border-border overflow-hidden shadow-elegant"
              onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg font-display">{selectedProduct.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Estoque Atual</span>
                    <span className="font-semibold">{selectedProduct.currentStock}{selectedProduct.unit} / {selectedProduct.maxStock}{selectedProduct.unit}</span>
                  </div>
                  <div className="h-4 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${stockColor(selectedProduct)} transition-all`}
                      style={{ width: `${stockPercent(selectedProduct)}%` }} />
                  </div>
                </div>
                {selectedProduct.aiAlert && (
                  <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{selectedProduct.aiAlert}</span>
                  </div>
                )}
                {selectedProduct.recipes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Receita Técnica
                    </h3>
                    <div className="space-y-2">
                      {selectedProduct.recipes.map((r, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/50 border border-border">
                          <div>
                            <p className="text-sm font-medium">{r.serviceName}</p>
                            <p className="text-xs text-muted-foreground">{r.quantityUsed}{selectedProduct.unit} por aplicação</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">R$ {r.costPerDose.toFixed(2)}</p>
                            <p className="text-[10px] text-muted-foreground">custo/dose</p>
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
              className="w-full max-w-sm rounded-2xl bg-card border border-border p-5 space-y-4 shadow-elegant"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold font-display">Ajustar Estoque</h3>
                <button onClick={() => setShowAdjustModal(null)} className="p-1 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-muted-foreground">{showAdjustModal.name} ({showAdjustModal.brand})</p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Quantidade ({showAdjustModal.unit})</label>
                <input type="number" value={adjustValue} onChange={e => setAdjustValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50" min={0} max={showAdjustModal.maxStock} />
              </div>
              <Button onClick={() => {
                const val = Number(adjustValue);
                if (!isNaN(val)) setProducts(prev => prev.map(p => p.id === showAdjustModal.id ? { ...p, currentStock: Math.max(0, Math.min(p.maxStock, val)) } : p));
                setShowAdjustModal(null);
              }} className="w-full rounded-xl bg-gradient-hero font-semibold text-sm">
                Confirmar
              </Button>
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
              className="w-full max-w-sm rounded-2xl bg-card border border-border p-5 space-y-4 shadow-elegant"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold font-display">Gerenciar Categorias</h3>
                <button onClick={() => setShowCategoryModal(false)} className="p-1 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {categories.filter(c => c !== 'Todos').map(cat => (
                  <div key={cat} className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/50 border border-border">
                    <span className="text-sm">{cat}</span>
                    <button onClick={() => setCategories(prev => prev.filter(c => c !== cat))}
                      className="text-xs text-destructive hover:text-destructive/80">Remover</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nova categoria..."
                  className="flex-1 px-4 py-2 rounded-xl bg-secondary/60 border border-border text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/60"
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()} />
                <Button onClick={handleAddCategory} size="icon" variant="outline"
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary/15">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

export default Estoque;
