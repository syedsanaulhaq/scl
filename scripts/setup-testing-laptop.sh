#!/bin/bash

##############################################################################
# SCL Testing Laptop Setup Script
# 
# This script automates the setup of the Testing environment on another laptop
# Run this once to get your testing machine ready
#
# Usage: bash setup-testing-laptop.sh
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     SCL Testing Environment - Automated Setup Script           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check Prerequisites
echo -e "${YELLOW}STEP 1: Checking Prerequisites${NC}"
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not installed. Please install Node.js 18+ first${NC}"
    echo "  Visit: https://nodejs.org/en/download/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not installed${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"

echo "Checking Git installation..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not installed. Please install Git first${NC}"
    exit 1
fi
GIT_VERSION=$(git --version)
echo -e "${GREEN}✓ ${GIT_VERSION} found${NC}"
echo ""

# Step 2: Clone Repository
echo -e "${YELLOW}STEP 2: Cloning SCL Repository${NC}"
if [ -d "scl" ]; then
    echo "✓ Repository already exists. Skipping clone."
    cd scl
else
    git clone https://github.com/syedsanaulhaq/scl.git
    cd scl
    echo -e "${GREEN}✓ Repository cloned successfully${NC}"
fi
echo ""

# Step 3: Checkout Testing Branch
echo -e "${YELLOW}STEP 3: Setting Up Testing Branch${NC}"
git fetch origin
git checkout testing || git checkout -b testing origin/testing
echo -e "${GREEN}✓ Testing branch ready${NC}"
echo ""

# Step 4: Install Dependencies
echo -e "${YELLOW}STEP 4: Installing Dependencies${NC}"
echo "This may take a few minutes..."
npm install --workspaces 2>&1 | tail -5
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 5: Create Environment Files
echo -e "${YELLOW}STEP 5: Creating Environment Files${NC}"

# Backend .env.testing
if [ ! -f "backend/.env.testing" ]; then
    cat > backend/.env.testing << 'EOF'
# Testing Environment - Backend Configuration

NODE_ENV=testing
PORT=5000
LOG_LEVEL=debug

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=scl_test
DATABASE_PASSWORD=scl_test_password
DATABASE_NAME=scl_test
DATABASE_DIALECT=mysql

# JWT
JWT_SECRET=testing-secret-key-change-in-prod
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=testing-refresh-secret-change-in-prod
REFRESH_TOKEN_EXPIRES_IN=30d

# API
API_URL=http://localhost:5000
API_TIMEOUT=30000

# CORS
CORS_ORIGIN=http://localhost:5173

# Session
SESSION_SECRET=testing-session-secret

# Email (optional - can use test service)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=465
SMTP_USER=your_test_email_user
SMTP_PASSWORD=your_test_email_password

# Feature Flags
ENABLE_API_DOCS=true
ENABLE_TEST_ROUTES=true

# Logging
LOG_FILE=./logs/app.log
ERROR_LOG_FILE=./logs/error.log
EOF
    echo -e "${GREEN}✓ Created backend/.env.testing${NC}"
else
    echo "✓ backend/.env.testing already exists"
fi

# Frontend .env.testing
if [ ! -f "frontend/.env.testing" ]; then
    cat > frontend/.env.testing << 'EOF'
# Testing Environment - Frontend Configuration

VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=SCL Testing
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=testing
VITE_DEBUG=true

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
EOF
    echo -e "${GREEN}✓ Created frontend/.env.testing${NC}"
else
    echo "✓ frontend/.env.testing already exists"
fi
echo ""

# Step 6: Verify Installations
echo -e "${YELLOW}STEP 6: Verifying Installations${NC}"
echo "Backend packages:"
cd backend && npm list --depth=0 2>&1 | head -3 && cd ..
echo ""
echo "Frontend packages:"
cd frontend && npm list --depth=0 2>&1 | head -3 && cd ..
echo ""

# Step 7: Create startup script
echo -e "${YELLOW}STEP 7: Creating Startup Script${NC}"
cat > start-testing.sh << 'EOF'
#!/bin/bash

# Start SCL Testing Environment

echo "Starting SCL Testing Environment..."
echo ""

# Start backend in background
echo "Starting backend server (port 5000)..."
cd backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting frontend server (port 5173)..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "=========================================="
echo "Testing Environment is Running:"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:5173"
echo "  Logs:     ./logs/"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "=========================================="

# Wait for Ctrl+C
wait
EOF

chmod +x start-testing.sh
echo -e "${GREEN}✓ Created start-testing.sh${NC}"
echo ""

# Step 8: Create logs directory
mkdir -p logs
echo -e "${GREEN}✓ Created logs directory${NC}"
echo ""

# Step 9: Final Instructions
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Setup Complete! Next Steps:                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}1. Update Database Configuration:${NC}"
echo "   Edit backend/.env.testing with your TEST database credentials"
echo ""
echo -e "${YELLOW}2. Create Test Database:${NC}"
echo "   Create a MySQL/PostgreSQL database named 'scl_test'"
echo ""
echo -e "${YELLOW}3. Run Database Migrations:${NC}"
echo "   cd backend && npm run migrate:test"
echo ""
echo -e "${YELLOW}4. Start Testing Environment:${NC}"
echo "   ./start-testing.sh"
echo ""
echo -e "${YELLOW}5. Access Applications:${NC}"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/api/docs"
echo ""
echo -e "${YELLOW}6. Pull Latest Updates (future):${NC}"
echo "   git checkout testing && git pull origin testing"
echo ""
echo -e "${GREEN}✓ Testing environment is ready!${NC}"
echo ""
