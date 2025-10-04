import { useState } from "react";
import { Header } from "@/components/Header";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { DocumentPanel } from "@/components/DocumentPanel";
import { cn } from "@/lib/utils";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newConversationTrigger, setNewConversationTrigger] = useState(0);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);

  const handleNewConversation = () => {
    setNewConversationTrigger(prev => prev + 1);
    setActiveConversationId(undefined);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile by default */}
        <aside
          className={cn(
            "w-64 lg:w-72 shrink-0 transition-transform duration-300",
            "lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "absolute lg:relative h-full z-40"
          )}
        >
          <ConversationSidebar onSelectConversation={setActiveConversationId} onNewChat={handleNewConversation} />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className="flex-1 min-w-0">
          <ChatInterface 
            onNewConversation={handleNewConversation}
            newConversationTrigger={newConversationTrigger}
            savedConversationId={activeConversationId}
          />
        </main>

        {/* Document Panel rimosso */}
      </div>
    </div>
  );
};

export default Chat;
