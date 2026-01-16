# 🚀 Automated Environment Setup Guide

**Created:** January 16, 2026  
**Status:** Ready to Deploy

---

## Overview

I've created automated setup scripts for both your Testing laptop and VPS Production server. This means you don't have to manually configure everything - just run the scripts!

---

## 📋 What's Automated

### ✅ **Testing Laptop** (Automatic Setup)
- Clone repository
- Install Node.js dependencies
- Create `.env.testing` files
- Set up startup script
- Create logs directory

**File:** `scripts/setup-testing-laptop.sh`

### ✅ **VPS Production Server** (Automatic Setup)
- Install Node.js 18 LTS
- Install PM2 (process manager)
- Install Nginx (web server)
- Install MySQL (database)
- Create application directory
- Clone repository
- Build frontend
- Configure PM2 ecosystem
- Configure Nginx reverse proxy
- Set up automatic deployments

**File:** `scripts/setup-vps-production.sh`

---

## 🎯 Quick Start

### For Testing Laptop

**On your testing laptop, run:**

```bash
# Download setup script
curl -o setup-test.sh https://raw.githubusercontent.com/syedsanaulhaq/scl/main/scripts/setup-testing-laptop.sh

# Make it executable
chmod +x setup-test.sh

# Run it
./setup-test.sh
```

**That's it!** The script will:
1. ✓ Clone your repo
2. ✓ Install all packages
3. ✓ Create environment files
4. ✓ Create startup script

### For VPS Server

**On your VPS, run:**

```bash
# Download setup script
curl -o setup-vps.sh https://raw.githubusercontent.com/syedsanaulhaq/scl/main/scripts/setup-vps-production.sh

# Run with sudo
sudo bash setup-vps.sh
```

**The script will:**
1. ✓ Update system packages
2. ✓ Install Node.js 18
3. ✓ Install PM2
4. ✓ Install Nginx
5. ✓ Install MySQL
6. ✓ Clone your repo
7. ✓ Build your app
8. ✓ Configure everything

---

## 📝 After Running Scripts

### Testing Laptop - Next Steps

1. **Update database credentials:**
   ```bash
   nano backend/.env.testing
   ```
   Update: `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`

2. **Create test database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE scl_test;
   CREATE USER 'scl_test'@'localhost' IDENTIFIED BY 'scl_test_password';
   GRANT ALL PRIVILEGES ON scl_test.* TO 'scl_test'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Run migrations:**
   ```bash
   cd backend
   npm run migrate:test
   ```

4. **Start applications:**
   ```bash
   ./start-testing.sh
   ```

5. **Access your apps:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### VPS Production - Next Steps

1. **Update environment files:**
   ```bash
   sudo nano /home/scl-app/scl/backend/.env.production
   sudo nano /home/scl-app/scl/frontend/.env.production
   ```

2. **Create production database:**
   ```bash
   sudo mysql -u root -p
   CREATE DATABASE scl_prod;
   CREATE USER 'scl_prod'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
   GRANT ALL PRIVILEGES ON scl_prod.* TO 'scl_prod'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Run migrations:**
   ```bash
   cd /home/scl-app/scl/backend
   npm run migrate:prod
   ```

4. **Install SSL Certificate:**
   ```bash
   sudo certbot certonly --nginx -d your-domain.com
   ```

5. **Update Nginx config with your domain:**
   ```bash
   sudo nano /etc/nginx/sites-available/scl
   # Update: server_name and ssl_certificate paths
   sudo systemctl reload nginx
   ```

6. **Check status:**
   ```bash
   pm2 status
   pm2 logs
   ```

---

## 🔑 GitHub Actions Secrets

Before deployments work, add these secrets to GitHub:

**Go to:** https://github.com/syedsanaulhaq/scl/settings/secrets/actions

### For Testing Environment

```
TEST_SSH_KEY          SSH private key for testing laptop
TEST_MACHINE_IP       IP address of testing laptop
TEST_DEPLOY_PATH      /home/user/apps/scl (or your path)
```

### For Production Environment

```
DEPLOY_USER           VPS username (usually 'ubuntu' or 'root')
DEPLOY_HOST           VPS IP address or domain
DEPLOY_KEY            SSH private key for VPS
DEPLOY_PATH           /home/scl-app/scl (from setup script)
DATABASE_URL_PROD     postgresql://user:pass@host/scl_prod
JWT_SECRET_PROD       Your production JWT secret
SLACK_WEBHOOK_URL     Optional: For deployment notifications
```

---

## 📊 File Structure After Setup

### Testing Laptop
```
scl/
├── backend/
│   ├── src/
│   ├── .env.testing          ← Created by script
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.testing          ← Created by script
│   └── package.json
├── logs/                     ← Created by script
├── start-testing.sh          ← Created by script
└── package.json
```

### VPS Production
```
/home/scl-app/scl/
├── backend/
│   ├── dist/
│   ├── src/
│   ├── .env.production       ← Created by script
│   └── package.json
├── frontend/
│   ├── dist/                 ← Frontend served by Nginx
│   ├── src/
│   ├── .env.production       ← Created by script
│   └── package.json
├── ecosystem.config.js       ← PM2 config created by script
├── logs/
└── package.json

/var/log/scl/                 ← Application logs
/etc/nginx/sites-available/scl   ← Nginx config created by script
```

---

## ✅ Verification Checklist

### Testing Laptop - After Setup
- [ ] Repository cloned successfully
- [ ] All npm packages installed
- [ ] `.env.testing` file created
- [ ] Test database created
- [ ] Migrations ran successfully
- [ ] `./start-testing.sh` launches both servers
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend API responds at `http://localhost:5000`

### VPS Production - After Setup
- [ ] System packages updated
- [ ] Node.js 18 installed
- [ ] Repository cloned to `/home/scl-app/scl`
- [ ] PM2 installed and running
- [ ] Nginx installed and configured
- [ ] MySQL installed and running
- [ ] Production database created
- [ ] Application logs in `/var/log/scl/`
- [ ] PM2 managing backend process
- [ ] Nginx serving frontend and proxying API
- [ ] HTTPS certificate installed (Let's Encrypt)

---

## 🔄 Deployment Flow

```
Your Computer          GitHub              Testing Laptop    VPS
(Development)          (CI/CD)             (Testing)         (Production)
     ↓                  ↓                      ↓                ↓
1. git push feature/*
2.                    Tests run             ✓ Auto-deploys
3. Create PR           (DEV actions)         (if using)
4. Get approval                        
5. Merge to develop    ✓ Auto-passes
6.                     to testing       
7. Manual PR to testing
8. Get approval        ✓ Auto-deploys  ← Run QA tests
9. Merge to testing                    ← Verify everything
10.                    ✓ Awaits        
11. Manual PR to main
12. Get 2 approvals    ✓ Auto-deploys           ← Live!
13. Merge to main      ✓ Backup DB
                       ✓ Health checks
                       ✓ Slack notify
```

---

## 🆘 Troubleshooting

### Testing Laptop Issues

**Package installation fails:**
```bash
npm install --legacy-peer-deps --workspaces
```

**Port 5000/5173 already in use:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Database connection error:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env.testing
nano backend/.env.testing
```

### VPS Issues

**Permission denied errors:**
```bash
# Run with sudo
sudo bash setup-vps-production.sh
```

**Port 80/443 already in use:**
```bash
# Check what's using the ports
sudo netstat -tlnp | grep ':80\|:443'
```

**PM2 not starting:**
```bash
# Check logs
pm2 logs

# Restart PM2
pm2 restart all
```

---

## 📚 Next Steps

1. **For Testing Laptop:**
   - [ ] Run `setup-testing-laptop.sh`
   - [ ] Update `.env.testing`
   - [ ] Create test database
   - [ ] Run migrations
   - [ ] Test with `./start-testing.sh`

2. **For VPS:**
   - [ ] Run `setup-vps-production.sh`
   - [ ] Update `.env.production`
   - [ ] Create production database
   - [ ] Get SSL certificate
   - [ ] Update Nginx config
   - [ ] Verify with `pm2 status`

3. **GitHub Actions:**
   - [ ] Add all secrets
   - [ ] Merge `docs/branch-protection-update` to develop
   - [ ] Test deployment workflow with a feature branch

4. **Ready for Phase 2:**
   - [ ] User Model implementation
   - [ ] Start on January 17

---

**Questions?** Check [DEPLOYMENT_ENVIRONMENTS.md](../DEPLOYMENT_ENVIRONMENTS.md) for more details!
