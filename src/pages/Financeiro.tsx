import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockTransactions, mockDailyRevenue, Transaction } from "@/components/financeiro/mockFinanceData";
import {
  DollarSign, TrendingUp, Users, Package, CreditCard, Banknote,
  Smartphone, ChevronRight, X, ArrowDown, Percent
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Financeiro = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserName(user.user_metadata?.full_name || user.email || "");
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Compute anatomy
  const getAnatomy = (t: Transaction) => {
    const tax = t.price * t.taxRate;
    const cardFee = t.price * t.cardFeeRate;
    const commission = t.price * t.commissionRate;
    const net = t.price - tax - cardFee - commission - t.productCost;
    const margin = (net / t.price) * 100;
    return { tax, cardFee, commission, net, margin };
  };

  const paymentIcons: Record<string, React.ReactNode> = {
    card: <CreditCard className="w-3.5 h-3.5" />,
    pix: <Smartphone className="w-3.5 h-3.5" />,
    cash: <Banknote className="w-3.5 h-3.5" />,
  };

  const paymentLabels: Record<string, string> = {
    card: "Cartão",
    pix: "Pix",
    cash: "Dinheiro",
  };

  const metrics = [
    { label: "Faturamento Bruto", value: "R$ 15.000", color: "text-foreground", bgClass: "bg-card", borderClass: "border-border/30", icon: DollarSign },
    { label: "Comissões a Pagar", value: "R$ 6.000", color: "text-amber-500", bgClass: "bg-amber-500/8", borderClass: "border-amber-500/20", icon: Users },
    { label: "Custo de Produtos", value: "R$ 2.500", color: "text-yellow-500", bgClass: "bg-yellow-500/8", borderClass: "border-yellow-500/20", icon: Package },
    { label: "Lucro Líquido Real", value: "R$ 6.500", color: "text-emerald-400", bgClass: "bg-emerald-500/8", borderClass: "border-emerald-500/25", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-15 blur-3xl bg-primary" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-10 blur-3xl bg-accent" />

      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <main className="relative z-10 px-4 md:px-6 py-5 max-w-[1600px] mx-auto space-y-6">
        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visão completa de receitas, custos e lucro real</p>
        </motion.div>

        {/* ===== Metric Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-2xl p-5 border ${m.borderClass} ${m.bgClass} glass shadow-card`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{m.label}</span>
                <m.icon className={`w-5 h-5 ${m.color} opacity-60`} />
              </div>
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              {m.label === "Lucro Líquido Real" && (
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl" />
              )}
            </motion.div>
          ))}
        </div>

        {/* ===== Stacked Bar Chart ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 bg-card border border-border/30 glass shadow-card"
        >
          <h2 className="font-display text-base font-bold text-foreground mb-4">
            Composição Diária — Custo · Comissão · Lucro
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDailyRevenue} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(280 15% 25% / 0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(280 15% 45%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(280 15% 45%)" }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(280 25% 12% / 0.95)",
                    border: "1px solid hsl(280 15% 22%)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "productCost" ? "Custo Produto" : name === "commission" ? "Comissão" : "Lucro",
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "productCost" ? "Custo Produto" : value === "commission" ? "Comissão" : "Lucro"
                  }
                />
                <Bar dataKey="productCost" stackId="a" fill="hsl(45 90% 55%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="commission" stackId="a" fill="hsl(30 90% 55%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="profit" stackId="a" fill="hsl(150 80% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ===== Transactions List ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-card border border-border/30 glass shadow-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/20">
            <h2 className="font-display text-base font-bold text-foreground">Atendimentos Recentes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Clique em um atendimento para ver a Anatomia do Lucro</p>
          </div>

          <div className="divide-y divide-border/10">
            {mockTransactions.map((t, i) => {
              const anatomy = getAnatomy(t);
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  onClick={() => setSelectedTransaction(t)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-primary/3 transition-colors group"
                >
                  {/* Professional Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                    {t.professional.slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">{t.service}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                        {paymentIcons[t.paymentMethod]}
                        {paymentLabels[t.paymentMethod]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.clientName} · {t.professional} · {t.date} {t.time}
                    </p>
                  </div>

                  {/* Price + margin */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{formatCurrency(t.price)}</p>
                    <p className="text-[11px] text-emerald-500 font-medium">
                      Margem {anatomy.margin.toFixed(0)}%
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* ===== Anatomy Drawer ===== */}
      {selectedTransaction && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTransaction(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] max-w-[90vw] bg-card border-l border-border/30 z-50 flex flex-col shadow-2xl"
          >
            <AnatomyDrawerContent
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
              getAnatomy={getAnatomy}
              formatCurrency={formatCurrency}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

/* ===== Anatomy Drawer Content ===== */
const AnatomyDrawerContent = ({
  transaction: t,
  onClose,
  getAnatomy,
  formatCurrency,
}: {
  transaction: Transaction;
  onClose: () => void;
  getAnatomy: (t: Transaction) => { tax: number; cardFee: number; commission: number; net: number; margin: number };
  formatCurrency: (v: number) => string;
}) => {
  const a = getAnatomy(t);

  const deductions = [
    {
      label: `Imposto (${(t.taxRate * 100).toFixed(0)}%)`,
      value: a.tax,
      icon: <Percent className="w-4 h-4" />,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: `Taxa Cartão (${(t.cardFeeRate * 100).toFixed(1)}%)`,
      value: a.cardFee,
      icon: <CreditCard className="w-4 h-4" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      hidden: t.cardFeeRate === 0,
    },
    {
      label: `Comissão ${t.professional} (${(t.commissionRate * 100).toFixed(0)}%)`,
      value: a.commission,
      icon: <Users className="w-4 h-4" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Custo de Produtos",
      value: t.productCost,
      icon: <Package className="w-4 h-4" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      detail: t.productDetails,
    },
  ].filter((d) => !d.hidden);

  const totalDeductions = a.tax + a.cardFee + a.commission + t.productCost;

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/20 flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Anatomia do Lucro</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Entenda para onde vai cada real</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Service info */}
        <div className="rounded-xl bg-muted/30 border border-border/20 p-4">
          <p className="text-sm font-bold text-foreground">{t.service}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t.clientName} · {t.professional} · {t.date} às {t.time}
          </p>
        </div>

        {/* Price */}
        <div className="text-center py-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Preço Cobrado</p>
          <p className="text-3xl font-bold text-foreground mt-1">{formatCurrency(t.price)}</p>
        </div>

        {/* Waterfall deductions */}
        <div className="space-y-2.5">
          {deductions.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`flex items-center gap-3 p-3.5 rounded-xl ${d.bgColor} border border-border/10`}
            >
              <div className={`p-2 rounded-lg bg-card/80 ${d.color}`}>
                {d.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <ArrowDown className="w-3 h-3 text-red-400" />
                  <span className="text-xs font-medium text-foreground">{d.label}</span>
                </div>
                {d.detail && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{d.detail}</p>
                )}
              </div>
              <span className={`text-sm font-bold ${d.color}`}>
                - {formatCurrency(d.value)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Separator */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 border-t border-dashed border-border/40" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total deduzido: {formatCurrency(totalDeductions)}</span>
          <div className="flex-1 border-t border-dashed border-border/40" />
        </div>

        {/* NET Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl p-5 bg-emerald-500/10 border-2 border-emerald-500/30"
        >
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl" />
          <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">
            💰 Sobrou no Bolso
          </p>
          <p className="text-3xl font-bold text-emerald-500 mt-1">
            {formatCurrency(a.net)}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Margem Real: {a.margin.toFixed(1)}%
            </span>
          </div>

          {/* Visual bar */}
          <div className="mt-4 h-3 rounded-full bg-card/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${a.margin}%` }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">0%</span>
            <span className="text-[10px] text-emerald-500 font-medium">{a.margin.toFixed(1)}%</span>
            <span className="text-[10px] text-muted-foreground">100%</span>
          </div>
        </motion.div>

        {/* Educational tip */}
        <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
          <p className="text-xs font-semibold text-primary mb-1">💡 Dica da Bella</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {a.margin < 35
              ? "Margem abaixo de 35%. Considere renegociar a taxa do cartão ou ajustar o preço do serviço para manter a rentabilidade."
              : a.margin < 50
                ? "Margem saudável! Para aumentar ainda mais, considere comprar produtos em maior quantidade para reduzir o custo unitário."
                : "Excelente margem! Este serviço é um dos mais rentáveis do salão. Continue assim! 🌟"
            }
          </p>
        </div>
      </div>
    </>
  );
};

export default Financeiro;
