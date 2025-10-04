import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatAPI } from "@/services/api";
import { toast } from "sonner";

export const WebhookTest = () => {
  const [testMessage, setTestMessage] = useState("Ciao, questo è un test");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [testFormat, setTestFormat] = useState("standard");

  const testWebhook = async () => {
    setIsLoading(true);
    try {
      console.log("🧪 Avvio test webhook...");
      
      const conversationId = await ChatAPI.createConversation();
      console.log("✅ Conversazione creata:", conversationId);
      
      let response;
      if (testFormat === "alternative") {
        response = await ChatAPI.sendMessageAlternative(testMessage, conversationId);
      } else {
        response = await ChatAPI.sendMessage(testMessage, conversationId);
      }
      
      console.log("✅ Risposta ricevuta:", response);
      
      setLastResponse(response);
      toast.success("Test webhook completato con successo!");
      
    } catch (error) {
      console.error("❌ Errore test webhook:", error);
      toast.error(`Errore durante il test webhook: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setIsLoading(true);
    try {
      const webhookUrl = 'https://fiscalot.duckdns.org/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789';
      
      const testData = {
        message: testMessage,
        conversationId: `test_${Date.now()}`,
        userId: "test-user"
      };
      
      console.log('🚀 Test diretto fetch:', webhookUrl);
      console.log('📤 Dati:', testData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      console.log('📡 Risposta HTTP:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Risposta ricevuta:', data);
        setLastResponse(data);
        toast.success("Test diretto completato!");
      } else {
        const errorText = await response.text();
        console.error('❌ Errore HTTP:', response.status, errorText);
        setLastResponse({ error: `HTTP ${response.status}: ${errorText}` });
        toast.error(`Errore HTTP: ${response.status}`);
      }
      
    } catch (error) {
      console.error("❌ Errore test diretto:", error);
      setLastResponse({ error: error.message });
      toast.error(`Errore: ${error.message}`);
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
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Formato di Test:
          </label>
          <Select value={testFormat} onValueChange={setTestFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (ChatAPI)</SelectItem>
              <SelectItem value="alternative">Alternativo (formato semplice)</SelectItem>
              <SelectItem value="direct">Diretto (fetch)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={testWebhook} 
            disabled={isLoading || testFormat === "direct"}
            className="flex-1"
          >
            {isLoading ? "Test in corso..." : "Testa con ChatAPI"}
          </Button>
          
          <Button 
            onClick={testDirectFetch} 
            disabled={isLoading || testFormat !== "direct"}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? "Test in corso..." : "Test Diretto"}
          </Button>
        </div>
        
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
