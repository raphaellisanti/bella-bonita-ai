import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Bot, Power } from "lucide-react";
import { CalendarEvent, professionals } from "./mockData";

interface Props {
  events: CalendarEvent[];
}

const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7h - 18h

const statusColors: Record<string, { bg: string; border: string; label: string }> = {
  confirmed: { bg: "bg-emerald-500/15", border: "border-emerald-500/40", label: "Confirmado" },
  pending: { bg: "bg-amber-500/15", border: "border-amber-500/40", label: "Pendente" },
  soft_lock: { bg: "bg-accent/15", border: "border-accent/40", label: "Soft Lock" },
};

const AgendaCalendar = ({ events }: Props) => {
  const [aiActive, setAiActive] = useState(true);
  const [view, setView] = useState<"day" | "week">("day");

  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const getEventStyle = (event: CalendarEvent) => {
    const top = (event.startHour - 7) * 64 + (event.startMinute / 60) * 64;
    const height = (event.durationMinutes / 60) * 64;
    return { top: `${top}px`, height: `${Math.max(height, 28)}px` };
  };

  const getColumnForProfessional = (name: string) => professionals.indexOf(name);

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden glass shadow-card border border-border/30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30 flex items-center gap-3 flex-wrap"
        style={{ background: "linear-gradient(135deg, hsl(320 80% 50% / 0.06), hsl(270 65% 50% / 0.03))" }}
      >
        {/* AI Toggle */}
        <button
          onClick={() => setAiActive(!aiActive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            aiActive
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {aiActive ? <Bot className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
          IA {aiActive ? "Ativa" : "Inativa"} no WhatsApp
        </button>

        {/* Date nav */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-xs font-medium text-foreground capitalize">{dateStr}</span>
          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg bg-muted/60 p-0.5">
          {(["day", "week"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {v === "day" ? "Dia" : "Semana"}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 flex items-center gap-4 border-b border-border/20">
        {Object.entries(statusColors).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${val.bg} border ${val.border} ${key === "soft_lock" ? "animate-pulse" : ""}`} />
            <span className="text-[10px] text-muted-foreground">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Professional headers */}
        <div className="sticky top-0 z-20 grid border-b border-border/30 bg-card/80 backdrop-blur-sm"
          style={{ gridTemplateColumns: `56px repeat(${professionals.length}, 1fr)` }}
        >
          <div className="px-2 py-2 text-[10px] text-muted-foreground font-medium border-r border-border/20">Hora</div>
          {professionals.map((p) => (
            <div key={p} className="px-2 py-2 text-[11px] font-semibold text-foreground text-center border-r border-border/10 last:border-r-0">
              {p}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative" style={{ gridTemplateColumns: `56px repeat(${professionals.length}, 1fr)` }}>
          {/* Hour rows */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid border-b border-border/15"
              style={{ gridTemplateColumns: `56px repeat(${professionals.length}, 1fr)`, height: "64px" }}
            >
              <div className="px-2 py-1 text-[10px] text-muted-foreground border-r border-border/20 font-medium">
                {String(hour).padStart(2, "0")}:00
              </div>
              {professionals.map((p) => (
                <div key={p} className="border-r border-border/10 last:border-r-0 relative" />
              ))}
            </div>
          ))}

          {/* Events overlay */}
          {events.map((event) => {
            const style = getEventStyle(event);
            const col = getColumnForProfessional(event.professional);
            const colCount = professionals.length;
            const sc = statusColors[event.status];

            // Calculate left position (skip the 56px time column)
            const leftPercent = ((col) / colCount) * 100;
            const widthPercent = (1 / colCount) * 100;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute rounded-lg px-2 py-1 border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${sc.bg} ${sc.border} ${event.status === "soft_lock" ? "animate-pulse" : ""}`}
                style={{
                  top: style.top,
                  height: style.height,
                  left: `calc(56px + ${leftPercent}% )`,
                  width: `calc(${widthPercent}% - 6px)`,
                  marginLeft: "3px",
                }}
              >
                <p className="text-[10px] font-semibold text-foreground truncate leading-tight">{event.clientName}</p>
                <p className="text-[9px] text-muted-foreground truncate">{event.service}</p>
                <p className="text-[8px] text-muted-foreground/70">
                  {String(event.startHour).padStart(2, "0")}:{String(event.startMinute).padStart(2, "0")}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgendaCalendar;
