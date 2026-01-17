# GitHub ↔ Jira Integration Setup Guide

**Date:** January 17, 2026  
**Project:** SCL - Education Institute Management  
**Repository:** github.com/syedsanaulhaq/scl  
**Jira URL:** https://scl-sandbox.atlassian.net/

---

## 📋 Overview

This guide integrates your GitHub repository with Jira Cloud, enabling:
- ✅ Auto-link commits to Jira issues
- ✅ Auto-link pull requests to Jira issues
- ✅ Auto-transition issues on PR merge
- ✅ Automatic issue closure on code deploy
- ✅ Real-time status visibility in GitHub

---

## 🚀 Part 1: Install GitHub App in Jira (5 minutes)

### Step 1: Open Jira Marketplace

1. Log in to **https://scl-sandbox.atlassian.net/**
2. Click **Settings** (gear icon) → **Apps and integrations**
3. Click **Find new apps**
4. Search for **"GitHub for Jira"** (official app by Jira)

### Step 2: Install the App

1. Click the app result: **"GitHub for Jira"**
2. Click **Install** button
3. Review permissions → Click **Install**
4. Wait for installation to complete (30 seconds)

### Step 3: Grant Jira Access to GitHub

1. You'll be redirected to GitHub
2. Click **Authorize Atlassian** (green button)
3. GitHub will ask to authorize - click **Authorize**
4. You'll be redirected back to Jira

**Status:** ✅ App installed and authenticated

---

## 🔗 Part 2: Connect Your Repository (10 minutes)

### Step 4: Link Repository in Jira

1. In Jira, go to **Settings** → **Apps and integrations** → **GitHub**
2. Click **Connect repository** (or **Add repository**)
3. Select your GitHub organization/account
4. Select repository: **syedsanaulhaq/scl**
5. Click **Connect**

### Step 5: Map Jira Projects (Automatic)

- Jira will auto-detect your Jira projects
- Select: **SCL** (Education Institute Management)
- Click **Save**

**Status:** ✅ Repository connected to Jira

---

## 🎯 Part 3: Configure GitHub Linking (5 minutes)

### Step 6: Enable Linking Options

1. In Jira repository settings, look for **Link settings**
2. Enable the following checkboxes:
   - ✅ **Link commits** - Auto-link commits containing issue keys
   - ✅ **Link pull requests** - Auto-link PRs containing issue keys
   - ✅ **Link branches** - Auto-link branches containing issue keys
   - ✅ **Show GitHub information in issues** - Display commit/PR info in Jira

### Step 7: Configure Auto-Transition (Optional but Recommended)

1. Go to **Automation rules** in repository settings
2. Enable: **Auto-transition on pull request merge**
3. Set: When PR merged → Move issue to **Done/Closed**
4. Click **Save**

**Status:** ✅ All linking options enabled

---

## 📝 Part 4: Configure Your GitHub Commits (IMPORTANT!)

### Step 8: Add Jira Issue Keys to Your Commits

To link commits automatically, use this format:

```
git commit -m "feat: Add course CRUD endpoints - SCL-10"
```

**Format:** `[Your message] - [PROJECT_KEY]-[ISSUE_NUMBER]`

**Examples:**
```bash
# Fix a bug
git commit -m "fix: Fix JWT authentication issue - SCL-24"

# Add feature
git commit -m "feat: Implement course management APIs - SCL-10"

# Update documentation
git commit -m "docs: Add API documentation - SCL-15"
```

### Step 9: Create Branches with Issue Keys (Best Practice)

```bash
# Create a feature branch with issue key
git checkout -b SCL-10/add-course-crud-endpoints

# Or with prefix
git checkout -b feature/SCL-10-add-course-crud

# Example for bug fix
git checkout -b bugfix/SCL-24-jwt-auth-issue
```

**Format:** `[type]/SCL-[NUMBER]-[description]`

Jira will auto-detect the issue key in the branch name!

**Status:** ✅ Commit format ready

---

## 🔄 Part 5: Test the Integration (5 minutes)

### Step 10: Test Commit Linking

1. Make a test commit with issue key:
   ```bash
   git checkout -b test/SCL-1
   git commit -m "test: Testing GitHub-Jira integration - SCL-1"
   git push origin test/SCL-1
   ```

2. Go to **Jira** → **SCL-1** issue
3. Scroll down to **Development** section
4. You should see your branch and commit linked! ✅

### Step 11: Test Pull Request Linking

1. Create a pull request for your test branch
2. In the PR title or description, include issue key:
   ```
   Title: Add Course Management - SCL-10
   ```

3. Go back to **Jira** → **SCL-10** issue
4. Check **Development** section - PR should appear! ✅

### Step 12: Test Auto-Transition

1. If you set up automation, merge the PR
2. Go to **Jira** → Check issue status
3. Issue should auto-transition to **Done** ✅

---

## 📊 What You'll See in Jira

Once integrated, each issue will show:

### Development Section in Issue Details:
```
Development
├─ Branches
│  └─ feature/SCL-10-add-course-crud (1)
├─ Commits
│  ├─ 7b3c2e1 - feat: Add course CRUD endpoints (2 hours ago)
│  └─ a1f4d9b - fix: Handle empty request body (1 hour ago)
└─ Pull Requests
   └─ #45 - Add Course Management [OPEN]
```

### When PR is Merged:
```
Development
├─ Commits
│  ├─ 7b3c2e1 - feat: Add course CRUD endpoints (deployed)
│  └─ a1f4d9b - fix: Handle empty request body (deployed)
└─ Pull Requests
   └─ #45 - Add Course Management [MERGED]

[Issue automatically moved to "Done"]
```

---

## 🔧 Part 6: Advanced Automation Rules (Optional)

### Optional: Auto-Assign Based on Branch

1. Jira → **Settings** → **Automation**
2. Click **Create rule**
3. **Trigger:** When pull request created
4. **Condition:** PR matches branch pattern `feature/SCL-*`
5. **Action:** Assign to [Your GitHub username]
6. Click **Enable**

### Optional: Notify Team on Commit

1. Jira → **Settings** → **Automation**
2. Click **Create rule**
3. **Trigger:** When commit created
4. **Action:** Send notification to project team
5. Click **Enable**

---

## ✅ Verification Checklist

- [ ] GitHub app installed in Jira
- [ ] Repository connected (syedsanaulhaq/scl)
- [ ] Linking options enabled (commits, PRs, branches)
- [ ] Auto-transition enabled (optional)
- [ ] Test commit created with issue key
- [ ] Test PR created with issue key
- [ ] Linked items visible in Jira issue
- [ ] Team members can see GitHub info in Jira

---

## 📚 Quick Reference

### Linking Formats

| What | Format | Example |
|------|--------|---------|
| **Commit Message** | `[message] - SCL-XX` | `fix: bug - SCL-24` |
| **Branch Name** | `SCL-XX/description` | `SCL-10/add-crud` |
| **PR Title** | `[title] - SCL-XX` | `Add Course - SCL-10` |
| **PR Description** | `Fixes SCL-XX` | `Fixes SCL-24` |

### Auto-Transition Keywords

Add these in commit/PR to auto-transition:
- `closes SCL-10` → Moves to Done
- `fixes SCL-24` → Moves to Done
- `resolves SCL-1` → Moves to Done

---

## 🚨 Troubleshooting

### Issue: Commits not appearing in Jira

**Solution:**
1. Check commit message contains `SCL-XX` issue key
2. Ensure issue exists in Jira project
3. Wait 2-5 minutes for sync
4. Go to issue → Developer panel → click refresh

### Issue: PR not linking to issue

**Solution:**
1. Check PR title/description has issue key
2. Ensure branch matches pattern `SCL-*/...`
3. Verify repository is connected in Jira settings
4. Try adding issue key to PR description: `Fixes SCL-10`

### Issue: Auto-transition not working

**Solution:**
1. Check automation rules are enabled
2. Verify PR merge event is triggering
3. Check issue has "Done" status available
4. Manually test by merging a PR

---

## 🎯 Next Steps

1. **Complete integration using steps above** ✅
2. **Create first feature branch:** `git checkout -b feature/SCL-10-course-management`
3. **Make test commit:** `git commit -m "Initial course schema - SCL-10"`
4. **Push to GitHub:** `git push origin feature/SCL-10-course-management`
5. **Verify in Jira:** Check SCL-10 issue for linked branch
6. **Start Phase 3 development** 🚀

---

## 📞 Support

For issues with:
- **Jira setup:** Visit https://support.atlassian.com/jira-cloud-administration/
- **GitHub app:** Check https://github.com/integrations/jira
- **This project:** Refer to JIRA_IMPORT_GUIDE.md

---

**Status:** ✅ Ready to integrate GitHub with Jira
**Estimated Time:** 20-30 minutes for complete setup
**Benefits:** Real-time tracking, automated workflows, team transparency

