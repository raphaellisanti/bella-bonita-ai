export interface ProfessionalAppointment {
  id: string;
  clientName: string;
  clientPhoto: string;
  time: string;
  endTime: string;
  service: string;
  price: number;
  commission: number;
  status: "waiting" | "in_progress" | "completed";
  upsell?: {
    suggestion: string;
    reason: string;
    extraCommission: number;
    productName: string;
  };
}

export interface UsedProduct {
  id: string;
  name: string;
  quantity: number;
  unit: "ml" | "g" | "un";
}

export const professionalProfile = {
  name: "Bia",
  role: "Cabeleireira & Manicure",
  dailyGoal: 300,
  dailyEarned: 180,
  monthlyEarned: 4850,
  ranking: 2,
  streak: 12,
};

export const professionalAppointments: ProfessionalAppointment[] = [
  {
    id: "1",
    clientName: "Mariana L.",
    clientPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    time: "09:00",
    endTime: "10:30",
    service: "Escova Progressiva",
    price: 250,
    commission: 87.5,
    status: "completed",
  },
  {
    id: "2",
    clientName: "Juliana R.",
    clientPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
    time: "11:00",
    endTime: "12:00",
    service: "Corte + Hidratação",
    price: 180,
    commission: 63,
    status: "completed",
  },
  {
    id: "3",
    clientName: "Carla S.",
    clientPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    time: "14:00",
    endTime: "15:30",
    service: "Manicure + Pedicure",
    price: 120,
    commission: 42,
    status: "waiting",
    upsell: {
      suggestion: "A Carla tem pele sensível. Que tal oferecer o Kit Spa dos Pés como adicional?",
      reason: "Histórico de pele sensível",
      extraCommission: 15,
      productName: "Kit Spa dos Pés",
    },
  },
  {
    id: "4",
    clientName: "Fernanda M.",
    clientPhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
    time: "16:00",
    endTime: "17:30",
    service: "Mechas Babylights",
    price: 350,
    commission: 122.5,
    status: "waiting",
    upsell: {
      suggestion: "Fernanda fez coloração há 3 meses. Sugira o Tratamento Pós-Química para manter o brilho!",
      reason: "Última coloração há 90 dias",
      extraCommission: 22,
      productName: "Tratamento Pós-Química",
    },
  },
  {
    id: "5",
    clientName: "Patrícia G.",
    clientPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
    time: "18:00",
    endTime: "19:00",
    service: "Coloração 7.1 Louro Cinza",
    price: 200,
    commission: 70,
    status: "waiting",
  },
];

export const checkoutProducts: UsedProduct[] = [
  { id: "p1", name: "Pó Descolorante BlondMe", quantity: 40, unit: "g" },
  { id: "p2", name: "Oxidante 30 Vol", quantity: 60, unit: "ml" },
  { id: "p3", name: "Máscara Reconstrutora K18", quantity: 15, unit: "ml" },
  { id: "p4", name: "Esmalte Cremoso Vermelho", quantity: 1, unit: "un" },
  { id: "p5", name: "Acetona Removedora", quantity: 30, unit: "ml" },
];
