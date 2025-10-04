import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Settings, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChatStorage, SavedConversation } from "@/services/storage";

export const ConversationSidebar = () => {
  const [activeId, setActiveId] = useState("1");
  const [conversations, setConversations] = useState<SavedConversation[]>([]);

  // Carica le conversazioni salvate
  useEffect(() => {
    const savedConversations = ChatStorage.getAllConversations();
    setConversations(savedConversations);
  }, []);

  // Aggiorna le conversazioni quando cambiano
  useEffect(() => {
    const interval = setInterval(() => {
      const savedConversations = ChatStorage.getAllConversations();
      setConversations(savedConversations);
    }, 1000); // Controlla ogni secondo per aggiornamenti

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* New Chat Button */}
      <div className="p-4 border-b border-sidebar-border">
        <Button className="w-full justify-start gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Nuova Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Conversazioni Recenti
            </h3>
          </div>
          <div className="space-y-1">
            {conversations.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <MessageSquare className="h-8 w-8 text-sidebar-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-sidebar-foreground/60">
                  Nessuna conversazione salvata
                </p>
                <p className="text-xs text-sidebar-foreground/40 mt-1">
                  Inizia una nuova chat per vedere le conversazioni qui
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveId(conv.id)}
                    className={cn(
                      "w-full text-left rounded-md p-3 transition-all group hover:bg-sidebar-accent",
                      activeId === conv.id && "bg-sidebar-accent"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-sidebar-foreground/60 flex-shrink-0" />
                          <h4 className="text-sm font-medium truncate text-sidebar-foreground">
                            {conv.title}
                          </h4>
                        </div>
                        <p className="text-xs text-sidebar-foreground/60 truncate mt-1">
                          {lastMessage?.content
                            ? lastMessage.content.slice(0, 50) + (lastMessage.content.length > 50 ? '...' : '')
                            : 'Nessun messaggio'}
                        </p>
                        <p className="text-xs text-sidebar-foreground/40 mt-1">
                          {getRelativeTime(conv.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            ChatStorage.deleteConversation(conv.id);
                          }}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border p-2">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
            <Settings className="h-4 w-4" />
            Impostazioni
          </Button>
        </div>
      </div>
    </div>
  );
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Ora";
  if (minutes < 60) return `${minutes}m fa`;
  if (hours < 24) return `${hours}h fa`;
  return `${days}g fa`;
}
