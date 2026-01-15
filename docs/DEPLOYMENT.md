# 🚀 Deployment Guide

**Version:** 1.0.0  
**Last Updated:** January 15, 2026  
**Status:** ✅ Ready for Implementation  

---

## 📊 Deployment Pipeline Overview

```
Feature Branch → Development Tests
      ↓
  Merge to develop
      ↓
  Automated TEST Deployment
      ↓
  QA Verification
      ↓
  Create Release PR (develop → main)
      ↓
  Code Review & Approval
      ↓
  Merge to main (auto-tag as release)
      ↓
  Manual PROD Deployment Trigger
      ↓
  Pre-deployment Checks
      ↓
  Production Deployment
      ↓
  Health Checks & Smoke Tests
      ↓
  Monitoring & Alerts Active
```

---

## 🔧 Pre-Deployment Checklist

### Before Any Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] No console errors/warnings
- [ ] No security vulnerabilities
- [ ] Documentation updated
- [ ] Environment variables verified
- [ ] Database migrations ready (if needed)
- [ ] Rollback plan prepared

### DEV Environment (Local)
- [ ] `npm install` completed
- [ ] `.env.dev` configured
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:5000/api/health returns success
- [ ] http://localhost:3173 loads without errors

### TEST Environment (Staging)
- [ ] GitHub Actions passed
- [ ] TEST environment variables correct
- [ ] Database initialized
- [ ] SMTP configured
- [ ] SSL certificate valid
- [ ] Health check endpoint responding
- [ ] QA team notified

### PROD Environment (Production)
- [ ] All TEST verification passed
- [ ] PROD environment variables verified
- [ ] Database backups completed
- [ ] Monitoring active
- [ ] Slack notifications configured
- [ ] Rollback procedures documented
- [ ] Stakeholders notified

---

## 🌍 Environment-Specific Deployment

### Development Deployment

**Local Development (No Deployment Needed)**

```bash
# Developers run locally
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2

# Access at:
# - App: http://localhost:3173
# - API: http://localhost:5000
```

**Changes Deploy Instantly via Hot Reload**
- Backend: Auto-restart with nodemon
- Frontend: Instant HMR with Vite

---

### Test Deployment (Staging)

**Automatic on `develop` Push**

```bash
# GitHub Actions automatically:
1. Pulls code from develop
2. Installs dependencies
3. Runs tests
4. Builds frontend
5. Deploys to test.sclsandbox.xyz
6. Runs health checks
7. Notifies Slack
```

**Manual Trigger (if needed)**
```
Go to: GitHub Actions → test-deploy.yml → Run workflow
```

**Verify TEST Deployment**
```bash
# Check API health
curl https://test.sclsandbox.xyz/api/health

# Check frontend loads
curl https://test.sclsandbox.xyz

# SSH to TEST server
ssh deploy-user@test.sclsandbox.xyz

# Check logs
tail -f /var/log/scl/test/app.log

# Check PM2 status
pm2 status
```

---

### Production Deployment (Live)

**Manual Process with Safeguards**

```bash
# 1. Merge develop → main on GitHub
#    - Create Release PR
#    - Get 2+ approvals
#    - Merge when ready
#    - Tag release (v1.0.0)

# 2. Trigger deployment
#    GitHub → Actions → prod-deploy.yml → Run workflow
#    - Input version: v1.0.0

# 3. System performs:
#    - Pre-deployment backup
#    - Code pull
#    - Dependency install
#    - Build frontend
#    - Database backup
#    - Service restart
#    - Health checks
#    - Smoke tests
#    - Slack notification
```

**If Issues Occur:**
```bash
# SSH to PROD server
ssh deploy-user@prod.sclsandbox.xyz

# Check logs
tail -f /var/log/scl/prod/error.log

# Stop services
pm2 stop scl-backend-prod
systemctl stop nginx

# Restore from backup
cp -r /var/backups/scl/prod/[BACKUP_DATE] /var/www/scl/prod/
mysql < /var/backups/scl/prod/db_[BACKUP_DATE].sql

# Restart services
pm2 start scl-backend-prod
systemctl start nginx

# Verify
curl https://app.sclsandbox.xyz/api/health
```

---

## 📋 Deployment Step-by-Step

### Step 1: Prepare Release

```bash
# Ensure all PRs merged to develop
git checkout develop
git pull origin develop

# Check all tests pass on GitHub

# Create release notes
# Tag release: v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Step 2: Create Release PR

```
On GitHub:
1. Create PR: develop → main
2. Title: "Release v1.0.0"
3. Description: Include changelog
4. Request reviewers
5. Wait for approvals
```

### Step 3: Merge to Main

```bash
# After approval:
# 1. Click "Merge pull request"
# 2. Confirm merge
# GitHub auto-creates release tag
```

### Step 4: Trigger Production Deployment

```
On GitHub:
1. Go to Actions
2. Select "PROD - Deploy to Production"
3. Click "Run workflow"
4. Enter version: v1.0.0
5. Watch deployment progress
```

### Step 5: Verify Deployment

```bash
# Check health endpoint
curl https://app.sclsandbox.xyz/api/health

# Test critical endpoints
curl https://app.sclsandbox.xyz/
curl https://app.sclsandbox.xyz/login

# Check monitoring dashboard
# Uptime: https://uptime.sclsandbox.xyz
# Logs: https://logs.sclsandbox.xyz
# Performance: https://perf.sclsandbox.xyz
```

### Step 6: Notify Stakeholders

```bash
# Slack notification sent automatically
# Email stakeholders:
# - Deployment completed
# - No issues detected
# - All systems operational
```

---

## 🔄 Rollback Procedures

### Automatic Rollback (Deployment Failure)

If deployment fails, GitHub Actions automatically:
1. Stops deployment
2. Sends Slack alert
3. Keeps previous version running
4. Creates incident

**Manual Intervention Required**
```bash
# SSH to affected server
ssh deploy-user@prod.sclsandbox.xyz

# Check what failed
tail -f /var/log/scl/prod/error.log

# Restore from backup
cd /var/www/scl/prod
git reset --hard [PREVIOUS_COMMIT_SHA]
npm install
npm run build
pm2 restart scl-backend-prod

# Verify
curl https://app.sclsandbox.xyz/api/health
```

### Manual Rollback (Post-Deployment Issue)

```bash
# If issues detected after deployment:

# 1. SSH to server
ssh deploy-user@prod.sclsandbox.xyz

# 2. List available backups
ls -la /var/backups/scl/prod/

# 3. Restore specific backup
# Format: cp -r /var/backups/scl/prod/YYYYMMDD_HHMMSS /var/www/scl/prod/
cp -r /var/backups/scl/prod/20260115_140000 /var/www/scl/prod/

# 4. Restore database (if needed)
mysql < /var/backups/scl/prod/db_20260115_140000.sql.gz

# 5. Restart services
pm2 restart scl-backend-prod
systemctl restart nginx

# 6. Verify
curl https://app.sclsandbox.xyz/api/health

# 7. Notify team
# Update Slack with incident
```

---

## 📊 Deployment Checklist

### Pre-Deployment (24 hours before)
- [ ] Feature code complete
- [ ] All tests passing
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Database migrations tested
- [ ] Environment variables reviewed
- [ ] Backup procedure verified
- [ ] Monitoring configured
- [ ] Slack channel created for incident

### Deployment Day
- [ ] All systems healthy
- [ ] Team available for monitoring
- [ ] Stakeholders notified
- [ ] Deployment window confirmed
- [ ] Rollback plan documented
- [ ] Health check endpoints ready
- [ ] Load testing completed
- [ ] Browser cache issues identified

### During Deployment
- [ ] Monitor GitHub Actions progress
- [ ] Watch error logs in real-time
- [ ] Check health endpoints
- [ ] Monitor server resources
- [ ] Monitor error rates
- [ ] Check user reports
- [ ] Have rollback command ready

### Post-Deployment (1 hour)
- [ ] All endpoints responding
- [ ] No error spikes
- [ ] Database queries normal
- [ ] User reports normal
- [ ] Monitoring alerts quiet
- [ ] Slack notifications sent
- [ ] Stakeholders confirmed success

### Post-Deployment (24 hours)
- [ ] No delayed errors
- [ ] Performance metrics stable
- [ ] No security alerts
- [ ] User feedback positive
- [ ] Database integrity verified
- [ ] Backups automated running
- [ ] Document lessons learned

---

## 🎯 Deployment Success Criteria

✅ **Health Check**
```bash
curl https://app.sclsandbox.xyz/api/health
# Returns: {"success": true, "message": "SCL API Server is running"}
```

✅ **Response Time**
- API endpoints: < 500ms (p95)
- Frontend load: < 2s (p95)

✅ **Error Rate**
- API errors: < 0.1%
- Frontend errors: < 0.05%

✅ **Uptime**
- Service availability: > 99.9%
- Database connectivity: 100%

✅ **Database**
- Query performance: no degradation
- Backup completed: automated
- Replication lag: < 1 second

---

## 📞 Deployment Support

### During Deployment Issues
1. **Slack:** #deployment-alerts channel
2. **On-Call:** Page on-call engineer
3. **Escalation:** Tech lead → Manager
4. **Rollback:** Execute rollback procedures

### Post-Incident
1. Create incident report
2. Document root cause
3. Update deployment checklist
4. Schedule post-mortem
5. Implement preventive measures

---

## 🔗 Related Documentation

- [Environments Guide](./ENVIRONMENTS.md)
- [GitHub Setup](./GITHUB_SETUP.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [CI/CD Workflows](./.github/workflows/)

---

**Version:** 1.0.0 | **Status:** ✅ ACTIVE | **Last Updated:** January 15, 2026
