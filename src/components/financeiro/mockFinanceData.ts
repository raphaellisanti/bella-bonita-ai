export interface Transaction {
  id: string;
  clientName: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  price: number;
  taxRate: number;
  cardFeeRate: number;
  commissionRate: number;
  productCost: number;
  productDetails: string;
  paymentMethod: "card" | "pix" | "cash";
}

export interface DailyRevenue {
  day: string;
  productCost: number;
  commission: number;
  profit: number;
}

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    clientName: "Renata Oliveira",
    service: "Mechas Morena Iluminada",
    professional: "Rafael",
    date: "12/02/2026",
    time: "08:30",
    price: 450,
    taxRate: 0.06,
    cardFeeRate: 0.015,
    commissionRate: 0.40,
    productCost: 45,
    productDetails: "Pó descolorante + OX 30vol (Baixa técnica)",
    paymentMethod: "card",
  },
  {
    id: "t2",
    clientName: "Fernanda Lima",
    service: "Corte + Escova",
    professional: "Juliana",
    date: "12/02/2026",
    time: "09:00",
    price: 180,
    taxRate: 0.06,
    cardFeeRate: 0,
    commissionRate: 0.35,
    productCost: 8,
    productDetails: "Shampoo + Condicionador (uso médio)",
    paymentMethod: "pix",
  },
  {
    id: "t3",
    clientName: "Beatriz Santos",
    service: "Manicure + Pedicure",
    professional: "Camila",
    date: "12/02/2026",
    time: "09:00",
    price: 90,
    taxRate: 0.06,
    cardFeeRate: 0.015,
    commissionRate: 0.30,
    productCost: 12,
    productDetails: "Esmalte + Removedor + Lixa",
    paymentMethod: "card",
  },
  {
    id: "t4",
    clientName: "Luciana Ferreira",
    service: "Progressiva Completa",
    professional: "Juliana",
    date: "12/02/2026",
    time: "10:00",
    price: 350,
    taxRate: 0.06,
    cardFeeRate: 0.015,
    commissionRate: 0.40,
    productCost: 65,
    productDetails: "Progressiva 250ml + Shampoo Antirresíduo",
    paymentMethod: "card",
  },
  {
    id: "t5",
    clientName: "Carla Mendes",
    service: "Coloração Global",
    professional: "Rafael",
    date: "11/02/2026",
    time: "14:00",
    price: 280,
    taxRate: 0.06,
    cardFeeRate: 0,
    commissionRate: 0.40,
    productCost: 38,
    productDetails: "Coloração 3 tubos + OX 20vol",
    paymentMethod: "pix",
  },
  {
    id: "t6",
    clientName: "Patrícia Souza",
    service: "Design de Sobrancelha + Henna",
    professional: "Camila",
    date: "11/02/2026",
    time: "15:00",
    price: 65,
    taxRate: 0.06,
    cardFeeRate: 0.015,
    commissionRate: 0.30,
    productCost: 5,
    productDetails: "Henna + Linha",
    paymentMethod: "card",
  },
  {
    id: "t7",
    clientName: "Sandra Pereira",
    service: "Luzes + Tonalização",
    professional: "Rafael",
    date: "11/02/2026",
    time: "10:00",
    price: 520,
    taxRate: 0.06,
    cardFeeRate: 0.015,
    commissionRate: 0.40,
    productCost: 72,
    productDetails: "Pó descolorante + OX 40vol + Tonalizante",
    paymentMethod: "card",
  },
  {
    id: "t8",
    clientName: "Ana Costa",
    service: "Hidratação Profunda",
    professional: "Juliana",
    date: "10/02/2026",
    time: "11:00",
    price: 120,
    taxRate: 0.06,
    cardFeeRate: 0,
    commissionRate: 0.35,
    productCost: 22,
    productDetails: "Máscara reconstrutora 200g",
    paymentMethod: "cash",
  },
];

export const mockDailyRevenue: DailyRevenue[] = [
  { day: "Seg 09", productCost: 320, commission: 780, profit: 900 },
  { day: "Ter 10", productCost: 280, commission: 650, profit: 720 },
  { day: "Qua 11", productCost: 410, commission: 920, profit: 1050 },
  { day: "Qui 12", productCost: 380, commission: 850, profit: 980 },
  { day: "Sex 13", productCost: 450, commission: 1100, profit: 1300 },
  { day: "Sáb 14", productCost: 520, commission: 1200, profit: 1550 },
  { day: "Dom 15", productCost: 140, commission: 500, profit: 500 },
];
