// Test script per verificare l'integrazione webhook
import { ChatAPI } from './src/services/api';

async function testWebhookIntegration() {
  console.log('🧪 Test integrazione webhook...');
  
  try {
    // Test 1: Creazione conversazione
    console.log('1. Creazione conversazione...');
    const conversationId = await ChatAPI.createConversation();
    console.log('✅ Conversazione creata:', conversationId);
    
    // Test 2: Invio messaggio
    console.log('2. Invio messaggio di test...');
    const response = await ChatAPI.sendMessage('Ciao, questo è un test', conversationId);
    console.log('✅ Risposta ricevuta:', response);
    
    console.log('🎉 Tutti i test completati con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error);
  }
}

// Esegui il test se questo file viene eseguito direttamente
if (typeof window === 'undefined') {
  testWebhookIntegration();
}
