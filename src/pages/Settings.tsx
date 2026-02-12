import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Building2, Users, Brain, Scissors, Upload, Plus, X, Clock,
  Mail, Phone, Shield, Percent, ChevronRight, Sparkles, Tag,
  MessageSquare, Lightbulb, Globe, Edit2, Trash2, ToggleLeft
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  mockSalonProfile, mockBusinessHours, mockTeam, mockServices,
  mockAiBrain, roleLabels, TeamMember, SalonService, BusinessHours
} from "@/components/settings/mockSettingsData";

type TabKey = "profile" | "team" | "ai" | "services";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Perfil do Salão", icon: Building2 },
  { key: "team", label: "Gestão de Equipe", icon: Users },
  { key: "ai", label: "Cérebro da IA", icon: Brain },
  { key: "services", label: "Serviços e Preços", icon: Scissors },
];

const Settings = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserName(user.user_metadata?.full_name || user.email || "");
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute top-[-120px] right-[-80px] w-[350px] h-[350px] rounded-full opacity-12 blur-3xl bg-primary pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-8 blur-3xl bg-accent pointer-events-none" />

      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <main className="relative z-10 flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
        {/* Vertical Tab Sidebar */}
        <div className="w-[240px] min-w-[200px] border-r border-border/30 bg-card/40 backdrop-blur-md p-3 flex flex-col gap-1">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 mb-1">Configurações</h2>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? "bg-primary/12 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/30 border border-transparent"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl"
            >
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "team" && <TeamTab />}
              {activeTab === "ai" && <AiTab />}
              {activeTab === "services" && <ServicesTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

/* ============================================= */
/* TAB 1: Perfil do Salão                        */
/* ============================================= */
const ProfileTab = () => {
  const [profile, setProfile] = useState(mockSalonProfile);
  const [hours, setHours] = useState<BusinessHours[]>(mockBusinessHours);

  return (
    <div className="space-y-8">
      <SectionHeader icon={Building2} title="Perfil do Salão" subtitle="Informações gerais do seu negócio" />

      {/* Logo Upload */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-4">Logo do Salão</h3>
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-2 border-dashed border-primary/30 cursor-pointer hover:border-primary/50 transition-colors">
            <Upload className="w-8 h-8 text-primary/60" />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">Clique para fazer upload</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 2MB. Recomendado: 512x512px</p>
          </div>
        </div>
      </GlassCard>

      {/* Info Fields */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-4">Informações do Salão</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldInput label="Nome do Salão" value={profile.name} icon={<Building2 className="w-4 h-4" />} />
          <FieldInput label="Telefone (WhatsApp)" value={profile.phone} icon={<Phone className="w-4 h-4" />} />
          <FieldInput label="Email" value={profile.email} icon={<Mail className="w-4 h-4" />} className="md:col-span-2" />
          <FieldInput label="Endereço" value={profile.address} icon={<Globe className="w-4 h-4" />} className="md:col-span-2" />
        </div>
      </GlassCard>

      {/* Business Hours */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Horário de Funcionamento
        </h3>
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={h.day} className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${h.enabled ? "bg-muted/10 border-border/15" : "bg-muted/5 border-border/10 opacity-50"}`}>
              <Switch checked={h.enabled} onCheckedChange={(v) => {
                const next = [...hours];
                next[i] = { ...next[i], enabled: v };
                setHours(next);
              }} />
              <span className="w-20 text-sm font-medium text-foreground">{h.day}</span>
              {h.enabled ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TimeChip value={h.open} /> <span>–</span> <TimeChip value={h.close} />
                  {h.lunchStart && (
                    <>
                      <span className="text-muted-foreground/40 mx-1">|</span>
                      <span className="text-[10px]">Almoço:</span>
                      <TimeChip value={h.lunchStart} /> <span>–</span> <TimeChip value={h.lunchEnd} />
                    </>
                  )}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Fechado</span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      <SaveButton />
    </div>
  );
};

/* ============================================= */
/* TAB 2: Gestão de Equipe                       */
/* ============================================= */
const TeamTab = () => {
  const [team] = useState<TeamMember[]>(mockTeam);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader icon={Users} title="Gestão de Equipe" subtitle="Membros, permissões e comissões" />
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Adicionar Membro
        </button>
      </div>

      <div className="space-y-3">
        {team.map((member) => {
          const r = roleLabels[member.role];
          return (
            <GlassCard key={member.id} className="!p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{member.name}</h4>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${r.color}`}>{r.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{member.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {member.specialties.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {member.role === "professional" && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{member.commission}%</p>
                      <p className="text-[10px] text-muted-foreground">Comissão</p>
                    </div>
                  )}
                  <button onClick={() => setEditMember(member)} className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay onClose={() => setShowModal(false)}>
            <h3 className="text-lg font-bold text-foreground mb-5">Adicionar Membro</h3>
            <div className="space-y-4">
              <FieldInput label="Nome Completo" value="" placeholder="Ex: Maria Santos" icon={<Users className="w-4 h-4" />} />
              <FieldInput label="Email" value="" placeholder="email@salao.com" icon={<Mail className="w-4 h-4" />} />
              <FieldInput label="Senha Provisória" value="" placeholder="••••••••" icon={<Shield className="w-4 h-4" />} />
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Permissão (Role)</label>
                <div className="space-y-2">
                  {Object.entries(roleLabels).map(([key, r]) => (
                    <label key={key} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/10 border border-border/15 cursor-pointer hover:bg-muted/20 transition-colors">
                      <input type="radio" name="role" className="accent-fuchsia-500" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{r.label}</span>
                        <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" /> Comissão Padrão
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min={0} max={60} defaultValue={40} className="flex-1 accent-fuchsia-500" />
                  <span className="text-lg font-bold text-primary w-12 text-right">40%</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors">Cancelar</button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">Salvar</button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Edit Member Modal (Commission slider) */}
      <AnimatePresence>
        {editMember && (
          <ModalOverlay onClose={() => setEditMember(null)}>
            <h3 className="text-lg font-bold text-foreground mb-1">Editar: {editMember.name}</h3>
            <p className="text-xs text-muted-foreground mb-5">{roleLabels[editMember.role].label}</p>
            <div className="space-y-4">
              <FieldInput label="Email" value={editMember.email} icon={<Mail className="w-4 h-4" />} />
              <FieldInput label="Telefone" value={editMember.phone} icon={<Phone className="w-4 h-4" />} />
              {editMember.role === "professional" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> Comissão Padrão
                  </label>
                  <div className="flex items-center gap-4">
                    <input type="range" min={0} max={60} defaultValue={editMember.commission} className="flex-1 accent-fuchsia-500" />
                    <span className="text-lg font-bold text-primary w-12 text-right">{editMember.commission}%</span>
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Permissão</label>
                <div className="space-y-2">
                  {Object.entries(roleLabels).map(([key, r]) => (
                    <label key={key} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/10 border border-border/15 cursor-pointer hover:bg-muted/20 transition-colors">
                      <input type="radio" name="editRole" defaultChecked={key === editMember.role} className="accent-fuchsia-500" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{r.label}</span>
                        <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditMember(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors">Cancelar</button>
                <button onClick={() => setEditMember(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">Salvar</button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================= */
/* TAB 3: Cérebro da IA                          */
/* ============================================= */
const AiTab = () => {
  const [personality, setPersonality] = useState(mockAiBrain.personality);
  const [tone, setTone] = useState(mockAiBrain.toneOfVoice);
  const [tags, setTags] = useState(mockAiBrain.differentials);
  const [rules, setRules] = useState(mockAiBrain.goldenRules);
  const [newTag, setNewTag] = useState("");
  const [newRule, setNewRule] = useState("");

  return (
    <div className="space-y-8">
      <SectionHeader icon={Brain} title="Cérebro da IA" subtitle="Configure como a Bella pensa, fala e age" />

      {/* Personality Slider */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Personalidade
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>🏢 Formal</span>
            <span>🎉 Divertida</span>
          </div>
          <input
            type="range" min={0} max={100} value={personality}
            onChange={(e) => setPersonality(Number(e.target.value))}
            className="w-full accent-fuchsia-500 h-2"
          />
          <p className="text-center text-xs text-muted-foreground">
            {personality < 30 ? "Comunicação corporativa e sóbria" : personality < 70 ? "Equilíbrio entre profissional e acolhedora" : "Comunicação leve, com emojis e humor"}
          </p>
        </div>
      </GlassCard>

      {/* Tom de Voz */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Tom de Voz
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3">Descreva como o seu salão se comunica. A IA usará isso como referência.</p>
        <textarea
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none text-foreground placeholder:text-muted-foreground/50"
        />
      </GlassCard>

      {/* Diferenciais Competitivos (Tags) */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          Diferenciais Competitivos
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3">Tags que a IA usará no marketing e conversas.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              {tag}
              <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag(""); } }}
            placeholder="Adicionar diferencial..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
          />
          <button
            onClick={() => { if (newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag(""); } }}
            className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* Regras de Ouro */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Regras de Ouro
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3">Regras que a IA deve sempre respeitar nas conversas e agendamentos.</p>
        <div className="space-y-2 mb-3">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/10 border border-border/15">
              <span className="text-amber-400 text-sm mt-0.5">💡</span>
              <p className="text-sm text-foreground flex-1">{rule}</p>
              <button onClick={() => setRules(rules.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0 mt-0.5">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && newRule.trim()) { setRules([...rules, newRule.trim()]); setNewRule(""); } }}
            placeholder="Adicionar nova regra..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
          />
          <button
            onClick={() => { if (newRule.trim()) { setRules([...rules, newRule.trim()]); setNewRule(""); } }}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      <SaveButton />
    </div>
  );
};

/* ============================================= */
/* TAB 4: Serviços e Preços                      */
/* ============================================= */
const ServicesTab = () => {
  const [services, setServices] = useState<SalonService[]>(mockServices);

  const categories = [...new Set(services.map(s => s.category))];

  const toggleOnline = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, onlineBooking: !s.onlineBooking } : s));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader icon={Scissors} title="Serviços e Preços" subtitle="Gerencie o catálogo do salão" />
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h3>
          <div className="space-y-2">
            {services.filter(s => s.category === cat).map((service) => (
              <GlassCard key={service.id} className="!p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Scissors className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground">{service.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {service.duration} min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">R$ {service.price}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Switch checked={service.onlineBooking} onCheckedChange={() => toggleOnline(service.id)} />
                      <span className="text-[9px] text-muted-foreground">Online</span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============================================= */
/* Shared Components                              */
/* ============================================= */
const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) => (
  <div className="mb-2">
    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
      <Icon className="w-5 h-5 text-primary" />
      {title}
    </h2>
    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
  </div>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-5 rounded-2xl bg-card/50 backdrop-blur-md border border-border/20 shadow-sm ${className}`}>
    {children}
  </div>
);

const FieldInput = ({ label, value, placeholder, icon, className = "" }: { label: string; value: string; placeholder?: string; icon: React.ReactNode; className?: string }) => (
  <div className={className}>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        defaultValue={value}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/50"
      />
    </div>
  </div>
);

const TimeChip = ({ value }: { value: string }) => (
  <span className="px-2 py-1 rounded-lg bg-muted/30 text-xs font-medium text-foreground">{value}</span>
);

const SaveButton = () => (
  <div className="flex justify-end pt-2">
    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-fuchsia-600 text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
      Salvar Alterações
    </button>
  </div>
);

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-lg bg-card border border-border/30 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
        <X className="w-5 h-5" />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

export default Settings;
