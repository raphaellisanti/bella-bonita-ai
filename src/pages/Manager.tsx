import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Users, AlertTriangle, TrendingUp,
  Award, BarChart3, Send, ArrowRight, Sparkles, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StockInsights from "@/components/dashboard/StockInsights";

/* ===== Mock Data ===== */
const teamPerformance = [
  { name: "Bia", role: "Cabeleireira", appointments: 5, completed: 3, occupation: 90, avatar: "B" },
  { name: "Carol", role: "Manicure", appointments: 7, completed: 5, occupation: 95, avatar: "C" },
  { name: "Juliana", role: "Cabeleireira", appointments: 4, completed: 2, occupation: 70, avatar: "J" },
  { name: "Patrícia", role: "Esteticista", appointments: 3, completed: 1, occupation: 60, avatar: "P" },
];

const operationalStats = [
  { label: "Ocupação Hoje", value: "85%", icon: BarChart3, color: "text-primary" },
  { label: "Agendamentos", value: "19", icon: Calendar, color: "text-foreground" },
  { label: "No-Shows Hoje", value: "2", icon: AlertTriangle, color: "text-destructive" },
  { label: "Equipe Ativa", value: "4/5", icon: Users, color: "text-foreground" },
];

const Manager = () => {
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

  const topProfessional = teamPerformance.reduce((a, b) =>
    a.appointments > b.appointments ? a : b
  );

  return (
    <>
      {/* Decorative blobs are in ManagerLayout */}

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-20 glass border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Visão <span className="text-primary">Gerencial</span>
            </h1>
            <p className="text-xs text-muted-foreground">Salão BellaBonita</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-muted-foreground">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
              G
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* ===== BELLA INSIGHTS (Operational) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 text-primary-foreground bg-gradient-hero shadow-elegant overflow-hidden relative"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                Bella Insights · Operação
              </span>
            </div>
            <p className="text-xl md:text-2xl font-display font-bold mb-1">
              Agenda 85% preenchida hoje! 📋
            </p>
            <p className="text-sm opacity-80 mb-5 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              2 horários vagos às 13h e 17h — Bia e Juliana disponíveis
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm rounded-full"
                variant="outline"
              >
                <Send className="h-4 w-4 mr-1.5" />
                Preencher Horários
              </Button>
              <Button
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/15 backdrop-blur-sm rounded-full"
                variant="outline"
              >
                Ver Agenda
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ===== OPERATIONAL STATS ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalStats.map((stat) => (
            <Card key={stat.label} className="glass shadow-card border-border/30 transition-all hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column: Team Performance + Stock */}
          <div className="lg:col-span-3 space-y-6">
            {/* Team Performance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-5 shadow-card space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-foreground">Produtividade da Equipe</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  Mais solicitada: <span className="font-bold text-primary">{topProfessional.name}</span>
                </div>
              </div>

              <div className="space-y-3">
                {teamPerformance.map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/15 border border-border/10 hover:bg-muted/25 transition"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                      {member.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{member.name}</p>
                        <span className="text-[10px] text-muted-foreground">{member.role}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              member.occupation >= 80
                                ? "bg-primary"
                                : member.occupation >= 50
                                ? "bg-amber-500"
                                : "bg-destructive"
                            )}
                            style={{ width: `${member.occupation}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground w-8">
                          {member.occupation}%
                        </span>
                      </div>
                    </div>

                    {/* Appointment count */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">
                        {member.completed}/{member.appointments}
                      </p>
                      <p className="text-[10px] text-muted-foreground">concluídos</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stock insights */}
            <StockInsights />
          </div>

          {/* Right column: Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>
      </main>
    </>
  );
};

export default Manager;
