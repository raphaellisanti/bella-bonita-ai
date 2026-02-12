import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Bot, Power, Plus, Clock, User } from "lucide-react";
import { CalendarEvent } from "./mockData";
import { useTeam } from "@/contexts/TeamContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  events: CalendarEvent[];
}

const ROW_HEIGHT = 88;
const MOBILE_ROW_HEIGHT = 64;
const hours = Array.from({ length: 12 }, (_, i) => i + 7);
const COL_MIN_WIDTH = 180;

const statusColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
  confirmed: { bg: "bg-emerald-500/10", border: "border-l-emerald-500", text: "text-emerald-700 dark:text-emerald-400", label: "Confirmado" },
  pending: { bg: "bg-amber-500/10", border: "border-l-amber-500", text: "text-amber-700 dark:text-amber-400", label: "Pendente" },
  soft_lock: { bg: "bg-violet-500/10", border: "border-l-violet-500", text: "text-violet-700 dark:text-violet-400", label: "Soft Lock" },
};

const colorPalette = [
  "from-pink-500/20 to-rose-500/10",
  "from-blue-500/20 to-indigo-500/10",
  "from-teal-500/20 to-emerald-500/10",
  "from-amber-500/20 to-orange-500/10",
  "from-violet-500/20 to-purple-500/10",
  "from-cyan-500/20 to-sky-500/10",
  "from-lime-500/20 to-green-500/10",
  "from-fuchsia-500/20 to-pink-500/10",
];

const AgendaCalendar = ({ events }: Props) => {
  const { professionals: teamProfessionals } = useTeam();
  const [aiActive, setAiActive] = useState(true);
  const [view, setView] = useState<"day" | "week">("day");
  const [selectedProfessional, setSelectedProfessional] = useState<number>(0);
  const isMobile = useIsMobile();

  const professionalNames = teamProfessionals.map(p => p.name.split(" ")[0]);
  const getProfessionalColor = (index: number) => colorPalette[index % colorPalette.length];

  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const rowHeight = isMobile ? MOBILE_ROW_HEIGHT : ROW_HEIGHT;

  const getEventStyle = (event: CalendarEvent) => {
    const top = (event.startHour - 7) * rowHeight + (event.startMinute / 60) * rowHeight;
    const height = (event.durationMinutes / 60) * rowHeight;
    return { top: `${top}px`, height: `${Math.max(height, 40)}px` };
  };

  const getColumnForProfessional = (name: string) => {
    const idx = professionalNames.indexOf(name);
    return idx >= 0 ? idx : -1;
  };

  const colCount = professionalNames.length;
  const totalAppointments = events.filter(e => getColumnForProfessional(e.professional) >= 0).length;
  const confirmedCount = events.filter(e => e.status === "confirmed" && getColumnForProfessional(e.professional) >= 0).length;
  const pendingCount = events.filter(e => e.status === "pending" && getColumnForProfessional(e.professional) >= 0).length;
  const aiBookedCount = events.filter(e => e.bookedBy === "ai" && getColumnForProfessional(e.professional) >= 0).length;

  const gridMinWidth = isMobile ? 0 : 72 + colCount * COL_MIN_WIDTH;

  // Mobile: filter events for selected professional
  const mobileEvents = isMobile
    ? events.filter(e => getColumnForProfessional(e.professional) === selectedProfessional)
    : events;

  if (colCount === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm p-8 bg-card rounded-2xl border border-border/40">
        <div className="text-center">
          <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum profissional cadastrado</p>
          <p className="text-xs mt-1">Adicione membros da equipe nas Configurações para vê-los aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden bg-card shadow-lg border border-border/40">
      {/* Top Bar */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-b border-border/30 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <h2 className="text-sm md:text-lg font-bold text-foreground capitalize truncate">{dateStr}</h2>
            <div className="flex items-center gap-2 md:gap-4 mt-0.5 flex-wrap">
              <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {totalAppointments}
              </span>
              <span className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400">✓ {confirmedCount}</span>
              <span className="text-[10px] md:text-xs text-amber-600 dark:text-amber-400">⏳ {pendingCount}</span>
              <span className="text-[10px] md:text-xs text-primary flex items-center gap-1">
                <Bot className="w-3 h-3" /> {aiBookedCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setAiActive(!aiActive)}
              className={`flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                aiActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {aiActive ? <Bot className="w-3 h-3" /> : <Power className="w-3 h-3" />}
              <span className="hidden sm:inline">IA {aiActive ? "Ativa" : "Off"}</span>
            </button>

            <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/30">
              <button className="p-1 md:p-1.5 rounded-md hover:bg-card transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <span className="px-1.5 md:px-3 text-[10px] md:text-xs font-medium text-foreground">Hoje</span>
              <button className="p-1 md:p-1.5 rounded-md hover:bg-card transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {!isMobile && (
              <div className="flex rounded-lg bg-muted/50 p-0.5 border border-border/30">
                {(["day", "week"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v === "day" ? "Dia" : "Semana"}
                  </button>
                ))}
              </div>
            )}

            <button className="flex items-center gap-1 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg bg-primary text-primary-foreground text-[10px] md:text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="hidden sm:inline">Novo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Professional selector tabs */}
      {isMobile && colCount > 0 && (
        <div className="flex gap-1 px-3 py-2 border-b border-border/20 bg-muted/10 overflow-x-auto">
          {professionalNames.map((p, i) => (
            <button
              key={p}
              onClick={() => setSelectedProfessional(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedProfessional === i
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted/30 border border-transparent"
              }`}
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${getProfessionalColor(i)}`} />
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Desktop: Legend */}
      {!isMobile && (
        <div className="px-6 py-2.5 flex items-center justify-between border-b border-border/20 bg-muted/20 flex-wrap gap-2">
          <div className="flex items-center gap-6">
            {Object.entries(statusColors).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${val.bg} border-l-2 ${val.border}`} />
                <span className="text-[11px] text-muted-foreground font-medium">{val.label}</span>
              </div>
            ))}
            <div className="w-px h-4 bg-border/40" />
            <div className="flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-primary" />
              <span className="text-[11px] text-muted-foreground">IA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Manual</span>
            </div>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            {professionalNames.map((p, i) => (
              <div key={p} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${getProfessionalColor(i)}`} />
                <span className="text-[11px] text-muted-foreground">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto min-h-0">
        {isMobile ? (
          /* ===== MOBILE: Single-column timeline ===== */
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex border-b border-border/10"
                style={{ height: `${MOBILE_ROW_HEIGHT}px` }}
              >
                <div className="w-12 shrink-0 px-2 py-1.5 text-[10px] text-muted-foreground/80 font-mono font-medium border-r border-border/15 bg-card/80">
                  {String(hour).padStart(2, "0")}:00
                </div>
                <div className="flex-1 relative" />
              </div>
            ))}

            {/* Events for selected professional */}
            {mobileEvents.map((event) => {
              const style = getEventStyle(event);
              const sc = statusColors[event.status];
              const isSoftLock = event.status === "soft_lock";

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`absolute rounded-lg px-2.5 py-1.5 border-l-3 cursor-pointer transition-all ${sc.bg} ${sc.border} ${isSoftLock ? "animate-pulse" : ""}`}
                  style={{
                    top: style.top,
                    height: style.height,
                    left: "52px",
                    right: "8px",
                    borderLeftWidth: "3px",
                  }}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-semibold text-foreground truncate leading-tight">{event.clientName}</p>
                    <span className="shrink-0 text-xs leading-none">
                      {event.bookedBy === "ai" ? "🤖" : "👤"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{event.service}</p>
                  <p className={`text-[9px] font-medium ${sc.text}`}>
                    {String(event.startHour).padStart(2, "0")}:{String(event.startMinute).padStart(2, "0")} · {event.durationMinutes}min
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ===== DESKTOP: Multi-column grid ===== */
          <div style={{ minWidth: `${gridMinWidth}px` }}>
            <div
              className="sticky top-0 z-20 grid border-b border-border/30 bg-card/95 backdrop-blur-sm"
              style={{ gridTemplateColumns: `72px repeat(${colCount}, 1fr)` }}
            >
              <div className="px-3 py-3 text-[11px] text-muted-foreground font-medium border-r border-border/20 flex items-center sticky left-0 bg-card/95 backdrop-blur-sm z-10">
                <Clock className="w-3.5 h-3.5 mr-1.5" /> Hora
              </div>
              {professionalNames.map((p, i) => (
                <div key={p} className={`px-4 py-3 text-center border-r border-border/10 last:border-r-0 bg-gradient-to-b ${getProfessionalColor(i)}`}>
                  <span className="text-sm font-semibold text-foreground">{p}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {teamProfessionals[i]?.specialties?.slice(0, 2).join(", ") || teamProfessionals[i]?.role}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid border-b border-border/10 hover:bg-muted/5 transition-colors"
                  style={{ gridTemplateColumns: `72px repeat(${colCount}, 1fr)`, height: `${ROW_HEIGHT}px` }}
                >
                  <div className="px-3 py-2 text-xs text-muted-foreground/80 border-r border-border/15 font-mono font-medium sticky left-0 bg-card/80 backdrop-blur-sm z-10">
                    {String(hour).padStart(2, "0")}:00
                  </div>
                  {professionalNames.map((p) => (
                    <div key={p} className="border-r border-border/8 last:border-r-0 relative cursor-pointer hover:bg-primary/3 transition-colors" />
                  ))}
                </div>
              ))}

              {events.map((event) => {
                const style = getEventStyle(event);
                const col = getColumnForProfessional(event.professional);
                if (col < 0) return null;
                const sc = statusColors[event.status];
                const isSoftLock = event.status === "soft_lock";

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: col * 0.05 }}
                    className={`absolute rounded-lg px-3 py-2 border-l-3 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] ${sc.bg} ${sc.border} ${isSoftLock ? "animate-pulse" : ""}`}
                    style={{
                      top: style.top,
                      height: style.height,
                      left: `calc(72px + (100% - 72px) * ${col / colCount} + 4px)`,
                      width: `calc((100% - 72px) / ${colCount} - 8px)`,
                      borderLeftWidth: "3px",
                    }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-foreground truncate leading-tight">{event.clientName}</p>
                      <span className="shrink-0 text-sm leading-none" title={event.bookedBy === "ai" ? "Agendado pela IA" : "Agendamento manual"}>
                        {event.bookedBy === "ai" ? "🤖" : "👤"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{event.service}</p>
                    <p className={`text-[10px] mt-0.5 font-medium ${sc.text}`}>
                      {String(event.startHour).padStart(2, "0")}:{String(event.startMinute).padStart(2, "0")} · {event.durationMinutes}min
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaCalendar;
