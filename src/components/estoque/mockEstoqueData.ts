export interface ProductStock {
  id: string;
  name: string;
  brand: string;
  unit: 'ml' | 'g' | 'un';
  currentStock: number;
  maxStock: number;
  costPerUnit: number;
  minStockAlert: number;
  aiAlert?: string;
  depletionDays?: number;
  recipes: { serviceName: string; quantityUsed: number; costPerDose: number }[];
}

export const mockProducts: ProductStock[] = [
  {
    id: '1',
    name: 'Pó Descolorante BlondMe',
    brand: 'Schwarzkopf',
    unit: 'g',
    currentStock: 200,
    maxStock: 500,
    costPerUnit: 0.32,
    minStockAlert: 100,
    aiAlert: '⚠️ Esgota em 3 dias (baseado na agenda)',
    depletionDays: 3,
    recipes: [
      { serviceName: 'Mechas Babylights', quantityUsed: 40, costPerDose: 12.80 },
      { serviceName: 'Morena Iluminada', quantityUsed: 60, costPerDose: 19.20 },
      { serviceName: 'Retoque de Raiz', quantityUsed: 30, costPerDose: 9.60 },
    ],
  },
  {
    id: '2',
    name: 'Oxidante 30 Vol',
    brand: 'Wella',
    unit: 'ml',
    currentStock: 800,
    maxStock: 1000,
    costPerUnit: 0.05,
    minStockAlert: 200,
    recipes: [
      { serviceName: 'Mechas Babylights', quantityUsed: 60, costPerDose: 3.00 },
      { serviceName: 'Morena Iluminada', quantityUsed: 80, costPerDose: 4.00 },
      { serviceName: 'Coloração Completa', quantityUsed: 100, costPerDose: 5.00 },
    ],
  },
  {
    id: '3',
    name: 'Máscara Reconstrutora',
    brand: 'K18',
    unit: 'ml',
    currentStock: 50,
    maxStock: 250,
    costPerUnit: 0.95,
    minStockAlert: 60,
    aiAlert: '🔴 Abaixo do mínimo! Repor urgente',
    depletionDays: 1,
    recipes: [
      { serviceName: 'Hidratação Profunda', quantityUsed: 30, costPerDose: 28.50 },
      { serviceName: 'Cauterização', quantityUsed: 40, costPerDose: 38.00 },
    ],
  },
  {
    id: '4',
    name: 'Shampoo Profissional',
    brand: 'Loréal',
    unit: 'ml',
    currentStock: 1200,
    maxStock: 1500,
    costPerUnit: 0.03,
    minStockAlert: 300,
    recipes: [
      { serviceName: 'Lavagem (todos)', quantityUsed: 20, costPerDose: 0.60 },
    ],
  },
  {
    id: '5',
    name: 'Coloração 7.1 Louro Cinza',
    brand: 'Igora Royal',
    unit: 'g',
    currentStock: 30,
    maxStock: 180,
    costPerUnit: 0.55,
    minStockAlert: 40,
    aiAlert: '⚠️ Esgota em 5 dias — 4 colorações agendadas',
    depletionDays: 5,
    recipes: [
      { serviceName: 'Coloração Completa', quantityUsed: 60, costPerDose: 33.00 },
      { serviceName: 'Retoque de Raiz', quantityUsed: 30, costPerDose: 16.50 },
    ],
  },
  {
    id: '6',
    name: 'Ampola de Tratamento',
    brand: 'Redken',
    unit: 'un',
    currentStock: 18,
    maxStock: 30,
    costPerUnit: 12.00,
    minStockAlert: 5,
    recipes: [
      { serviceName: 'Tratamento Intensivo', quantityUsed: 1, costPerDose: 12.00 },
    ],
  },
  {
    id: '7',
    name: 'Queratina Líquida',
    brand: 'Cadiveu',
    unit: 'ml',
    currentStock: 150,
    maxStock: 500,
    costPerUnit: 0.18,
    minStockAlert: 100,
    aiAlert: '⚠️ Consumo acelerado esta semana',
    depletionDays: 8,
    recipes: [
      { serviceName: 'Progressiva', quantityUsed: 80, costPerDose: 14.40 },
      { serviceName: 'Cauterização', quantityUsed: 50, costPerDose: 9.00 },
    ],
  },
  {
    id: '8',
    name: 'Tonalizante Gloss',
    brand: 'Wella',
    unit: 'g',
    currentStock: 280,
    maxStock: 300,
    costPerUnit: 0.40,
    minStockAlert: 50,
    recipes: [
      { serviceName: 'Matização', quantityUsed: 40, costPerDose: 16.00 },
    ],
  },
];

export const estoqueKPIs = {
  valorEmEstoque: 4200,
  itensCriticos: 3,
  previsaoCompra: 'Quinta-feira',
};
