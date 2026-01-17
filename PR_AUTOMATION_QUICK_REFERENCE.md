# PR Automation - Quick Reference

## 🚀 One-Time Setup
```powershell
choco install gh
gh auth login
```

## ⚡ Create PR (Every Feature)
```powershell
.\scripts\create-pr.ps1
```

That's it! Script handles:
- ✅ Commit detection and prompting
- ✅ Pushing to remote
- ✅ Creating PR on GitHub
- ✅ Opening in browser

## 📋 With Custom Details
```powershell
.\scripts\create-pr.ps1 -Title "feat: my feature" -Description "Details..."
```

## 🎯 Typical Phase 3 Workflow
```powershell
# 1. Create feature branch
git checkout -b feature/phase-3-enrollments

# 2. Make changes, test
# (edit files, run tests)

# 3. Create PR (automated!)
.\scripts\create-pr.ps1

# 4. Get approval and merge on GitHub
```

## ❌ Troubleshooting
| Issue | Fix |
|-------|-----|
| "GitHub CLI not found" | `choco install gh` |
| "Not authenticated" | `gh auth login` |
| "PR creation failed" | `gh auth status` then `gh auth login` |

## 📚 Full Guide
See [AUTOMATED_PR_GUIDE.md](AUTOMATED_PR_GUIDE.md)
