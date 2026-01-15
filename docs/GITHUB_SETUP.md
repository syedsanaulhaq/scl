# 🐙 GitHub Repository Setup & Management

**Status:** ✅ Ready for Implementation  
**Date:** January 15, 2026  
**Repository:** SCL Education Institute Management System  

---

## 📋 GitHub Repository Setup Checklist

### Step 1: Create Repository on GitHub
- [ ] Go to https://github.com/new
- [ ] Name: `scl`
- [ ] Description: `SCL - Education Institute Management System`
- [ ] Visibility: **Private** (unless you want public)
- [ ] Initialize: Leave unchecked (we have local repo)
- [ ] Click "Create Repository"

### Step 2: Add Remote & Push Initial Code
```bash
# From project root (e:\SCL-Projects\SCL)
git remote add origin https://github.com/YOUR_USERNAME/scl.git
git branch -M main
git push -u origin main
```

### Step 3: Create and Push Develop Branch
```bash
# Create develop branch
git checkout -b develop

# Push develop branch
git push -u origin develop
```

### Step 4: Configure Branch Protection Rules

**For `main` branch (Production):**
1. Go to **Settings** → **Branches** → **Add Rule**
2. Branch name pattern: `main`
3. ✅ Require pull request reviews before merging (1 reviewer)
4. ✅ Require status checks to pass
5. ✅ Require branches to be up to date
6. ✅ Dismiss stale PR approvals
7. ✅ Require code reviews from code owners
8. ✅ Require approval of code reviews before merging
9. ✅ Require conversation resolution before merging
10. ✅ Require signed commits
11. ✅ Restrict who can push to matching branches

**For `develop` branch (Staging):**
1. Branch name pattern: `develop`
2. ✅ Require pull request reviews (1 reviewer)
3. ✅ Require status checks to pass
4. ✅ Require branches to be up to date

### Step 5: Configure GitHub Secrets

Navigate to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

**Development Secrets:**
```
DEV_SSH_HOST: dev.sclsandbox.xyz
DEV_SSH_USER: deploy-user
DEV_SSH_KEY: [SSH private key for DEV server]
```

**Test Secrets:**
```
TEST_SSH_HOST: test.sclsandbox.xyz
TEST_SSH_USER: deploy-user
TEST_SSH_KEY: [SSH private key for TEST server]
```

**Production Secrets:**
```
PROD_SSH_HOST: prod.sclsandbox.xyz
PROD_SSH_USER: deploy-user
PROD_SSH_KEY: [SSH private key for PROD server]
```

**Communication Secrets:**
```
SLACK_WEBHOOK_URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
GITHUB_TOKEN: [GitHub Personal Access Token]
```

### Step 6: Configure Environments

Navigate to **Settings** → **Environments**

**Create Environment: `development`**
- No protection rules
- No required reviewers

**Create Environment: `staging`**
- Deployment branches: `develop`
- Protection rules: None (optional)

**Create Environment: `production`**
- Deployment branches: `main`
- Required reviewers: 2 (minimum)
- Require custom deployment branches/tags: `v*`

### Step 7: Enable GitHub Actions
1. Go to **Settings** → **Actions** → **General**
2. ✅ Allow all actions and reusable workflows
3. Set "Workflow permissions": **Read and write permissions**
4. ✅ Allow GitHub Actions to create and approve pull requests

### Step 8: Configure CODEOWNERS File
Create `.github/CODEOWNERS`:
```
# Backend
/backend/ @backend-team

# Frontend
/frontend/ @frontend-team

# Documentation
/docs/ @tech-lead

# Workflows
.github/workflows/ @devops-team

# Root files
.github* @tech-lead
```

### Step 9: Add Status Checks
Configure required status checks:
- ✅ Build Backend
- ✅ Lint Backend
- ✅ Test Backend
- ✅ Build Frontend
- ✅ Lint Frontend
- ✅ Test Frontend

---

## 🔄 Git Workflow & Branching Strategy

### Branch Structure
```
main (Production - v1.0.0, v1.0.1, etc.)
  ↑
  └─ Release PRs from develop
     
develop (Staging - continuously updated)
  ↑
  └─ Feature/bug fix PRs
  
feature/auth-system
feature/user-management
feature/dashboard
bugfix/login-error
```

### Branching Rules

| Branch | Purpose | Protection | Deploy |
|--------|---------|-----------|---------|
| `main` | Production release | ✅ Strict | Manual (PROD) |
| `develop` | Staging/integration | ✅ Moderate | Auto (TEST) |
| `feature/*` | Feature development | ❌ None | None |
| `bugfix/*` | Bug fixes | ❌ None | None |
| `hotfix/*` | Production patches | ✅ Strict | Manual (PROD) |

### Feature Branch Workflow

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch (use descriptive names)
git checkout -b feature/user-authentication
# or
git checkout -b feature/dashboard-redesign
# or
git checkout -b bugfix/login-validation-error

# 3. Make commits (atomic, well-described)
git add .
git commit -m "feat: implement JWT token generation for auth system"
git commit -m "feat: add password hashing with bcryptjs"
git commit -m "test: add unit tests for login endpoint"

# 4. Push to GitHub
git push origin feature/user-authentication

# 5. Create Pull Request on GitHub
# - Title: Clear description
# - Description: What, Why, How
# - Link related issues
# - Request reviewers

# 6. Code Review → Approval → Merge
# - Address feedback
# - Squash commits if needed
# - Delete branch after merge
```

### Commit Message Format

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (no logic change)
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Test addition/modification
- `chore` - Build/tooling/dependencies
- `ci` - CI/CD configuration

**Examples:**
```
feat(auth): implement JWT token refresh endpoint
fix(login): correct email validation regex
docs(api): add authentication endpoints documentation
test(auth): add unit tests for password hashing
refactor(components): extract common button component
perf(database): add indexing for user queries
chore(deps): update express to v4.19.0
```

---

## 📌 Pull Request Process

### PR Title Convention
```
[SCOPE] Title: Description
[AUTH] feat: implement login endpoint
[UI] fix: correct navbar spacing on mobile
[INFRA] chore: update Node.js version to 18.16.0
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## How Has This Been Tested?
- Unit tests
- Integration tests
- Manual testing

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors
- [ ] No breaking changes

## Reviewer Notes
[Any special instructions for reviewers]
```

---

## 🚀 Deployment Flow

### Development (DEV)
```
1. Push to any branch
2. GitHub Actions runs tests
3. Tests pass → Manual run in DEV
4. Accessible at: http://localhost:5000 (local)
```

### Testing (TEST / Staging)
```
1. Create PR from feature → develop
2. Code review & approval
3. Merge to develop
4. GitHub Actions auto-runs:
   - Build backend & frontend
   - Run all tests
   - Deploy to TEST server
5. Accessible at: https://test.sclsandbox.xyz
6. QA team tests
```

### Production (PROD)
```
1. Create PR from develop → main
2. Required approvals (2+ reviewers)
3. All status checks must pass
4. Merge to main
5. Tag release: git tag v1.0.0
6. Manually trigger prod-deploy workflow
7. Production deployment with safeguards:
   - Backup current deployment
   - Deploy new version
   - Run health checks
   - Automated rollback on failure
8. Accessible at: https://app.sclsandbox.xyz
9. Slack notification to team
```

---

## 📊 GitHub Actions Workflows

### Files Created
```
.github/workflows/
├── dev-deploy.yml        # Runs on every develop push
├── test-deploy.yml       # Runs on develop merge, deploys to TEST
└── prod-deploy.yml       # Manual trigger, deploys to PROD
```

### Workflow Status
```
✅ Tests → ✅ Build → ✅ Deploy
                ↓
         [Failure] → 🔴 Notification
```

---

## 🔐 Security Best Practices

### Secrets Management
- ✅ Never commit `.env` files
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate secrets every 90 days
- ✅ Use SSH keys instead of passwords
- ✅ Different credentials per environment

### Code Review
- ✅ Minimum 1 reviewer for develop
- ✅ Minimum 2 reviewers for main
- ✅ CODEOWNERS approval required
- ✅ All status checks must pass
- ✅ Require signed commits on main

### Deployment Safety
- ✅ Automated backups before deploy
- ✅ Health checks after deploy
- ✅ Automated rollback on failure
- ✅ Manual approval for production
- ✅ Slack notifications for all deploys

---

## 📚 Additional Resources

### GitHub CLI Commands
```bash
# List PRs
gh pr list

# Check PR status
gh pr status

# Create PR from CLI
gh pr create --title "feat: add feature" --body "Description"

# Approve PR
gh pr review <PR_NUMBER> --approve

# View workflow runs
gh run list

# View workflow logs
gh run view <RUN_ID> --log
```

### Important Files
- `.gitignore` - Files to exclude from Git
- `.github/CODEOWNERS` - Code ownership rules
- `.github/workflows/*.yml` - CI/CD automation

---

## 🆘 Troubleshooting

### Push Rejected
```bash
# Update local main/develop
git fetch origin
git rebase origin/develop
git push origin develop
```

### Merge Conflicts
```bash
# Pull latest
git fetch origin
git merge origin/develop

# Resolve conflicts in editor
# Add resolved files
git add .
git commit -m "chore: resolve merge conflicts"
git push
```

### Failed Workflow
1. Click "Details" on failed check
2. Review error logs
3. Fix code locally
4. Commit & push again
5. Workflow automatically retries

---

## ✅ Setup Checklist

- [ ] GitHub repository created
- [ ] Remote added to local repo
- [ ] main & develop branches pushed
- [ ] Branch protection rules configured
- [ ] GitHub Secrets added
- [ ] Environments configured
- [ ] CODEOWNERS file created
- [ ] GitHub Actions enabled
- [ ] Status checks configured
- [ ] Team members invited
- [ ] Slack integration set up
- [ ] First deployment successful

---

**Version:** 1.0.0 | **Last Updated:** January 15, 2026 | **Status:** ✅ READY
