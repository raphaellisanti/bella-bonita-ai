import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockInboxContacts, InboxContact } from "@/components/inbox/mockInboxData";
import {
  Bot, User, Search, Filter, Send, Hand, Phone, Calendar,
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, MessageCircle,
  ChevronRight, Clock
} from "lucide-react";

type FilterType = "all" | "needs_attention" | "ai_talking";

const churnColors = {
  low: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", label: "Baixa", icon: TrendingDown },
  medium: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", label: "Média", icon: AlertTriangle },
  high: { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", label: "Alta 🔴", icon: TrendingUp },
};

const statusConfig = {
  ai_talking: { label: "IA Falando", color: "bg-primary/20 text-primary", icon: Bot },
  needs_attention: { label: "Atenção", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400", icon: AlertTriangle },
  resolved: { label: "Resolvido", color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
};

const Inbox = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedContact, setSelectedContact] = useState<InboxContact | null>(mockInboxContacts[0]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredContacts = mockInboxContacts.filter((c) => {
    if (filter === "needs_attention") return c.status === "needs_attention";
    if (filter === "ai_talking") return c.status === "ai_talking";
    return true;
  }).filter((c) =>
    searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: mockInboxContacts.length },
    { key: "needs_attention", label: "Atenção", count: mockInboxContacts.filter(c => c.status === "needs_attention").length },
    { key: "ai_talking", label: "IA Falando", count: mockInboxContacts.filter(c => c.status === "ai_talking").length },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-15 blur-3xl bg-primary" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-10 blur-3xl bg-accent" />

      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <main className="relative z-10 flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
        {/* ===== Column 1: Contact List (25%) ===== */}
        <div className="w-[320px] min-w-[280px] border-r border-border/30 flex flex-col bg-card/50 backdrop-blur-sm">
          {/* Search */}
          <div className="p-3 border-b border-border/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar contato..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/50 border border-border/30 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="px-3 py-2 flex gap-1.5 border-b border-border/20">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  filter === f.key
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-muted/50 border border-transparent"
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === f.key ? "bg-primary/20" : "bg-muted"
                }`}>{f.count}</span>
              </button>
            ))}
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => {
              const st = statusConfig[contact.status];
              const isSelected = selectedContact?.id === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full px-3 py-3 flex items-center gap-3 border-b border-border/10 text-left transition-all ${
                    isSelected
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : "hover:bg-muted/30 border-l-2 border-l-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                    {contact.avatar}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-foreground truncate">{contact.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{contact.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${st.color}`}>
                        <st.icon className="w-2.5 h-2.5" />
                        {st.label}
                      </span>
                    </div>
                  </div>
                  {/* Unread indicator */}
                  {contact.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Column 2: Chat Area (50%) ===== */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between glass">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-foreground">
                    {selectedContact.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selectedContact.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {selectedContact.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedContact.respondedBy === "ai" && (
                    <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      <Bot className="w-3 h-3" /> IA respondendo
                    </span>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <AnimatePresence>
                  {selectedContact.messages.map((msg, i) => {
                    const isClient = msg.sender === "client";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex ${isClient ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                            isClient
                              ? "bg-muted/60 text-foreground rounded-bl-md"
                              : msg.sender === "ai"
                                ? "bg-primary/12 text-foreground rounded-br-md border border-primary/15"
                                : "bg-card text-foreground rounded-br-md border border-border/30 shadow-sm"
                          }`}
                        >
                          {!isClient && (
                            <span className="text-[10px] font-semibold block mb-1 flex items-center gap-1">
                              {msg.sender === "ai" ? (
                                <><Bot className="w-3 h-3 text-primary" /> <span className="text-primary">Bella IA</span></>
                              ) : (
                                <><User className="w-3 h-3 text-muted-foreground" /> <span className="text-muted-foreground">Staff</span></>
                              )}
                            </span>
                          )}
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className="text-[10px] text-muted-foreground mt-1.5 block text-right">{msg.time}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Chat Footer */}
              <div className="px-5 py-3 border-t border-border/30 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-all">
                    <Hand className="w-4 h-4" />
                    Assumir Conversa
                  </button>
                  <div className="flex-1 flex items-center gap-2 rounded-xl bg-muted/40 border border-border/30 px-4 py-2.5">
                    <input
                      readOnly
                      placeholder="Digite uma mensagem..."
                      className="flex-1 bg-transparent text-sm outline-none text-muted-foreground placeholder:text-muted-foreground/50"
                    />
                    <Send className="w-4 h-4 text-primary cursor-pointer" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Selecione uma conversa</p>
              </div>
            </div>
          )}
        </div>

        {/* ===== Column 3: Client CRM Context (25%) ===== */}
        <div className="w-[320px] min-w-[280px] border-l border-border/30 flex flex-col bg-card/30 backdrop-blur-sm overflow-y-auto">
          {selectedContact ? (
            <div className="p-5 space-y-5">
              {/* Client Profile */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-lg font-bold text-foreground mx-auto shadow-lg">
                  {selectedContact.avatar}
                </div>
                <h3 className="text-base font-bold text-foreground mt-3">{selectedContact.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Phone className="w-3 h-3" /> {selectedContact.phone}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <MetricCard
                  label="Última Visita"
                  value={`há ${selectedContact.lastVisitDays} dias`}
                  icon={<Clock className="w-3.5 h-3.5" />}
                  highlight={selectedContact.lastVisitDays > 30}
                />
                <MetricCard
                  label="Prob. Churn"
                  value={churnColors[selectedContact.churnProbability].label}
                  icon={(() => { const ChurnIcon = churnColors[selectedContact.churnProbability].icon; return <ChurnIcon className="w-3.5 h-3.5" />; })()}
                  colorClass={churnColors[selectedContact.churnProbability].text}
                />
                <MetricCard
                  label="Ticket Médio"
                  value={`R$ ${selectedContact.averageTicket}`}
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                />
                <MetricCard
                  label="Total Visitas"
                  value={String(selectedContact.totalVisits)}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
              </div>

              {/* Churn Alert */}
              {selectedContact.churnProbability === "high" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400">Risco de Churn Alto</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Última visita há {selectedContact.lastVisitDays} dias. Considere oferecer promoção ou pacote especial.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Past Appointments */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Histórico de Agendamentos
                </h4>
                <div className="space-y-2">
                  {selectedContact.pastAppointments.map((apt, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/15">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{apt.service}</p>
                        <p className="text-[10px] text-muted-foreground">{apt.date} · {apt.professional}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  <Calendar className="w-4 h-4" />
                  Agendar para {selectedContact.name.split(" ")[0]}
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 text-foreground text-xs font-medium border border-border/30 hover:bg-muted transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Enviar Promoção
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-5">
              <div className="text-center text-muted-foreground">
                <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Selecione um contato para ver o perfil</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* Small metric card component */
const MetricCard = ({
  label,
  value,
  icon,
  highlight,
  colorClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
  colorClass?: string;
}) => (
  <div className={`p-3 rounded-xl border ${highlight ? "bg-amber-500/8 border-amber-500/20" : "bg-muted/20 border-border/20"}`}>
    <div className="flex items-center gap-1 text-muted-foreground mb-1">
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
    <p className={`text-sm font-bold ${colorClass || "text-foreground"}`}>{value}</p>
  </div>
);

export default Inbox;
