const WEBHOOK_URL = 'https://fiscalot.duckdns.org/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789';
const PROXY_URL = 'http://localhost:3001/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789';

// Funzione per determinare quale URL usare
function getWebhookUrl(): string {
  // Prova prima il proxy locale, poi quello diretto
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return PROXY_URL;
  }
  return WEBHOOK_URL;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{ name: string; link: string }>;
}

export interface WebhookRequest {
  message: string;
  conversationId?: string;
  userId?: string;
}

export interface WebhookResponse {
  response: string;
  sources?: Array<{ name: string; link: string }>;
  conversationId?: string;
}

export class ChatAPI {
  static async sendMessage(message: string, conversationId?: string): Promise<WebhookResponse> {
    try {
      const requestBody: WebhookRequest = {
        message,
        conversationId,
        userId: 'default-user' // TODO: Implementare autenticazione utente
      };

      const webhookUrl = getWebhookUrl();

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Errore invio messaggio al webhook:', error);
      
      // Se è un errore CORS o di rete, proviamo con un formato diverso
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return await this.sendMessageAlternative(message, conversationId);
      }
      
      throw error;
    }
  }

  // Metodo alternativo per testare diversi formati
  static async sendMessageAlternative(message: string, conversationId?: string): Promise<WebhookResponse> {
    try {
      // Prova con un formato più semplice
      const simpleBody = {
        text: message,
        id: conversationId || `conv_${Date.now()}`
      };

      const response = await fetch(getWebhookUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simpleBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Adatta la risposta al formato atteso
      return {
        response: data.response || data.text || data.message || 'Risposta ricevuta',
        sources: data.sources || [],
        conversationId: data.conversationId || conversationId
      };
    } catch (error) {
      console.error('❌ Errore anche con formato alternativo:', error);
      throw error;
    }
  }

  static async createConversation(): Promise<string> {
    // Genera un ID conversazione univoco
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
