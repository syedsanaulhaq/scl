# 🌍 SCL - Environment Configuration Guide

**Date:** January 15, 2026  
**Version:** 1.0.0  
**Status:** ✅ Active  

---

## 📊 Environment Overview

The SCL project uses **three distinct environments** for development, testing, and production. Each environment has separate configurations, databases, and deployment pipelines.

### Environment Comparison

| Aspect | **DEV** | **TEST** | **PROD** |
|--------|---------|---------|---------|
| **Purpose** | Local development | Staging/QA testing | Live production |
| **Location** | Local machine | VPS Staging | VPS Live |
| **Database** | `scl_dev` | `scl_test` | `scl_prod` |
| **Domain** | `localhost` | `test.sclsandbox.xyz` | `app.sclsandbox.xyz` |
| **Backend Port** | 5000 | 5001 | 5000 |
| **Frontend Port** | 3173 | nginx | nginx |
| **SSL** | ❌ No | ✅ Yes | ✅ Yes |
| **File Storage** | Local `/uploads` | VPS `/var/scl/test` | VPS `/var/scl/prod` |
| **Log Level** | DEBUG | INFO | WARN |
| **CORS Origins** | `localhost:*` | `test.sclsandbox.xyz` | `app.sclsandbox.xyz` |
| **Email Service** | Console (mock) | Staging SMTP | Production SMTP |
| **Error Tracking** | Console | Sentry staging | Sentry production |
| **CDN** | None | Optional | Required |

---

## 🔧 DEV Environment (Development)

### Purpose
- Local development on developer machines
- Fast feedback loop with auto-reload
- No database required to start
- Maximum logging for debugging

### Setup

**Backend Configuration** (`.env.dev`)
```env
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3173
FRONTEND_DOMAIN=localhost

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=scl_dev
DB_USER=scl_dev_user
DB_PASSWORD=SCL_Dev_Pass123!
DB_DIALECT=mysql
DB_POOL_MAX=10
DB_POOL_MIN=1

# JWT
JWT_SECRET=dev_jwt_secret_min_32_chars_dev_only
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=dev_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRY=7d

# Logging
LOG_LEVEL=debug

# Email (Mock)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=dev@sclsandbox.xyz
SMTP_PASSWORD=dev_password

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend Configuration** (`.env.development`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
VITE_LOG_LEVEL=debug
VITE_ENABLE_MOCK_DATA=true
```

### Start Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Access Points
- **App:** http://localhost:3173
- **API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

### Database Setup (Optional)
```bash
mysql -u root -p < database/scl_init_dev.sql
```

---

## 🧪 TEST Environment (Staging/QA)

### Purpose
- Staging environment on VPS
- Testing before production release
- QA team validation
- Performance testing
- Integration testing

### Setup

**Backend Configuration** (`.env.test`)
```env
NODE_ENV=test
PORT=5001
SERVER_URL=https://test.sclsandbox.xyz:5001
FRONTEND_URL=https://test.sclsandbox.xyz
FRONTEND_DOMAIN=test.sclsandbox.xyz

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=scl_test
DB_USER=scl_test_user
DB_PASSWORD=SCL_Test_Pass123!
DB_DIALECT=mysql
DB_POOL_MAX=20
DB_POOL_MIN=5

# JWT
JWT_SECRET=test_jwt_secret_min_32_chars_test_env
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=test_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRY=7d

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/scl/test/app.log

# Email (Real SMTP)
SMTP_HOST=mail.sclsandbox.xyz
SMTP_PORT=587
SMTP_USER=test@sclsandbox.xyz
SMTP_PASSWORD=test_smtp_password
SMTP_FROM=noreply@test.sclsandbox.xyz

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=200

# Error Tracking
SENTRY_DSN=https://your_sentry_test_dsn
```

**Frontend Configuration** (`.env.test`)
```env
VITE_API_URL=https://test.sclsandbox.xyz/api
VITE_ENV=test
VITE_LOG_LEVEL=info
VITE_ENABLE_MOCK_DATA=false
VITE_SENTRY_DSN=https://your_sentry_test_dsn
```

### Deployment

```bash
# On VPS staging server
cd /var/www/scl/test

# Pull latest from GitHub
git pull origin develop

# Install & Build
npm install
npm run build

# Start with PM2
pm2 start "npm start" --name scl-backend
pm2 restart nginx
```

### Access Points
- **App:** https://test.sclsandbox.xyz
- **API:** https://test.sclsandbox.xyz/api
- **Health Check:** https://test.sclsandbox.xyz/api/health

### Database
- **Host:** 127.0.0.1
- **Name:** scl_test
- **User:** scl_test_user
- **Backup:** Daily at 02:00 UTC

---

## 🚀 PROD Environment (Production)

### Purpose
- Live production system
- High availability & redundancy
- Performance optimized
- Strict security & monitoring
- Minimal logging (errors only)

### Setup

**Backend Configuration** (`.env.production`)
```env
NODE_ENV=production
PORT=5000
SERVER_URL=https://app.sclsandbox.xyz
FRONTEND_URL=https://app.sclsandbox.xyz
FRONTEND_DOMAIN=app.sclsandbox.xyz

# Database
DB_HOST=db.internal.sclsandbox.xyz
DB_PORT=3306
DB_NAME=scl_prod
DB_USER=scl_prod_user
DB_PASSWORD=SCL_Prod_Pass_SecureString_Here!
DB_DIALECT=mysql
DB_POOL_MAX=50
DB_POOL_MIN=10

# JWT
JWT_SECRET=prod_jwt_secret_min_32_chars_prod_env
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=prod_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRY=7d

# Logging
LOG_LEVEL=error
LOG_FILE=/var/log/scl/prod/error.log
LOG_MAX_SIZE=100m
LOG_MAX_FILES=30

# Email (Production SMTP)
SMTP_HOST=mail.sclsandbox.xyz
SMTP_PORT=587
SMTP_USER=noreply@sclsandbox.xyz
SMTP_PASSWORD=prod_smtp_password
SMTP_FROM=noreply@sclsandbox.xyz
SMTP_FROM_NAME=SCL System

# Rate Limiting (Stricter)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Error Tracking
SENTRY_DSN=https://your_sentry_prod_dsn

# Security
HELMET_ENABLED=true
CORS_ENABLED=true
RATE_LIMIT_ENABLED=true

# Performance
CACHE_TTL=3600
DB_CONNECTION_TIMEOUT=30000
```

**Frontend Configuration** (`.env.production`)
```env
VITE_API_URL=https://app.sclsandbox.xyz/api
VITE_ENV=production
VITE_LOG_LEVEL=error
VITE_ENABLE_MOCK_DATA=false
VITE_SENTRY_DSN=https://your_sentry_prod_dsn
VITE_ANALYTICS_ID=GA_PROD_ID
```

### Deployment

```bash
# On VPS production server
cd /var/www/scl/prod

# Pull from main branch
git pull origin main

# Install & Build
npm install
npm run build

# Start with PM2 cluster mode
pm2 start "npm start" --name scl-backend -i max

# Restart nginx
systemctl restart nginx

# Health check
curl https://app.sclsandbox.xyz/api/health
```

### Access Points
- **App:** https://app.sclsandbox.xyz
- **API:** https://app.sclsandbox.xyz/api
- **Health Check:** https://app.sclsandbox.xyz/api/health
- **Admin Dashboard:** https://app.sclsandbox.xyz/admin

### Database
- **Host:** db.internal.sclsandbox.xyz
- **Name:** scl_prod
- **User:** scl_prod_user
- **Replicas:** 2 (read-only)
- **Backup:** Hourly (offsite)
- **Recovery Time:** < 1 hour
- **Recovery Point:** < 15 min

### Monitoring
- **Uptime:** 99.9% SLA
- **Error Rate:** < 0.1%
- **Response Time:** < 500ms (p95)
- **Dashboard:** datadog.sclsandbox.xyz

---

## 📋 Environment Variables Checklist

### Backend Variables Required in All Environments
```
✅ NODE_ENV
✅ PORT
✅ SERVER_URL
✅ FRONTEND_URL
✅ FRONTEND_DOMAIN
✅ DB_HOST
✅ DB_PORT
✅ DB_NAME
✅ DB_USER
✅ DB_PASSWORD
✅ DB_DIALECT
✅ DB_POOL_MAX
✅ DB_POOL_MIN
✅ JWT_SECRET (min 32 chars)
✅ JWT_EXPIRY
✅ JWT_REFRESH_SECRET (min 32 chars)
✅ JWT_REFRESH_EXPIRY
✅ LOG_LEVEL
✅ SMTP_HOST
✅ SMTP_PORT
✅ SMTP_USER
✅ SMTP_PASSWORD
✅ SMTP_FROM
✅ RATE_LIMIT_WINDOW
✅ RATE_LIMIT_MAX_REQUESTS
```

### Frontend Variables Required in All Environments
```
✅ VITE_API_URL
✅ VITE_ENV
✅ VITE_LOG_LEVEL
✅ VITE_ENABLE_MOCK_DATA
```

---

## 🔐 Security Guidelines

### DEV Environment
- ⚠️ Use weak passwords locally
- ⚠️ No HTTPS needed
- ⚠️ All logging enabled
- ⚠️ Skip some security checks

### TEST Environment
- ✅ Use strong passwords
- ✅ HTTPS required (self-signed OK)
- ✅ Rate limiting enabled
- ✅ CORS strict
- ✅ Email notifications enabled

### PROD Environment
- ✅ Use extremely strong passwords
- ✅ HTTPS with valid certificates
- ✅ Rate limiting strict
- ✅ CORS very strict
- ✅ Only error logs
- ✅ Monitoring 24/7
- ✅ Backups hourly
- ✅ Audit logging enabled

---

## 🔄 Environment Promotion Flow

```
DEV (Local)
    ↓ (git push)
GitHub Repository
    ↓ (PR review)
TEST (Staging)
    ↓ (QA approval)
PROD (Production)
```

### Branching Strategy
- **develop** → TEST environment (auto-deploy)
- **main** → PROD environment (manual deploy with approval)
- **feature/*/** → Local DEV only

---

## 📚 Next Steps

1. **Update `.env.dev`** with your local MySQL credentials
2. **Update `.env.test`** with test VPS credentials
3. **Update `.env.production`** with production credentials
4. **Never commit** `.env.*` files to GitHub
5. **Use GitHub Secrets** for sensitive values in CI/CD
6. **Rotate credentials** every 90 days
7. **Document** any additional environment variables

---

## 📞 Support

For environment-related issues:
- DEV: Check console logs in terminal
- TEST: SSH to VPS and check logs in `/var/log/scl/test/`
- PROD: Contact DevOps team via Slack

---

**Version:** 1.0.0 | **Last Updated:** January 15, 2026 | **Status:** ✅ ACTIVE
