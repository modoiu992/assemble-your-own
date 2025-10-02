import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Star, Archive, Settings, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isStarred: boolean;
}

export const ConversationSidebar = () => {
  const [activeId, setActiveId] = useState("1");
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Analisi Budget Q4 2024",
      lastMessage: "Questa è una risposta simulata...",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isStarred: true,
    },
    {
      id: "2",
      title: "Report Vendite Gennaio",
      lastMessage: "I dati mostrano un incremento...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isStarred: false,
    },
    {
      id: "3",
      title: "Documenti Progetto Alpha",
      lastMessage: "Ho trovato 5 documenti...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isStarred: false,
    },
  ]);

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
            {conversations.map((conv) => (
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
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-sidebar-foreground/40 mt-1">
                      {getRelativeTime(conv.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {conv.isStarred && <Star className="h-3 w-3 fill-accent text-accent" />}
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border p-2">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
            <Star className="h-4 w-4" />
            Preferiti
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
            <Archive className="h-4 w-4" />
            Archivio
          </Button>
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
