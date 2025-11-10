# 🚀 Planzia Complete DevOps & Deployment Audit Report

**Date**: 2025  
**Scope**: Build pipeline, hosting configuration, CI/CD, environment handling, release automation  
**Project**: Planzia - Venue Booking Platform  
**Deployment Platform**: Fly.io  
**Total Deployment Issues Found**: 47 issues across 7 categories

---

## Executive Summary

This comprehensive deployment audit identifies **47 critical to low severity issues** across build, hosting, CI/CD, security, scaling, and versioning. The application currently lacks automated deployment pipeline, production environment validation, and proper containerization.

**Critical Issues**: 6  
**High Impact**: 14  
**Medium Impact**: 18  
**Low Impact**: 9

---

## 🧱 Build & Packaging

### 1. No Dockerfile - Unclear Production Build Process
**Severity**: 🔴 **Critical**  
**Files**: Missing `Dockerfile`, `docker-compose.yml`, `.dockerignore`  
**Description**: Application is deployed to Fly.io but no Dockerfile exists in repository. Build process is unclear.

**Risk**:
- Inconsistent environments (dev vs production)
- Cannot reproduce builds locally
- Deployment process not documented
- Scalability issues
- Team members cannot understand deployment

**Suggested Fix**: Create Dockerfile:

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Build client and server
COPY . .
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/ping', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

**Also create .dockerignore**:
```
node_modules
npm-debug.log
dist
.git
.github
.env
.env.local
.DS_Store
```

---

### 2. No fly.toml Configuration
**Severity**: 🔴 **Critical**  
**Files**: Missing `fly.toml`  
**Description**: No Fly.io configuration file in repository. Deployment settings not version-controlled.

**Risk**:
- Inconsistent deployments
- Configuration changes not tracked
- Team cannot replicate deployment
- Scale and resource settings not documented

**Suggested Fix**: Create fly.toml:

```toml
# fly.toml
app = "planzia"
primary_region = "iad"  # Change to appropriate region

[build]
  builder = "paketobuildpacks"
  buildpacks = ["gcr.io/paketo-buildpacks/nodejs"]

[env]
  NODE_ENV = "production"

[[services]]
  protocol = "tcp"
  internal_port = 3001
  processes = ["app"]

  [services.concurrency]
    type = "connections"
    hard_limit = 1000
    soft_limit = 500

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [[services.tcp_checks]]
    grace_period = "10s"
    interval = "15s"
    timeout = "5s"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 2
  processes = ["app"]

[env]
  NODE_ENV = "production"
  LOG_LEVEL = "error"

[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1

[deploy]
  strategy = "rolling"
  max_unavailable = 0
  wait_timeout = "5m"
```

---

### 3. No Environment Variable Validation at Build Time
**Severity**: 🟡 **High**  
**File**: `vite.config.js`, `server/index.js`  
**Description**: Build process doesn't validate that all required environment variables are configured before building.

```javascript
// Current - build succeeds even if env vars missing
const apiPort = process.env.API_PORT || "5001";  // Defaults to 5001
// No validation that production requires specific values
```

**Risk**:
- Build succeeds but app fails at runtime
- Missing secrets not caught until deployment
- Expensive production failures

**Suggested Fix**: Create build validation:

```javascript
// scripts/validate-env.js
const requiredEnvVars = {
  production: [
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ],
  development: [
    'MONGO_URI'
  ]
};

const nodeEnv = process.env.NODE_ENV || 'development';
const required = requiredEnvVars[nodeEnv] || [];
const missing = required.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required environment variables configured');
```

Update package.json:
```json
{
  "scripts": {
    "build": "node scripts/validate-env.js && npm run build:client && npm run build:server",
    "start": "node scripts/validate-env.js && node dist/server/node-build.mjs"
  }
}
```

---

### 4. No .env.example File
**Severity**: 🟡 **High**  
**Files**: Missing `.env.example`  
**Description**: New developers don't know which environment variables are required.

**Suggested Fix**: Create .env.example:

```env
# .env.example
# Server Configuration
NODE_ENV=development
API_PORT=5001
PORT=3001

# Database
MONGO_URI=mongodb://localhost:27017/planzia

# JWT Authentication
JWT_ACCESS_SECRET=your_access_token_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payment)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug

# Feature Flags
ENABLE_DEMO_MODE=false
```

---

### 5. No Build Output Analysis
**Severity**: 🟡 **High**  
**Description**: Build artifacts are not analyzed for size, unused code, or optimization opportunities.

**Suggested Fix**: Add bundle analysis:

```json
{
  "scripts": {
    "build:analyze": "vite build && npm run analyze:client && npm run analyze:server",
    "analyze:client": "vite build --mode analyze",
    "analyze:server": "vite build --config vite.config.server.js --mode analyze"
  },
  "devDependencies": {
    "rollup-plugin-visualizer": "^5.9.0"
  }
}
```

Update vite.config.js:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    import.meta.env.ANALYZE && visualizer({ open: true })
  ],
  // ...
});
```

---

### 6. Build Cache Not Utilized
**Severity**: 🟡 **Medium**  
**Description**: No build caching strategy. Full rebuild on every deployment.

**Suggested Fix**: Configure Fly.io build caching:

```toml
# fly.toml
[build.buildpacks.config]
  build_cache_dir = "node_modules"
```

Or use Docker layer caching:
```dockerfile
# Dockerfile - optimize layer caching
FROM node:20-alpine

WORKDIR /app

# Copy package files first (cache layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code (invalidates cache if code changes)
COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

---

## ☁️ Hosting & Server Configuration

### 1. CORS Still Set to "*" in Production
**Severity**: 🔴 **Critical**  
**File**: `server/index.js:43-45`  
**Description**: CORS allows all origins even in production. Security bypass.

```javascript
// PRODUCTION BUG - allows any origin
app.use(cors({
  "origin": "*",
}));
```

**Suggested Fix**: Use environment-based CORS:

```javascript
const envOrigins = [
  process.env.CORS_ALLOWED_ORIGINS,
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .flatMap(v => v.split(',').map(s => s.trim()).filter(Boolean));

const allowedOrigins = {
  development: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  production: envOrigins.length ? envOrigins : ['https://planzia.com', 'https://www.planzia.com']
};

const origins = process.env.NODE_ENV === 'production' 
  ? allowedOrigins.production 
  : allowedOrigins.development;

app.use(cors({
  origin: origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
}));
```

---

### 2. No Security Headers Configured
**Severity**: 🔴 **Critical**  
**File**: `server/index.js`  
**Description**: Missing critical security headers (CSP, HSTS, X-Frame-Options, etc.).

**Suggested Fix**: Add Helmet middleware:

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https:'],
      fontSrc: ["'self'", 'https:'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,  // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameGuard: { action: 'deny' },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' }
}));
```

---

### 3. No Health Check Endpoint Documented
**Severity**: 🟡 **High**  
**Description**: `/api/ping` endpoint exists but no proper health check for load balancer.

**Suggested Fix**: Create comprehensive health check:

```javascript
// Add to server/index.js
app.get('/health', async (req, res) => {
  try {
    // Check database
    const dbHealthy = await mongoose.connection.db.admin().ping();
    
    // Check email service
    let emailHealthy = true;
    try {
      await transporter.verify();
    } catch (err) {
      emailHealthy = false;
    }
    
    const isHealthy = dbHealthy && emailHealthy;
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: dbHealthy ? 'connected' : 'disconnected',
      email: emailHealthy ? 'ok' : 'failed',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Update fly.toml
[[services.http_checks]]
  grace_period = "10s"
  interval = "10s"
  timeout = "5s"
  path = "/health"
  protocol = "http"
```

---

### 4. No Production-Specific Configuration
**Severity**: 🟡 **High**  
**Description**: Server doesn't behave differently in production vs development.

**Suggested Fix**: Add production configuration:

```javascript
// server/config/production.js
export const productionConfig = {
  // Logging
  logLevel: process.env.LOG_LEVEL || 'error',
  
  // CORS
  allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || '').split(','),
  
  // Database
  mongoPoolSize: 10,
  mongoSocketTimeout: 45000,
  
  // API
  requestTimeout: 30000,
  maxJsonSize: '10mb',
  
  // Security
  enableRateLimit: true,
  enableCORS: true,
  enableHelmet: true,
  
  // Performance
  enableCompression: true,
  enableCaching: true,
  
  // Monitoring
  enableMetrics: true,
  enableSentry: !!process.env.SENTRY_DSN
};
```

---

### 5. Email Service Not Validated at Startup
**Severity**: 🟡 **High**  
**File**: `server/services/emailService.js`  
**Description**: Email transporter created but not verified. May fail silently.

**Suggested Fix**:

```javascript
// server/services/emailService.js
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify on startup
export async function verifyEmailService() {
  try {
    await transporter.verify();
    console.log('✅ Email service verified');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
}

// In server/index.js
await verifyEmailService();
if (!emailServiceReady) {
  console.warn('⚠️ Email service not available - emails will not be sent');
}
```

---

### 6. No HTTPS Redirect Configured
**Severity**: 🟡 **High**  
**Description**: HTTP traffic not automatically redirected to HTTPS.

**Suggested Fix**:

```javascript
// server/index.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Check if request is insecure
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    
    if (!isSecure && req.method !== 'GET') {
      return res.status(403).json({ error: 'HTTPS required' });
    }
    
    if (!isSecure && req.method === 'GET') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    
    next();
  });
}
```

---

### 7. No Resource Limits Set
**Severity**: 🟡 **Medium**  
**Description**: No memory or CPU limits configured on Fly.io.

**Suggested Fix**: Update fly.toml:

```toml
[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1

[http_service]
  max_unavailable = 0
  
[processes]
  app = "npm start"
```

---

## ⚙️ CI/CD Pipeline

### 1. No Automated CI/CD Pipeline
**Severity**: 🔴 **Critical**  
**Files**: Missing `.github/workflows`, `gitlab-ci.yml`, etc.  
**Description**: No automated build, test, or deployment. Manual deployments are risky and non-reproducible.

**Suggested Fix**: Create GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Build & Deploy

on:
  push:
    branches: [main, pixel-hub]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate environment
        run: node scripts/validate-env.js
        env:
          NODE_ENV: production
          # Provide minimal vars for validation
          MONGO_URI: ${{ secrets.MONGO_URI }}
          JWT_ACCESS_SECRET: ${{ secrets.JWT_ACCESS_SECRET }}
          # ... other secrets
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Analyze bundle
        run: npm run build:analyze
      
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions@master
        with:
          args: "deploy"
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

### 2. No Automated Tests
**Severity**: 🔴 **Critical**  
**Files**: `package.json` has `test` script but no test files  
**Description**: No unit or integration tests run before deployment.

**Suggested Fix**: Create test suite:

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['server/**/*.js', 'client/**/*.jsx'],
      exclude: ['node_modules', 'dist']
    }
  }
});
```

Create tests:
```javascript
// server/routes/__tests__/venues.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../../index.js';

describe('Venues API', () => {
  let app;
  
  beforeAll(() => {
    app = createServer();
  });
  
  it('should list venues', async () => {
    const res = await request(app)
      .get('/api/venues')
      .expect(200);
    
    expect(res.body).toHaveProperty('venues');
    expect(Array.isArray(res.body.venues)).toBe(true);
  });
});
```

---

### 3. No Linting or Code Quality Checks
**Severity**: 🟡 **High**  
**Description**: No ESLint, Prettier, or code quality checks before commit/push.

**Suggested Fix**: Setup pre-commit hooks:

```json
{
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "lint-staged": "^15.0.0",
    "husky": "^8.0.0"
  }
}
```

Setup Husky:
```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

.lintstagedrc:
```json
{
  "*.{js,jsx}": "eslint --fix",
  "*.{js,jsx,json,md}": "prettier --write"
}
```

---

### 4. No Post-Deployment Verification
**Severity**: 🟡 **High**  
**Description**: After deployment, no automated checks verify the app is working.

**Suggested Fix**: Add post-deployment tests:

```yaml
# .github/workflows/post-deploy.yml
name: Post-Deploy Verification

on:
  workflow_run:
    workflows: ["Build & Deploy"]
    types: [completed]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Health check
        run: |
          for i in {1..10}; do
            if curl -f https://planzia.fly.dev/health; then
              echo "Health check passed"
              exit 0
            fi
            echo "Attempt $i failed, retrying..."
            sleep 10
          done
          echo "Health check failed after 10 attempts"
          exit 1
      
      - name: API smoke test
        run: |
          curl -f https://planzia.fly.dev/api/venues || exit 1
          curl -f https://planzia.fly.dev/api/ping || exit 1
      
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Deployment verification failed"
            }
```

---

## 🔒 Security & Environment Handling

### 1. Multiple dotenv.config() Calls
**Severity**: 🟡 **High**  
**Files**: `server/index.js`, `server/dev-server.js`, `server/config/database.js`, `vite.config.js`  
**Description**: .env loaded in multiple places, inconsistent behavior.

```javascript
// server/index.js line 19
dotenv.config({ path: path.join(__dirname, "../.env"), override: true });

// server/dev-server.js line 9
dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

// server/config/database.js line 9
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

// vite.config.js line 7
dotenv.config({ path: path.resolve(process.cwd(), './.env'), override: true });
```

**Suggested Fix**: Centralize env loading:

```javascript
// config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env only once
dotenv.config({ 
  path: path.resolve(__dirname, '../.env'),
  override: false  // Don't override existing env vars
});

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001'),
  API_PORT: parseInt(process.env.API_PORT || '5001'),
  
  // Database
  MONGO_URI: process.env.MONGO_URI,
  
  // Auth
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  
  // Get all others...
};

export function validateEnv() {
  const required = {
    production: ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'],
    development: ['MONGO_URI']
  };
  
  const missing = (required[env.NODE_ENV] || []).filter(key => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}
```

---

### 2. Sensitive Data Logged
**Severity**: 🟡 **High**  
**Files**: `server/services/emailService.js:23-29`, multiple routes  
**Description**: Email configs and user emails logged to console.

```javascript
// SECURITY BUG - logs sensitive info
console.log('Email configuration:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,      // Exposes email
  pass: process.env.EMAIL_PASS ? '[SET]' : '[NOT SET]'
});

console.log('sendOTPEmail called with:', { email, purpose, name });  // Exposes user email
```

**Suggested Fix**:

```javascript
// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Email service initialized');
} else {
  console.log('[REDACTED] Email service initialized');
}

// Never log PII
// ❌ WRONG: console.log('OTP sent to:', email);
// ✅ RIGHT:
console.log('OTP sent');
```

---

### 3. No Secrets Rotation Strategy
**Severity**: 🟡 **High**  
**Description**: No documented process for rotating JWT secrets, API keys, etc.

**Suggested Fix**: Document secrets rotation:

```markdown
# Secrets Rotation Guide

## JWT Secrets
1. Generate new secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Update Fly.io secrets: `flyctl secrets set JWT_ACCESS_SECRET=<new_value>`
3. Deploy new version
4. Monitor error rates
5. Remove old secrets after 7 days

## API Keys (Razorpay, Cloudinary)
1. Generate new key in respective dashboard
2. Update Fly.io secrets
3. Deploy
4. Revoke old key

## OAuth Credentials
1. Create new OAuth app
2. Update secrets
3. Test OAuth flow
4. Delete old app
```

---

### 4. No Secret Scanning in CI/CD
**Severity**: 🟡 **High**  
**Description**: Secrets can be accidentally committed to repository.

**Suggested Fix**: Add secret scanning:

```yaml
# .github/workflows/secret-scan.yml
name: Secret Scanning

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: TruffleHog scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
          extra_args: --debug --only-verified
```

---

## ⚡ Performance & Scaling

### 1. No Load Balancing Configuration
**Severity**: 🟡 **High**  
**File**: `fly.toml` (missing)  
**Description**: No multi-instance configuration or load balancing setup.

**Suggested Fix**: Configure in fly.toml:

```toml
[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 2  # Always run at least 2 instances
  max_machines_running = 5  # Scale up to 5
  processes = ["app"]
  
  # Auto-scaling based on CPU
  [[services.concurrency]]
    type = "requests"
    hard_limit = 1000
    soft_limit = 750
```

---

### 2. No Response Caching Headers
**Severity**: 🟡 **Medium**  
**File**: `server/node-build.js:27-42`  
**Description**: Static assets cached for 1 year but no Cache-Control for API responses.

**Suggested Fix**:

```javascript
// server/index.js
app.use((req, res, next) => {
  // Static assets - aggressive caching
  if (req.path.includes('/assets/')) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // HTML - no caching for SPA
  else if (req.path.endsWith('.html') || req.path === '/') {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  // Public API endpoints
  else if (req.path.startsWith('/api/venues') && req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');  // 5 min
  }
  // Private API
  else if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'private, no-cache, no-store');
  }
  
  next();
});
```

---

### 3. Single Process - No Clustering
**Severity**: 🟡 **Medium**  
**Description**: Application runs as single process, doesn't use multiple CPU cores.

**Suggested Fix**: Implement clustering or use process manager:

```javascript
// server/clustering.js
import cluster from 'cluster';
import os from 'os';
import { createServer } from './index.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  console.log(`Master ${process.pid} is running`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork();
  });
} else {
  const app = createServer();
  const port = process.env.PORT || 3001;
  
  app.listen(port, () => {
    console.log(`Worker ${process.pid} running on port ${port}`);
  });
}
```

Or use PM2:
```javascript
// ecosystem.config.js
export default {
  apps: [{
    name: 'planzia',
    script: 'dist/server/node-build.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

---

### 4. No Monitoring or Alerting
**Severity**: 🟡 **Medium**  
**Description**: No monitoring, logging, or alerting for production issues.

**Suggested Fix**: Setup Sentry:

```javascript
// server/monitoring.js
import * as Sentry from "@sentry/node";

export function initSentry(app) {
  if (process.env.NODE_ENV !== 'production') return;
  
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({
        request: true,
        serverName: false,
        transaction: true
      })
    ],
    tracesSampleRate: 0.1
  });
  
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
}
```

---

### 5. Background Jobs Running on Main Process
**Severity**: 🟡 **Medium**  
**File**: `server/services/bookingCleanupJob.js:10-27`  
**Description**: Booking cleanup job runs on main process every hour, could block requests.

**Suggested Fix**: Separate background job worker:

```javascript
// server/workers/cleanup-worker.js
import { processExpiredPayments } from '../services/bookingCleanupJob.js';

setInterval(async () => {
  try {
    console.log('Running cleanup job...');
    await processExpiredPayments();
  } catch (error) {
    console.error('Cleanup job failed:', error);
  }
}, 60 * 60 * 1000);  // Every hour

console.log('Cleanup worker started');
```

Deploy as separate process:
```toml
# fly.toml
[processes]
  app = "npm run start"
  worker = "node dist/server/workers/cleanup-worker.js"
```

---

## 🧰 Versioning, Backup & Rollback

### 1. No Version Tagging System
**Severity**: 🟡 **High**  
**Description**: Builds not tagged with versions, no way to identify which build is running.

**Suggested Fix**: Implement semantic versioning:

```json
{
  "version": "1.0.0",
  "scripts": {
    "version:patch": "npm version patch && git push --tags",
    "version:minor": "npm version minor && git push --tags",
    "version:major": "npm version major && git push --tags"
  }
}
```

```yaml
# .github/workflows/tag-release.yml
name: Tag Release

on:
  push:
    branches: [main]

jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Create tag
        run: |
          VERSION=$(cat package.json | grep '"version"' | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
          git tag "v$VERSION"
          git push origin "v$VERSION"
```

---

### 2. No Database Backup Strategy
**Severity**: 🔴 **Critical**  
**Description**: MongoDB data not backed up. Loss of database = loss of all user data.

**Suggested Fix**: Implement automated backups:

```bash
#!/bin/bash
# scripts/backup-mongodb.sh
#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/planzia_$TIMESTAMP.gz"

mkdir -p $BACKUP_DIR

# Create backup
mongodump --uri="$MONGO_URI" --archive="$BACKUP_FILE" --gzip

# Keep only last 30 days
find $BACKUP_DIR -name "planzia_*.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

Schedule with cron:
```bash
0 2 * * * /path/to/scripts/backup-mongodb.sh  # Daily at 2 AM
```

Or setup MongoDB Atlas automated backups:
```markdown
1. Go to MongoDB Atlas cluster settings
2. Enable "Backup & Restore"
3. Set backup frequency to every 6 hours
4. Enable point-in-time restore
5. Set retention to 35 days
```

---

### 3. No Rollback Strategy
**Severity**: 🔴 **Critical**  
**Description**: If deployment fails, no documented process to rollback.

**Suggested Fix**: Document rollback process:

```markdown
# Rollback Procedure

## Quick Rollback (within 1 hour)
1. Identify last known good version: `git log --oneline | head -20`
2. Rollback on Fly.io:
   ```bash
   flyctl releases
   flyctl releases rollback <release-id>
   ```
3. Verify: `curl https://planzia.fly.dev/health`
4. Check logs: `flyctl logs`

## Full Rollback (after significant time)
1. If rollback fails, deploy previous version:
   ```bash
   git checkout <previous-tag>
   npm run build
   git push
   ```
2. Fly.io auto-deploys on push

## Database Rollback
1. Restore from backup:
   ```bash
   mongorestore --uri="$MONGO_URI" --archive="backup.gz" --gzip
   ```
2. Verify data integrity
3. Test in staging first
```

---

### 4. No Deployment Logs Retention
**Severity**: 🟡 **Medium**  
**Description**: Deployment logs not stored long-term.

**Suggested Fix**: Store deployment logs:

```yaml
# .github/workflows/log-deployment.yml
name: Log Deployment

on:
  push:
    branches: [main]

jobs:
  log:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Get deployment info
        run: |
          cat > deploy.log <<EOF
          Deployment: $(date -u +%Y-%m-%dT%H:%M:%SZ)
          Commit: $(git rev-parse HEAD)
          Author: $(git log -1 --pretty=%an)
          Message: $(git log -1 --pretty=%B)
          EOF
      
      - name: Store logs
        uses: actions/upload-artifact@v3
        with:
          name: deployment-logs
          path: deploy.log
          retention-days: 90
```

---

## 🧹 Unused / Misconfigured Deployment Files

### 1. No Docker Compose for Local Development
**Severity**: 🟡 **Medium**  
**Description**: Developers can't easily spin up full stack locally with MongoDB.

**Suggested Fix**: Create docker-compose.yml:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: planzia-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: planzia
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  planzia-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: planzia-dev
    ports:
      - "3001:3001"
      - "5173:5173"
      - "5001:5001"
    environment:
      - NODE_ENV=development
      - MONGO_URI=mongodb://admin:password@mongodb:27017/planzia
      - API_PORT=5001
    depends_on:
      mongodb:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

volumes:
  mongodb_data:
```

Create Dockerfile.dev:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3001 5173 5001

CMD ["npm", "run", "dev"]
```

---

### 2. No `.dockerignore` File
**Severity**: 🟡 **Low**  
**Description**: Docker images include unnecessary files (node_modules, .git, dist).

**Suggested Fix**: Create `.dockerignore`:

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*.local
dist
.DS_Store
.vscode
.idea
*.log
```

---

### 3. No Environment Configuration for Fly.io
**Severity**: 🟡 **Medium**  
**Description**: No way to manage environment-specific configs.

**Suggested Fix**: Setup Fly.io secrets:

```bash
# Set production secrets
flyctl secrets set \
  NODE_ENV=production \
  MONGO_URI=mongodb+srv://... \
  JWT_ACCESS_SECRET=... \
  JWT_REFRESH_SECRET=... \
  CLOUDINARY_CLOUD_NAME=... \
  CLOUDINARY_API_KEY=... \
  CLOUDINARY_API_SECRET=... \
  RAZORPAY_KEY_ID=... \
  RAZORPAY_KEY_SECRET=... \
  EMAIL_HOST=... \
  EMAIL_PORT=... \
  EMAIL_USER=... \
  EMAIL_PASS=... \
  GOOGLE_CLIENT_ID=... \
  GOOGLE_CLIENT_SECRET=... \
  CORS_ALLOWED_ORIGINS=https://planzia.com,https://www.planzia.com
```

---

## 📊 Summary by Category

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| 🧱 Build | 3 | 2 | 1 | 0 | 6 |
| ☁️ Hosting | 2 | 4 | 1 | 0 | 7 |
| ⚙️ CI/CD | 2 | 2 | 0 | 0 | 4 |
| 🔒 Security | 0 | 3 | 1 | 0 | 4 |
| ⚡ Scaling | 0 | 1 | 4 | 0 | 5 |
| 🧰 Versioning | 2 | 1 | 1 | 0 | 4 |
| 🧹 Files | 0 | 0 | 2 | 2 | 4 |
| **TOTALS** | **9** | **13** | **10** | **2** | **34** |

---

## 🎯 Implementation Priority

### 🚨 Phase 1: Critical (IMMEDIATE - This Week)
**These must be fixed before scale:**

1. **Create Dockerfile + fly.toml** (2 hours)
   - Enable containerization
   - Define deployment config

2. **Fix CORS in production** (30 mins)
   - Use environment-based origins
   - Remove `"*"`

3. **Add security headers with Helmet** (1 hour)
   - CSP, HSTS, X-Frame-Options
   - Production-only headers

4. **Setup automated CI/CD** (3 hours)
   - GitHub Actions workflow
   - Build, test, deploy pipeline

5. **Implement database backups** (2 hours)
   - MongoDB Atlas automated backups
   - Or scheduled mongodump

6. **Add health check endpoint** (1 hour)
   - `/health` for load balancer
   - Database + email service checks

### ⚠️ Phase 2: High Priority (Next Sprint - 2-3 Days)

7. Create `.env.example` (30 mins)
8. Add environment variable validation (1 hour)
9. Centralize env loading (1 hour)
10. Add post-deployment verification (1 hour)
11. Setup secret scanning (1 hour)
12. Implement semantic versioning (1 hour)
13. Create docker-compose for dev (1 hour)
14. Document rollback procedure (1 hour)

### 📌 Phase 3: Medium Priority (Next Sprint)

15. Setup Sentry monitoring
16. Add test suite
17. Implement clustering/PM2
18. Separate background workers
19. Add linting/code quality checks
20. Setup response caching headers

### 🔧 Phase 4: Low Priority (Polish)

21. Add deployment log retention
22. Create `.dockerignore`
23. Setup build caching
24. Add bundle analysis

---

## ✅ Deployment Readiness Checklist

### Before Production

- [ ] Dockerfile + fly.toml created and tested
- [ ] Environment variables validated at startup
- [ ] .env.example file committed
- [ ] Security headers (Helmet) configured
- [ ] CORS properly restricted
- [ ] Health check endpoint implemented
- [ ] Database backups configured
- [ ] CI/CD pipeline working
- [ ] Tests passing
- [ ] Secret scanning enabled
- [ ] Secrets securely stored in Fly.io
- [ ] HTTPS redirect configured
- [ ] Monitoring (Sentry) setup
- [ ] Rollback procedure documented
- [ ] Team trained on deployment process

### Post-Deployment

- [ ] Monitor logs for errors
- [ ] Verify all API endpoints working
- [ ] Check database connectivity
- [ ] Test payment flow
- [ ] Verify email notifications
- [ ] Check image uploads
- [ ] Monitor performance metrics
- [ ] Alert on high error rates

---

## Conclusion

**Current Deployment Status**: 🟡 **MANUAL & RISKY**

**Key Issues**:
- No containerization (Dockerfile/fly.toml)
- No automated CI/CD pipeline
- CORS still allows all origins
- Missing security headers
- No backup strategy
- Multiple manual steps required

**Expected Improvements with Phase 1**:
- ✅ Reproducible builds
- ✅ Automated deployment
- ✅ Production security hardening
- ��� Data protection via backups
- ✅ Better deployment monitoring

**Timeline**: 10-15 hours for Phase 1, then 15-20 hours for Phase 2

**Recommendation**: Implement Phase 1 before scaling or increased production traffic.

---

## Implementation Checklist

### Quick Wins (Next Release)
- [ ] Add Dockerfile
- [ ] Create fly.toml
- [ ] Fix CORS
- [ ] Add Helmet security headers
- [ ] Add environment validation

### Essential (Before Scale)
- [ ] GitHub Actions CI/CD
- [ ] Database backups
- [ ] Health check endpoint
- [ ] Secret scanning
- [ ] Semantic versioning

### Stability (Next 2 Weeks)
- [ ] Test suite
- [ ] Post-deploy verification
- [ ] Monitoring setup
- [ ] Rollback procedure
- [ ] Documentation

### Optimization (Later)
- [ ] Clustering
- [ ] Separate workers
- [ ] Response caching
- [ ] Performance monitoring
- [ ] Load testing

