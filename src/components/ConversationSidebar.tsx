import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";
import { Plus, MessageSquare, Trash, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChatStorage, SavedConversation } from "@/services/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConversationSidebarProps {
  onSelectConversation?: (id: string) => void;
  onNewChat?: () => void;
}

export const ConversationSidebar = ({ onSelectConversation, onNewChat }: ConversationSidebarProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState("1");
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const loadConversations = async () => {
    setIsRefreshing(true);
    try {
      const savedConversations = await ChatStorage.getAllConversations();
      setConversations(savedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Errore nel caricamento delle conversazioni');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadConversations();
  }, []);

  // Realtime updates from Supabase
  useEffect(() => {
    const channel = supabase
      .channel('chats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats'
        },
        () => {
          setTimeout(() => {
            void loadConversations();
          }, 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll to bottom when conversations change (new or updated)
  useEffect(() => {
    // Try to scroll the Radix ScrollArea viewport to bottom if available
    try {
      const root = (scrollAreaRef.current as any)?.querySelector?.('[data-radix-scroll-area-viewport]') || (scrollAreaRef.current as any)?.querySelector?.('div');
      if (root) {
        // smooth when possible
        if (typeof root.scrollTo === 'function') {
          root.scrollTo({ top: root.scrollHeight, behavior: 'smooth' });
        } else {
          root.scrollTop = root.scrollHeight;
        }
      }
    } catch (e) {
      // ignore
    }
  }, [conversations]);

  // Listen to global updates triggered by ChatInterface for immediate reload
  useEffect(() => {
    const handler = () => {
      void loadConversations();
    };
    window.addEventListener('conversation-updated', handler as EventListener);
    return () => window.removeEventListener('conversation-updated', handler as EventListener);
  }, []);

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* New Chat Button */}
      <div className="p-4 border-b border-sidebar-border space-y-2">
        <Button className="w-full justify-start gap-2" size="lg" onClick={onNewChat}>
          <Plus className="h-5 w-5" />
          Nuova Chat
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          size="sm"
          onClick={() => void loadConversations()}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Aggiorna
        </Button>
      </div>

      {/* Conversations List */}
  <ScrollArea ref={scrollAreaRef as any} className="flex-1">
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
                    onClick={() => {
                      setActiveId(conv.id);
                      if (onSelectConversation) onSelectConversation(conv.id);
                    }}
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(conv.id);
                              }}
                            >
                              <Trash className="h-3 w-3 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Elimina conversazione?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Sei sicuro di voler eliminare questa conversazione? Questa azione non può essere annullata.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  if (deleteId) {
                                    await ChatStorage.deleteConversation(deleteId);
                                    const updated = await ChatStorage.getAllConversations();
                                    setConversations(updated);
                                    toast.success("Conversazione eliminata");
                                    setDeleteId(null);
                                  }
                                }}
                              >Elimina</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
  {/* ...nessun pulsante impostazioni... */}
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
