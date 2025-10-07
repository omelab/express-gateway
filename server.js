require('dotenv').config();
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

class GatewayServer {
  constructor() {
    this.config = {
      env: process.env.NODE_ENV || 'development',
      configDir: process.env.EG_CONFIG_DIR || path.join(__dirname, 'config'),
    };
  }

  initialize() {
    this.setupEnvironment();
    this.setupErrorHandling();
    this.validateConfiguration();
    this.loadGatewayConfig();
    return this;
  }

  setupEnvironment() {
    process.env.EG_CONFIG_DIR = this.config.configDir;

    console.log('🚀 Express Gateway Server');
    console.log(`🌍 Environment: ${this.config.env}`);
    console.log(`📁 Config: ${this.config.configDir}`);
    console.log(`🕒 Started: ${new Date().toISOString()}`);
    console.log('');
  }

  setupErrorHandling() {
    process.on('SIGINT', this.gracefulShutdown.bind(this, 'SIGINT'));
    process.on('SIGTERM', this.gracefulShutdown.bind(this, 'SIGTERM'));

    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  validateConfiguration() {
    if (!fs.existsSync(this.config.configDir)) {
      throw new Error(`Config directory not found: ${this.config.configDir}`);
    }
  }

  loadGatewayConfig() {
    try {
      const gatewayConfigPath = path.join(
        this.config.configDir,
        'gateway.config.yml'
      );

      if (fs.existsSync(gatewayConfigPath)) {
        const gatewayConfig = yaml.load(
          fs.readFileSync(gatewayConfigPath, 'utf8')
        );
        this.gatewayConfig = gatewayConfig;
        this.displayGatewayInfo(gatewayConfig);
      }
    } catch (error) {
      console.warn(
        '⚠️  Could not load gateway config for display:',
        error.message
      );
    }
  }

  displayGatewayInfo(config) {
    const httpPort = config.http?.port || 8080;
    const adminPort = config.admin?.port || 9876;

    console.log('🔌 Gateway URLs:');
    console.log(`   🌐 API Gateway: http://localhost:${httpPort}`);
    console.log(`   ⚙️  Admin Panel: http://localhost:${adminPort}`);
    console.log('');

    // Display API Endpoints
    if (config.apiEndpoints) {
      console.log('📡 API Endpoints:');
      Object.entries(config.apiEndpoints).forEach(([name, endpoint]) => {
        const paths = endpoint.paths?.join(', ') || '/*';
        console.log(`   📍 ${name.padEnd(12)} → ${paths}`);
      });
      console.log('');
    }

    // Display Service Endpoints with actual values
    if (config.serviceEndpoints) {
      console.log('🔗 Backend Services:');
      Object.entries(config.serviceEndpoints).forEach(([name, service]) => {
        const url = service.url || 'N/A';
        console.log(`   🎯 ${name.padEnd(15)} → ${url}`);
      });
      console.log('');
    }

    console.log('📋 Example Requests:');
    console.log(`   curl http://localhost:${httpPort}/health`);
    console.log(`   curl http://localhost:${httpPort}/users/123`);
    console.log(`   curl http://localhost:${httpPort}/products`);
    console.log('');
  }

  gracefulShutdown(signal) {
    console.log(`\n${signal} received, shutting down gracefully...`);
    process.exit(0);
  }

  start() {
    try {
      console.log('▶️  Starting Express Gateway...');
      console.log('─'.repeat(60));

      // Start the gateway
      require('express-gateway')().run();

      console.log('✅ Gateway is running!');
      console.log('─'.repeat(60));
    } catch (error) {
      console.error('❌ Gateway startup failed:', error.message);
      process.exit(1);
    }
  }
}

// Start the server
new GatewayServer().initialize().start();
