import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import { mockCalendarEvents } from "@/components/agenda/mockData";
import { Bot, X, Eye } from "lucide-react";

const ManagerAgenda = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserName(user.user_metadata?.full_name || user.email || "");
    };
    checkAuth();
  }, [navigate]);

  return (
    <>
      <header className="sticky top-0 z-20 glass border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Agenda <span className="text-primary">Gerencial</span>
            </h1>
            <p className="text-xs text-muted-foreground">Salão BellaBonita</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
            G
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-6 py-4 max-w-[1800px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div style={{ height: "calc(100vh - 140px)", minHeight: "550px" }}>
            <AgendaCalendar events={mockCalendarEvents} />
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default ManagerAgenda;
