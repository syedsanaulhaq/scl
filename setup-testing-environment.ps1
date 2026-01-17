# SCL Testing Environment Setup Script
# Automates the complete testing environment setup for SCL-Test folder

param(
    [string]$TestPath = "E:\SCL-Projects\SCL-Test"
)

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     SCL Testing Environment - Complete Setup                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if folder exists
if (-not (Test-Path $TestPath)) {
    Write-Host "❌ Error: Testing folder not found at $TestPath" -ForegroundColor Red
    Write-Host "Please clone the repository to E:\SCL-Projects\SCL-Test first" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Testing folder found: $TestPath`n" -ForegroundColor Green

# Step 1: Create Backend .env.test
Write-Host "STEP 1: Creating backend .env.test file..." -ForegroundColor Yellow

$backendEnv = @"
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
"@

Set-Content -Path "$TestPath\backend\.env.test" -Value $backendEnv -Force
Write-Host "✅ Created: backend\.env.test`n" -ForegroundColor Green

# Step 2: Create Frontend .env.test
Write-Host "STEP 2: Creating frontend .env.test file..." -ForegroundColor Yellow

$frontendEnv = @"
# Testing Environment - Frontend Configuration

VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=SCL Testing
VITE_APP_VERSION=1.0.0-test
VITE_ENVIRONMENT=test
VITE_DEBUG=true

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
"@

Set-Content -Path "$TestPath\frontend\.env.test" -Value $frontendEnv -Force
Write-Host "✅ Created: frontend\.env.test`n" -ForegroundColor Green

# Step 3: Create Logs Directories
Write-Host "STEP 3: Creating logs directories..." -ForegroundColor Yellow

New-Item -ItemType Directory -Path "$TestPath\backend\logs" -Force | Out-Null
New-Item -ItemType Directory -Path "$TestPath\frontend\logs" -Force | Out-Null
Write-Host "✅ Created: backend\logs and frontend\logs directories`n" -ForegroundColor Green

# Step 4: Verify Dependencies
Write-Host "STEP 4: Verifying npm dependencies..." -ForegroundColor Yellow

$backendPackageJson = "$TestPath\backend\package.json"
$frontendPackageJson = "$TestPath\frontend\package.json"

if ((Test-Path $backendPackageJson) -and (Test-Path $frontendPackageJson)) {
    Write-Host "✅ Backend package.json found" -ForegroundColor Green
    Write-Host "✅ Frontend package.json found`n" -ForegroundColor Green
    
    # Check if node_modules exist
    if ((Test-Path "$TestPath\backend\node_modules") -and (Test-Path "$TestPath\frontend\node_modules")) {
        Write-Host "✅ Dependencies already installed`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Dependencies not installed. Run:" -ForegroundColor Yellow
        Write-Host "   cd $TestPath\backend && npm install" -ForegroundColor Cyan
        Write-Host "   cd $TestPath\frontend && npm install`n" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ package.json files not found!" -ForegroundColor Red
    exit 1
}

# Step 5: Create Startup Script
Write-Host "STEP 5: Creating startup script..." -ForegroundColor Yellow

$startupScript = @"
@echo off
REM SCL Testing Environment Startup Script

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     SCL Testing Environment - Startup                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Starting Backend on port 5000...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Services starting...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Health:   http://localhost:5000/api/health
echo.
"@

Set-Content -Path "$TestPath\start-testing.bat" -Value $startupScript -Force
Write-Host "✅ Created: start-testing.bat`n" -ForegroundColor Green

# Summary
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ TESTING ENVIRONMENT SETUP COMPLETE!                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Backend .env.test created" -ForegroundColor Green
Write-Host "   ✅ Frontend .env.test created" -ForegroundColor Green
Write-Host "   ✅ Logs directories created" -ForegroundColor Green
Write-Host "   ✅ Startup script created`n" -ForegroundColor Green

Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Create MySQL test database (see guide below)" -ForegroundColor Cyan
Write-Host "   2. Run: cd $TestPath" -ForegroundColor Cyan
Write-Host "   3. Run: npm install (if not already done)" -ForegroundColor Cyan
Write-Host "   4. Option A - Run both services:" -ForegroundColor Cyan
Write-Host "      Terminal 1: cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "      Terminal 2: cd frontend && npm run dev" -ForegroundColor Cyan
Write-Host "   5. Option B - Use startup script:" -ForegroundColor Cyan
Write-Host "      Run: .\start-testing.bat`n" -ForegroundColor Cyan

Write-Host "📊 Access Testing Environment:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Health:   http://localhost:5000/api/health`n" -ForegroundColor Cyan

Write-Host "📝 Create MySQL Test Database:" -ForegroundColor Yellow
Write-Host @"
   Open MySQL and run:
   
   CREATE DATABASE IF NOT EXISTS scl_test;
   CREATE USER IF NOT EXISTS 'test_user'@'localhost' IDENTIFIED BY 'test_password';
   GRANT ALL PRIVILEGES ON scl_test.* TO 'test_user'@'localhost';
   FLUSH PRIVILEGES;
`n
"@ -ForegroundColor Cyan

Write-Host "✨ Testing environment is ready! Start coding and testing! 🎉`n" -ForegroundColor Green
