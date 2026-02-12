import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import { mockCalendarEvents } from "@/components/agenda/mockData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Bot, X, Eye } from "lucide-react";

interface AINotification {
  id: string;
  clientName: string;
  time: string;
  service: string;
}

const Agenda = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState<AINotification[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserName(user.user_metadata?.full_name || user.email || "");
    };
    checkAuth();
  }, [navigate]);

  // Simulate AI booking notification after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([{
        id: "n1",
        clientName: "Maria Silva",
        time: "14:00",
        service: "Corte Feminino",
      }]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-15 blur-3xl bg-primary" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-10 blur-3xl bg-accent" />

      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <main className="relative z-10 px-4 md:px-6 py-4 max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div style={{ height: "calc(100vh - 140px)", minHeight: "550px" }}>
            <AgendaCalendar events={mockCalendarEvents} />
          </div>
        </motion.div>
      </main>

      {/* Floating AI Notification Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-primary/30 shadow-xl backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  🤖 Bella agendou <span className="font-bold">{n.clientName}</span> para às {n.time}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.service}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-primary">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => dismissNotification(n.id)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Agenda;
