import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import WhatsAppChat from "@/components/agenda/WhatsAppChat";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import { mockConversations, mockCalendarEvents } from "@/components/agenda/mockData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useState } from "react";

const Agenda = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

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

      <main className="relative z-10 px-4 md:px-6 py-4 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Calendar - Top */}
          <div style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}>
            <AgendaCalendar events={mockCalendarEvents} />
          </div>

          {/* WhatsApp Chat - Bottom */}
          <div className="h-[40vh] min-h-[320px]">
            <WhatsAppChat conversations={mockConversations} />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Agenda;
