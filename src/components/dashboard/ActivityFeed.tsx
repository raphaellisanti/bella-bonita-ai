import { MessageSquare, Clock, User, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const mockActivities = [
  { id: 1, client: "Maria Silva", service: "Corte + Escova", time: "14:30", via: "WhatsApp", status: "confirmed" },
  { id: 2, client: "Ana Costa", service: "Coloração", time: "15:00", via: "WhatsApp", status: "pending" },
  { id: 3, client: "Juliana Reis", service: "Manicure", time: "15:30", via: "App", status: "confirmed" },
  { id: 4, client: "Camila Souza", service: "Hidratação", time: "16:00", via: "WhatsApp", status: "pending" },
  { id: 5, client: "Patrícia Lima", service: "Escova Progressiva", time: "16:30", via: "WhatsApp", status: "confirmed" },
];

const ActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass shadow-card border-border/30 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Atividades em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-4">
          {mockActivities.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary/40 transition-colors group"
            >
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.client}</p>
                <p className="text-xs text-muted-foreground truncate">{a.service}</p>
              </div>

              {/* Meta */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {a.time}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {a.status === "confirmed" ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                  )}
                  <span className="text-[10px] text-muted-foreground">{a.via}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityFeed;
