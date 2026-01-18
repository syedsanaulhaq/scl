# 🚀 PR Automation - Visual Workflow

## Before vs After

### ❌ BEFORE: Manual PR Creation (2-3 minutes)
```
1. Open browser
2. Go to GitHub
3. Click "New pull request"
4. Select base branch (develop)
5. Select compare branch (feature/phase-2)
6. Fill title
7. Fill description
8. Click "Create pull request"
9. Wait for page load
10. Copy PR URL (if needed)
```

### ✅ AFTER: Automated PR Creation (20-30 seconds)
```powershell
.\scripts\create-pr.ps1
```

Done! Browser opens with PR automatically created! ⚡

---

## Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Setup (One Time - 5 minutes)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Install GitHub CLI                                      │
│     $ choco install gh                                      │
│     (Takes 2-3 minutes)                                     │
│                                                             │
│  2. Authenticate                                            │
│     $ gh auth login                                         │
│     (Takes 1-2 minutes)                                     │
│                                                             │
│  3. Done! Never do this again ✅                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 2: For Every Feature (20-30 seconds each)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Create feature branch                                   │
│     $ git checkout -b feature/my-feature                    │
│                                                             │
│  2. Make changes, test, commit                              │
│     $ # (edit files, test, etc...)                          │
│     $ git commit -m "your changes"                          │
│                                                             │
│  3. Create PR - AUTOMATED!                                  │
│     $ .\scripts\create-pr.ps1                               │
│     ✨ Everything happens automatically:                    │
│        • Detects uncommitted changes                        │
│        • Prompts to commit if needed                        │
│        • Pushes to GitHub                                   │
│        • Creates PR                                         │
│        • Opens PR in browser                                │
│                                                             │
│  4. Get approval and merge (manual on GitHub)               │
│     • Wait for CI/CD tests to pass                          │
│     • Get 1 approval from team                              │
│     • Click merge button                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## File Locations

```
Project Root (E:\SCL-Projects\SCL\)
│
├── scripts/
│   ├── create-pr.ps1                ← Main script (GitHub CLI)
│   ├── create-pr-api.ps1            ← Backup script (API)
│   └── test-auth-endpoints.ps1      ← Testing
│
├── START_HERE_PR_AUTOMATION.md       ← Start here! 👈
├── PR_AUTOMATION_COMPLETE.md         ← Overview
├── AUTOMATED_PR_GUIDE.md             ← Detailed guide
└── PR_AUTOMATION_QUICK_REFERENCE.md  ← Quick ref
```

---

## Command Cheat Sheet

### Installation
```powershell
# Install GitHub CLI
choco install gh

# Authenticate (one time)
gh auth login
```

### Creating PRs
```powershell
# Simple (interactive - asks for title/description)
.\scripts\create-pr.ps1

# With custom base branch
.\scripts\create-pr.ps1 -BaseBranch "main"

# With all details specified
.\scripts\create-pr.ps1 `
  -BaseBranch "develop" `
  -Title "feat: add course enrollments" `
  -Description "Adds ability for students to enroll in courses"

# Using API script (if no GitHub CLI)
$env:GITHUB_TOKEN = 'your_token'
.\scripts\create-pr-api.ps1
```

---

## What's Automated?

```
Your Action:        .\scripts\create-pr.ps1
                            ↓
Script Automatically:
├─ Checks for GitHub CLI
├─ Gets current branch
├─ Detects uncommitted changes
├─ Prompts to commit (if needed)
├─ Pushes to GitHub
├─ Creates PR on GitHub
├─ Opens PR in browser
└─ Shows next steps

Result: ✅ Your PR is created and ready for review!
```

---

## Time Savings

| Task | Manual | Automated | Saved |
|------|--------|-----------|-------|
| Install/Setup | N/A | 5 min | — |
| Per PR | 2-3 min | 20-30 sec | ~2-3 min |
| 10 features | 20-30 min | 2-5 min | 15-25 min |
| 100 features | 3-5 hours | 20-50 min | 2-4 hours |

---

## Error Handling

Script automatically handles:
- ✅ GitHub CLI not installed → helpful install instructions
- ✅ Not authenticated → helpful auth instructions
- ✅ Uncommitted changes → prompts to commit
- ✅ Push failures → error message with next steps
- ✅ PR creation failures → error message with troubleshooting

---

## Phase 3 Ready!

When you start Phase 3 (Course Enrollments):

```powershell
# 1. Create branch
git checkout -b feature/phase-3-enrollments

# 2. Work on code...
# (make changes, test, commit)

# 3. Create PR - no manual GitHub steps!
.\scripts\create-pr.ps1

# ✨ Done! PR created and opened in browser automatically
```

---

## Documentation Guide

```
For Getting Started:
├─ START_HERE_PR_AUTOMATION.md       ← You should read this first
├─ PR_AUTOMATION_QUICK_REFERENCE.md  ← For quick commands
└─ AUTOMATED_PR_GUIDE.md             ← For detailed help

For Understanding Phase 2:
├─ PHASE_2_IMPLEMENTATION_COMPLETE.md
├─ PHASE_2_QUICK_REFERENCE.md
└─ PHASE_2_READY_FOR_PR.md
```

---

## Quick Links

- 📖 **Full Setup Guide:** [AUTOMATED_PR_GUIDE.md](AUTOMATED_PR_GUIDE.md)
- 📋 **Quick Reference:** [PR_AUTOMATION_QUICK_REFERENCE.md](PR_AUTOMATION_QUICK_REFERENCE.md)
- 🎯 **Main Summary:** [START_HERE_PR_AUTOMATION.md](START_HERE_PR_AUTOMATION.md)
- 🔧 **GitHub CLI Docs:** https://cli.github.com/

---

## Summary

✅ **Setup:** `choco install gh` + `gh auth login` (5 min, one time)  
✅ **Usage:** `.\scripts\create-pr.ps1` (20-30 sec, every feature)  
✅ **Saved Time:** 2-3 minutes per PR  
✅ **Phase 3 Ready:** No additional setup needed  
✅ **Fully Automated:** Handles commit, push, create, open  

**Your workflow is optimized!** 🚀

---

## Get Started Now!

1. **Install:** `choco install gh`
2. **Authenticate:** `gh auth login`
3. **Test:** Try `.\scripts\create-pr.ps1` on any branch
4. **Ready for Phase 3!** 🎉

Questions? See [AUTOMATED_PR_GUIDE.md](AUTOMATED_PR_GUIDE.md)
