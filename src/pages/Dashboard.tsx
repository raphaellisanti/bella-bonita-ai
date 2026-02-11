import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Scissors, TrendingUp, LogOut, Sparkles } from "lucide-react";

const stats = [
  { label: "Agendamentos Hoje", value: "—", icon: Calendar },
  { label: "Clientes Ativos", value: "—", icon: Users },
  { label: "Serviços", value: "—", icon: Scissors },
  { label: "Receita do Mês", value: "—", icon: TrendingUp },
];

const Dashboard = () => {
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
    <div className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(280 60% 96%), hsl(320 70% 95%), hsl(280 50% 98%))" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-20 blur-3xl" style={{ background: "hsl(320 80% 60%)" }} />
      <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-15 blur-3xl" style={{ background: "hsl(270 70% 55%)" }} />

      {/* Header */}
      <header className="relative z-10 border-b" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.3)" }}>
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="font-display text-2xl font-bold" style={{ color: "hsl(280 45% 25%)" }}>
            Bella<span style={{ color: "hsl(320 80% 50%)" }}>Bonita</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: "hsl(280 25% 45%)" }}>Olá, {userName}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container relative z-10 mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 rounded-2xl p-8 text-white"
          style={{ background: "linear-gradient(135deg, hsl(320 80% 50%), hsl(270 65% 50%))" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6" />
            <h2 className="font-display text-2xl font-bold">Bem-vindo ao seu painel</h2>
          </div>
          <p className="text-white/80">
            Comece cadastrando seu salão para desbloquear todas as funcionalidades.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 4px 20px -4px hsl(320 60% 50% / 0.1)",
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: "hsl(280 20% 45%)" }}>
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5" style={{ color: "hsl(320 80% 50%)" }} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" style={{ color: "hsl(280 45% 25%)" }}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder */}
        <div className="mt-12 text-center">
          <p style={{ color: "hsl(280 20% 55%)" }}>
            Funcionalidades de agenda, clientes, serviços e financeiro em breve.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
