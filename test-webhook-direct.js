// Test diretto del webhook dalla console del browser
async function testWebhookNow() {
  const webhookUrl = 'https://fiscalot.duckdns.org/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789';
  
  const testData = {
    message: "Ciao! Questo è un test del webhook",
    conversationId: "test_" + Date.now(),
    userId: "test-user"
  };
  
  console.log('🚀 Invio test al webhook:', webhookUrl);
  console.log('📤 Dati inviati:', testData);
  
  try {
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
      return data;
    } else {
      const errorText = await response.text();
      console.error('❌ Errore HTTP:', response.status, errorText);
    }
  } catch (error) {
    console.error('❌ Errore di rete:', error);
  }
}

// Esegui il test
testWebhookNow();
