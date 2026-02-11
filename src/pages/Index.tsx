import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Sparkles, TrendingUp, Users, BarChart3, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-salon.jpg";

const features = [
  {
    icon: Sparkles,
    title: "IA Anti-Churn",
    description: "Identifica clientes em risco de abandono e dispara campanhas automáticas de retenção.",
  },
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Agendamento online com sugestões de horários otimizados por IA.",
  },
  {
    icon: BarChart3,
    title: "Estoque por Receita",
    description: "Controle de estoque em ml/g vinculado às receitas de cada serviço.",
  },
  {
    icon: TrendingUp,
    title: "Financeiro com Split",
    description: "Divisão automática de comissões entre profissionais e salão.",
  },
  {
    icon: Users,
    title: "Multi-Salão",
    description: "Gerencie múltiplas unidades com equipes e permissões independentes.",
  },
  {
    icon: Scissors,
    title: "Serviços & Receitas",
    description: "Cada serviço tem sua ficha técnica com produtos e quantidades.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-2xl font-bold" style={{ color: "hsl(280 45% 25%)" }}>
            Bella<span style={{ color: "hsl(320 80% 50%)" }}>Bonita</span>
          </Link>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?tab=signup">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Interior luxuoso de salão de beleza"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              ✨ Potencializado por IA
            </span>
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-primary-foreground md:text-7xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
              Gestão de Salão com{" "}
              <span className="font-bold" style={{
                background: "linear-gradient(135deg, hsl(320 90% 55%), hsl(270 80% 60%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 8px rgba(200, 50, 150, 0.5))",
              }}>Inteligência</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
              Agenda, estoque, financeiro e marketing — tudo automatizado com IA para que você foque no que importa: seus clientes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="shadow-elegant text-lg px-8 py-6" asChild>
                <Link to="/auth?tab=signup">Teste Grátis por 14 dias</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white backdrop-blur-sm text-lg px-8 py-6 bg-white/10 hover:bg-white/20" asChild>
                <Link to="#features">Ver Funcionalidades</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl"
            >
              Tudo que seu salão precisa
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto max-w-2xl text-lg text-muted-foreground"
            >
              Uma plataforma completa com IA integrada para transformar a gestão do seu negócio de beleza.
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="mb-6 font-display text-4xl font-bold text-primary-foreground md:text-5xl"
            >
              Pronto para transformar seu salão?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80"
            >
              Junte-se a centenas de salões que já usam IA para crescer.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-6 font-semibold shadow-elegant"
                asChild
              >
                <Link to="/auth?tab=signup">Criar Conta Grátis</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="font-display text-lg font-bold text-foreground">
            Bella<span className="text-primary">Bonita</span>
          </p>
          <p className="text-sm text-muted-foreground">
            © 2026 BellaBonita. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
