# Express Gateway API Gateway

A complete, production-ready API Gateway built with Express Gateway.

## Features

- 🔐 JWT Authentication & Authorization
- ⚡ Rate Limiting
- 🌐 CORS Support
- 📊 Request Logging
- 🔄 Request/Response Transformation
- 🛡️ Security Headers
- 🏥 Health Checks
- 🐳 Docker Support
- 📈 Circuit Breaker
- 🔑 API Key Authentication

## Quick Start

### Prerequisites

- Node.js 18+
- Redis
- Docker (optional)

### Installation

1. **Clone and install:**
```bash
git clone <repository>
cd express-gateway-project
npm install
```


2. **Configure environment:**

```bash
cp .env.example .env
# Edit .env with your configuration
```


3. **Start services:**

```bash
# Using Docker (recommended)
npm run docker:up

# Or manually
redis-server &
npm start
```


### Usage

**Access the gateway:**

```bash
# API Gateway
http://localhost:8080

# Admin interface
http://localhost:9876
```

**Example requests:**

```bash
# Health check
curl http://localhost:8080/health

# Public product search
curl http://localhost:8080/products/search?q=laptop

# Protected user profile (requires JWT)
curl -H "Authorization: Bearer <jwt-token>" http://localhost:8080/users/me
```


### Configuration

***Environment Variables***

See `.env.example` for all available configuration options.


***Adding New Services***

1. Update config/gateway.config.yml:

    - Add new apiEndpoints
    - Add new serviceEndpoints
    - Create new pipeline


***Custom Policies***
See `extensions/custom-policy` for examples of custom policy development.


### Development

```bash
# Development mode
npm run dev

# Run tests
npm test

# Create test credentials
npm run create-user
```

###Deployment

**Docker**

```bash
npm run docker:build
npm run docker:up
```
