# Automated Pull Request Creator using GitHub CLI
# Works with GitHub CLI installed via winget
# ✅ GitHub CLI 2.83.2 installed and ready to use

param(
    [string]$BaseBranch = "develop",
    [string]$Title = "",
    [string]$Description = ""
)

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "GitHub CLI - Automated PR Creator" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
Write-Host "Checking for GitHub CLI..." -ForegroundColor Yellow
if (-not (Test-Path $ghPath)) {
    Write-Host "  ❌ GitHub CLI not found at: $ghPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Install using:" -ForegroundColor Yellow
    Write-Host "    winget install --id GitHub.cli" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "  ✅ GitHub CLI found" -ForegroundColor Green

# Check if authenticated
Write-Host ""
Write-Host "Checking GitHub authentication..." -ForegroundColor Yellow
try {
    & $ghPath auth status --quiet 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Authenticated" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Authentication may be needed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠️  Could not verify auth status" -ForegroundColor Yellow
}

# Get current branch
Write-Host ""
Write-Host "Gathering repository information..." -ForegroundColor Yellow
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "  Current branch: $currentBranch" -ForegroundColor Gray

if ($currentBranch -eq $BaseBranch) {
    Write-Host "  ⚠️  Cannot create PR from same branch!" -ForegroundColor Red
    Write-Host "     Checkout a feature branch first" -ForegroundColor Red
    exit 1
}

# Check for uncommitted changes
Write-Host ""
Write-Host "Checking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "  Found uncommitted changes:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Gray
    Write-Host ""
    $confirm = Read-Host "  Commit these changes? (y/n)"
    if ($confirm -eq 'y') {
        $message = Read-Host "  Enter commit message"
        git add -A
        git commit -m $message
        Write-Host "  ✅ Changes committed" -ForegroundColor Green
    } else {
        Write-Host "  Skipping commit" -ForegroundColor Yellow
    }
} else {
    Write-Host "  No uncommitted changes" -ForegroundColor Green
}

# Push to remote
Write-Host ""
Write-Host "Pushing to remote..." -ForegroundColor Yellow
$pushOutput = git push origin $currentBranch 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Pushed successfully" -ForegroundColor Green
} else {
    Write-Host "  ❌ Push failed" -ForegroundColor Red
    Write-Host "  Error: $pushOutput" -ForegroundColor Red
    exit 1
}

# Get title and description if not provided
Write-Host ""
Write-Host "Creating pull request..." -ForegroundColor Yellow
Write-Host "  Base branch: $BaseBranch" -ForegroundColor Gray
Write-Host "  Head branch: $currentBranch" -ForegroundColor Gray

if (-not $Title) {
    Write-Host ""
    $Title = Read-Host "  Enter PR title"
}

if (-not $Description) {
    $Description = Read-Host "  Enter PR description (optional)"
}

# Create PR using GitHub CLI
Write-Host ""
Write-Host "Creating PR with GitHub CLI..." -ForegroundColor Yellow

try {
    if ($Description) {
        $prUrl = & $ghPath pr create `
            --base $BaseBranch `
            --head $currentBranch `
            --title $Title `
            --body $Description `
            --web 2>&1
    } else {
        $prUrl = & $ghPath pr create `
            --base $BaseBranch `
            --head $currentBranch `
            --title $Title `
            --web 2>&1
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Pull Request Created Successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "PR Details:" -ForegroundColor Cyan
        Write-Host "  Output: $prUrl" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Review PR on GitHub (browser should open)" -ForegroundColor Gray
        Write-Host "  2. CI/CD pipeline will run automatically" -ForegroundColor Gray
        Write-Host "  3. Request reviewers" -ForegroundColor Gray
        Write-Host "  4. Merge after approval" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  Response: $prUrl" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "If authentication is needed:" -ForegroundColor Yellow
        Write-Host "    & '$ghPath' auth login" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Failed to create PR" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "PR Creation Complete!" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""
