import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, AlertTriangle, ShoppingCart, Plus, Minus, Scale, X,
  BookOpen, Search, Settings, Truck, CalendarIcon, Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockProducts, estoqueKPIs, defaultCategories, type ProductStock } from '@/components/estoque/mockEstoqueData';

/**
 * Manager version of Estoque — reuses the same data & UI but lives inside ManagerLayout
 * (no admin sidebar, no admin BottomNav).
 * We import the full Estoque page content inline to avoid coupling with admin layout.
 */

const ManagerEstoque = () => {
  const [products, setProducts] = useState<ProductStock[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null);

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const criticalCount = products.filter(p => p.currentStock <= p.minStockAlert).length;

  return (
    <>
      <header className="sticky top-0 z-20 glass border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Estoque <span className="text-primary">Gerencial</span>
            </h1>
            <p className="text-xs text-muted-foreground">Salão BellaBonita</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
            G
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border/30 bg-card/80 backdrop-blur-xl p-4 shadow-card text-center">
            <p className="text-xs text-muted-foreground">Valor em Estoque</p>
            <p className="text-xl font-bold text-foreground">R$ {estoqueKPIs.valorEmEstoque.toLocaleString('pt-BR')}</p>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/80 backdrop-blur-xl p-4 shadow-card text-center">
            <p className="text-xs text-muted-foreground">Itens Críticos</p>
            <p className="text-xl font-bold text-destructive">{criticalCount}</p>
          </div>
          <div className="rounded-xl border border-border/30 bg-card/80 backdrop-blur-xl p-4 shadow-card text-center">
            <p className="text-xs text-muted-foreground">Próx. Compra</p>
            <p className="text-xl font-bold text-foreground">{estoqueKPIs.previsaoCompra}</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-card/60 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/60 text-muted-foreground border-border/30 hover:border-primary/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product list */}
        <div className="space-y-3">
          {filtered.map(product => {
            const pct = Math.round((product.currentStock / product.maxStock) * 100);
            const isCritical = product.currentStock <= product.minStockAlert;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border bg-card/80 backdrop-blur-xl p-4 shadow-card cursor-pointer hover:-translate-y-0.5 transition-all",
                  isCritical ? "border-destructive/40" : "border-border/30"
                )}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand} · {product.category}</p>
                  </div>
                  {isCritical && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        pct > 50 ? "bg-primary" : pct > 25 ? "bg-amber-500" : "bg-destructive"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {product.currentStock}/{product.maxStock} {product.unit}
                  </span>
                </div>
                {product.aiAlert && (
                  <p className="text-xs mt-2 text-amber-400">{product.aiAlert}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Product detail modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-lg bg-card border border-border/30 rounded-t-2xl md:rounded-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/20 p-3">
                  <p className="text-muted-foreground text-xs">Estoque Atual</p>
                  <p className="font-bold">{selectedProduct.currentStock} {selectedProduct.unit}</p>
                </div>
                <div className="rounded-lg bg-muted/20 p-3">
                  <p className="text-muted-foreground text-xs">Custo Unitário</p>
                  <p className="font-bold">R$ {selectedProduct.costPerUnit.toFixed(2)}</p>
                </div>
              </div>

              {selectedProduct.recipes.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-foreground mb-2">Receitas vinculadas</p>
                  {selectedProduct.recipes.map((r, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-border/10 last:border-0">
                      <span className="text-muted-foreground">{r.serviceName}</span>
                      <span className="font-medium">{r.quantityUsed} {selectedProduct.unit} · R$ {r.costPerDose.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManagerEstoque;
