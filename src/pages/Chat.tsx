import { useState } from "react";
import { Header } from "@/components/Header";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { DocumentPanel } from "@/components/DocumentPanel";
import { WebhookTest } from "@/components/WebhookTest";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newConversationTrigger, setNewConversationTrigger] = useState(0);
  const [showTest, setShowTest] = useState(false);

  const handleNewConversation = () => {
    setNewConversationTrigger(prev => prev + 1);
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
          <ConversationSidebar />
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
          {showTest ? (
            <div className="h-full flex items-center justify-center p-4">
              <WebhookTest />
            </div>
          ) : (
            <ChatInterface 
              onNewConversation={handleNewConversation}
              newConversationTrigger={newConversationTrigger}
            />
          )}
          
          {/* Test Toggle Button */}
          <div className="absolute top-20 right-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTest(!showTest)}
              className="gap-2"
            >
              <TestTube className="h-4 w-4" />
              {showTest ? "Nascondi Test" : "Test Webhook"}
            </Button>
          </div>
        </main>

        {/* Document Panel - Hidden on mobile and tablet */}
        <aside className="w-80 shrink-0 hidden xl:block">
          <DocumentPanel />
        </aside>
      </div>
    </div>
  );
};

export default Chat;
