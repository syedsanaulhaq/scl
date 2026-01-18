# Automated Pull Request Creation Guide

No more manual PR creation on GitHub! This guide shows you how to automate the entire workflow.

---

## Quick Start (2 Steps)

### Step 1: Install GitHub CLI
```powershell
choco install gh
```

### Step 2: Authenticate
```powershell
gh auth login
```

Then for any feature branch:
```powershell
.\scripts\create-pr.ps1
```

Done! Your PR is created and opened in the browser.

---

## What The Script Does

1. ✅ Checks for GitHub CLI installation
2. ✅ Detects uncommitted changes and prompts to commit
3. ✅ Pushes your current branch to remote
4. ✅ Creates PR automatically using GitHub CLI
5. ✅ Opens PR in browser
6. ✅ Shows next steps

---

## Installation Options

### Option 1: Chocolatey (Recommended)
```powershell
choco install gh
```

### Option 2: Windows Package Manager
```powershell
winget install --id GitHub.cli
```

### Option 3: Scoop
```powershell
scoop install gh
```

### Option 4: Manual Download
Visit: https://github.com/cli/cli/releases

---

## Authentication

After installing GitHub CLI, authenticate once:

```powershell
gh auth login
```

Follow the prompts:
1. Select "GitHub.com"
2. Choose "SSH" (recommended) or "HTTPS"
3. Select "Paste an authentication token"
4. Get a token from: https://github.com/settings/tokens/new
   - Scopes needed: `repo`, `workflow`
5. Paste the token when prompted

After this, you're authenticated for all future PR creation!

---

## Usage Examples

### Create PR with Interactive Prompts
```powershell
.\scripts\create-pr.ps1
```
The script will ask for title and description.

### Create PR with Specific Base Branch
```powershell
.\scripts\create-pr.ps1 -BaseBranch "main"
```

### Create PR with Full Details
```powershell
.\scripts\create-pr.ps1 `
  -BaseBranch "develop" `
  -Title "feat: add user dashboard" `
  -Description "Implements user dashboard with stats and charts"
```

---

## Typical Workflow

### For a New Feature Branch

1. **Create and switch to feature branch**
   ```powershell
   git checkout -b feature/my-feature
   ```

2. **Make your changes and test**
   ```powershell
   # Edit files...
   # Run tests: .\scripts\test-auth-endpoints.ps1
   ```

3. **Create PR (automated!)**
   ```powershell
   .\scripts\create-pr.ps1
   ```
   The script will:
   - Ask if you want to commit changes
   - Push to remote
   - Create the PR
   - Open it in your browser

4. **Review and Merge on GitHub**
   - Let CI/CD pipeline run
   - Get approval from teammate
   - Click "Merge pull request"

---

## What Happens Behind the Scenes

The script runs these commands in order:

```powershell
# 1. Check for GitHub CLI
Get-Command gh

# 2. Get current branch
git rev-parse --abbrev-ref HEAD

# 3. Check for uncommitted changes
git status --porcelain

# 4. (Optional) Commit changes
git add -A
git commit -m "Your commit message"

# 5. Push to remote
git push origin $currentBranch

# 6. Create PR via GitHub CLI
gh pr create --base develop --head $currentBranch --title "..." --body "..."

# 7. Open PR in browser
Start-Process $prUrl
```

---

## Troubleshooting

### "GitHub CLI not found"
Install GitHub CLI using one of the options above.

### "Failed to authenticate"
```powershell
gh auth logout
gh auth login
```

### "Commit not pushing"
```powershell
# Check remote URL
git remote -v

# Set correct remote if needed
git remote set-url origin https://github.com/syedsanaulhaq/scl.git
```

### "PR creation failed but GitHub CLI is installed"
```powershell
# Check authentication status
gh auth status

# Re-authenticate if needed
gh auth login
```

---

## Advanced: Using Without GitHub CLI

If you prefer not to install GitHub CLI, use the API-based script:

```powershell
.\scripts\create-pr-api.ps1
```

This requires setting a GitHub token:
```powershell
$env:GITHUB_TOKEN = 'your_github_token'
.\scripts\create-pr-api.ps1
```

Get a token from: https://github.com/settings/tokens/new (scope: `repo`)

---

## Next Time: Phase 3 Workflow

Once GitHub CLI is set up, creating PRs for Phase 3 is super simple:

```powershell
# Create feature branch
git checkout -b feature/phase-3-enrollments

# Make changes...

# When ready, create PR automatically
.\scripts\create-pr.ps1

# That's it! PR is created and browser opens automatically
```

---

## Files Involved

- **[scripts/create-pr.ps1](scripts/create-pr.ps1)** - GitHub CLI version (recommended)
- **[scripts/create-pr-api.ps1](scripts/create-pr-api.ps1)** - API version (no CLI needed)

Choose the one that fits your preference!

---

## Summary

| Task | Before (Manual) | After (Automated) |
|------|-----------------|-------------------|
| Create PR | 5+ steps on GitHub web UI | 1 command: `.\scripts\create-pr.ps1` |
| Commit changes | Separate step | Prompted by script |
| Push branch | Separate step | Done automatically |
| Open PR | Copy-paste URL from GitHub | Automatic browser open |
| Time saved per PR | ~2-3 minutes | ~20-30 seconds |

🚀 **Welcome to automated workflow!**
