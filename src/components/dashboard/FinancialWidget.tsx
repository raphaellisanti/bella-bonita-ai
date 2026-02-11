import { DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const mockData = [
  { day: "Seg", receita: 1200, custo: 400 },
  { day: "Ter", receita: 980, custo: 350 },
  { day: "Qua", receita: 1500, custo: 480 },
  { day: "Qui", receita: 1350, custo: 420 },
  { day: "Sex", receita: 1800, custo: 500 },
  { day: "Sáb", receita: 2200, custo: 650 },
  { day: "Dom", receita: 600, custo: 200 },
];

const metrics = [
  { label: "Faturamento", value: "R$ 9.630", icon: DollarSign, trend: "+12%", up: true },
  { label: "Custos + Comissões", value: "R$ 3.000", icon: TrendingDown, trend: "-5%", up: false },
  { label: "Lucro Real", value: "R$ 6.630", icon: TrendingUp, trend: "+18%", up: true },
];

const FinancialWidget = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glass shadow-card border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Financeiro da Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mini chart */}
          <div className="h-32 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(320 80% 50%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(320 80% 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCusto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(270 65% 50%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(270 65% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(280 15% 45%)" }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid hsl(280 20% 90%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`R$ ${value}`, undefined]}
                />
                <Area type="monotone" dataKey="receita" stroke="hsl(320 80% 50%)" strokeWidth={2} fill="url(#gradReceita)" />
                <Area type="monotone" dataKey="custo" stroke="hsl(270 65% 50%)" strokeWidth={1.5} fill="url(#gradCusto)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-xs text-muted-foreground mb-0.5">{m.label}</p>
                <p className="text-sm font-bold text-foreground">{m.value}</p>
                <span className={`text-xs font-medium ${m.up ? "text-emerald-500" : "text-rose-400"}`}>
                  {m.trend}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FinancialWidget;
