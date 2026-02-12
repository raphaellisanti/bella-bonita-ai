import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { mockInboxContacts, InboxContact } from "@/components/inbox/mockInboxData";
import {
  Bot, User, Search, Send, Hand, Phone, Calendar,
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, MessageCircle,
  ChevronRight, Clock, Paperclip, Smile, Pause, Play,
  DollarSign, BarChart3, Repeat
} from "lucide-react";

type FilterType = "all" | "ai_talking" | "needs_attention" | "resolved";

const statusConfig = {
  ai_talking: { label: "🤖 IA Falando", color: "bg-primary/15 text-primary border-primary/30" },
  needs_attention: { label: "⚠️ Atenção", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  resolved: { label: "✅ Finalizado", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
};

const ManagerInbox = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<InboxContact[]>(mockInboxContacts);
  const [selectedContact, setSelectedContact] = useState<InboxContact | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth");
    };
    checkAuth();
  }, [navigate]);

  const filtered = contacts.filter(c => {
    const matchFilter = filter === "all" || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <header className="sticky top-0 z-20 glass border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Inbox <span className="text-primary">Gerencial</span>
            </h1>
            <p className="text-xs text-muted-foreground">Salão BellaBonita</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
            G
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8 py-4 max-w-7xl mx-auto">
        {/* Search & filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar contato..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-card/60 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
          {(["all", "ai_talking", "needs_attention", "resolved"] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/60 text-muted-foreground border-border/30 hover:border-primary/40"
              }`}
            >
              {f === "all" ? "Todos" : statusConfig[f].label}
            </button>
          ))}
        </div>

        {/* Contact list */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(contact => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border/30 bg-card/80 backdrop-blur-xl p-4 shadow-card cursor-pointer hover:-translate-y-0.5 transition-all"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    •
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
};

export default ManagerInbox;
