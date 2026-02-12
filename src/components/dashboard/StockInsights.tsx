import { useNavigate } from "react-router-dom";
import { Package, AlertTriangle, Clock } from "lucide-react";
import { mockProducts, estoqueKPIs } from "@/components/estoque/mockEstoqueData";

const StockInsights = () => {
  const navigate = useNavigate();
  const criticalProducts = mockProducts.filter(p => p.currentStock <= p.minStockAlert);
  const expiringProducts = mockProducts.filter(p => {
    if (!p.expirationDate) return false;
    const diff = new Date(p.expirationDate).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Estoque</h3>
        </div>
        <button
          onClick={() => navigate("/estoque")}
          className="text-xs text-primary font-medium hover:underline"
        >
          Ver tudo →
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-muted/30 border border-border/20 p-3 text-center">
          <p className="text-lg font-bold text-foreground">
            R$ {estoqueKPIs.valorEmEstoque.toLocaleString("pt-BR")}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Capital Investido</p>
        </div>
        <div className="rounded-xl bg-destructive/8 border border-destructive/20 p-3 text-center">
          <p className="text-lg font-bold text-destructive">{criticalProducts.length}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Itens Críticos</p>
        </div>
        <div className="rounded-xl bg-muted/30 border border-border/20 p-3 text-center">
          <p className="text-lg font-bold text-foreground">{estoqueKPIs.previsaoCompra}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Próx. Compra</p>
        </div>
      </div>

      {/* Critical alerts */}
      {criticalProducts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            Alertas de Reposição
          </p>
          <div className="space-y-1.5">
            {criticalProducts.slice(0, 3).map(p => {
              const pct = Math.round((p.currentStock / p.maxStock) * 100);
              return (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/20 border border-border/10">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.brand} · {p.currentStock}{p.unit}</p>
                  </div>
                  <div className="w-16 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-destructive"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expiring soon */}
      {expiringProducts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Vencimento Próximo
          </p>
          <div className="space-y-1.5">
            {expiringProducts.slice(0, 2).map(p => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                <span className="text-[10px] font-medium text-amber-500 shrink-0 ml-2">
                  {new Date(p.expirationDate!).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockInsights;
