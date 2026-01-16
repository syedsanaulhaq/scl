#!/bin/bash

##############################################################################
# SCL Production VPS Setup Script
#
# This script automates the setup of the Production environment on a VPS
# Run this on your VPS server as root or with sudo
#
# Usage: sudo bash setup-vps-production.sh
##############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     SCL Production Environment - VPS Setup Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}✗ This script must be run as root (use: sudo bash setup-vps-production.sh)${NC}"
    exit 1
fi

echo -e "${YELLOW}STEP 1: System Updates${NC}"
apt-get update
apt-get upgrade -y
echo -e "${GREEN}✓ System updated${NC}"
echo ""

echo -e "${YELLOW}STEP 2: Install Required Packages${NC}"
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    python3-pip

echo -e "${GREEN}✓ Required packages installed${NC}"
echo ""

echo -e "${YELLOW}STEP 3: Install Node.js 18 LTS${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js $(node -v) installed${NC}"
else
    echo -e "${GREEN}✓ Node.js $(node -v) already installed${NC}"
fi
echo ""

echo -e "${YELLOW}STEP 4: Install PM2 (Process Manager)${NC}"
npm install -g pm2
pm2 update
echo -e "${GREEN}✓ PM2 installed and updated${NC}"
echo ""

echo -e "${YELLOW}STEP 5: Install Nginx (Web Server)${NC}"
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
echo -e "${GREEN}✓ Nginx installed and started${NC}"
echo ""

echo -e "${YELLOW}STEP 6: Install MySQL (Database)${NC}"
# Note: You may need to provide mysql password
if ! command -v mysql &> /dev/null; then
    apt-get install -y mysql-server
    echo -e "${YELLOW}⚠ MySQL installed. Configure it with: sudo mysql_secure_installation${NC}"
else
    echo -e "${GREEN}✓ MySQL already installed${NC}"
fi
echo ""

echo -e "${YELLOW}STEP 7: Create Application Directory${NC}"
mkdir -p /home/scl-app
cd /home/scl-app
echo -e "${GREEN}✓ Application directory created${NC}"
echo ""

echo -e "${YELLOW}STEP 8: Clone SCL Repository${NC}"
if [ ! -d "/home/scl-app/scl" ]; then
    git clone https://github.com/syedsanaulhaq/scl.git
    cd scl
    echo -e "${GREEN}✓ Repository cloned${NC}"
else
    cd scl
    git fetch origin
    git checkout main
    git pull origin main
    echo -e "${GREEN}✓ Repository already exists, updated to main${NC}"
fi
echo ""

echo -e "${YELLOW}STEP 9: Install Dependencies${NC}"
npm install --workspaces
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}STEP 10: Create Production Environment Files${NC}"

# Backend .env.production
cat > backend/.env.production << 'EOF'
# Production Environment - Backend Configuration

NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=scl_prod
DATABASE_PASSWORD=YOUR_SECURE_PASSWORD_HERE
DATABASE_NAME=scl_prod
DATABASE_DIALECT=mysql
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# JWT
JWT_SECRET=YOUR_LONG_RANDOM_SECRET_HERE_MIN_32_CHARS
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=YOUR_LONG_RANDOM_REFRESH_SECRET_HERE
REFRESH_TOKEN_EXPIRES_IN=30d

# API
API_URL=https://api.your-domain.com
API_TIMEOUT=30000

# CORS
CORS_ORIGIN=https://your-domain.com

# Session
SESSION_SECRET=YOUR_SESSION_SECRET_HERE

# Email
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=465
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-email-password

# Feature Flags
ENABLE_API_DOCS=false
ENABLE_TEST_ROUTES=false

# Logging
LOG_FILE=/var/log/scl/app.log
ERROR_LOG_FILE=/var/log/scl/error.log

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

echo -e "${GREEN}✓ Created backend/.env.production${NC}"

# Frontend .env.production
cat > frontend/.env.production << 'EOF'
# Production Environment - Frontend Configuration

VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_NAME=SCL
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_DEBUG=false

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true

# Sentry (optional - for error tracking)
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
EOF

echo -e "${GREEN}✓ Created frontend/.env.production${NC}"
echo ""

echo -e "${YELLOW}STEP 11: Build Frontend${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

echo -e "${YELLOW}STEP 12: Create PM2 Configuration${NC}"
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'scl-backend',
      script: './backend/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/scl/backend-error.log',
      out_file: '/var/log/scl/backend-out.log',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup
echo -e "${GREEN}✓ PM2 configured and running${NC}"
echo ""

echo -e "${YELLOW}STEP 13: Create Logs Directory${NC}"
mkdir -p /var/log/scl
chown www-data:www-data /var/log/scl
chmod 755 /var/log/scl
echo -e "${GREEN}✓ Logs directory created${NC}"
echo ""

echo -e "${YELLOW}STEP 14: Configure Nginx${NC}"
cat > /etc/nginx/sites-available/scl << 'EOF'
upstream scl_backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL configuration (requires Let's Encrypt certificate)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend (React/Vite)
    location / {
        root /home/scl-app/scl/frontend/dist;
        try_files $uri $uri/ /index.html;

        add_header Cache-Control "public, max-age=3600";
        expires 1h;
    }

    # Static assets (CSS, JS)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /home/scl-app/scl/frontend/dist;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://scl_backend;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://scl_backend;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/scl /etc/nginx/sites-enabled/scl
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo -e "${GREEN}✓ Nginx configured${NC}"
echo -e "${YELLOW}⚠ Update /etc/nginx/sites-available/scl with your domain and SSL certificate path${NC}"
echo ""

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     VPS Setup Complete!                                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}NEXT STEPS:${NC}"
echo ""
echo "1. Update Environment Files:"
echo "   nano /home/scl-app/scl/backend/.env.production"
echo "   nano /home/scl-app/scl/frontend/.env.production"
echo ""
echo "2. Create Production Database:"
echo "   mysql -u root -p"
echo "   > CREATE DATABASE scl_prod;"
echo "   > CREATE USER 'scl_prod'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD';"
echo "   > GRANT ALL PRIVILEGES ON scl_prod.* TO 'scl_prod'@'localhost';"
echo ""
echo "3. Run Database Migrations:"
echo "   cd /home/scl-app/scl/backend"
echo "   npm run migrate:prod"
echo ""
echo "4. Install SSL Certificate (Let's Encrypt):"
echo "   sudo certbot certonly --nginx -d your-domain.com"
echo ""
echo "5. Update Nginx Configuration:"
echo "   Edit: /etc/nginx/sites-available/scl"
echo "   Set your domain and SSL paths"
echo "   Then: sudo systemctl reload nginx"
echo ""
echo "6. Check Application Status:"
echo "   pm2 status"
echo "   pm2 logs"
echo ""
echo "7. Set Up Automated Backups:"
echo "   See: DEPLOYMENT_ENVIRONMENTS.md"
echo ""
echo -e "${GREEN}✓ Your production environment is ready!${NC}"
echo ""
