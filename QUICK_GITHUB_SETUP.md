# 🚀 Quick GitHub Setup Guide

**Time Estimate:** 15-20 minutes  
**Prerequisites:** GitHub account, Git installed  
**Status:** ✅ Ready to implement  

---

## 📋 Step-by-Step GitHub Setup

### Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. **Repository name:** `scl`
3. **Description:** `SCL - Education Institute Management System`
4. **Visibility:** Choose `Private` (recommended for closed-source)
5. **Don't** initialize with README, .gitignore, or license (we have these locally)
6. Click **"Create repository"**

---

### Step 2: Connect Local Repository to GitHub (2 minutes)

```bash
# From project root (e:\SCL-Projects\SCL)
cd e:\SCL-Projects\SCL

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/scl.git

# Verify remote
git remote -v

# Output should show:
# origin  https://github.com/YOUR_USERNAME/scl.git (fetch)
# origin  https://github.com/YOUR_USERNAME/scl.git (push)
```

---

### Step 3: Rename Branch to `main` and Push (2 minutes)

```bash
# Rename master to main
git branch -M main

# Push to GitHub
git push -u origin main

# This uploads all commits from Step 1 to GitHub
```

---

### Step 4: Create `develop` Branch (2 minutes)

```bash
# Create develop branch locally
git checkout -b develop

# Push develop to GitHub
git push -u origin develop

# Verify both branches exist
git branch -a

# Output:
# * develop
#   main
#   remotes/origin/develop
#   remotes/origin/main
```

---

### Step 5: Configure Branch Protection (5 minutes)

#### Protect `main` (Production)

1. Go to GitHub → **Settings** → **Branches**
2. Click **"Add rule"**
3. **Branch name pattern:** `main`
4. Enable these checkboxes:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (set to: 2)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require code reviews from code owners
   - ✅ Require conversation resolution
5. Click **"Create"**

#### Protect `develop` (Staging)

1. Click **"Add rule"** again
2. **Branch name pattern:** `develop`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (set to: 1)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
4. Click **"Create"**

---

### Step 6: Add GitHub Secrets (5 minutes)

Navigate to **Settings** → **Secrets and variables** → **Actions**

Click **"New repository secret"** for each:

#### DEV Environment Secrets
```
Name: DEV_SSH_HOST
Value: dev.sclsandbox.xyz
```

```
Name: DEV_SSH_USER
Value: deploy-user
```

```
Name: DEV_SSH_KEY
Value: [Paste SSH private key or skip for now]
```

#### TEST Environment Secrets
```
Name: TEST_SSH_HOST
Value: test.sclsandbox.xyz
```

```
Name: TEST_SSH_USER
Value: deploy-user
```

```
Name: TEST_SSH_KEY
Value: [Paste SSH private key or skip for now]
```

#### PROD Environment Secrets
```
Name: PROD_SSH_HOST
Value: prod.sclsandbox.xyz
```

```
Name: PROD_SSH_USER
Value: deploy-user
```

```
Name: PROD_SSH_KEY
Value: [Paste SSH private key or skip for now]
```

#### Communication Secrets
```
Name: SLACK_WEBHOOK_URL
Value: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

```
Name: GITHUB_TOKEN
Value: [GitHub Personal Access Token - see below]
```

---

### Step 7: Create GitHub Token (3 minutes)

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Token name:** `scl-automation`
4. **Expiration:** 90 days
5. **Select scopes:**
   - ✅ repo (full control of private repositories)
   - ✅ workflow (update GitHub Action workflows)
   - ✅ admin:repo_hook (write access to hooks)
6. Click **"Generate token"**
7. **Copy the token** and save as GitHub Secret:
   ```
   Name: GITHUB_TOKEN
   Value: ghp_xxxxxxxxxxxxxxxxxxxx
   ```

---

### Step 8: Configure GitHub Environments (3 minutes)

Navigate to **Settings** → **Environments**

#### Create Environment: `production`
1. Click **"New environment"**
2. **Name:** `production`
3. **Deployment branches:** Select `main`
4. **Required reviewers:** Check and add 2 team members
5. Click **"Save protection rules"**

#### Create Environment: `staging`
1. Click **"New environment"**
2. **Name:** `staging`
3. **Deployment branches:** Select `develop`
4. **Required reviewers:** Optional
5. Click **"Save protection rules"**

#### Create Environment: `development`
1. Click **"New environment"**
2. **Name:** `development`
3. **Deployment branches:** Any
4. No protection rules needed
5. Click **"Save protection rules"**

---

### Step 9: Enable GitHub Actions (1 minute)

1. Go to **Settings** → **Actions** → **General**
2. **Actions permissions:** Select "Allow all actions and reusable workflows"
3. **Workflow permissions:** Select "Read and write permissions"
4. ✅ Check "Allow GitHub Actions to create and approve pull requests"
5. Click **"Save"**

---

### Step 10: Test the Setup (2 minutes)

```bash
# Create a test feature branch
git checkout -b feature/test-setup

# Make a small change (e.g., update README)
echo "# Test Change" >> README.md

# Commit
git add .
git commit -m "test: verify GitHub setup is working"

# Push
git push origin feature/test-setup

# Go to GitHub and create a Pull Request
# - From: feature/test-setup
# - To: develop
# - GitHub Actions should automatically run tests
# - Once tests pass, you can merge
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] GitHub repository created and connected
- [ ] Both `main` and `develop` branches exist
- [ ] Branch protection rules applied
- [ ] All secrets added
- [ ] GitHub Actions enabled
- [ ] Environments configured
- [ ] Test PR created and merged successfully
- [ ] GitHub Actions workflows ran automatically
- [ ] CI/CD pipeline working

---

## 🎯 After Setup: First Development Workflow

### For First Feature Development

```bash
# 1. Update develop locally
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/user-authentication

# 3. Make changes
# ... edit backend/frontend files ...

# 4. Commit with descriptive messages
git commit -m "feat(auth): implement JWT token generation"
git commit -m "test(auth): add unit tests for token generation"

# 5. Push to GitHub
git push origin feature/user-authentication

# 6. Create Pull Request on GitHub
# - Title: [AUTH] feat: implement user authentication system
# - Description: [Use PR template from CONTRIBUTING.md]
# - Reviewers: @team-members

# 7. Address feedback and merge
# - GitHub Actions automatically tests
# - Reviewers approve
# - Merge to develop
# - Automatic TEST deployment triggers

# 8. Create Release PR when ready
# - From: develop → main
# - Wait for approvals
# - Merge to main
# - Manual PROD deployment available
```

---

## 🔗 Related Documentation

- [Full GitHub Setup Guide](./docs/GITHUB_SETUP.md)
- [Environments Configuration](./docs/ENVIRONMENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [GitHub Actions Workflows](./.github/workflows/)

---

## 📞 Troubleshooting

### Push Rejected: "Branch is protected"
```bash
# Create a PR instead:
git push origin feature/your-feature
# Then create PR on GitHub instead of merging directly
```

### Can't Find Repository Settings
```
GitHub → Your Repository → Click "Settings" tab
(Only repo admins can see Settings)
```

### Secrets Not Working in Actions
```
1. Verify secret exists: Settings → Secrets
2. Check workflow references ${secrets.SECRET_NAME}
3. Verify secret is available in workflow environment
4. Re-run workflow after updating secret
```

### Workflows Not Running
```
1. Check: Settings → Actions is enabled
2. Verify: .github/workflows/ files exist
3. Check: Branch protection requires status checks
4. Re-run: Manual trigger in Actions tab
```

---

## 🎉 You're All Set!

Your GitHub repository is now:
- ✅ Connected to local development
- ✅ Protected with branch rules
- ✅ Ready for team collaboration
- ✅ Automated with CI/CD pipelines
- ✅ Monitored and secured

**Next Steps:**
1. Invite team members to repository
2. Start creating feature branches
3. Create pull requests for code review
4. Deploy to TEST and PROD environments

---

**Version:** 1.0.0 | **Last Updated:** January 15, 2026 | **Status:** ✅ READY
