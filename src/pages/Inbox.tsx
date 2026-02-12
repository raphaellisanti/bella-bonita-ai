import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockInboxContacts, InboxContact } from "@/components/inbox/mockInboxData";
import {
  Bot, User, Search, Send, Hand, Phone, Calendar,
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, MessageCircle,
  ChevronRight, Clock, Paperclip, Smile, Pause, Play,
  DollarSign, BarChart3, Repeat
} from "lucide-react";

type FilterType = "all" | "ai_talking" | "needs_attention" | "resolved";

const churnConfig = {
  low: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", label: "BAIXO 🟢", desc: "Cliente fiel e ativa" },
  medium: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", label: "MÉDIO 🟡", desc: "Frequência caindo" },
  high: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", label: "ALTO 🔴", desc: "" },
};

const statusConfig = {
  ai_talking: { label: "🤖 IA Falando", color: "bg-primary/15 text-primary border-primary/30" },
  needs_attention: { label: "⚠️ Atenção", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  resolved: { label: "✅ Finalizado", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
};

const Inbox = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedContact, setSelectedContact] = useState<InboxContact | null>(mockInboxContacts[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiPaused, setAiPaused] = useState(false);

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

  const filteredContacts = mockInboxContacts
    .filter((c) => {
      if (filter === "ai_talking") return c.status === "ai_talking";
      if (filter === "needs_attention") return c.status === "needs_attention";
      if (filter === "resolved") return c.status === "resolved";
      return true;
    })
    .filter((c) => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "ai_talking", label: "🤖 IA Falando" },
    { key: "needs_attention", label: "⚠️ Atenção" },
    { key: "resolved", label: "✅ Finalizados" },
  ];

  const getFilterCount = (key: FilterType) => {
    if (key === "all") return mockInboxContacts.length;
    return mockInboxContacts.filter((c) => c.status === key).length;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[350px] h-[350px] rounded-full opacity-12 blur-3xl bg-primary pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-8 blur-3xl bg-accent pointer-events-none" />

      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <main className="relative z-10 flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
        {/* ===== COLUNA 1: Lista de Contatos (25%) ===== */}
        <div className="w-[25%] min-w-[280px] max-w-[340px] border-r border-border/30 flex flex-col bg-card/40 backdrop-blur-md">
          {/* Search */}
          <div className="p-3 border-b border-border/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar contato..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/30 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="px-2 py-2 flex flex-wrap gap-1 border-b border-border/20">
            {filterButtons.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                  filter === f.key
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-muted-foreground hover:bg-muted/40 border-transparent"
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.key ? "bg-primary/20" : "bg-muted/60"}`}>
                  {getFilterCount(f.key)}
                </span>
              </button>
            ))}
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContact?.id === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => { setSelectedContact(contact); setAiPaused(false); }}
                  className={`w-full px-3 py-3.5 flex items-center gap-3 border-b border-border/10 text-left transition-all ${
                    isSelected
                      ? "bg-primary/8 border-l-[3px] border-l-primary"
                      : "hover:bg-muted/30 border-l-[3px] border-l-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xs font-bold text-foreground">
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-foreground truncate">{contact.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{contact.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${statusConfig[contact.status].color}`}>
                        {statusConfig[contact.status].label}
                      </span>
                      {/* Who is responding indicator */}
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                        {contact.respondedBy === "ai" ? <Bot className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                      </span>
                    </div>
                  </div>
                  {/* Unread dot */}
                  {contact.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== COLUNA 2: Área de Chat (50%) ===== */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3.5 border-b border-border/30 backdrop-blur-md bg-card/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xs font-bold text-foreground">
                      {selectedContact.avatar}
                    </div>
                    {selectedContact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selectedContact.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      {selectedContact.online ? (
                        <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online</span>
                      ) : (
                        <span>Offline</span>
                      )}
                      <span>·</span>
                      <Phone className="w-3 h-3" /> {selectedContact.phone}
                    </p>
                  </div>
                </div>
                {/* Pause/Resume AI toggle */}
                <button
                  onClick={() => setAiPaused(!aiPaused)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    aiPaused
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                  }`}
                >
                  {aiPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {aiPaused ? "Retomar IA" : "Pausar IA"}
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gradient-to-b from-background/50 to-background">
                <AnimatePresence>
                  {selectedContact.messages.map((msg, i) => {
                    const isClient = msg.sender === "client";
                    const isAi = msg.sender === "ai";
                    const isStaff = msg.sender === "staff";

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
                      >
                        {/* AI/Client avatar */}
                        {!isStaff && (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1">
                            {isAi ? (
                              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                                <Bot className="w-3.5 h-3.5 text-primary" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center text-[10px] font-bold text-foreground">
                                {selectedContact.avatar.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}

                        <div
                          className={`max-w-[65%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                            isClient
                              ? "bg-muted/50 text-foreground rounded-2xl rounded-bl-md"
                              : isAi
                                ? "bg-primary/10 text-foreground rounded-2xl rounded-bl-md border border-primary/15 backdrop-blur-sm"
                                : "bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 text-white rounded-2xl rounded-br-md shadow-lg shadow-fuchsia-500/20"
                          }`}
                        >
                          {!isClient && (
                            <span className="text-[10px] font-bold block mb-1.5">
                              {isAi ? (
                                <span className="text-primary">🤖 Bella IA</span>
                              ) : (
                                <span className="text-white/80">👤 Staff</span>
                              )}
                            </span>
                          )}
                          <p>{msg.text}</p>
                          <span className={`text-[10px] mt-1.5 block text-right ${isStaff ? "text-white/60" : "text-muted-foreground"}`}>
                            {msg.time}
                          </span>
                        </div>

                        {/* Staff avatar on right */}
                        {isStaff && (
                          <div className="w-7 h-7 rounded-full bg-fuchsia-500/20 flex items-center justify-center shrink-0 ml-2 mt-1">
                            <User className="w-3.5 h-3.5 text-fuchsia-400" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Chat Input Footer */}
              <div className="px-5 py-3.5 border-t border-border/30 bg-card/70 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-all shrink-0">
                    <Hand className="w-4 h-4" />
                    Assumir Conversa
                  </button>
                  <div className="flex-1 flex items-center gap-2 rounded-xl bg-muted/30 border border-border/30 px-4 py-2.5">
                    <Paperclip className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                    <input
                      readOnly
                      placeholder="Digite uma mensagem..."
                      className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                    />
                    <Smile className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                      <Send className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-14 h-14 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Selecione uma conversa</p>
                <p className="text-xs mt-1 opacity-60">Escolha um contato à esquerda</p>
              </div>
            </div>
          )}
        </div>

        {/* ===== COLUNA 3: CRM Contextual (25%) ===== */}
        <div className="w-[25%] min-w-[280px] max-w-[360px] border-l border-border/30 flex flex-col bg-card/30 backdrop-blur-md overflow-y-auto">
          {selectedContact ? (
            <div className="p-5 space-y-5">
              {/* Profile Card */}
              <div className="text-center pb-4 border-b border-border/20">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xl font-bold text-foreground mx-auto shadow-xl shadow-primary/10">
                  {selectedContact.avatar}
                </div>
                <h3 className="text-lg font-bold text-foreground mt-3">{selectedContact.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedContact.age} anos</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Phone className="w-3 h-3" /> {selectedContact.phone}
                </p>
              </div>

              {/* Value Metrics */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Métricas de Valor</h4>
                <div className="space-y-2">
                  <ValueMetric icon={<DollarSign className="w-4 h-4 text-emerald-400" />} label="LTV (Gasto Total)" value={`R$ ${selectedContact.ltv.toLocaleString("pt-BR")}`} />
                  <ValueMetric icon={<BarChart3 className="w-4 h-4 text-primary" />} label="Ticket Médio" value={`R$ ${selectedContact.averageTicket}`} />
                  <ValueMetric icon={<Repeat className="w-4 h-4 text-sky-400" />} label="Frequência" value={`A cada ${selectedContact.frequencyDays} dias`} />
                  <ValueMetric icon={<Calendar className="w-4 h-4 text-amber-400" />} label="Total de Visitas" value={`${selectedContact.totalVisits} visitas`} />
                </div>
              </div>

              {/* Churn Risk Alert */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl ${churnConfig[selectedContact.churnProbability].bg} border ${churnConfig[selectedContact.churnProbability].border}`}
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${churnConfig[selectedContact.churnProbability].text}`} />
                  <div>
                    <p className={`text-sm font-bold ${churnConfig[selectedContact.churnProbability].text}`}>
                      Risco de Churn: {churnConfig[selectedContact.churnProbability].label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {selectedContact.churnProbability === "high"
                        ? `Não vem há ${selectedContact.lastVisitDays} dias. Considere oferecer promoção especial.`
                        : selectedContact.churnProbability === "medium"
                          ? `Última visita há ${selectedContact.lastVisitDays} dias. Frequência está caindo.`
                          : churnConfig[selectedContact.churnProbability].desc}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Last Visit */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/20 border border-border/15">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Última visita:</span>
                <span className={`text-xs font-bold ${selectedContact.lastVisitDays > 30 ? "text-amber-400" : "text-foreground"}`}>
                  há {selectedContact.lastVisitDays} dias
                </span>
              </div>

              {/* Past Appointments History */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Últimos Serviços
                </h4>
                <div className="space-y-1.5">
                  {selectedContact.pastAppointments.slice(0, 3).map((apt, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/20 border border-border/10 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{apt.service}</p>
                        <p className="text-[10px] text-muted-foreground">{apt.date} · {apt.professional}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-fuchsia-600 text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                  <Calendar className="w-4 h-4" />
                  Agendar para {selectedContact.name.split(" ")[0]}
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted/40 text-foreground text-xs font-medium border border-border/30 hover:bg-muted/60 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Enviar Promoção
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-5">
              <div className="text-center text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Perfil do Cliente</p>
                <p className="text-xs mt-1 opacity-60">Selecione um contato para ver o CRM</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* Value metric row for CRM sidebar */
const ValueMetric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/20 border border-border/10">
    {icon}
    <div className="flex-1">
      <span className="text-[10px] text-muted-foreground block">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  </div>
);

export default Inbox;
