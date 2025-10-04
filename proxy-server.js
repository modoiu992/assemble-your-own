// Proxy server per bypassare CORS
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Abilita CORS per tutte le richieste
app.use(cors());

// Proxy per il webhook
app.use('/webhook', createProxyMiddleware({
  target: 'https://fiscalot.duckdns.org',
  changeOrigin: true,
  pathRewrite: {
    '^/webhook': '/webhook'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Proxy request:', req.method, req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('📡 Proxy response:', proxyRes.statusCode);
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook proxy: http://localhost:${PORT}/webhook/a4e94c40-adcc-45cc-9e4d-4b0906a9c789`);
});
