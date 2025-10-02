import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Copy, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{ name: string; page?: number }>;
}

export const ChatInterface = () => {
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

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Questa è una risposta simulata. Il backend AI verrà integrato successivamente per fornire risposte reali basate sui tuoi documenti Google Drive.",
        timestamp: new Date(),
        sources: [
          { name: "Budget_2024.xlsx", page: 2 },
          { name: "Meeting_Notes.docx" },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4 shadow-soft",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-card border border-border"
              )}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs font-medium mb-2 text-muted-foreground">
                    📄 Fonti:
                  </p>
                  <ul className="text-xs space-y-1">
                    {message.sources.map((source, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        • {source.name}
                        {source.page && ` (p.${source.page})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex gap-2">
                  {message.role === "assistant" && (
                    <>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background px-4 py-4">
        <div className="relative max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi il tuo messaggio..."
            className="min-h-[60px] max-h-[200px] pr-12 resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="sm"
            className="absolute bottom-3 right-3 h-8 w-8 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Premi Invio per inviare, Shift + Invio per andare a capo
        </p>
      </div>
    </div>
  );
};
