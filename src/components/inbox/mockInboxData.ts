export interface InboxMessage {
  id: string;
  sender: "client" | "ai" | "staff";
  text: string;
  time: string;
}

export interface InboxContact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  age: number;
  lastMessage: string;
  timestamp: string;
  status: "ai_talking" | "needs_attention" | "resolved";
  unread: boolean;
  online: boolean;
  respondedBy: "ai" | "human";
  messages: InboxMessage[];
  // CRM data
  lastVisitDays: number;
  churnProbability: "low" | "medium" | "high";
  averageTicket: number;
  totalVisits: number;
  ltv: number;
  frequencyDays: number;
  pastAppointments: { date: string; service: string; professional: string }[];
}

export const mockInboxContacts: InboxContact[] = [
  {
    id: "1",
    name: "Maria Silva",
    avatar: "MS",
    phone: "(11) 99832-4567",
    age: 34,
    lastMessage: "Quanto fica a morena iluminada?",
    timestamp: "agora",
    status: "ai_talking",
    unread: true,
    online: true,
    respondedBy: "ai",
    messages: [
      { id: "m1", sender: "client", text: "Oii, tudo bem? Quero fazer morena iluminada!", time: "10:01" },
      { id: "m2", sender: "ai", text: "Olá Maria! 😍 A Morena Iluminada é um dos nossos serviços mais pedidos! Temos disponibilidade com o Rafael (nosso especialista em coloração) nos seguintes horários:\n\n📅 Amanhã (Quinta): 9h ou 14h\n📅 Sexta: 10h ou 15h\n\nQual fica melhor para você?", time: "10:01" },
      { id: "m3", sender: "client", text: "Quanto fica a morena iluminada?", time: "10:02" },
      { id: "m4", sender: "ai", text: "A Morena Iluminada com o Rafael fica R$ 380! 💇‍♀️✨\n\nO procedimento inclui:\n• Estudo de colorimetria\n• Mechas técnica babylights\n• Tonalização\n• Finalização com produtos premium\n\nDuração: aproximadamente 3h30.\n\nQuer reservar um horário? Posso garantir sua vaga! 🌟", time: "10:02" },
    ],
    lastVisitDays: 32,
    churnProbability: "medium",
    averageTicket: 180,
    totalVisits: 12,
    ltv: 2160,
    frequencyDays: 25,
    pastAppointments: [
      { date: "10/01/2026", service: "Corte + Escova", professional: "Juliana" },
      { date: "12/12/2025", service: "Hidratação Profunda", professional: "Juliana" },
      { date: "15/11/2025", service: "Corte Feminino", professional: "Juliana" },
    ],
  },
  {
    id: "2",
    name: "Ana Costa",
    avatar: "AC",
    phone: "(11) 98765-1234",
    age: 28,
    lastMessage: "E demora quanto tempo?",
    timestamp: "5 min",
    status: "ai_talking",
    unread: true,
    online: true,
    respondedBy: "ai",
    messages: [
      { id: "m1", sender: "client", text: "Boa tarde! Quanto custa a progressiva?", time: "09:55" },
      { id: "m2", sender: "ai", text: "Oi Ana! A progressiva está R$180. Inclui lavagem e finalização. Quer agendar? 🌟", time: "09:55" },
      { id: "m3", sender: "client", text: "E demora quanto tempo?", time: "09:56" },
      { id: "m4", sender: "ai", text: "O procedimento leva em média 2h30. Temos horários amanhã pela manhã! 📅", time: "09:56" },
    ],
    lastVisitDays: 45,
    churnProbability: "high",
    averageTicket: 250,
    totalVisits: 8,
    ltv: 2000,
    frequencyDays: 35,
    pastAppointments: [
      { date: "28/12/2025", service: "Progressiva", professional: "Rafael" },
      { date: "01/11/2025", service: "Coloração", professional: "Rafael" },
    ],
  },
  {
    id: "3",
    name: "Juliana Ramos",
    avatar: "JR",
    phone: "(11) 97654-3210",
    age: 41,
    lastMessage: "Mas quero com a Juliana, não com a Camila",
    timestamp: "12 min",
    status: "needs_attention",
    unread: true,
    online: true,
    respondedBy: "human",
    messages: [
      { id: "m1", sender: "client", text: "Oi, preciso de manicure + pedicure", time: "09:48" },
      { id: "m2", sender: "ai", text: "Olá Juliana! Temos horário hoje às 15h com a Camila. Serve?", time: "09:48" },
      { id: "m3", sender: "client", text: "Hoje não consigo, e amanhã?", time: "09:49" },
      { id: "m4", sender: "ai", text: "Amanhã temos às 10h e 14h. Qual prefere?", time: "09:49" },
      { id: "m5", sender: "client", text: "Mas quero com a Juliana, não com a Camila", time: "09:50" },
      { id: "m6", sender: "ai", text: "⚠️ A profissional Juliana não realiza esse serviço. Vou transferir para a equipe verificar alternativas. 🙏", time: "09:50" },
    ],
    lastVisitDays: 15,
    churnProbability: "low",
    averageTicket: 120,
    totalVisits: 24,
    ltv: 2880,
    frequencyDays: 14,
    pastAppointments: [
      { date: "28/01/2026", service: "Manicure + Pedicure", professional: "Camila" },
      { date: "14/01/2026", service: "Manicure", professional: "Camila" },
      { date: "01/01/2026", service: "Pedicure", professional: "Camila" },
    ],
  },
  {
    id: "4",
    name: "Carla Mendes",
    avatar: "CM",
    phone: "(11) 96543-8765",
    age: 36,
    lastMessage: "Obrigada! Até sábado 🥰",
    timestamp: "28 min",
    status: "resolved",
    unread: false,
    online: false,
    respondedBy: "ai",
    messages: [
      { id: "m1", sender: "client", text: "Quero agendar coloração pro sábado", time: "09:32" },
      { id: "m2", sender: "ai", text: "Oi Carla! No sábado temos às 9h com o Rafael. Pode ser? 🎨", time: "09:32" },
      { id: "m3", sender: "client", text: "Perfeito! Reserva pra mim", time: "09:33" },
      { id: "m4", sender: "ai", text: "Prontinho! Sábado às 9h com Rafael. Te esperamos! ✨", time: "09:33" },
      { id: "m5", sender: "client", text: "Obrigada! Até sábado 🥰", time: "09:34" },
    ],
    lastVisitDays: 20,
    churnProbability: "low",
    averageTicket: 320,
    totalVisits: 18,
    ltv: 5760,
    frequencyDays: 20,
    pastAppointments: [
      { date: "23/01/2026", service: "Coloração + Corte", professional: "Rafael" },
      { date: "02/01/2026", service: "Luzes", professional: "Rafael" },
    ],
  },
  {
    id: "5",
    name: "Patrícia Souza",
    avatar: "PS",
    phone: "(11) 95432-1098",
    age: 22,
    lastMessage: "Vocês fazem design de sobrancelha?",
    timestamp: "45 min",
    status: "ai_talking",
    unread: false,
    online: false,
    respondedBy: "ai",
    messages: [
      { id: "m1", sender: "client", text: "Vocês fazem design de sobrancelha?", time: "09:15" },
      { id: "m2", sender: "ai", text: "Fazemos sim, Patrícia! O design com henna é R$45 e leva 40min. Quer agendar? ✨", time: "09:15" },
    ],
    lastVisitDays: 60,
    churnProbability: "high",
    averageTicket: 95,
    totalVisits: 3,
    ltv: 285,
    frequencyDays: 45,
    pastAppointments: [
      { date: "14/12/2025", service: "Design de Sobrancelha", professional: "Camila" },
    ],
  },
  {
    id: "6",
    name: "Fernanda Lima",
    avatar: "FL",
    phone: "(11) 94321-7654",
    age: 29,
    lastMessage: "Chego em 10 minutos!",
    timestamp: "1h",
    status: "resolved",
    unread: false,
    online: false,
    respondedBy: "human",
    messages: [
      { id: "m1", sender: "client", text: "Tô chegando, deu trânsito", time: "09:00" },
      { id: "m2", sender: "staff", text: "Sem problema, Fernanda! Te aguardamos 😊", time: "09:01" },
      { id: "m3", sender: "client", text: "Chego em 10 minutos!", time: "09:02" },
    ],
    lastVisitDays: 7,
    churnProbability: "low",
    averageTicket: 200,
    totalVisits: 30,
    ltv: 6000,
    frequencyDays: 12,
    pastAppointments: [
      { date: "05/02/2026", service: "Corte + Escova", professional: "Juliana" },
      { date: "22/01/2026", service: "Corte + Escova", professional: "Juliana" },
      { date: "08/01/2026", service: "Hidratação", professional: "Juliana" },
    ],
  },
];
