# 🚀 Three-Environment Setup Checklist

**Project:** SCL (Syed's Code Lab)  
**Status:** Planning Phase  
**Last Updated:** January 16, 2026  

---

## Environment Overview

```
┌──────────────────────┐
│   DEVELOPMENT (DEV)  │
│   This Computer      │
│   Branch: develop    │
│   Auto-deploys: YES  │
└──────────────────────┘
          ↓ (Git Push)
┌──────────────────────┐
│    TESTING (TEST)    │
│   Other Laptop       │
│   Branch: testing    │
│   Manual Deploy: YES │
└──────────────────────┘
          ↓ (PR + Approve)
┌──────────────────────┐
│  PRODUCTION (PROD)   │
│    VPS Server        │
│   Branch: main       │
│   Auto-deploys: YES  │
└──────────────────────┘
```

---

## ✅ PHASE 1: GITHUB SETUP (This Week)

### Step 1: Create Testing Branch
- [ ] Create branch: `git checkout -b testing`
- [ ] Push to GitHub: `git push -u origin testing`
- [ ] Verify branch exists on GitHub

### Step 2: Add Branch Protection for Testing
- [ ] Go to: https://github.com/syedsanaulhaq/scl/settings/branches
- [ ] Add rule for `testing` branch
- [ ] Require 1 approval
- [ ] Require status checks
- [ ] Enforce for admins

### Step 3: Document VPS Access Details
- [ ] VPS IP Address: `_______________`
- [ ] VPS Username: `_______________`
- [ ] VPS Domain/SSH Key: `_______________`
- [ ] Database Host: `_______________`
- [ ] Database Name: `_______________`

### Step 4: Create GitHub Actions Secrets
- [ ] `DEPLOY_USER` - VPS username
- [ ] `DEPLOY_HOST` - VPS IP or domain
- [ ] `DEPLOY_KEY` - SSH private key
- [ ] `DEPLOY_PATH` - Path on VPS (e.g., /home/user/scl)
- [ ] `DATABASE_URL_PROD` - Production database URL
- [ ] `DATABASE_URL_TEST` - Test database URL
- [ ] `JWT_SECRET_PROD` - Production JWT secret
- [ ] `SLACK_WEBHOOK_URL` - For deployment notifications

---

## ✅ PHASE 2: TESTING LAPTOP SETUP (Week 2)

### Step 1: Clone Repository
- [ ] SSH into testing laptop
- [ ] Run: `git clone https://github.com/syedsanaulhaq/scl.git`
- [ ] Navigate: `cd scl`

### Step 2: Install Dependencies
- [ ] Run: `npm install --workspaces`
- [ ] Verify: `npm list` shows all packages

### Step 3: Create Environment Files
- [ ] Copy: `cp backend/.env.example backend/.env.testing`
- [ ] Copy: `cp frontend/.env.example frontend/.env.testing`
- [ ] Update DATABASE_HOST to TEST database
- [ ] Update API_URL to test machine IP

### Step 4: Test Installation
- [ ] Backend: `cd backend && npm run dev`
- [ ] Frontend (new terminal): `cd frontend && npm run dev`
- [ ] Verify both servers start correctly
- [ ] Stop servers (Ctrl+C)

### Step 5: Set Up Automated Deployment Script
- [ ] Create deployment script for auto-pull on `testing` branch push
- [ ] Test script with dummy commit
- [ ] Document startup command

---

## ✅ PHASE 3: VPS SERVER SETUP (Week 2)

### Step 1: SSH Access
- [ ] Verify SSH access to VPS: `ssh user@your-vps-ip`
- [ ] Check available disk space: `df -h`
- [ ] Check CPU/Memory: `free -h`

### Step 2: Install Node.js & npm
- [ ] Check if installed: `node -v && npm -v`
- [ ] If not: Install Node.js 18+ LTS
- [ ] Verify: `node -v` returns v18 or later

### Step 3: Clone Repository
- [ ] SSH into VPS
- [ ] Create app directory: `mkdir -p /home/user/apps`
- [ ] Clone repo: `git clone https://github.com/syedsanaulhaq/scl.git /home/user/apps/scl`
- [ ] Navigate: `cd /home/user/apps/scl`

### Step 4: Install Dependencies
- [ ] Run: `npm install --workspaces`
- [ ] Verify installation successful

### Step 5: Create Production Environment Files
- [ ] Create: `backend/.env.production`
- [ ] Create: `frontend/.env.production`
- [ ] Set DATABASE_URL to production database
- [ ] Set JWT_SECRET to production value
- [ ] Set NODE_ENV=production
- [ ] **DO NOT COMMIT THESE FILES!**

### Step 6: Set Up Process Manager (PM2)
- [ ] Install: `npm install -g pm2`
- [ ] Create PM2 config file for backend
- [ ] Create PM2 config file for frontend
- [ ] Test: `pm2 start app.json`
- [ ] Enable startup: `pm2 startup`
- [ ] Save: `pm2 save`

### Step 7: Configure Nginx Reverse Proxy
- [ ] Install Nginx: `apt-get install nginx`
- [ ] Create config for backend (port 5000)
- [ ] Create config for frontend (port 5173 → 80/443)
- [ ] Enable SSL/HTTPS (Let's Encrypt)
- [ ] Test: `nginx -t`
- [ ] Restart: `systemctl restart nginx`

### Step 8: Database Setup
- [ ] Create production database
- [ ] Set up database user with limited privileges
- [ ] Run migrations: `npm run migrate:prod`
- [ ] Verify tables created

### Step 9: Backup & Monitoring
- [ ] Set up automated daily backups
- [ ] Configure log rotation
- [ ] Set up monitoring (PM2 Plus or alternatives)
- [ ] Test: `pm2 restart all`

### Step 10: Firewall & Security
- [ ] Configure firewall: Allow ports 22, 80, 443 only
- [ ] Disable SSH password login (use keys only)
- [ ] Set up fail2ban for brute force protection
- [ ] Test from local machine

---

## 📋 DEPLOYMENT WORKFLOW CHECKLIST

### Development Feature
- [ ] Create feature branch locally
- [ ] Push to GitHub
- [ ] GitHub Actions runs tests (DEV)
- [ ] Code appears in DEV environment
- [ ] Test locally
- [ ] Create PR to develop
- [ ] Get 1 approval
- [ ] Merge to develop

### Testing/QA
- [ ] Code merged to develop
- [ ] Create PR: develop → testing
- [ ] Get 1 approval
- [ ] Merge to testing
- [ ] GitHub Actions deploys to TEST laptop
- [ ] Run QA tests
- [ ] Verify all functionality

### Production Release
- [ ] All QA testing complete
- [ ] Create PR: testing → main
- [ ] Get 2 approvals (code review + tech lead)
- [ ] Merge to main
- [ ] GitHub Actions deploys to VPS
- [ ] Post-deployment: Check logs and health
- [ ] Notify team (Slack)

---

## 🔒 Security Checklist

### GitHub Secrets Management
- [ ] All secrets added to GitHub Actions
- [ ] No secrets in code or .env files
- [ ] SSH keys stored securely
- [ ] Database passwords in GitHub Secrets only

### VPS Security
- [ ] SSH key-only authentication
- [ ] Firewall configured
- [ ] Fail2ban installed and running
- [ ] Regular security updates scheduled
- [ ] Database backups encrypted
- [ ] Logs monitored for suspicious activity

### Code Security
- [ ] No API keys in commit messages
- [ ] ESLint security rules enabled
- [ ] Dependency vulnerabilities scanned
- [ ] HTTPS enforced on all endpoints

---

## 📞 Emergency Contacts & Info

**VPS Details:**
- Hostname: `_______________`
- IP Address: `_______________`
- SSH Port: `_______________`
- Provider: `_______________`
- Support URL: `_______________`

**Database Details:**
- Host: `_______________`
- Type: `_______________`
- Dev DB: `_______________`
- Test DB: `_______________`
- Prod DB: `_______________`

**Team Members:**
- Lead Dev: `_______________`
- DevOps Lead: `_______________`
- Tech Lead (approver): `_______________`

---

## 🎯 Completion Criteria

✅ **Phase 1 Complete When:**
- All GitHub branch protections set
- GitHub Actions secrets configured
- DEPLOYMENT_ENVIRONMENTS.md documented

✅ **Phase 2 Complete When:**
- DEV environment working (current computer)
- TEST environment working (other laptop)
- PROD environment working (VPS)
- All three can communicate and deploy correctly

✅ **Phase 3 Complete When:**
- Full workflow tested end-to-end
- Feature → Dev → Test → Prod pipeline verified
- Team trained on deployment process
- Documentation complete

---

## 📝 Notes

```
Add any additional notes about your specific environment setup:

1. Testing laptop details:
   ___________________________________________

2. VPS provider notes:
   ___________________________________________

3. Database setup specifics:
   ___________________________________________

4. Custom deployment requirements:
   ___________________________________________
```

---

**Last Updated:** January 16, 2026  
**Next Review:** January 17, 2026  
**Owner:** Syed Sanaulhaq
