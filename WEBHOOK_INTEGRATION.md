# Integrazione Webhook AI

## Panoramica

L'applicazione AI Drive Assistant è stata integrata con un webhook POST per fornire risposte AI reali invece delle simulazioni.

## Configurazione

### URL Webhook
```
https://fiscalot.duckdns.org/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789
```

## Struttura API

### Richiesta (POST)
```typescript
interface WebhookRequest {
  message: string;           // Messaggio dell'utente
  conversationId?: string;   // ID conversazione (opzionale)
  userId?: string;          // ID utente (opzionale)
}
```

### Risposta
```typescript
interface WebhookResponse {
  response: string;         // Risposta dell'AI
  sources?: Array<{         // Fonti citate (opzionale)
    name: string;
    page?: number;
  }>;
  conversationId?: string;   // ID conversazione aggiornato (opzionale)
}
```

## Funzionalità Implementate

### 1. Servizio API (`src/services/api.ts`)
- `ChatAPI.sendMessage()` - Invia messaggio al webhook
- `ChatAPI.createConversation()` - Crea nuovo ID conversazione
- Gestione errori HTTP e timeout

### 2. Interfaccia Chat (`src/components/ChatInterface.tsx`)
- Integrazione webhook sostituisce la simulazione
- Gestione stati di caricamento
- Gestione errori con messaggi utente-friendly
- Supporto per citazioni delle fonti
- Pulsante "Nuova Chat" per iniziare conversazioni fresche

### 3. Gestione Conversazioni
- ID conversazione persistente durante la sessione
- Possibilità di iniziare nuove conversazioni
- Trigger dalla sidebar per nuove chat

## Gestione Errori

- **Errori di rete**: Mostra messaggio di errore all'utente
- **Errori HTTP**: Log dell'errore e notifica toast
- **Timeout**: Gestione automatica dei timeout di rete
- **Fallback**: Messaggio di errore user-friendly se il webhook non risponde

## Stati dell'Applicazione

1. **Typing**: Indicatore di caricamento durante la chiamata al webhook
2. **Success**: Messaggio aggiunto alla conversazione con eventuali fonti
3. **Error**: Messaggio di errore mostrato all'utente
4. **New Conversation**: Reset della conversazione con nuovo ID

## Test

Per testare l'integrazione:

1. Avvia il server di sviluppo: `npm run dev`
2. Naviga alla pagina `/chat`
3. Invia un messaggio per testare la chiamata al webhook
4. Verifica la gestione degli errori disconnettendo la rete
5. Testa il pulsante "Nuova Chat" per iniziare una nuova conversazione

## Note Tecniche

- Il webhook viene chiamato in modo asincrono
- Gli errori vengono gestiti gracefully senza bloccare l'UI
- I conversationId vengono generati lato client se non forniti dal server
- Le fonti vengono mostrate solo se presenti nella risposta
- Toast notifications per feedback utente immediato
