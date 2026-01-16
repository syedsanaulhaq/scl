# 🔧 GITHUB CONFIGURATION - PHASE 1 SETUP

**Task:** Configure GitHub for team collaboration  
**Repository:** https://github.com/syedsanaulhaq/scl  
**Status:** In Progress  
**Duration:** ~1 hour  

---

## 📋 CHECKLIST

- [ ] Step 1: Branch Protection for `main`
- [ ] Step 2: Branch Protection for `develop`
- [ ] Step 3: Enable GitHub Actions
- [ ] Step 4: Configure Secrets (Optional but recommended)
- [ ] Step 5: Verify Everything Works

---

## ✅ STEP 1: BRANCH PROTECTION FOR `main`

**Requirement:** All PRs to main must have 2 code reviews before merge (production safety)

### Instructions:

1. **Go to GitHub Repository Settings**
   - Visit: https://github.com/syedsanaulhaq/scl/settings
   - Or: Click ⚙️ **Settings** tab on GitHub

2. **Navigate to Branches**
   - Left sidebar → **Branches**
   - Click **Add rule** button

3. **Create Protection Rule for `main`**
   
   | Setting | Value | Purpose |
   |---------|-------|---------|
   | Branch name pattern | `main` | Protect main branch |
   | Require a pull request before merging | ✅ | Must use PR |
   | Require approvals | ✅ | 2 approvals required |
   | Number of approvals | `2` | Production requirement |
   | Require status checks to pass | ✅ | Tests must pass |
   | Require branches to be up to date | ✅ | Before merge |
   | Include administrators | ✅ | Rules apply to all |

4. **Save Protection Rule**
   - Click **Create** button

### Result:
```
✅ main branch protected
   ├─ Requires 2 approvals
   ├─ Tests must pass
   ├─ Must be current with develop
   └─ No force pushes allowed
```

---

## ✅ STEP 2: BRANCH PROTECTION FOR `develop`

**Requirement:** PRs to develop must have 1 code review (staging safety)

### Instructions:

1. **Still in Branch Settings**
   - You're already at: https://github.com/syedsanaulhaq/scl/settings/branches

2. **Add Another Rule**
   - Click **Add rule** button again

3. **Create Protection Rule for `develop`**
   
   | Setting | Value | Purpose |
   |---------|-------|---------|
   | Branch name pattern | `develop` | Protect develop branch |
   | Require a pull request before merging | ✅ | Must use PR |
   | Require approvals | ✅ | 1 approval required |
   | Number of approvals | `1` | Staging requirement |
   | Require status checks to pass | ✅ | Tests must pass |
   | Require branches to be up to date | ✅ | Before merge |
   | Include administrators | ✅ | Rules apply to all |

4. **Save Protection Rule**
   - Click **Create** button

### Result:
```
✅ develop branch protected
   ├─ Requires 1 approval
   ├─ Tests must pass
   ├─ Must be current with main
   └─ No force pushes allowed
```

---

## ✅ STEP 3: ENABLE GITHUB ACTIONS

**Requirement:** Activate CI/CD workflows for automated testing and deployment

### Instructions:

1. **Go to Actions Settings**
   - Visit: https://github.com/syedsanaulhaq/scl/settings/actions
   - Or: Settings tab → **Actions** → **General**

2. **Configure Actions Permissions**
   
   | Setting | Value | Purpose |
   |---------|-------|---------|
   | Actions permissions | ✅ Allow all actions | Enable workflows |
   | Workflow permissions | ✅ Read and write | CI/CD needs access |
   | Allow GitHub Actions to create/approve pull requests | ✅ | Automation allowed |

3. **Save Settings**
   - Scroll down, click **Save**

### Verify Workflows:

1. **Go to Actions Tab**
   - Visit: https://github.com/syedsanaulhaq/scl/actions

2. **You should see 3 workflows:**
   - ✅ dev-deploy.yml
   - ✅ test-deploy.yml
   - ✅ prod-deploy.yml

### Result:
```
✅ GitHub Actions enabled
   ├─ dev-deploy: Runs on feature branch pushes (lint & test)
   ├─ test-deploy: Auto-deploys develop to TEST env
   └─ prod-deploy: Manual deploy main to PROD env
```

---

## ⚙️ STEP 4: CONFIGURE SECRETS (Optional)

**Requirement:** Store sensitive environment variables for CI/CD pipelines

### Instructions:

1. **Go to Secrets Settings**
   - Settings → **Secrets and variables** → **Actions**
   - Or: https://github.com/syedsanaulhaq/scl/settings/secrets/actions

2. **Add Each Secret**
   - Click **New repository secret**

3. **Required Secrets** (Add these):

```
Secret Name                | Example Value              | Used By
---------------------------|----------------------------|------------------
DEPLOY_KEY                | your-ssh-private-key      | Deployment
SLACK_WEBHOOK_URL         | https://hooks.slack.com/..| Notifications
DATABASE_HOST             | test.sclsandbox.xyz       | TEST env
DATABASE_USER             | scl_user                  | TEST env
DATABASE_PASSWORD         | [secure-password]         | TEST env
DATABASE_NAME             | scl_test                  | TEST env
JWT_SECRET                | [long-random-string]      | Auth tokens
NODE_ENV                  | test                      | Environment
```

### How to Add Secret:

1. **Name:** `DEPLOY_KEY`
2. **Value:** [Paste SSH private key or token]
3. Click **Add secret**

**Note:** These can be added later once infrastructure is ready. For now, you can skip this step.

---

## ✅ STEP 5: VERIFY EVERYTHING WORKS

### Check 1: Branch Protection

```bash
✓ Go to https://github.com/syedsanaulhaq/scl/settings/branches
✓ See "main" with protection rules
✓ See "develop" with protection rules
```

### Check 2: GitHub Actions Enabled

```bash
✓ Go to https://github.com/syedsanaulhaq/scl/actions
✓ See all 3 workflows listed
✓ Green checkmarks or yellow (pending)
```

### Check 3: Try Creating a Test PR

```bash
1. Create new branch locally:
   git checkout -b test/branch-protection
   
2. Make a small change:
   echo "# Test" >> README.md
   
3. Push and create PR:
   git push origin test/branch-protection
   
4. Go to GitHub → Pull Requests
5. Click "Create pull request"
6. Try to merge without approvals
   ✓ Merge button should be DISABLED
   ✓ Shows: "This branch has 2 required status checks"
```

---

## 📊 CURRENT STATUS

### Phase 1 Progress

| Task | Status | Time |
|------|--------|------|
| Branch Protection (main) | 🔄 In Progress | 5 min |
| Branch Protection (develop) | ⏳ Pending | 5 min |
| Enable GitHub Actions | ⏳ Pending | 3 min |
| Configure Secrets | ⏳ Optional | 10 min |
| Verify Setup | ⏳ Pending | 2 min |

---

## 🎯 NEXT STEPS AFTER GITHUB CONFIG

Once Phase 1 is complete:

1. **✅ GitHub configured** (main + develop protected, Actions enabled)
2. **Next:** Create feature branch `feature/authentication`
3. **Then:** Start coding User Model (Jan 17)

---

## 📝 QUICK REFERENCE

### GitHub URLs You'll Need

```
Repository: https://github.com/syedsanaulhaq/scl
Settings: https://github.com/syedsanaulhaq/scl/settings
Branches: https://github.com/syedsanaulhaq/scl/settings/branches
Actions: https://github.com/syedsanaulhaq/scl/actions
Pull Requests: https://github.com/syedsanaulhaq/scl/pulls
Issues: https://github.com/syedsanaulhaq/scl/issues
```

---

## ❓ TROUBLESHOOTING

### "Can't find Branches in Settings"
→ Click **Settings** tab at top of repository page
→ Look for **Branches** in left sidebar
→ If not visible, scroll down in sidebar

### "Branch protection rule not working"
→ Check: Are you admin of the repository?
→ Check: Is the rule saved? (Look for checkmark)
→ Try refreshing the page

### "GitHub Actions not showing workflows"
→ Check: Are workflow files in `.github/workflows/`?
→ Check: Are they valid YAML files?
→ Try: Push a dummy commit to trigger workflows

---

## ✨ YOU'RE ALL SET!

Once you complete all 5 steps above, Phase 1 is COMPLETE! 🎉

Then we'll move to **Phase 2: Authentication System** starting Jan 17.

---

**Status:** Phase 1 Configuration Guide  
**Duration:** ~1 hour  
**Next:** Week 1 Development (Jan 17)  
