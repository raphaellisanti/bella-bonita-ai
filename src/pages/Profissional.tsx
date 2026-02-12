import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Sparkles, Clock, CheckCircle2, Play, X,
  Calendar, Wallet, User, AlertCircle, Package, Minus, Plus,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  professionalProfile,
  professionalAppointments,
  checkoutProducts,
  type ProfessionalAppointment,
  type UsedProduct,
} from "@/components/profissional/mockProfissionalData";

type ProNavTab = "agenda" | "carteira" | "perfil";

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Profissional = () => {
  const navigate = useNavigate();
  const [hideValues, setHideValues] = useState(false);
  const [appointments, setAppointments] = useState(professionalAppointments);
  const [dismissedUpsells, setDismissedUpsells] = useState<string[]>([]);
  const [offeredUpsells, setOfferedUpsells] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState<ProfessionalAppointment | null>(null);
  const [checkoutUsedProducts, setCheckoutUsedProducts] = useState<UsedProduct[]>([]);
  const [upsellAccepted, setUpsellAccepted] = useState(false);
  const [showProductRequest, setShowProductRequest] = useState(false);
  const [productRequestText, setProductRequestText] = useState("");
  const [productRequestSent, setProductRequestSent] = useState(false);
  const [activeTab, setActiveTab] = useState<ProNavTab>("agenda");

  const prof = professionalProfile;
  const progressPct = Math.min((prof.dailyEarned / prof.dailyGoal) * 100, 100);

  const handleStartService = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "in_progress" as const } : a))
    );
  };

  const handleOpenCheckout = (apt: ProfessionalAppointment) => {
    setShowCheckout(apt);
    setCheckoutUsedProducts(checkoutProducts.slice(0, 3).map((p) => ({ ...p })));
    setUpsellAccepted(false);
  };

  const handleFinishCheckout = () => {
    if (showCheckout) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === showCheckout.id ? { ...a, status: "completed" as const } : a
        )
      );
      setShowCheckout(null);
    }
  };

  const updateProductQty = (idx: number, delta: number) => {
    setCheckoutUsedProducts((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
      )
    );
  };

  const sendProductRequest = () => {
    setProductRequestSent(true);
    setTimeout(() => {
      setShowProductRequest(false);
      setProductRequestSent(false);
      setProductRequestText("");
    }, 1500);
  };

  const nextAppointment = appointments.find(
    (a) => a.status === "waiting" || a.status === "in_progress"
  );

  const maskedValue = "R$ ---,--";

  // ===== CARTEIRA TAB =====
  const completedToday = appointments.filter((a) => a.status === "completed");
  const totalCommission = completedToday.reduce((s, a) => s + a.commission, 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* ===== HEADER MOTIVACIONAL ===== */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.4),transparent_60%)]" />
        <div className="relative z-10 px-5 pt-8 pb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-primary-foreground">
                Olá, {prof.name}! ✂️
              </h1>
              <p className="text-primary-foreground/70 text-sm mt-0.5">{prof.role}</p>
            </div>
            <button
              onClick={() => setHideValues(!hideValues)}
              className="p-2.5 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 transition"
            >
              {hideValues ? (
                <EyeOff className="w-5 h-5 text-primary-foreground/80" />
              ) : (
                <Eye className="w-5 h-5 text-primary-foreground/80" />
              )}
            </button>
          </div>

          {/* Daily commission card */}
          <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-xl border border-primary-foreground/15 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-primary-foreground/60 font-medium">Sua comissão hoje</p>
              <span className="text-[10px] bg-primary-foreground/15 text-primary-foreground/80 px-2 py-0.5 rounded-full font-medium">
                🔥 {prof.streak} dias seguidos
              </span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground tracking-tight">
              {hideValues ? maskedValue : formatCurrency(prof.dailyEarned)}
            </p>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-primary-foreground/60">
                <span>Meta diária</span>
                <span>{hideValues ? "---" : formatCurrency(prof.dailyGoal)}</span>
              </div>
              <div className="h-2 rounded-full bg-primary-foreground/15 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary-foreground"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-primary-foreground/50 text-right">
                {Math.round(progressPct)}% da meta
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ===== TAB CONTENT ===== */}
      <main className="px-4 py-4 space-y-4">
        {activeTab === "agenda" && (
          <>
            {/* Section title */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-sm text-foreground">Timeline do Dia</h2>
            </div>

            {/* Appointments timeline */}
            <div className="space-y-3">
              {appointments.map((apt) => {
                const isNext =
                  nextAppointment?.id === apt.id &&
                  (apt.status === "waiting" || apt.status === "in_progress");
                const isCompleted = apt.status === "completed";
                const isInProgress = apt.status === "in_progress";
                const hasUpsell =
                  apt.upsell &&
                  !dismissedUpsells.includes(apt.id) &&
                  isNext;

                return (
                  <div key={apt.id} className="space-y-0">
                    {/* Main appointment card */}
                    <motion.div
                      layout
                      className={cn(
                        "rounded-2xl border p-4 transition-all",
                        isNext
                          ? "bg-card border-primary/30 shadow-elegant"
                          : isCompleted
                          ? "bg-muted/30 border-border/20 opacity-70"
                          : "bg-card/60 border-border/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Client photo */}
                        <div
                          className={cn(
                            "w-14 h-14 rounded-2xl overflow-hidden border-2 shrink-0",
                            isNext ? "border-primary" : "border-border/30"
                          )}
                        >
                          <img
                            src={apt.clientPhoto}
                            alt={apt.clientName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-foreground truncate">
                              {apt.clientName}
                            </p>
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {apt.time} – {apt.endTime}
                          </p>
                          <p className="text-xs text-primary font-medium mt-0.5">
                            {apt.service}
                          </p>
                        </div>

                        {/* Commission */}
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">Comissão</p>
                          <p className="text-sm font-bold text-foreground">
                            {hideValues ? "---" : formatCurrency(apt.commission)}
                          </p>
                        </div>
                      </div>

                      {/* Action button for next/active */}
                      {isNext && (
                        <div className="mt-4">
                          {apt.status === "waiting" ? (
                            <Button
                              onClick={() => handleStartService(apt.id)}
                              className="w-full h-12 text-sm font-bold rounded-xl bg-gradient-hero text-primary-foreground shadow-elegant hover:opacity-90 transition"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Iniciar Atendimento
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleOpenCheckout(apt)}
                              className="w-full h-12 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Finalizar / Checkout
                            </Button>
                          )}
                        </div>
                      )}
                    </motion.div>

                    {/* AI Upsell card */}
                    {hasUpsell && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-3 rounded-b-2xl border border-t-0 border-primary/20 bg-gradient-to-b from-primary/5 to-accent/5 p-4 space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground leading-relaxed">
                              💡 <span className="font-bold">Dica da Bella:</span>{" "}
                              {apt.upsell!.suggestion}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setDismissedUpsells((prev) => [...prev, apt.id])
                            }
                            className="p-1 hover:bg-muted/40 rounded-lg transition shrink-0"
                          >
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            💰 + {formatCurrency(apt.upsell!.extraCommission)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => {
                              setOfferedUpsells((prev) => [...prev, apt.id]);
                              setDismissedUpsells((prev) => [...prev, apt.id]);
                            }}
                            className={cn(
                              "text-xs h-8 rounded-xl",
                              offeredUpsells.includes(apt.id)
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "bg-primary text-primary-foreground"
                            )}
                            disabled={offeredUpsells.includes(apt.id)}
                          >
                            {offeredUpsells.includes(apt.id)
                              ? "✓ Registrado"
                              : "Ofereci!"}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "carteira" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-sm text-foreground">Extrato de Ganhos</h2>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-5 shadow-card space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/30 border border-border/20 p-3">
                  <p className="text-[10px] text-muted-foreground">Hoje</p>
                  <p className="text-lg font-bold text-foreground">
                    {hideValues ? maskedValue : formatCurrency(totalCommission)}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/30 border border-border/20 p-3">
                  <p className="text-[10px] text-muted-foreground">Este mês</p>
                  <p className="text-lg font-bold text-foreground">
                    {hideValues ? maskedValue : formatCurrency(prof.monthlyEarned)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction list */}
            <div className="space-y-2">
              {completedToday.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum atendimento concluído ainda hoje.
                </p>
              )}
              {completedToday.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/20"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/30 shrink-0">
                    <img
                      src={apt.clientPhoto}
                      alt={apt.clientName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {apt.clientName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {apt.service} · {apt.time}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-500 shrink-0">
                    {hideValues ? "---" : `+${formatCurrency(apt.commission)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "perfil" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-sm text-foreground">Meu Perfil</h2>
            </div>

            <div className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-5 shadow-card space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {prof.name[0]}
                </div>
                <div>
                  <p className="font-bold text-foreground">{prof.name}</p>
                  <p className="text-sm text-muted-foreground">{prof.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/30 border border-border/20 p-3 text-center">
                  <p className="text-lg font-bold text-primary">#{prof.ranking}</p>
                  <p className="text-[10px] text-muted-foreground">Ranking do Salão</p>
                </div>
                <div className="rounded-xl bg-muted/30 border border-border/20 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">🔥 {prof.streak}</p>
                  <p className="text-[10px] text-muted-foreground">Dias Seguidos</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== FAB: Solicitar Produto ===== */}
      <button
        onClick={() => setShowProductRequest(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant flex items-center justify-center active:scale-95 transition-transform"
      >
        <Package className="w-6 h-6" />
      </button>

      {/* ===== BOTTOM NAV (Professional) ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/90 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center justify-around px-4 py-2">
          {([
            { key: "agenda" as ProNavTab, icon: Calendar, label: "Agenda" },
            { key: "carteira" as ProNavTab, icon: Wallet, label: "Carteira" },
            { key: "perfil" as ProNavTab, icon: User, label: "Perfil" },
          ]).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className={cn("w-6 h-6", isActive && "drop-shadow-sm")} />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ===== PRODUCT REQUEST MODAL ===== */}
      <AnimatePresence>
        {showProductRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end justify-center"
            onClick={() => !productRequestSent && setShowProductRequest(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-t-3xl bg-card border border-border/30 p-6 space-y-4"
            >
              <div className="w-10 h-1 rounded-full bg-muted mx-auto" />
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-foreground">Solicitar Produto</h3>
              </div>
              {productRequestSent ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="text-sm font-medium text-foreground">Solicitação enviada!</p>
                  <p className="text-xs text-muted-foreground">O estoque foi notificado.</p>
                </div>
              ) : (
                <>
                  <textarea
                    value={productRequestText}
                    onChange={(e) => setProductRequestText(e.target.value)}
                    placeholder="Ex: Acetona acabou na bancada 3..."
                    className="w-full h-24 rounded-xl bg-muted/30 border border-border/30 p-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/40"
                  />
                  <Button
                    onClick={sendProductRequest}
                    disabled={!productRequestText.trim()}
                    className="w-full h-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold"
                  >
                    🚨 Enviar Solicitação
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CHECKOUT MODAL ===== */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="w-full max-w-lg max-h-[85vh] rounded-t-3xl bg-card border border-border/30 flex flex-col"
            >
              <div className="p-5 border-b border-border/20 space-y-1">
                <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-3" />
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-foreground">
                    Checkout – {showCheckout.clientName}
                  </h3>
                  <button
                    onClick={() => setShowCheckout(null)}
                    className="p-1.5 rounded-lg hover:bg-muted/40 transition"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {showCheckout.service} · {showCheckout.time}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Products used */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Produtos Utilizados
                  </h4>
                  {checkoutUsedProducts.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/15"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {p.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateProductQty(i, -5)}
                          className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center hover:bg-muted/60 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-foreground w-12 text-center">
                          {p.quantity}
                          {p.unit}
                        </span>
                        <button
                          onClick={() => updateProductQty(i, 5)}
                          className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center hover:bg-muted/60 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upsell confirmation */}
                {showCheckout.upsell && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Upsell Sugerido pela IA
                    </h4>
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary shrink-0" />
                        <p className="text-xs text-foreground font-medium">
                          {showCheckout.upsell.productName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setUpsellAccepted(true)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border",
                            upsellAccepted
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-500"
                              : "bg-muted/30 border-border/30 text-foreground hover:border-emerald-500/30"
                          )}
                        >
                          ✅ Cliente aceitou
                        </button>
                        <button
                          onClick={() => setUpsellAccepted(false)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border",
                            !upsellAccepted
                              ? "bg-muted/40 border-border/40 text-muted-foreground"
                              : "bg-muted/20 border-border/20 text-muted-foreground/60"
                          )}
                        >
                          Não aceitou
                        </button>
                      </div>
                      {upsellAccepted && (
                        <p className="text-[10px] text-emerald-500 font-medium">
                          💰 + {formatCurrency(showCheckout.upsell.extraCommission)} na sua comissão!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Commission summary */}
                <div className="rounded-xl bg-muted/20 border border-border/15 p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Comissão do serviço</span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(showCheckout.commission)}
                    </span>
                  </div>
                  {upsellAccepted && showCheckout.upsell && (
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-500">Bônus upsell</span>
                      <span className="font-bold text-emerald-500">
                        +{formatCurrency(showCheckout.upsell.extraCommission)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-border/20 pt-2 flex justify-between text-sm">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(
                        showCheckout.commission +
                          (upsellAccepted && showCheckout.upsell
                            ? showCheckout.upsell.extraCommission
                            : 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm button */}
              <div className="p-5 border-t border-border/20">
                <Button
                  onClick={handleFinishCheckout}
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirmar e Finalizar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profissional;
