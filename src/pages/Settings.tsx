import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Building2, Users, Brain, Scissors, Upload, Plus, X, Clock,
  Mail, Phone, Shield, Percent, ChevronRight, Sparkles, Tag,
  MessageSquare, Lightbulb, Globe, Edit2, Trash2, ToggleLeft, Package
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  mockSalonProfile, mockBusinessHours, mockServices,
  mockAiBrain, roleLabels, TeamMember, SalonService, BusinessHours
} from "@/components/settings/mockSettingsData";
import { useTeam } from "@/contexts/TeamContext";
import { Checkbox } from "@/components/ui/checkbox";
import BottomNav from "@/components/BottomNav";

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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pb-20">
      <div className="absolute top-[-120px] right-[-80px] w-[350px] h-[350px] rounded-full opacity-12 blur-3xl bg-primary pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-8 blur-3xl bg-accent pointer-events-none" />

      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <main className="relative z-10 flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
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
      <BottomNav />
    </div>
  );
};

/* ============================================= */
/* TAB 1: Perfil do Salão                        */
/* ============================================= */
const ProfileTab = () => {
  const [profile, setProfile] = useState(mockSalonProfile);
  const [hours, setHours] = useState<BusinessHours[]>(mockBusinessHours);

  const updateHour = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    const next = [...hours];
    next[index] = { ...next[index], [field]: value };
    setHours(next);
  };

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

      {/* Business Hours - EDITABLE */}
      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Horário de Funcionamento
        </h3>
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={h.day} className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${h.enabled ? "bg-muted/10 border-border/15" : "bg-muted/5 border-border/10 opacity-60"}`}>
              <Switch checked={h.enabled} onCheckedChange={(v) => updateHour(i, "enabled", v)} />
              <span className="w-20 text-sm font-medium text-foreground">{h.day}</span>
              {h.enabled ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <TimeInput value={h.open} onChange={(v) => updateHour(i, "open", v)} />
                  <span>–</span>
                  <TimeInput value={h.close} onChange={(v) => updateHour(i, "close", v)} />
                  <span className="text-muted-foreground/40 mx-1">|</span>
                  <span className="text-[10px]">Almoço:</span>
                  <TimeInput value={h.lunchStart} onChange={(v) => updateHour(i, "lunchStart", v)} placeholder="--:--" />
                  <span>–</span>
                  <TimeInput value={h.lunchEnd} onChange={(v) => updateHour(i, "lunchEnd", v)} placeholder="--:--" />
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
  const { team, addMember, updateMember, removeMember } = useTeam();
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Add member form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "manager" | "professional">("professional");
  const [newCommission, setNewCommission] = useState(40);
  const [newProductCommission, setNewProductCommission] = useState(10);
  const [enableCommission, setEnableCommission] = useState(true);
  const [enableProductCommission, setEnableProductCommission] = useState(false);
  const [newAssignedServices, setNewAssignedServices] = useState<string[]>([]);

  // Edit member form state
  const [editCommission, setEditCommission] = useState(0);
  const [editProductCommission, setEditProductCommission] = useState(10);
  const [editEnableCommission, setEditEnableCommission] = useState(false);
  const [editEnableProductCommission, setEditEnableProductCommission] = useState(false);
  const [editRole, setEditRole] = useState<"admin" | "manager" | "professional">("professional");
  const [editAssignedServices, setEditAssignedServices] = useState<string[]>([]);

  const openEdit = (member: TeamMember) => {
    setEditMember(member);
    setEditRole(member.role);
    setEditCommission(member.commission);
    setEditProductCommission(member.productCommission || 10);
    setEditEnableCommission(member.role === "professional" ? true : member.commission > 0);
    setEditEnableProductCommission(member.productCommission > 0);
    setEditAssignedServices(member.assignedServices || []);
  };

  const handleDelete = (id: string) => {
    removeMember(id);
    setDeleteConfirm(null);
  };

  const handleAddMember = () => {
    if (!newName.trim()) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newName,
      avatar: newName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      role: newRole,
      email: newEmail,
      phone: "",
      commission: (newRole === "professional" || (newRole === "manager" && enableCommission)) ? newCommission : 0,
      productCommission: enableProductCommission ? newProductCommission : 0,
      specialties: [],
      assignedServices: newAssignedServices,
      active: true,
    };
    addMember(newMember);
    setShowModal(false);
    setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("professional"); setNewCommission(40);
    setNewAssignedServices([]);
  };

  const toggleService = (id: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter(s => s !== id) : [...list, id]);
  };

  // Group services by category
  const servicesByCategory = mockServices.filter(s => s.active).reduce((acc, svc) => {
    (acc[svc.category] = acc[svc.category] || []).push(svc);
    return acc;
  }, {} as Record<string, SalonService[]>);

  const showCommissionForRole = (role: string) => role === "professional";
  const showOptionalCommissionForRole = (role: string) => role === "manager";

  // Current user is admin (mock)
  const currentUserIsAdmin = true;

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
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {(member.assignedServices || []).length > 0
                      ? member.assignedServices.map((sId) => {
                          const svc = mockServices.find(s => s.id === sId);
                          return svc ? <span key={sId} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{svc.name}</span> : null;
                        })
                      : member.specialties.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground">{s}</span>
                        ))
                    }
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {member.commission > 0 && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{member.commission}%</p>
                      <p className="text-[10px] text-muted-foreground">Comissão</p>
                    </div>
                  )}
                  <button onClick={() => openEdit(member)} className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {currentUserIsAdmin && (
                    <button onClick={() => setDeleteConfirm(member.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <ModalOverlay onClose={() => setDeleteConfirm(null)}>
            <h3 className="text-lg font-bold text-foreground mb-2">Excluir Membro</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Tem certeza que deseja excluir <strong>{team.find(m => m.id === deleteConfirm)?.name}</strong> da equipe? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Excluir</button>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay onClose={() => setShowModal(false)}>
            <h3 className="text-lg font-bold text-foreground mb-5">Adicionar Membro</h3>
            <div className="space-y-4">
              <FieldInput label="Nome Completo" value={newName} onChange={setNewName} placeholder="Ex: Maria Santos" icon={<Users className="w-4 h-4" />} />
              <FieldInput label="Email" value={newEmail} onChange={setNewEmail} placeholder="email@salao.com" icon={<Mail className="w-4 h-4" />} />
              <FieldInput label="Senha Provisória" value={newPassword} onChange={setNewPassword} placeholder="••••••••" icon={<Shield className="w-4 h-4" />} type="password" />
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Permissão (Role)</label>
                <div className="space-y-2">
                  {Object.entries(roleLabels).map(([key, r]) => (
                    <label key={key} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${newRole === key ? "bg-primary/10 border-primary/30" : "bg-muted/10 border-border/15 hover:bg-muted/20"}`}>
                      <input type="radio" name="role" checked={newRole === key} onChange={() => setNewRole(key as any)} className="accent-fuchsia-500" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{r.label}</span>
                        <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Commission - always visible for Professional, optional toggle for Manager */}
              {(showCommissionForRole(newRole) || showOptionalCommissionForRole(newRole)) && (
                <div className="space-y-3 p-4 rounded-xl bg-muted/10 border border-border/15">
                  {showOptionalCommissionForRole(newRole) && (
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Habilitar Comissão sobre Serviços
                      </label>
                      <Switch checked={enableCommission} onCheckedChange={setEnableCommission} />
                    </div>
                  )}
                  {(showCommissionForRole(newRole) || enableCommission) && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Comissão sobre Serviços
                      </label>
                      <div className="flex items-center gap-4">
                        <input type="range" min={0} max={60} value={newCommission} onChange={e => setNewCommission(Number(e.target.value))} className="flex-1 accent-fuchsia-500" />
                        <span className="text-lg font-bold text-primary w-14 text-right">{newCommission}%</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> Comissão sobre Produtos
                    </label>
                    <Switch checked={enableProductCommission} onCheckedChange={setEnableProductCommission} />
                  </div>
                  {enableProductCommission && (
                    <div>
                      <div className="flex items-center gap-4">
                        <input type="range" min={0} max={30} value={newProductCommission} onChange={e => setNewProductCommission(Number(e.target.value))} className="flex-1 accent-fuchsia-500" />
                        <span className="text-lg font-bold text-primary w-14 text-right">{newProductCommission}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Service Assignment */}
              {(newRole === "professional" || newRole === "manager") && (
                <div className="space-y-3 p-4 rounded-xl bg-muted/10 border border-border/15">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-primary" /> Serviços Atribuídos
                  </label>
                  <p className="text-[11px] text-muted-foreground -mt-1">Selecione os serviços que este profissional pode realizar</p>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(servicesByCategory).map(([cat, svcs]) => (
                      <div key={cat}>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{cat}</p>
                        <div className="space-y-1">
                          {svcs.map(svc => (
                            <label key={svc.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${newAssignedServices.includes(svc.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/20 border border-transparent"}`}>
                              <Checkbox checked={newAssignedServices.includes(svc.id)} onCheckedChange={() => toggleService(svc.id, newAssignedServices, setNewAssignedServices)} />
                              <span className="text-sm text-foreground">{svc.name}</span>
                              <span className="text-[10px] text-muted-foreground ml-auto">R$ {svc.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{newAssignedServices.length} serviço(s) selecionado(s)</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors">Cancelar</button>
                <button onClick={handleAddMember} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">Salvar</button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {editMember && (
          <ModalOverlay onClose={() => setEditMember(null)}>
            <h3 className="text-lg font-bold text-foreground mb-1">Editar: {editMember.name}</h3>
            <p className="text-xs text-muted-foreground mb-5">{roleLabels[editMember.role].label}</p>
            <div className="space-y-4">
              <FieldInput label="Email" value={editMember.email} icon={<Mail className="w-4 h-4" />} />
              <FieldInput label="Telefone" value={editMember.phone} icon={<Phone className="w-4 h-4" />} />

              {/* Role selector */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Permissão</label>
                <div className="space-y-2">
                  {Object.entries(roleLabels).map(([key, r]) => (
                    <label key={key} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${editRole === key ? "bg-primary/10 border-primary/30" : "bg-muted/10 border-border/15 hover:bg-muted/20"}`}>
                      <input type="radio" name="editRole" checked={editRole === key} onChange={() => setEditRole(key as any)} className="accent-fuchsia-500" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{r.label}</span>
                        <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Commission section */}
              {(showCommissionForRole(editRole) || showOptionalCommissionForRole(editRole)) && (
                <div className="space-y-3 p-4 rounded-xl bg-muted/10 border border-border/15">
                  {showOptionalCommissionForRole(editRole) && (
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Habilitar Comissão sobre Serviços
                      </label>
                      <Switch checked={editEnableCommission} onCheckedChange={setEditEnableCommission} />
                    </div>
                  )}
                  {(showCommissionForRole(editRole) || editEnableCommission) && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Comissão sobre Serviços
                      </label>
                      <div className="flex items-center gap-4">
                        <input type="range" min={0} max={60} value={editCommission} onChange={e => setEditCommission(Number(e.target.value))} className="flex-1 accent-fuchsia-500" />
                        <span className="text-lg font-bold text-primary w-14 text-right">{editCommission}%</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> Comissão sobre Produtos
                    </label>
                    <Switch checked={editEnableProductCommission} onCheckedChange={setEditEnableProductCommission} />
                  </div>
                  {editEnableProductCommission && (
                    <div>
                      <div className="flex items-center gap-4">
                        <input type="range" min={0} max={30} value={editProductCommission} onChange={e => setEditProductCommission(Number(e.target.value))} className="flex-1 accent-fuchsia-500" />
                        <span className="text-lg font-bold text-primary w-14 text-right">{editProductCommission}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Service Assignment - Edit */}
              {(editRole === "professional" || editRole === "manager") && (
                <div className="space-y-3 p-4 rounded-xl bg-muted/10 border border-border/15">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-primary" /> Serviços Atribuídos
                  </label>
                  <p className="text-[11px] text-muted-foreground -mt-1">Selecione os serviços que este profissional pode realizar</p>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(servicesByCategory).map(([cat, svcs]) => (
                      <div key={cat}>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{cat}</p>
                        <div className="space-y-1">
                          {svcs.map(svc => (
                            <label key={svc.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${editAssignedServices.includes(svc.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/20 border border-transparent"}`}>
                              <Checkbox checked={editAssignedServices.includes(svc.id)} onCheckedChange={() => toggleService(svc.id, editAssignedServices, setEditAssignedServices)} />
                              <span className="text-sm text-foreground">{svc.name}</span>
                              <span className="text-[10px] text-muted-foreground ml-auto">R$ {svc.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{editAssignedServices.length} serviço(s) selecionado(s)</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditMember(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors">Cancelar</button>
                <button onClick={() => { updateMember(editMember.id, { role: editRole, commission: editCommission, productCommission: editEnableProductCommission ? editProductCommission : 0, assignedServices: editAssignedServices }); setEditMember(null); }} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">Salvar</button>
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
          <input type="range" min={0} max={100} value={personality} onChange={(e) => setPersonality(Number(e.target.value))} className="w-full accent-fuchsia-500 h-2" />
          <p className="text-center text-xs text-muted-foreground">
            {personality < 30 ? "Comunicação corporativa e sóbria" : personality < 70 ? "Equilíbrio entre profissional e acolhedora" : "Comunicação leve, com emojis e humor"}
          </p>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Tom de Voz
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3">Descreva como o seu salão se comunica. A IA usará isso como referência.</p>
        <textarea value={tone} onChange={(e) => setTone(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none text-foreground placeholder:text-muted-foreground/50" />
      </GlassCard>

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
              <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag(""); } }} placeholder="Adicionar diferencial..." className="flex-1 px-4 py-2.5 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50" />
          <button onClick={() => { if (newTag.trim()) { setTags([...tags, newTag.trim()]); setNewTag(""); } }} className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
      </GlassCard>

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
              <button onClick={() => setRules(rules.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0 mt-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newRule} onChange={(e) => setNewRule(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newRule.trim()) { setRules([...rules, newRule.trim()]); setNewRule(""); } }} placeholder="Adicionar nova regra..." className="flex-1 px-4 py-2.5 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50" />
          <button onClick={() => { if (newRule.trim()) { setRules([...rules, newRule.trim()]); setNewRule(""); } }} className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-colors"><Plus className="w-4 h-4" /></button>
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
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editService, setEditService] = useState<SalonService | null>(null);

  // New service form
  const [svcName, setSvcName] = useState("");
  const [svcPrice, setSvcPrice] = useState("");
  const [svcDuration, setSvcDuration] = useState("");
  const [svcCategory, setSvcCategory] = useState("");
  const [svcOnline, setSvcOnline] = useState(true);

  const categories = [...new Set(services.map(s => s.category))];

  const toggleOnline = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, onlineBooking: !s.onlineBooking } : s));
  };

  const openNewService = () => {
    setSvcName(""); setSvcPrice(""); setSvcDuration(""); setSvcCategory(""); setSvcOnline(true);
    setShowServiceModal(true);
  };

  const openEditService = (service: SalonService) => {
    setEditService(service);
    setSvcName(service.name);
    setSvcPrice(String(service.price));
    setSvcDuration(String(service.duration));
    setSvcCategory(service.category);
    setSvcOnline(service.onlineBooking);
  };

  const handleSaveNewService = () => {
    if (!svcName.trim() || !svcPrice || !svcDuration) return;
    const newSvc: SalonService = {
      id: Date.now().toString(),
      name: svcName,
      price: Number(svcPrice),
      duration: Number(svcDuration),
      category: svcCategory || "Outros",
      onlineBooking: svcOnline,
      active: true,
    };
    setServices([...services, newSvc]);
    setShowServiceModal(false);
  };

  const handleSaveEditService = () => {
    if (!editService || !svcName.trim()) return;
    setServices(services.map(s => s.id === editService.id ? {
      ...s,
      name: svcName,
      price: Number(svcPrice) || s.price,
      duration: Number(svcDuration) || s.duration,
      category: svcCategory || s.category,
      onlineBooking: svcOnline,
    } : s));
    setEditService(null);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader icon={Scissors} title="Serviços e Preços" subtitle="Gerencie o catálogo do salão" />
        <button onClick={openNewService} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
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
                    <button onClick={() => openEditService(service)} className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteService(service.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}

      {/* New Service Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <ModalOverlay onClose={() => setShowServiceModal(false)}>
            <h3 className="text-lg font-bold text-foreground mb-5">Novo Serviço</h3>
            <div className="space-y-4">
              <FieldInput label="Nome do Serviço" value={svcName} onChange={setSvcName} placeholder="Ex: Corte Feminino" icon={<Scissors className="w-4 h-4" />} />
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Preço (R$)" value={svcPrice} onChange={setSvcPrice} placeholder="120" icon={<span className="text-xs font-bold">R$</span>} type="number" />
                <FieldInput label="Duração (min)" value={svcDuration} onChange={setSvcDuration} placeholder="45" icon={<Clock className="w-4 h-4" />} type="number" />
              </div>
              <FieldInput label="Categoria" value={svcCategory} onChange={setSvcCategory} placeholder="Ex: Corte, Coloração..." icon={<Tag className="w-4 h-4" />} />
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-medium text-muted-foreground">Disponível para Agendamento Online?</label>
                <Switch checked={svcOnline} onCheckedChange={setSvcOnline} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowServiceModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors">Cancelar</button>
                <button onClick={handleSaveNewService} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">Salvar</button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {editService && (
          <ModalOverlay onClose={() => setEditService(null)}>
            <h3 className="text-lg font-bold text-foreground mb-5">Editar Serviço</h3>
            <div className="space-y-4">
              <FieldInput label="Nome do Serviço" value={svcName} onChange={setSvcName} icon={<Scissors className="w-4 h-4" />} />
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Preço (R$)" value={svcPrice} onChange={setSvcPrice} icon={<span className="text-xs font-bold">R$</span>} type="number" />
                <FieldInput label="Duração (min)" value={svcDuration} onChange={setSvcDuration} icon={<Clock className="w-4 h-4" />} type="number" />
              </div>
              <FieldInput label="Categoria" value={svcCategory} onChange={setSvcCategory} icon={<Tag className="w-4 h-4" />} />
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-medium text-muted-foreground">Disponível para Agendamento Online?</label>
                <Switch checked={svcOnline} onCheckedChange={setSvcOnline} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditService(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border/30 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors">Cancelar</button>
                <button onClick={handleSaveEditService} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">Salvar</button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
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

const FieldInput = ({ label, value, placeholder, icon, className = "", onChange, type = "text" }: { label: string; value: string; placeholder?: string; icon: React.ReactNode; className?: string; onChange?: (v: string) => void; type?: string }) => (
  <div className={className}>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        defaultValue={!onChange ? value : undefined}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/20 border border-border/20 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/50"
      />
    </div>
  </div>
);

const TimeInput = ({ value, onChange, placeholder = "" }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    type="time"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="px-2 py-1 rounded-lg bg-muted/30 border border-border/20 text-xs font-medium text-foreground outline-none focus:border-primary/50 transition-all w-[90px]"
  />
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
      className="w-full max-w-lg bg-card border border-border/30 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
        <X className="w-5 h-5" />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

export default Settings;
