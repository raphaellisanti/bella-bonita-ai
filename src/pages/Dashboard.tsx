import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Scissors, TrendingUp, LogOut, Sparkles } from "lucide-react";

const stats = [
  { label: "Agendamentos Hoje", value: "—", icon: Calendar, color: "text-primary" },
  { label: "Clientes Ativos", value: "—", icon: Users, color: "text-accent" },
  { label: "Serviços", value: "—", icon: Scissors, color: "text-primary" },
  { label: "Receita do Mês", value: "—", icon: TrendingUp, color: "text-accent" },
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Bella<span className="text-primary">Bonita</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Olá, {userName}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 rounded-2xl bg-gradient-hero p-8 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6" />
            <h2 className="font-display text-2xl font-bold">Bem-vindo ao seu painel</h2>
          </div>
          <p className="text-primary-foreground/80">
            Comece cadastrando seu salão para desbloquear todas as funcionalidades.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Funcionalidades de agenda, clientes, serviços e financeiro em breve.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
