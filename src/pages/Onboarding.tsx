import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Zap, Star, Scissors, FlaskConical, Hand, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";

const steps = [
  {
    id: "style",
    title: "Como é seu salão?",
    subtitle: "Isso define o tom de voz da sua IA",
    options: [
      { value: "popular", label: "Popular", description: "Atendimento caloroso, preços acessíveis, ambiente familiar", icon: Star, emoji: "🏠" },
      { value: "luxo", label: "Luxo", description: "Experiência premium, exclusividade e sofisticação", icon: Crown, emoji: "✨" },
      { value: "descolado", label: "Descolado", description: "Moderno, irreverente, conectado com tendências", icon: Zap, emoji: "🔥" },
    ],
  },
  {
    id: "focus",
    title: "Qual seu foco principal?",
    subtitle: "Ajuda a personalizar suas promoções",
    options: [
      { value: "corte", label: "Corte", description: "Cortes masculinos e femininos são o carro-chefe", icon: Scissors, emoji: "✂️" },
      { value: "quimica", label: "Química", description: "Coloração, alisamento, tratamentos capilares", icon: FlaskConical, emoji: "🧪" },
      { value: "manicure", label: "Manicure", description: "Unhas, nail art, esmaltação em gel", icon: Hand, emoji: "💅" },
    ],
  },
  {
    id: "aggressiveness",
    title: "Agressividade das promoções",
    subtitle: "Quanto a IA deve insistir nas campanhas?",
    options: [
      { value: "suave", label: "Suave", description: "Mensagens gentis, sem pressão, apenas lembretes", icon: Star, emoji: "🕊️" },
      { value: "moderado", label: "Moderado", description: "Promoções equilibradas, bom senso comercial", icon: Sparkles, emoji: "⚖️" },
      { value: "agressivo", label: "Agressivo", description: "Promoções frequentes, urgência, descontos chamativos", icon: Zap, emoji: "🚀" },
    ],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth");
    };
    check();
  }, [navigate]);

  const step = steps[currentStep];
  const isSelected = (value: string) => selections[step.id] === value;

  const select = (value: string) => {
    setSelections((prev) => ({ ...prev, [step.id]: value }));
  };

  const next = () => {
    if (!selections[step.id]) return;
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const slug = `salon-${user.id.slice(0, 8)}-${Date.now()}`;
      const { data: salon, error } = await supabase.from("salons").insert({
        name: "Meu Salão",
        slug,
        settings: {
          ai_tone: selections.style,
          focus: selections.focus,
          promo_aggressiveness: selections.aggressiveness,
        },
      }).select().single();

      if (error) throw error;
      toast.success("Salão configurado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(280 60% 96%), hsl(320 70% 95%), hsl(280 50% 98%))",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-30 blur-3xl"
        style={{ background: "hsl(320 80% 60%)" }} />
      <div className="absolute bottom-[-100px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-25 blur-3xl"
        style={{ background: "hsl(270 70% 55%)" }} />
      <div className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full opacity-20 blur-3xl"
        style={{ background: "hsl(290 65% 65%)" }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="font-display text-3xl font-bold" style={{ color: "hsl(280 50% 30%)" }}>
          Bella<span style={{ color: "hsl(320 80% 50%)" }}>Bonita</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(280 30% 50%)" }}>Configure sua IA em 3 passos</p>
      </motion.div>

      {/* Progress dots */}
      <div className="flex gap-3 mb-6 z-10">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            animate={{
              width: i === currentStep ? 32 : 8,
              backgroundColor: i <= currentStep ? "hsl(320, 80%, 50%)" : "hsl(280, 30%, 80%)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-md z-10 relative" style={{ minHeight: 420 }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="w-full rounded-3xl p-6 border"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "rgba(255, 255, 255, 0.5)",
              boxShadow: "0 8px 40px -12px hsl(320 60% 50% / 0.15), 0 0 0 1px rgba(255,255,255,0.3) inset",
            }}
          >
            <div className="text-center mb-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: "hsl(320 70% 50%)" }}
              >
                Passo {currentStep + 1} de {steps.length}
              </motion.p>
              <h2 className="font-display text-2xl font-bold" style={{ color: "hsl(280 45% 25%)" }}>
                {step.title}
              </h2>
              <p className="text-sm mt-1" style={{ color: "hsl(280 25% 50%)" }}>{step.subtitle}</p>
            </div>

            <div className="space-y-3">
              {step.options.map((option) => {
                const selected = isSelected(option.value);
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => select(option.value)}
                    whileTap={{ scale: 0.97 }}
                    className="w-full text-left rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden"
                    style={{
                      background: selected
                        ? "linear-gradient(135deg, hsl(320 80% 50% / 0.12), hsl(270 60% 55% / 0.08))"
                        : "rgba(255, 255, 255, 0.5)",
                      borderColor: selected ? "hsl(320 80% 55%)" : "rgba(255, 255, 255, 0.4)",
                      boxShadow: selected
                        ? "0 4px 20px -4px hsl(320 70% 50% / 0.2)"
                        : "0 2px 8px -2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <div className="flex-1">
                        <span className="font-semibold text-sm block" style={{ color: "hsl(280 45% 25%)" }}>
                          {option.label}
                        </span>
                        <span className="text-xs block mt-0.5" style={{ color: "hsl(280 20% 50%)" }}>
                          {option.description}
                        </span>
                      </div>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "hsl(320 80% 50%)" }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={prev}
                  className="flex-1 rounded-xl border-transparent"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    color: "hsl(280 40% 40%)",
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
              )}
              <Button
                onClick={next}
                disabled={!selections[step.id] || saving}
                className="flex-1 rounded-xl text-white border-0"
                style={{
                  background: selections[step.id]
                    ? "linear-gradient(135deg, hsl(320 80% 50%), hsl(270 65% 50%))"
                    : "hsl(280 20% 75%)",
                }}
              >
                {saving ? "Salvando..." : currentStep === steps.length - 1 ? "Concluir" : "Próximo"}
                {!saving && currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                {!saving && currentStep === steps.length - 1 && <Sparkles className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
