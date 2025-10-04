// Test per verificare il nuovo formato JSON
const testNewFormat = () => {
  console.log('🧪 Test nuovo formato JSON...');
  
  // Simula la risposta dell'agente AI
  const mockResponse = {
    "response": "Il budget marketing 2024 è di €250.000",
    "sources": [
      {
        "name": "Budget_2024.xlsx",
        "link": "https://drive.google.com/file/d/abc123/view"
      },
      {
        "name": "Piano_Marketing_2024.pdf",
        "link": "https://drive.google.com/file/d/xyz789/view"
      }
    ]
  };
  
  console.log('✅ Formato JSON valido:', mockResponse);
  
  // Test caso senza fonti
  const mockResponseNoSources = {
    "response": "Non ho trovato informazioni su questo nei documenti",
    "sources": []
  };
  
  console.log('✅ Formato senza fonti:', mockResponseNoSources);
  
  return { mockResponse, mockResponseNoSources };
};

// Esegui il test
testNewFormat();
