import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, Scissors, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BottomNav from "@/components/BottomNav";
import BellaInsights from "@/components/dashboard/BellaInsights";
import FinancialWidget from "@/components/dashboard/FinancialWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StockInsights from "@/components/dashboard/StockInsights";

const quickStats = [
  { label: "Agendamentos Hoje", value: "12", icon: Calendar },
  { label: "Clientes Ativos", value: "248", icon: Users },
  { label: "Serviços", value: "18", icon: Scissors },
  { label: "Receita do Mês", value: "R$ 24k", icon: TrendingUp },
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
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-15 blur-3xl bg-primary" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] rounded-full opacity-10 blur-3xl bg-accent" />

      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <main className="relative z-10 px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* Bella Insights - full width */}
        <BellaInsights />

        {/* Quick stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="glass shadow-card border-border/30 transition-all hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main grid: Financial + Activity + Stock */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <FinancialWidget />
            <StockInsights />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
