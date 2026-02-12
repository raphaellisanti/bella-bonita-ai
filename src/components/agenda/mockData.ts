export interface ChatConversation {
  id: string;
  clientName: string;
  clientAvatar: string;
  lastMessage: string;
  timestamp: string;
  respondedBy: "ai" | "human";
  unread: boolean;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: "client" | "ai" | "staff";
  text: string;
  time: string;
}

export interface CalendarEvent {
  id: string;
  clientName: string;
  service: string;
  professional: string;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  status: "confirmed" | "pending" | "soft_lock";
}

export const mockConversations: ChatConversation[] = [
  {
    id: "1",
    clientName: "Maria Silva",
    clientAvatar: "MS",
    lastMessage: "Perfeito, confirmo às 14h!",
    timestamp: "agora",
    respondedBy: "ai",
    unread: true,
    messages: [
      { id: "m1", sender: "client", text: "Oi, quero agendar um corte pra hoje", time: "10:02" },
      { id: "m2", sender: "ai", text: "Olá Maria! 😊 Temos horários às 14h e 16h30. Qual prefere?", time: "10:02" },
      { id: "m3", sender: "client", text: "14h tá ótimo!", time: "10:03" },
      { id: "m4", sender: "ai", text: "Maravilha! Reservei às 14h com a Juliana. Até lá! 💇‍♀️", time: "10:03" },
      { id: "m5", sender: "client", text: "Perfeito, confirmo às 14h!", time: "10:04" },
    ],
  },
  {
    id: "2",
    clientName: "Ana Costa",
    clientAvatar: "AC",
    lastMessage: "Quanto custa a progressiva?",
    timestamp: "5 min",
    respondedBy: "ai",
    unread: true,
    messages: [
      { id: "m1", sender: "client", text: "Boa tarde! Quanto custa a progressiva?", time: "09:55" },
      { id: "m2", sender: "ai", text: "Oi Ana! A progressiva está R$180. Inclui lavagem e finalização. Quer agendar? 🌟", time: "09:55" },
      { id: "m3", sender: "client", text: "Quanto custa a progressiva?", time: "09:56" },
    ],
  },
  {
    id: "3",
    clientName: "Juliana Ramos",
    clientAvatar: "JR",
    lastMessage: "Pode ser amanhã às 10h?",
    timestamp: "12 min",
    respondedBy: "human",
    unread: false,
    messages: [
      { id: "m1", sender: "client", text: "Oi, preciso de manicure + pedicure", time: "09:48" },
      { id: "m2", sender: "ai", text: "Olá Juliana! Temos horário hoje às 15h. Serve?", time: "09:48" },
      { id: "m3", sender: "client", text: "Hoje não consigo, amanhã pode?", time: "09:49" },
      { id: "m4", sender: "staff", text: "Juliana, amanhã temos às 10h e 14h. Qual prefere?", time: "09:50" },
      { id: "m5", sender: "client", text: "Pode ser amanhã às 10h?", time: "09:50" },
    ],
  },
  {
    id: "4",
    clientName: "Carla Mendes",
    clientAvatar: "CM",
    lastMessage: "Obrigada! Até sábado 🥰",
    timestamp: "28 min",
    respondedBy: "ai",
    unread: false,
    messages: [
      { id: "m1", sender: "client", text: "Quero agendar coloração pro sábado", time: "09:32" },
      { id: "m2", sender: "ai", text: "Oi Carla! No sábado temos às 9h com o Rafael. Pode ser? 🎨", time: "09:32" },
      { id: "m3", sender: "client", text: "Obrigada! Até sábado 🥰", time: "09:33" },
    ],
  },
  {
    id: "5",
    clientName: "Patrícia Souza",
    clientAvatar: "PS",
    lastMessage: "Vocês fazem design de sobrancelha?",
    timestamp: "45 min",
    respondedBy: "ai",
    unread: false,
    messages: [
      { id: "m1", sender: "client", text: "Vocês fazem design de sobrancelha?", time: "09:15" },
      { id: "m2", sender: "ai", text: "Fazemos sim, Patrícia! O design com henna é R$45 e leva 40min. Quer agendar? ✨", time: "09:15" },
    ],
  },
  {
    id: "6",
    clientName: "Fernanda Lima",
    clientAvatar: "FL",
    lastMessage: "Chego em 10 minutos!",
    timestamp: "1h",
    respondedBy: "human",
    unread: false,
    messages: [
      { id: "m1", sender: "client", text: "Tô chegando, deu trânsito", time: "09:00" },
      { id: "m2", sender: "staff", text: "Sem problema, Fernanda! Te aguardamos 😊", time: "09:01" },
      { id: "m3", sender: "client", text: "Chego em 10 minutos!", time: "09:02" },
    ],
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: "e1", clientName: "Fernanda Lima", service: "Corte + Escova", professional: "Juliana", startHour: 8, startMinute: 0, durationMinutes: 60, status: "confirmed" },
  { id: "e2", clientName: "Renata Oliveira", service: "Coloração", professional: "Rafael", startHour: 8, startMinute: 30, durationMinutes: 120, status: "confirmed" },
  { id: "e3", clientName: "Beatriz Santos", service: "Manicure", professional: "Camila", startHour: 9, startMinute: 0, durationMinutes: 45, status: "confirmed" },
  { id: "e4", clientName: "Luciana Ferreira", service: "Progressiva", professional: "Juliana", startHour: 10, startMinute: 0, durationMinutes: 150, status: "confirmed" },
  { id: "e5", clientName: "Débora Almeida", service: "Pedicure", professional: "Camila", startHour: 10, startMinute: 0, durationMinutes: 60, status: "pending" },
  { id: "e6", clientName: "Tatiane Rocha", service: "Corte Masculino", professional: "Rafael", startHour: 11, startMinute: 0, durationMinutes: 30, status: "confirmed" },
  { id: "e7", clientName: "Amanda Dias", service: "Hidratação", professional: "Juliana", startHour: 13, startMinute: 0, durationMinutes: 60, status: "soft_lock" },
  { id: "e8", clientName: "Maria Silva", service: "Corte Feminino", professional: "Juliana", startHour: 14, startMinute: 0, durationMinutes: 45, status: "pending" },
  { id: "e9", clientName: "Priscila Nunes", service: "Escova", professional: "Camila", startHour: 14, startMinute: 0, durationMinutes: 45, status: "confirmed" },
  { id: "e10", clientName: "Cristina Melo", service: "Unha Gel", professional: "Camila", startHour: 15, startMinute: 30, durationMinutes: 90, status: "confirmed" },
  { id: "e11", clientName: "Sandra Pereira", service: "Luzes", professional: "Rafael", startHour: 14, startMinute: 0, durationMinutes: 120, status: "soft_lock" },
  { id: "e12", clientName: "Vanessa Costa", service: "Corte + Barba", professional: "Rafael", startHour: 16, startMinute: 30, durationMinutes: 45, status: "pending" },
];

export const professionals = ["Juliana", "Rafael", "Camila"];
