import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowLeft, Calendar, Copy, Send, Lightbulb,
  Target, Smile, Zap, Heart, TrendingUp, Clock, CheckCircle2,
  Image as ImageIcon, Instagram, Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const objectives = [
  { id: "agenda", label: "Preencher Agenda", icon: Calendar },
  { id: "servico", label: "Divulgar Novo Serviço", icon: Megaphone },
  { id: "dica", label: "Dica de Beleza", icon: Heart },
  { id: "engajamento", label: "Engajamento", icon: TrendingUp },
];

const vibes = [
  { id: "elegante", label: "Elegante", emoji: "✨" },
  { id: "divertida", label: "Divertida", emoji: "🎉" },
  { id: "urgente", label: "Urgente", emoji: "🔥" },
];

const generatedTexts: Record<string, Record<string, { caption: string; overlay: string }>> = {
  agenda: {
    elegante: {
      caption: "Sua beleza merece um espaço na nossa agenda. ✨ Terça-feira com horários exclusivos e condições especiais para você brilhar. Agende já pelo link na bio.",
      overlay: "Terça Exclusiva — Agende Já",
    },
    divertida: {
      caption: "Meninas, terça é dia de ficar loira! 👱‍♀️ Apenas 2 horários vagos com condição especial. Corre que é por tempo limitado! 🏃‍♀️💨",
      overlay: "Terça do Loiro — 15% OFF",
    },
    urgente: {
      caption: "⚡ ÚLTIMOS HORÁRIOS! Terça-feira quase lotada. Garanta seu horário AGORA antes que acabe. Link na bio! ⏰",
      overlay: "ÚLTIMOS HORÁRIOS — Corra!",
    },
  },
  servico: {
    elegante: {
      caption: "Apresentamos nosso novo tratamento de Botox Capilar Premium. Fios restaurados, brilho intenso e resultado imediato. Agende sua transformação. 💎",
      overlay: "Novo: Botox Capilar Premium",
    },
    divertida: {
      caption: "Novidade quentíssima! 🔥 Botox Capilar que deixa o cabelo tipo comercial de shampoo, sabe? Vem testar! 💁‍♀️",
      overlay: "NOVO! Botox Capilar 💁‍♀️",
    },
    urgente: {
      caption: "🚨 LANÇAMENTO! Primeiras 10 clientes ganham 20% OFF no Botox Capilar Premium. Vagas limitadíssimas!",
      overlay: "LANÇAMENTO — 20% OFF",
    },
  },
  dica: {
    elegante: {
      caption: "Dica da especialista: hidratar os fios semanalmente preserva a cor e o brilho por muito mais tempo. Cuide-se com quem entende. 🌿",
      overlay: "Dica: Hidratação Semanal",
    },
    divertida: {
      caption: "Dica de milhões: quer cabelo de diva? Hidratação toda semana! 💆‍♀️ Seu cabelo vai te agradecer (e todo mundo vai elogiar 😏).",
      overlay: "Dica de Diva 💆‍♀️",
    },
    urgente: {
      caption: "⚠️ ATENÇÃO: O sol do verão está destruindo seu cabelo! Agende uma hidratação urgente e salve seus fios antes que seja tarde!",
      overlay: "SOS Cabelo — Hidrate JÁ",
    },
  },
  engajamento: {
    elegante: {
      caption: "Qual look combina mais com você? A) Morena Iluminada ☕ B) Loiro Champagne 🥂 Conte nos comentários! 💬",
      overlay: "Qual é o seu estilo?",
    },
    divertida: {
      caption: "DESAFIO! 🎯 Marca aquela amiga que tá precisando de um dia de salão URGENTE! 😂 A mais marcada ganha um desconto especial!",
      overlay: "Marca a Amiga! 😂",
    },
    urgente: {
      caption: "📊 ENQUETE RELÂMPAGO: Qual serviço você quer em PROMOÇÃO essa semana? Comente 1, 2 ou 3! Mais votado ganha desconto!",
      overlay: "ENQUETE — Vote Agora!",
    },
  },
};

const scheduledPosts = [
  { id: 1, date: "Ter 14/01", time: "10:00", type: "Feed", status: "agendado", title: "Promoção Terça" },
  { id: 2, date: "Qua 15/01", time: "14:00", type: "Stories", status: "agendado", title: "Dica Capilar" },
  { id: 3, date: "Sex 17/01", time: "18:00", type: "Feed", status: "rascunho", title: "Novo Serviço" },
  { id: 4, date: "Sáb 18/01", time: "09:00", type: "Reels", status: "agendado", title: "Antes & Depois" },
];

const Marketing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentContent = selectedObjective && selectedVibe
    ? generatedTexts[selectedObjective]?.[selectedVibe]
    : null;

  const handleGenerate = () => {
    if (!selectedObjective || !selectedVibe) {
      toast({ title: "Selecione um objetivo e uma vibe", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      toast({ title: "🤖 Sugestão gerada!", description: "Confira o preview no simulador." });
    }, 1500);
  };

  const handleCopy = () => {
    if (currentContent) {
      navigator.clipboard.writeText(currentContent.caption);
      toast({ title: "✅ Texto copiado!" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Estúdio de Marketing
              </h1>
              <p className="text-sm text-muted-foreground">Crie conteúdo irresistível com IA</p>
            </div>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/30 text-sm px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Bella Creative
          </Badge>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT — Creator (40%) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Insight Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/30 backdrop-blur-md"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 shrink-0">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Insight da Bella</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    💡 Sua <strong>terça-feira à tarde</strong> está com <strong className="text-amber-600">60% de ociosidade</strong>. Sugiro uma promoção relâmpago para preencher a agenda!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Objective */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-5 glass border border-white/20"
            >
              <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Objetivo
              </h3>
              <p className="text-xs text-muted-foreground mb-3">O que você quer alcançar?</p>
              <div className="grid grid-cols-2 gap-2">
                {objectives.map((obj) => {
                  const Icon = obj.icon;
                  const active = selectedObjective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => { setSelectedObjective(obj.id); setGenerated(false); }}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border ${
                        active
                          ? "bg-primary/15 border-primary/40 text-primary shadow-sm"
                          : "bg-white/40 border-white/30 text-foreground hover:bg-white/60"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-left text-xs leading-tight">{obj.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Vibe */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-5 glass border border-white/20"
            >
              <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                <Smile className="h-4 w-4 text-primary" /> Vibe do Conteúdo
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Qual tom quer usar?</p>
              <div className="flex gap-2">
                {vibes.map((v) => {
                  const active = selectedVibe === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVibe(v.id); setGenerated(false); }}
                      className={`flex-1 rounded-xl px-3 py-3 text-sm font-medium transition-all border text-center ${
                        active
                          ? "bg-primary/15 border-primary/40 text-primary shadow-sm"
                          : "bg-white/40 border-white/30 text-foreground hover:bg-white/60"
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{v.emoji}</span>
                      <span className="text-xs">{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Generate Button */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button
                onClick={handleGenerate}
                disabled={!selectedObjective || !selectedVibe || isGenerating}
                className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-hero text-white shadow-elegant hover:opacity-90 transition-opacity"
              >
                {isGenerating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sparkles className="h-5 w-5 mr-2" />
                  </motion.div>
                ) : (
                  <Zap className="h-5 w-5 mr-2" />
                )}
                {isGenerating ? "Gerando..." : "✨ Gerar Sugestão"}
              </Button>
            </motion.div>
          </div>

          {/* RIGHT — Preview (60%) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Smartphone Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl p-6 glass border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-primary" /> Preview do Post
                </h3>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">Feed</Badge>
                  <Badge variant="outline" className="text-xs border-muted-foreground/30">Stories</Badge>
                </div>
              </div>

              {/* Phone Frame */}
              <div className="mx-auto w-full max-w-[320px]">
                <div className="rounded-[2rem] border-4 border-foreground/20 bg-foreground/5 p-2 shadow-xl">
                  {/* Notch */}
                  <div className="mx-auto w-24 h-5 bg-foreground/20 rounded-full mb-2" />

                  {/* Screen */}
                  <div className="rounded-[1.5rem] overflow-hidden bg-white">
                    {/* Instagram Header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-hero" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">seu_salao</p>
                        <p className="text-[10px] text-gray-400">Patrocinado</p>
                      </div>
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-square bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!generated ? (
                          <div className="text-center text-white/60 p-4">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-40" />
                            <p className="text-xs">Selecione objetivo + vibe e gere uma sugestão</p>
                          </div>
                        ) : (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center p-6 relative z-10"
                            >
                              <p className="text-white font-bold text-lg drop-shadow-lg leading-tight">
                                {currentContent?.overlay}
                              </p>
                              <div className="mt-3 mx-auto w-16 h-0.5 bg-white/60 rounded-full" />
                              <p className="text-white/80 text-xs mt-2">Seu Salão ✨</p>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    </div>

                    {/* Caption Area */}
                    <div className="p-3">
                      {generated && currentContent ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="flex gap-3 mb-2">
                            <Heart className="h-5 w-5 text-gray-700" />
                            <Send className="h-5 w-5 text-gray-700 -rotate-12" />
                          </div>
                          <p className="text-xs text-gray-800 leading-relaxed">
                            <span className="font-bold">seu_salao</span>{" "}
                            {currentContent.caption}
                          </p>
                        </motion.div>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-gray-100 rounded" />
                          <div className="h-3 w-3/4 bg-gray-100 rounded" />
                          <div className="h-3 w-1/2 bg-gray-100 rounded" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-5 justify-center flex-wrap">
                <Button
                  onClick={() => toast({ title: "📅 Post agendado com sucesso!" })}
                  disabled={!generated}
                  className="rounded-xl bg-gradient-hero text-white hover:opacity-90"
                >
                  <Calendar className="h-4 w-4 mr-1.5" /> Agendar Post
                </Button>
                <Button
                  onClick={handleCopy}
                  disabled={!generated}
                  variant="outline"
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Copy className="h-4 w-4 mr-1.5" /> Copiar Texto
                </Button>
                <Button
                  onClick={() => toast({ title: "📨 Enviado para o designer!" })}
                  disabled={!generated}
                  variant="outline"
                  className="rounded-xl border-muted-foreground/30 hover:bg-muted"
                >
                  <Send className="h-4 w-4 mr-1.5" /> Enviar p/ Designer
                </Button>
              </div>
            </motion.div>

            {/* Scheduled Posts Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl p-5 glass border border-white/20"
            >
              <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Próximos Posts Agendados
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex-shrink-0 w-40 rounded-xl border border-white/30 bg-white/40 p-3 hover:bg-white/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={`text-[10px] px-1.5 py-0 ${
                          post.status === "agendado"
                            ? "bg-green-500/15 text-green-700 border-green-500/30"
                            : "bg-amber-500/15 text-amber-700 border-amber-500/30"
                        }`}
                        variant="outline"
                      >
                        {post.status === "agendado" ? <CheckCircle2 className="h-3 w-3 mr-0.5" /> : <Clock className="h-3 w-3 mr-0.5" />}
                        {post.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{post.type}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate">{post.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{post.date} · {post.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Marketing;
