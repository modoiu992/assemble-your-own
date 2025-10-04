const WEBHOOK_URL = 'https://fiscalot.duckdns.org/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789';

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{ name: string; page?: number }>;
}

export interface WebhookRequest {
  message: string;
  conversationId?: string;
  userId?: string;
}

export interface WebhookResponse {
  response: string;
  sources?: Array<{ name: string; page?: number }>;
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

      console.log('🚀 Invio messaggio al webhook:', WEBHOOK_URL);
      console.log('📤 Payload:', requestBody);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Risposta HTTP:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Risposta ricevuta:', data);
      return data;
    } catch (error) {
      console.error('❌ Errore invio messaggio al webhook:', error);
      throw error;
    }
  }

  static async createConversation(): Promise<string> {
    // Genera un ID conversazione univoco
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
