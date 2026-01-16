# 🚀 Multi-Environment Deployment Strategy

**Status:** Phase 1 Planning  
**Created:** January 16, 2026  

---

## Overview

Three-tier environment setup for SCL project with automated GitHub Actions deployments:

```
Code Flow:
Feature Branch → Develop (DEV) → Testing Branch (TEST) → Main (PROD)
     ↓                ↓                     ↓                   ↓
Personal Dev    This Computer      Other Laptop (Local)    VPS Server
```

---

## 🖥️ Environment Details

### 1. DEVELOPMENT (DEV) Environment
**Location:** Your current computer (Windows)  
**Purpose:** Active development, testing features, debugging  
**Database:** Local (SQLite or local MySQL)  
**Branch:** `develop` + feature branches  

**Setup:**
- Backend: `npm run dev` (Port 5000)
- Frontend: `npm run dev` (Port 5173 via Vite)
- Auto-deploys from: Any push to `feature/*` branches
- Status checks: YES (linting + unit tests)

**Files:**
- GitHub Actions: `.github/workflows/dev-deploy.yml`
- Environment file: `.env.development`

---

### 2. TESTING (TEST) Environment
**Location:** Other laptop (local machine)  
**Purpose:** Integration testing, QA, staging validation  
**Database:** Test database (MySQL/PostgreSQL)  
**Branch:** `testing` (synced from develop after QA)  

**Setup:**
- Manual trigger or push to `testing` branch
- Full test suite runs
- Database migrations applied
- Status checks: YES (all tests)
- Auto-deploys from: Push to `testing` branch

**Access:**
- SSH/Git pull on testing laptop
- Run: `npm install && npm run build && npm start`
- Environment file: `.env.testing`

**Workflow:**
1. Feature tested in DEV
2. Create PR to develop
3. Code review + approval
4. Merge to develop
5. Manual PR: develop → testing (triggers CI/CD)
6. Run test suite on TEST machine
7. If pass → proceed to PROD

---

### 3. PRODUCTION (PROD) Environment
**Location:** VPS Server (remote)  
**Purpose:** Live user-facing application  
**Database:** Production database (MySQL/PostgreSQL)  
**Branch:** `main` (release branch)  

**Setup:**
- Deployed via GitHub Actions
- Requires 2 code approvals to deploy
- Database backups automated
- Status checks: YES (all critical tests)
- Auto-deploys from: Push to `main` branch

**Access:**
- SSH to VPS
- GitHub Actions runner or webhook triggers deployment
- Environment file: `.env.production` (stored as GitHub Secrets)

**Workflow:**
1. Code tested in DEV and TEST environments
2. All tests passing
3. Create PR: testing → main
4. Team lead approves (2 approvals required)
5. Merge to main
6. GitHub Actions auto-deploys to VPS
7. Post-deployment: monitor logs, health checks

---

## 📋 Branch Strategy

```
┌─────────────────────────────────────────────────────────┐
│ Feature Branch (feature/user-auth)                      │
│ - For individual feature development                    │
│ - Status checks: Unit tests                             │
│ - Deploy to: DEV (your computer)                        │
└─────────────────────┬───────────────────────────────────┘
                      │ (PR + 1 approval)
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Develop Branch                                          │
│ - Integration of all features                           │
│ - Status checks: Lint + unit + integration tests        │
│ - Deploy to: DEV (your computer)                        │
└─────────────────────┬───────────────────────────────────┘
                      │ (Manual)
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Testing Branch                                          │
│ - For QA and integration testing                        │
│ - Status checks: All tests + security scan              │
│ - Deploy to: TEST (other laptop)                        │
└─────────────────────┬───────────────────────────────────┘
                      │ (PR + 2 approvals)
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Main Branch (RELEASE)                                   │
│ - Production-ready code                                 │
│ - Status checks: All tests + coverage                   │
│ - Deploy to: PROD (VPS Server)                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 GitHub Actions Workflows

### Current Workflows

**1. dev-deploy.yml** → DEV Environment (Your Computer)
- **Trigger:** Push to `feature/*` or `develop`
- **Actions:**
  - Lint code (ESLint)
  - Run unit tests
  - Build backend
  - Build frontend
  - Deploy to DEV (local environment)
- **Status:** Runs automatically
- **Failure:** Blocks merge to develop

**2. test-deploy.yml** → TEST Environment (Other Laptop)
- **Trigger:** Push to `testing` branch
- **Actions:**
  - All dev checks
  - Integration tests
  - Database migration tests
  - Security scan
  - Deploy to TEST machine via SSH
- **Status:** Requires manual trigger (develop → testing PR)
- **Failure:** Blocks merge to main

**3. prod-deploy.yml** → PROD Environment (VPS)
- **Trigger:** Push to `main` branch (after 2 approvals)
- **Actions:**
  - All test checks
  - Performance tests
  - Create backup of production DB
  - Deploy to VPS via SSH
  - Run health checks
  - Notify team (Slack)
- **Status:** Requires manual merge (2 approvals)
- **Failure:** Rollback to previous version

---

## 📊 Environment Comparison

| Feature | DEV | TEST | PROD |
|---------|-----|------|------|
| **Location** | Your Computer | Other Laptop | VPS Server |
| **Branch** | develop + feature/* | testing | main |
| **Auto-Deploy** | Yes | Manual (on demand) | Yes (on merge) |
| **Approvals Required** | 1 | 1 | 2 |
| **Database** | Local SQLite | Test DB | Production DB |
| **Backup** | Manual | Daily | Automated |
| **Access Level** | Full | Full | SSH Keys |
| **Monitoring** | Local logs | SSH logs | CloudWatch/PM2 |
| **Restart** | Manual (npm run dev) | Manual (npm start) | Systemd/PM2 |

---

## 🛠️ Setup Instructions

### Step 1: Create Testing Branch

```bash
# From your computer
git checkout develop
git pull origin develop
git checkout -b testing
git push -u origin testing
```

### Step 2: Add Testing Branch Protection

Go to: https://github.com/syedsanaulhaq/scl/settings/branches

Add rule for `testing` branch:
- Require 1 approval
- Require status checks to pass
- Enforce for admins
- Allow force pushes: NO
- Allow deletions: NO

### Step 3: Configure Testing Laptop

**On the testing laptop:**

```bash
# Clone repository
git clone https://github.com/syedsanaulhaq/scl.git
cd scl

# Checkout testing branch
git checkout testing

# Install dependencies
npm install --workspaces

# Create .env files
cp backend/.env.example backend/.env.testing
cp frontend/.env.example frontend/.env.testing

# Update with TEST environment variables
# (Database host, API endpoint, etc.)
```

### Step 4: Configure VPS Server

**On your VPS:**

```bash
# SSH into VPS
ssh user@your-vps-ip

# Clone repository
git clone https://github.com/syedsanaulhaq/scl.git
cd scl

# Checkout main branch
git checkout main

# Install dependencies
npm install --workspaces

# Create .env files with PRODUCTION secrets
# Use GitHub Actions secrets (don't commit!)
```

### Step 5: Set Up GitHub Actions Secrets

Go to: https://github.com/syedsanaulhaq/scl/settings/secrets/actions

Add these secrets for deployments:

```
DEPLOY_USER          = your-vps-username
DEPLOY_HOST          = your-vps-ip-or-domain
DEPLOY_KEY           = SSH private key (for VPS deployment)
DEPLOY_PATH          = /home/user/apps/scl

TEST_SSH_KEY         = SSH key for testing laptop
TEST_MACHINE_IP      = IP of testing laptop
TEST_DEPLOY_PATH     = /home/user/apps/scl

DATABASE_URL_PROD    = postgresql://user:pass@host/scl_prod
DATABASE_URL_TEST    = postgresql://user:pass@host/scl_test

JWT_SECRET_PROD      = [long-random-secret]
JWT_SECRET_TEST      = [test-secret]

SLACK_WEBHOOK_URL    = https://hooks.slack.com/... (for notifications)
```

---

## 📝 Daily Workflow

### For Feature Development (DEV)

```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/user-auth

# 2. Make changes
# ... code ...

# 3. Push to GitHub
git push -u origin feature/user-auth

# 4. GitHub Actions automatically:
#    - Runs linting
#    - Runs unit tests
#    - Deploys to your DEV environment
#    - Shows status on PR

# 5. Create Pull Request
#    - Go to GitHub
#    - PR: feature/user-auth → develop
#    - Get 1 approval
#    - Merge to develop
```

### For Testing (TEST)

```bash
# 1. Create testing PR (after develop has updates)
# Go to: https://github.com/syedsanaulhaq/scl/pulls

# 2. Click "New pull request"
#    - From: testing
#    - To: develop
#    - Wait for 1 approval

# 3. Merge develop → testing
#    - This triggers GitHub Actions
#    - Actions deploys to testing laptop
#    - Tests run automatically

# 4. On testing laptop:
ssh user@test-laptop
cd scl
git pull origin testing
npm start

# 5. Manual testing
#    - Test all features
#    - Verify database migrations
#    - Test integrations
```

### For Production (PROD)

```bash
# 1. Create Release PR (after testing passes)
# Go to: https://github.com/syedsanaulhaq/scl/pulls

# 2. Click "New pull request"
#    - From: main
#    - To: testing
#    - Wait for 2 approvals
#    - Get code review + tech lead approval

# 3. Merge testing → main
#    - This triggers GitHub Actions
#    - Actions deploys to VPS
#    - Health checks run
#    - Team notified via Slack

# 4. Monitor production
ssh user@your-vps-ip
cd scl
tail -f logs/app.log
pm2 status
```

---

## 🚨 Emergency Procedures

### Rollback Production

If something breaks in production:

```bash
# On VPS
git log --oneline | head -10
git revert [commit-hash]
git push origin main

# OR reset to previous version
git reset --hard origin/main~1
git push -f origin main
```

### Skip Deployment

If you need to merge code WITHOUT deploying:

1. Disable GitHub Actions workflow temporarily:
   - Settings → Actions → Disable workflows
   - Merge PR
   - Re-enable workflows

2. Or add skip flag:
   ```bash
   git commit --allow-empty -m "chore: skip deployment [skip ci]"
   git push
   ```

---

## 📊 Environment Checklist

- [ ] DEV environment running on your computer
- [ ] Testing branch created on GitHub
- [ ] TEST environment set up on other laptop
- [ ] VPS server ready for production
- [ ] GitHub Actions workflows configured
- [ ] Secrets added to GitHub Actions
- [ ] SSH keys configured for deployments
- [ ] Database backups automated
- [ ] Monitoring set up (logs, health checks)
- [ ] Team trained on deployment workflow

---

## 🎯 Next Steps

1. **Set up testing laptop** with git clone and npm install
2. **Configure VPS server** with production environment
3. **Add GitHub Actions secrets** for automated deployments
4. **Test the workflow** with a dummy feature branch
5. **Document any VPS-specific setup** (firewall, domain, SSL, etc.)

---

**Ready to proceed with Phase 2 development while maintaining this multi-environment strategy!**
