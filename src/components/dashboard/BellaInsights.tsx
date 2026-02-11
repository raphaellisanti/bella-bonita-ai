import { Sparkles, Send, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const BellaInsights = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 text-primary-foreground bg-gradient-hero shadow-elegant overflow-hidden relative"
    >
      {/* Decorative */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
            Bella Insights
          </span>
        </div>

        <p className="text-xl md:text-2xl font-display font-bold mb-1">
          Sua margem de lucro subiu 10% hoje! 🎉
        </p>
        <p className="text-sm opacity-80 mb-5 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4" />
          Comparado com a mesma semana do mês passado
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm rounded-full"
            variant="outline"
          >
            <Send className="h-4 w-4 mr-1.5" />
            Enviar Promoção
          </Button>
          <Button
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/15 backdrop-blur-sm rounded-full"
            variant="outline"
          >
            Ver Detalhes
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BellaInsights;
