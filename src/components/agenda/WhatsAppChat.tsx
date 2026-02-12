import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, ArrowLeft, Send, MessageCircle } from "lucide-react";
import { ChatConversation } from "./mockData";

interface Props {
  conversations: ChatConversation[];
}

const WhatsAppChat = ({ conversations }: Props) => {
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden glass shadow-card border border-border/30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2"
        style={{ background: "linear-gradient(135deg, hsl(320 80% 50% / 0.1), hsl(270 65% 50% / 0.05))" }}
      >
        {selectedChat ? (
          <button onClick={() => setSelectedChat(null)} className="p-1 rounded-lg hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-primary" />
          </button>
        ) : (
          <MessageCircle className="w-4 h-4 text-primary" />
        )}
        <h3 className="font-display text-sm font-semibold text-foreground">
          {selectedChat ? selectedChat.clientName : "Monitoramento IA"}
        </h3>
        {!selectedChat && (
          <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
            {conversations.filter(c => c.unread).length} novas
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div
              key="chat"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {selectedChat.messages.map((msg) => {
                  const isClient = msg.sender === "client";
                  return (
                    <div key={msg.id} className={`flex ${isClient ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs ${
                          isClient
                            ? "bg-muted text-foreground rounded-bl-sm"
                            : msg.sender === "ai"
                              ? "bg-primary/15 text-foreground rounded-br-sm"
                              : "bg-accent/15 text-foreground rounded-br-sm"
                        }`}
                      >
                        {!isClient && (
                          <span className="text-[9px] font-semibold block mb-0.5 text-muted-foreground">
                            {msg.sender === "ai" ? "🤖 Bella IA" : "👤 Staff"}
                          </span>
                        )}
                        <p>{msg.text}</p>
                        <span className="text-[9px] text-muted-foreground mt-1 block text-right">{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input mock */}
              <div className="p-2 border-t border-border/30">
                <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                  <input
                    readOnly
                    placeholder="Assumir conversa..."
                    className="flex-1 bg-transparent text-xs outline-none text-muted-foreground placeholder:text-muted-foreground/60"
                  />
                  <Send className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-border/20 text-left"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                    {conv.clientAvatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{conv.clientName}</span>
                      <span className="text-[9px] text-muted-foreground shrink-0 ml-2">{conv.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                  </div>

                  {/* Responder indicator */}
                  <div className="shrink-0 flex items-center gap-1">
                    {conv.respondedBy === "ai" ? (
                      <span className="text-sm" title="IA respondendo">🤖</span>
                    ) : (
                      <span className="text-sm" title="Staff respondendo">👤</span>
                    )}
                    {conv.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WhatsAppChat;
