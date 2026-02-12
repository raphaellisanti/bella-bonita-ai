import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, MessageCircle, DollarSign, Megaphone, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agenda", label: "Agenda", icon: Calendar },
  { path: "/inbox", label: "Inbox", icon: MessageCircle },
  { path: "/financeiro", label: "Financeiro", icon: DollarSign },
  { path: "/marketing", label: "Marketing", icon: Megaphone },
  { path: "/estoque", label: "Estoque", icon: Package },
  { path: "/settings", label: "Config", icon: Settings },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/90 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-0 flex-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "drop-shadow-sm")} />
              <span className="text-[10px] font-medium leading-tight truncate">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
