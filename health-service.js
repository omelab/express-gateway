const express = require('express');
const app = express();
const PORT = 3005;

// Middleware
app.use(express.json());

// Health endpoint
app.get(['/health', '/status', '/'], (req, res) => {
  const healthData = {
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    endpoints: {
      auth: '/auth/*',
      users: '/users/*',
      products: '/products/*',
      orders: '/orders/*',
    },
  };

  res.json(healthData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Health service running on http://localhost:${PORT}`);
  console.log(`   Endpoints: /health, /status, /`);
});

module.exports = app;
