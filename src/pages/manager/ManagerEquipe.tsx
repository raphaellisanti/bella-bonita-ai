import { motion } from "framer-motion";
import { Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const teamPerformance = [
  { name: "Bia", role: "Cabeleireira", appointments: 5, completed: 3, occupation: 90, avatar: "B" },
  { name: "Carol", role: "Manicure", appointments: 7, completed: 5, occupation: 95, avatar: "C" },
  { name: "Juliana", role: "Cabeleireira", appointments: 4, completed: 2, occupation: 70, avatar: "J" },
  { name: "Patrícia", role: "Esteticista", appointments: 3, completed: 1, occupation: 60, avatar: "P" },
];

const ManagerEquipe = () => {
  const topProfessional = teamPerformance.reduce((a, b) =>
    a.appointments > b.appointments ? a : b
  );

  return (
    <>
      <header className="sticky top-0 z-20 glass border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Equipe <span className="text-primary">Gerencial</span>
            </h1>
            <p className="text-xs text-muted-foreground">Salão BellaBonita</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
            G
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
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
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/15 border border-border/10 hover:bg-muted/25 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {member.avatar}
                </div>
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
      </main>
    </>
  );
};

export default ManagerEquipe;
