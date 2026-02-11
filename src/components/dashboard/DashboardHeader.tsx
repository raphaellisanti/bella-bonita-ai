import { useState } from "react";
import { Search, Sparkles, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

const DashboardHeader = ({ userName, onLogout }: DashboardHeaderProps) => {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-20 glass border-b border-border/40">
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        {/* Logo */}
        <h1 className="font-display text-2xl font-bold text-foreground shrink-0">
          Bella<span className="text-primary">Bonita</span>
        </h1>

        {/* AI Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <div className="relative group">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pergunte à Bella..."
              className="pl-10 pr-10 h-10 rounded-full bg-secondary/60 border-border/50 focus:bg-card focus:border-primary/40 transition-all placeholder:text-muted-foreground/60"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <span className="hidden md:inline text-sm text-muted-foreground">
            {userName}
          </span>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
