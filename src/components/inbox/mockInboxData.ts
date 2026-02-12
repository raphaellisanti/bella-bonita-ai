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
  lastMessage: string;
  timestamp: string;
  status: "ai_talking" | "needs_attention" | "resolved";
  unread: boolean;
  respondedBy: "ai" | "human";
  messages: InboxMessage[];
  // CRM data
  lastVisitDays: number;
  churnProbability: "low" | "medium" | "high";
  averageTicket: number;
  totalVisits: number;
  pastAppointments: { date: string; service: string; professional: string }[];
}

export const mockInboxContacts: InboxContact[] = [
  {
    id: "1",
    name: "Maria Silva",
    avatar: "MS",
    phone: "(11) 99832-4567",
    lastMessage: "Perfeito, confirmo às 14h!",
    timestamp: "agora",
    status: "ai_talking",
    unread: true,
    respondedBy: "ai",
    messages: [
      { id: "m1", sender: "client", text: "Oi, quero agendar um corte pra hoje", time: "10:02" },
      { id: "m2", sender: "ai", text: "Olá Maria! 😊 Temos horários às 14h e 16h30 com a Juliana. Qual prefere?", time: "10:02" },
      { id: "m3", sender: "client", text: "14h tá ótimo!", time: "10:03" },
      { id: "m4", sender: "ai", text: "Maravilha! Reservei às 14h com a Juliana. Até lá! 💇‍♀️", time: "10:03" },
      { id: "m5", sender: "client", text: "Perfeito, confirmo às 14h!", time: "10:04" },
    ],
    lastVisitDays: 32,
    churnProbability: "medium",
    averageTicket: 180,
    totalVisits: 12,
    pastAppointments: [
      { date: "10/01/2026", service: "Corte + Escova", professional: "Juliana" },
      { date: "12/12/2025", service: "Hidratação", professional: "Juliana" },
      { date: "15/11/2025", service: "Corte Feminino", professional: "Juliana" },
    ],
  },
  {
    id: "2",
    name: "Ana Costa",
    avatar: "AC",
    phone: "(11) 98765-1234",
    lastMessage: "Quanto custa a progressiva?",
    timestamp: "5 min",
    status: "ai_talking",
    unread: true,
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
    lastMessage: "Pode ser amanhã às 10h?",
    timestamp: "12 min",
    status: "needs_attention",
    unread: true,
    respondedBy: "human",
    messages: [
      { id: "m1", sender: "client", text: "Oi, preciso de manicure + pedicure", time: "09:48" },
      { id: "m2", sender: "ai", text: "Olá Juliana! Temos horário hoje às 15h com a Camila. Serve?", time: "09:48" },
      { id: "m3", sender: "client", text: "Hoje não consigo, e amanhã?", time: "09:49" },
      { id: "m4", sender: "ai", text: "Amanhã temos às 10h e 14h. Qual prefere?", time: "09:49" },
      { id: "m5", sender: "client", text: "Mas quero com a Juliana, não com a Camila", time: "09:50" },
      { id: "m6", sender: "ai", text: "A Juliana não faz esse serviço. Vou transferir para a equipe verificar alternativas. 🙏", time: "09:50" },
      { id: "m7", sender: "client", text: "Pode ser amanhã às 10h?", time: "09:51" },
    ],
    lastVisitDays: 15,
    churnProbability: "low",
    averageTicket: 120,
    totalVisits: 24,
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
    lastMessage: "Obrigada! Até sábado 🥰",
    timestamp: "28 min",
    status: "resolved",
    unread: false,
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
    lastMessage: "Vocês fazem design de sobrancelha?",
    timestamp: "45 min",
    status: "ai_talking",
    unread: false,
    respondedBy: "ai",
    messages: [
      { id: "m1", sender: "client", text: "Vocês fazem design de sobrancelha?", time: "09:15" },
      { id: "m2", sender: "ai", text: "Fazemos sim, Patrícia! O design com henna é R$45 e leva 40min. Quer agendar? ✨", time: "09:15" },
    ],
    lastVisitDays: 60,
    churnProbability: "high",
    averageTicket: 95,
    totalVisits: 3,
    pastAppointments: [
      { date: "14/12/2025", service: "Design de Sobrancelha", professional: "Camila" },
    ],
  },
  {
    id: "6",
    name: "Fernanda Lima",
    avatar: "FL",
    phone: "(11) 94321-7654",
    lastMessage: "Chego em 10 minutos!",
    timestamp: "1h",
    status: "resolved",
    unread: false,
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
    pastAppointments: [
      { date: "05/02/2026", service: "Corte + Escova", professional: "Juliana" },
      { date: "22/01/2026", service: "Corte + Escova", professional: "Juliana" },
      { date: "08/01/2026", service: "Hidratação", professional: "Juliana" },
    ],
  },
];
