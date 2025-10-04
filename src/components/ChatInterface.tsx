import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Copy, RefreshCw, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatAPI, Message } from "@/services/api";
import { ChatStorage, SavedConversation } from "@/services/storage";
import { toast } from "sonner";

interface ChatInterfaceProps {
  onNewConversation?: () => void;
  newConversationTrigger?: number;
  savedConversationId?: string;
}

export const ChatInterface = ({ onNewConversation, newConversationTrigger, savedConversationId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Ciao! Sono il tuo assistente AI per Google Drive. Posso aiutarti a trovare informazioni nei tuoi documenti, rispondere a domande e molto altro. Come posso aiutarti oggi?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [internalSavedConversationId, setInternalSavedConversationId] = useState<string | undefined>();
  const [messageRatings, setMessageRatings] = useState<Record<string, 'like' | 'dislike' | null>>({});

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Messaggio copiato negli appunti");
  };

  const handleRegenerateMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (!previousUserMessage || previousUserMessage.role !== 'user') return;

    setIsTyping(true);
    try {
      const response = await ChatAPI.sendMessage(previousUserMessage.content, conversationId);
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[messageIndex] = newMessage;
        return newMessages;
      });
    } catch (error) {
      console.error('Error regenerating message:', error);
      toast.error("Errore nella rigenerazione del messaggio");
    } finally {
      setIsTyping(false);
    }
  };

  const handleRateMessage = (messageId: string, rating: 'like' | 'dislike') => {
    setMessageRatings(prev => ({
      ...prev,
      [messageId]: prev[messageId] === rating ? null : rating
    }));

    const action = rating === 'like' ? 'mi piace' : 'non mi piace';
    const currentRating = messageRatings[messageId];

    if (currentRating === rating) {
      toast.success(`Hai rimosso il ${action}`);
    } else {
      toast.success(`Hai messo ${action}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      const title = ChatStorage.generateConversationTitle(messages);
      const conversation: SavedConversation = {
        id: internalSavedConversationId || `conv_${Date.now()}`,
        title,
        messages,
        createdAt: internalSavedConversationId ? ChatStorage.getConversation(internalSavedConversationId)?.createdAt || new Date() : new Date(),
        updatedAt: new Date()
      };
      ChatStorage.saveConversation(conversation);
      setInternalSavedConversationId(conversation.id);
    }
  }, [messages, internalSavedConversationId]);

  useEffect(() => {
    if (savedConversationId) {
      const conv = ChatStorage.getConversation(savedConversationId);
      if (conv) {
        setMessages(conv.messages);
        setConversationId(conv.id);
        setInternalSavedConversationId(conv.id);
      }
    }
  }, [savedConversationId]);

  useEffect(() => {
    if (newConversationTrigger && newConversationTrigger > 0) {
      void handleNewConversation();
    }
  }, [newConversationTrigger]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
  // notify sidebar (and other listeners) that conversation updated
  try { window.dispatchEvent(new CustomEvent('conversation-updated')); } catch (e) { /* ignore */ }
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = await ChatAPI.createConversation();
        setConversationId(currentConversationId);
      }

      const response = await ChatAPI.sendMessage(currentInput, currentConversationId);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, aiResponse]);
  try { window.dispatchEvent(new CustomEvent('conversation-updated')); } catch (e) { /* ignore */ }

      if (response.conversationId && response.conversationId !== currentConversationId) {
        setConversationId(response.conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Mi dispiace, si è verificato un errore durante l'invio del messaggio. Riprova tra qualche momento.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Errore nella comunicazione con il server");
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = async () => {
    const newConversationId = await ChatAPI.createConversation();
    setConversationId(newConversationId);
    // Reset internal saved conversation id so a fresh conversation starts
    setInternalSavedConversationId(undefined);
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Ciao! Sono il tuo assistente AI per Google Drive. Posso aiutarti a trovare informazioni nei tuoi documenti, rispondere a domande e molto altro. Come posso aiutarti oggi?",
        timestamp: new Date(),
      },
    ]);
  try { window.dispatchEvent(new CustomEvent('conversation-updated')); } catch (e) { /* ignore */ }
  toast.success("Nuova conversazione iniziata");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Button variant="outline" size="sm" onClick={onNewConversation} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuova Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-end", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "assistant" && (
              <div className="flex-shrink-0 mr-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold shadow-soft">AI</div>
              </div>
            )}

            <div className={cn("max-w-[80%] rounded-2xl p-4 shadow-[var(--shadow-soft)]",
              message.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md rounded-tl-2xl ml-auto"
                : "bg-card border border-border rounded-bl-md rounded-tr-2xl"
            )}>
              <div className="prose prose-sm max-w-none dark:prose-invert text-sm leading-relaxed">
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>

              {Array.isArray(message.sources) && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/40">
                  <p className="text-xs font-medium mb-2 text-muted-foreground">📄 Fonti:</p>
                  <ul className="text-xs space-y-1">
                    {message.sources.map((source, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        <a href={source.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">• {source.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                <div className="flex gap-2 items-center">
                  {message.role === "assistant" && (
                    <>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleCopyMessage(message.content)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleRegenerateMessage(message.id)}>
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className={cn("h-7 w-7 p-0", messageRatings[message.id] === 'like' && "text-green-600 bg-green-50")} onClick={() => handleRateMessage(message.id, 'like')}>
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className={cn("h-7 w-7 p-0", messageRatings[message.id] === 'dislike' && "text-red-600 bg-red-50")} onClick={() => handleRateMessage(message.id, 'dislike')}>
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 ml-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">TU</div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start">
            <div className="mr-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold shadow-soft">AI</div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 shadow-soft">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background px-4 py-4">
        <div className="relative max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi il tuo messaggio..."
            className="min-h-[60px] max-h-[200px] pr-12 resize-none"
          />
          <Button onClick={() => void handleSend()} disabled={!input.trim()} size="sm" className="absolute bottom-3 right-3 h-8 w-8 p-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">Premi Invio per inviare, Shift + Invio per andare a capo</p>
      </div>
    </div>
  );
};

export default ChatInterface;
