import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard, Calendar, MessageCircle, DollarSign, Megaphone,
  Package, Settings, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { path: "/dashboard", icon: LayoutDashboard },
  { path: "/agenda", icon: Calendar },
  { path: "/inbox", icon: MessageCircle },
  { path: "/financeiro", icon: DollarSign },
  { path: "/marketing", icon: Megaphone },
  { path: "/estoque", icon: Package },
  { path: "/settings", icon: Settings },
];

const managerNav = [
  { path: "/manager", icon: BarChart3 },
  { path: "/agenda", icon: Calendar },
  { path: "/inbox", icon: MessageCircle },
  { path: "/estoque", icon: Package },
  { path: "/settings", icon: Settings },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const role = searchParams.get("role");
  const isManager =
    role === "manager" || location.pathname === "/manager";

  const items = isManager ? managerNav : adminNav;

  const handleNavigate = (path: string) => {
    if (isManager && path !== "/manager") {
      navigate(`${path}?role=manager`);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/90 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all flex-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-sm")} />
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
