# Complete Testing Environment Setup for SCL-Test

## 📋 Testing Environment Setup Instructions

This guide sets up the complete testing environment in `E:\SCL-Projects\SCL-Test`.

---

## ✅ Step 1: Create Backend .env File

Create file: `E:\SCL-Projects\SCL-Test\backend\.env.test`

**Copy this content:**
```
# Testing Environment - Backend Configuration

NODE_ENV=test
PORT=5000
LOG_LEVEL=info

# Database - Test Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=scl_test
DB_DIALECT=mysql
DB_POOL_MIN=1
DB_POOL_MAX=5

# JWT
JWT_SECRET=test_secret_key_testing_only_12345678
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=test_refresh_secret_testing_only_123456
REFRESH_TOKEN_EXPIRES_IN=30d

# API
API_URL=http://localhost:5000
API_TIMEOUT=30000

# CORS
CORS_ORIGIN=http://localhost:5173

# Session
SESSION_SECRET=test_session_secret_testing_only

# Feature Flags
ENABLE_API_DOCS=true
ENABLE_TEST_ROUTES=true

# Logging
LOG_FILE=./logs/test.log
ERROR_LOG_FILE=./logs/error.log

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

---

## ✅ Step 2: Create Frontend .env File

Create file: `E:\SCL-Projects\SCL-Test\frontend\.env.test`

**Copy this content:**
```
# Testing Environment - Frontend Configuration

VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=SCL Testing
VITE_APP_VERSION=1.0.0-test
VITE_ENVIRONMENT=test
VITE_DEBUG=true

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
```

---

## ✅ Step 3: Create MySQL Test Database

Open MySQL command line and run:

```sql
-- Create test database
CREATE DATABASE IF NOT EXISTS scl_test;

-- Create test user
CREATE USER IF NOT EXISTS 'test_user'@'localhost' IDENTIFIED BY 'test_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON scl_test.* TO 'test_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
```

---

## ✅ Step 4: Verify Dependencies Installed

```powershell
cd "E:\SCL-Projects\SCL-Test\backend"
npm list | head -20

cd "..\frontend"
npm list | head -20
```

Both should show dependencies installed.

---

## ✅ Step 5: Create Logs Directory

```powershell
# Create logs folder for backend
mkdir "E:\SCL-Projects\SCL-Test\backend\logs"
mkdir "E:\SCL-Projects\SCL-Test\frontend\logs"
```

---

## ✅ Step 6: Run Testing Environment

### **Option A: Run Both Services**

**Terminal 1 - Backend:**
```powershell
cd "E:\SCL-Projects\SCL-Test\backend"
npm run test
```

**Terminal 2 - Frontend:**
```powershell
cd "E:\SCL-Projects\SCL-Test\frontend"
npm run dev
```

### **Option B: Run With Vite Dev Server**

**Terminal 1 - Backend:**
```powershell
cd "E:\SCL-Projects\SCL-Test\backend"
$env:NODE_ENV="test"; npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "E:\SCL-Projects\SCL-Test\frontend"
npm run dev
```

---

## 🌐 Access Testing Environment

Once both services are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health
- **API Documentation:** http://localhost:5000/api/docs (if enabled)

---

## 📊 Testing Environment Structure

```
E:\SCL-Projects\SCL-Test\
├── backend/
│   ├── src/
│   ├── .env.test              ← Create this
│   ├── node_modules/
│   ├── logs/                  ← Create this
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.test              ← Create this
│   ├── node_modules/
│   ├── logs/                  ← Create this
│   └── package.json
└── README.md
```

---

## 🧪 Testing Checklist

✅ **Backend .env.test created**
✅ **Frontend .env.test created**  
✅ **MySQL test database created**
✅ **Logs directories created**
✅ **Dependencies installed (npm install ran)**
✅ **Backend starts on port 5000**
✅ **Frontend starts on port 5173**
✅ **API responds to /api/health**
✅ **Frontend loads without errors**

---

## 🔄 Common Commands

**Restart backend:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Restart
cd "E:\SCL-Projects\SCL-Test\backend"
npm run dev
```

**Restart frontend:**
```powershell
# Ctrl+C in frontend terminal, then:
cd "E:\SCL-Projects\SCL-Test\frontend"
npm run dev
```

**Clear database:**
```sql
DROP DATABASE scl_test;
CREATE DATABASE scl_test;
```

**View logs:**
```powershell
Get-Content "E:\SCL-Projects\SCL-Test\backend\logs\test.log" -Tail 50
Get-Content "E:\SCL-Projects\SCL-Test\backend\logs\error.log" -Tail 50
```

---

## 📝 Notes

- **Testing environment uses port 5000** (backend) and **5173** (frontend)
- **Production uses port 5000** (backend) and HTTPS
- **Keep separate databases** (scl_dev for development, scl_test for testing)
- **Test routes enabled** for testing API endpoints
- **Debug mode ON** for development visibility

---

## ✨ You're All Set!

Your complete testing environment is ready. Run the commands in **Step 6** to start developing and testing! 🚀
