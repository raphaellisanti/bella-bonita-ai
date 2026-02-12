export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "manager" | "professional";
  email: string;
  phone: string;
  commission: number;
  productCommission: number;
  specialties: string[];
  assignedServices: string[]; // service IDs from mockServices
  active: boolean;
}

export interface SalonService {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  onlineBooking: boolean;
  active: boolean;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  lunchStart: string;
  lunchEnd: string;
  enabled: boolean;
}

export const mockSalonProfile = {
  name: "Studio Bella Hair",
  address: "Rua Augusta, 1200 - Consolação, São Paulo - SP",
  phone: "(11) 99832-4567",
  email: "contato@bellahair.com.br",
  cnpj: "12.345.678/0001-90",
  instagram: "@studiobellahair",
};

export const mockBusinessHours: BusinessHours[] = [
  { day: "Segunda", open: "09:00", close: "19:00", lunchStart: "12:00", lunchEnd: "13:00", enabled: true },
  { day: "Terça", open: "09:00", close: "19:00", lunchStart: "12:00", lunchEnd: "13:00", enabled: true },
  { day: "Quarta", open: "09:00", close: "19:00", lunchStart: "12:00", lunchEnd: "13:00", enabled: true },
  { day: "Quinta", open: "09:00", close: "20:00", lunchStart: "12:00", lunchEnd: "13:00", enabled: true },
  { day: "Sexta", open: "09:00", close: "20:00", lunchStart: "12:00", lunchEnd: "13:00", enabled: true },
  { day: "Sábado", open: "09:00", close: "17:00", lunchStart: "", lunchEnd: "", enabled: true },
  { day: "Domingo", open: "", close: "", lunchStart: "", lunchEnd: "", enabled: false },
];

export const mockTeam: TeamMember[] = [
  { id: "1", name: "Carlos Mendes", avatar: "CM", role: "admin", email: "carlos@bellahair.com.br", phone: "(11) 99999-0001", commission: 0, productCommission: 0, specialties: ["Gestão"], assignedServices: [], active: true },
  { id: "2", name: "Juliana Santos", avatar: "JS", role: "professional", email: "juliana@bellahair.com.br", phone: "(11) 99999-0002", commission: 40, productCommission: 0, specialties: ["Corte Feminino", "Escova", "Penteado"], assignedServices: ["1", "3"], active: true },
  { id: "3", name: "Rafael Costa", avatar: "RC", role: "professional", email: "rafael@bellahair.com.br", phone: "(11) 99999-0003", commission: 45, productCommission: 0, specialties: ["Coloração", "Mechas", "Morena Iluminada"], assignedServices: ["5", "6", "7"], active: true },
  { id: "4", name: "Camila Oliveira", avatar: "CO", role: "professional", email: "camila@bellahair.com.br", phone: "(11) 99999-0004", commission: 35, productCommission: 0, specialties: ["Manicure", "Pedicure", "Nail Art"], assignedServices: ["10", "11"], active: true },
  { id: "5", name: "Amanda Reis", avatar: "AR", role: "manager", email: "amanda@bellahair.com.br", phone: "(11) 99999-0005", commission: 0, productCommission: 0, specialties: ["Gestão", "Atendimento"], assignedServices: [], active: true },
];

export const mockServices: SalonService[] = [
  { id: "1", name: "Corte Feminino", price: 120, duration: 45, category: "Corte", onlineBooking: true, active: true },
  { id: "2", name: "Corte Masculino", price: 60, duration: 30, category: "Corte", onlineBooking: true, active: true },
  { id: "3", name: "Escova Modeladora", price: 80, duration: 40, category: "Escova", onlineBooking: true, active: true },
  { id: "4", name: "Progressiva", price: 180, duration: 150, category: "Química", onlineBooking: true, active: true },
  { id: "5", name: "Morena Iluminada", price: 380, duration: 210, category: "Coloração", onlineBooking: true, active: true },
  { id: "6", name: "Mechas Babylights", price: 350, duration: 180, category: "Coloração", onlineBooking: true, active: true },
  { id: "7", name: "Coloração Raiz", price: 150, duration: 90, category: "Coloração", onlineBooking: true, active: true },
  { id: "8", name: "Hidratação Profunda", price: 90, duration: 60, category: "Tratamento", onlineBooking: true, active: true },
  { id: "9", name: "Botox Capilar", price: 200, duration: 120, category: "Tratamento", onlineBooking: false, active: true },
  { id: "10", name: "Manicure", price: 35, duration: 30, category: "Unhas", onlineBooking: true, active: true },
  { id: "11", name: "Pedicure", price: 40, duration: 40, category: "Unhas", onlineBooking: true, active: true },
  { id: "12", name: "Design de Sobrancelha", price: 45, duration: 40, category: "Sobrancelha", onlineBooking: true, active: true },
];

export const mockAiBrain = {
  personality: 65, // 0=Formal, 100=Divertida
  toneOfVoice: "Somos um salão sofisticado mas acolhedor. Tratamos cada cliente como única. Usamos emojis com moderação e sempre com carinho. Chamamos as clientes pelo primeiro nome.",
  differentials: ["Café Grátis", "Estacionamento Gratuito", "Wi-Fi Premium", "Área Kids", "Produtos Importados", "Ambiente Climatizado"],
  goldenRules: [
    "Nunca agende procedimentos químicos após as 18h",
    "Sempre ofereça hidratação para quem faz mechas ou coloração",
    "Confirme o agendamento 2h antes por WhatsApp",
    "Se a cliente perguntar por desconto, ofereça 10% no combo (2+ serviços)",
    "Nunca fale mal de concorrentes",
  ],
};

export const roleLabels: Record<string, { label: string; color: string; desc: string }> = {
  admin: { label: "Admin", color: "bg-red-500/15 text-red-400 border-red-500/30", desc: "Acesso total, inclui financeiro" },
  manager: { label: "Gerente", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", desc: "Agenda e estoque, sem lucro real" },
  professional: { label: "Profissional", color: "bg-primary/15 text-primary border-primary/30", desc: "Própria agenda e comissões" },
};
