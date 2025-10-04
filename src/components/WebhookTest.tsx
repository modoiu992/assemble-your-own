import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatAPI } from "@/services/api";
import { toast } from "sonner";

export const WebhookTest = () => {
  const [testMessage, setTestMessage] = useState("Ciao, questo è un test");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const testWebhook = async () => {
    setIsLoading(true);
    try {
      console.log("🧪 Avvio test webhook...");
      
      const conversationId = await ChatAPI.createConversation();
      console.log("✅ Conversazione creata:", conversationId);
      
      const response = await ChatAPI.sendMessage(testMessage, conversationId);
      console.log("✅ Risposta ricevuta:", response);
      
      setLastResponse(response);
      toast.success("Test webhook completato con successo!");
      
    } catch (error) {
      console.error("❌ Errore test webhook:", error);
      toast.error("Errore durante il test webhook");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Test Integrazione Webhook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Messaggio di Test:
          </label>
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Inserisci un messaggio di test..."
          />
        </div>
        
        <Button 
          onClick={testWebhook} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Test in corso..." : "Testa Webhook"}
        </Button>
        
        {lastResponse && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Ultima Risposta:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p><strong>Webhook URL:</strong> https://fiscalot.duckdns.org/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789</p>
          <p><strong>Metodo:</strong> POST</p>
          <p><strong>Content-Type:</strong> application/json</p>
        </div>
      </CardContent>
    </Card>
  );
};
