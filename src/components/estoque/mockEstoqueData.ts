export interface ProductStock {
  id: string;
  name: string;
  brand: string;
  category: string;
  unit: 'ml' | 'g' | 'un';
  currentStock: number;
  maxStock: number;
  costPerUnit: number;
  minStockAlert: number;
  expirationDate?: string; // ISO date
  imageUrl?: string;
  aiAlert?: string;
  depletionDays?: number;
  recipes: { serviceName: string; quantityUsed: number; costPerDose: number }[];
}

export const defaultCategories = [
  'Todos',
  'Cabelo',
  'Unhas',
  'Perfumaria',
  'Descartáveis',
];

export const mockProducts: ProductStock[] = [
  {
    id: '1',
    name: 'Pó Descolorante BlondMe',
    brand: 'Schwarzkopf',
    category: 'Cabelo',
    unit: 'g',
    currentStock: 200,
    maxStock: 500,
    costPerUnit: 0.32,
    minStockAlert: 100,
    expirationDate: '2026-08-15',
    aiAlert: '⚠️ Esgota em 3 dias (baseado na agenda)',
    depletionDays: 3,
    recipes: [
      { serviceName: 'Mechas Babylights', quantityUsed: 40, costPerDose: 12.80 },
      { serviceName: 'Morena Iluminada', quantityUsed: 60, costPerDose: 19.20 },
    ],
  },
  {
    id: '2',
    name: 'Oxidante 30 Vol',
    brand: 'Wella',
    category: 'Cabelo',
    unit: 'ml',
    currentStock: 800,
    maxStock: 1000,
    costPerUnit: 0.05,
    minStockAlert: 200,
    expirationDate: '2027-01-20',
    recipes: [
      { serviceName: 'Mechas Babylights', quantityUsed: 60, costPerDose: 3.00 },
      { serviceName: 'Coloração Completa', quantityUsed: 100, costPerDose: 5.00 },
    ],
  },
  {
    id: '3',
    name: 'Máscara Reconstrutora',
    brand: 'K18',
    category: 'Cabelo',
    unit: 'ml',
    currentStock: 50,
    maxStock: 250,
    costPerUnit: 0.95,
    minStockAlert: 60,
    expirationDate: '2026-03-10',
    aiAlert: '🔴 Abaixo do mínimo! Repor urgente',
    depletionDays: 1,
    recipes: [
      { serviceName: 'Hidratação Profunda', quantityUsed: 30, costPerDose: 28.50 },
    ],
  },
  {
    id: '4',
    name: 'Esmalte Anitta Nude',
    brand: 'Risqué',
    category: 'Unhas',
    unit: 'un',
    currentStock: 12,
    maxStock: 30,
    costPerUnit: 4.50,
    minStockAlert: 5,
    expirationDate: '2027-06-01',
    recipes: [],
  },
  {
    id: '5',
    name: 'Esmalte Cremoso Vermelho',
    brand: 'Vult',
    category: 'Unhas',
    unit: 'un',
    currentStock: 3,
    maxStock: 20,
    costPerUnit: 5.20,
    minStockAlert: 4,
    expirationDate: '2026-04-20',
    aiAlert: '⚠️ Baixo estoque — 6 manicures agendadas',
    depletionDays: 4,
    recipes: [],
  },
  {
    id: '6',
    name: 'Acetona Removedora',
    brand: 'Farmax',
    category: 'Unhas',
    unit: 'ml',
    currentStock: 400,
    maxStock: 500,
    costPerUnit: 0.02,
    minStockAlert: 100,
    recipes: [],
  },
  {
    id: '7',
    name: 'Perfume Ambiente Lavanda',
    brand: 'Via Aroma',
    category: 'Perfumaria',
    unit: 'ml',
    currentStock: 180,
    maxStock: 200,
    costPerUnit: 0.15,
    minStockAlert: 50,
    expirationDate: '2027-12-01',
    recipes: [],
  },
  {
    id: '8',
    name: 'Luvas Descartáveis (P)',
    brand: 'Descarpack',
    category: 'Descartáveis',
    unit: 'un',
    currentStock: 45,
    maxStock: 200,
    costPerUnit: 0.35,
    minStockAlert: 30,
    aiAlert: '⚠️ Esgota em 5 dias',
    depletionDays: 5,
    recipes: [],
  },
  {
    id: '9',
    name: 'Touca Descartável',
    brand: 'Descarpack',
    category: 'Descartáveis',
    unit: 'un',
    currentStock: 80,
    maxStock: 150,
    costPerUnit: 0.20,
    minStockAlert: 20,
    recipes: [],
  },
  {
    id: '10',
    name: 'Coloração 7.1 Louro Cinza',
    brand: 'Igora Royal',
    category: 'Cabelo',
    unit: 'g',
    currentStock: 30,
    maxStock: 180,
    costPerUnit: 0.55,
    minStockAlert: 40,
    expirationDate: '2026-02-28',
    aiAlert: '🔴 Vencimento próximo + estoque baixo',
    depletionDays: 5,
    recipes: [
      { serviceName: 'Coloração Completa', quantityUsed: 60, costPerDose: 33.00 },
    ],
  },
];

export const estoqueKPIs = {
  valorEmEstoque: 4200,
  itensCriticos: 3,
  previsaoCompra: '15/Out',
};
