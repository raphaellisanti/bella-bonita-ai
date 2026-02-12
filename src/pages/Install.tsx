import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, CheckCircle2, Share, PlusSquare, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if running as standalone (already installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for the install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display']">
            App Instalado!
          </h1>
          <p className="text-muted-foreground">
            O Bella Bonita Gestão já está na sua tela de início. Aproveite a experiência completa!
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Abrir o App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50">
            <img
              src="/apple-touch-icon.png"
              alt="Bella Bonita Gestão"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display']">
              Bella Bonita Gestão
            </h1>
            <p className="text-muted-foreground mt-1">
              Instale o app para uma experiência nativa
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-card rounded-2xl p-5 shadow-lg border space-y-4">
          <h2 className="font-semibold text-foreground">Vantagens do App</h2>
          <div className="space-y-3">
            {[
              { icon: Smartphone, text: "Acesso rápido pela tela de início" },
              { icon: Download, text: "Carregamento ultrarrápido" },
              { icon: CheckCircle2, text: "Funciona mesmo offline" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Install Action */}
        {deferredPrompt ? (
          <Button
            onClick={handleInstall}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-lg text-base py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Instalar Agora
          </Button>
        ) : isIOS ? (
          <div className="bg-card rounded-2xl p-5 shadow-lg border space-y-4">
            <h2 className="font-semibold text-foreground">Como instalar no iPhone</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Toque no ícone <Share className="w-4 h-4 inline text-primary" /> <strong>Compartilhar</strong> na barra do Safari
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Role para baixo e toque em <PlusSquare className="w-4 h-4 inline text-primary" /> <strong>Adicionar à Tela de Início</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Toque em <strong>Adicionar</strong> para confirmar
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-5 shadow-lg border space-y-3">
            <h2 className="font-semibold text-foreground">Como instalar</h2>
            <p className="text-sm text-muted-foreground">
              No navegador, toque em <MoreHorizontal className="w-4 h-4 inline text-primary" /> e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela de início"</strong>.
            </p>
          </div>
        )}

        {/* Skip */}
        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Continuar no navegador
        </button>
      </div>
    </div>
  );
};

export default Install;
