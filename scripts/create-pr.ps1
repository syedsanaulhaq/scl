# Automated Pull Request Creator using GitHub CLI
# Requires: GitHub CLI (gh) installed and authenticated
# Install: choco install gh
# Authenticate: gh auth login

param(
    [string]$BaseBranch = "develop",
    [string]$Title = "",
    [string]$Description = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Automated Pull Request Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
Write-Host "Checking for GitHub CLI..." -ForegroundColor Yellow
$ghInstalled = $null -ne (Get-Command gh -ErrorAction SilentlyContinue)

if (-not $ghInstalled) {
    Write-Host ""
    Write-Host "❌ GitHub CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "GitHub CLI is required to create PRs automatically." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Install options:" -ForegroundColor Yellow
    Write-Host "  1. Via Chocolatey:" -ForegroundColor Gray
    Write-Host "     choco install gh" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Via winget:" -ForegroundColor Gray
    Write-Host "     winget install --id GitHub.cli" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Via scoop:" -ForegroundColor Gray
    Write-Host "     scoop install gh" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After installation, authenticate with:" -ForegroundColor Gray
    Write-Host "  gh auth login" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ GitHub CLI found" -ForegroundColor Green
Write-Host ""

# Get current branch
Write-Host "Getting current branch..." -ForegroundColor Yellow
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $currentBranch" -ForegroundColor Gray

# Check for uncommitted changes
Write-Host "Checking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Gray
    Write-Host ""
    $confirm = Read-Host "Commit changes before creating PR? (y/n)"
    if ($confirm -eq 'y') {
        $message = Read-Host "Commit message"
        git add -A
        git commit -m $message
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
}

# Push to remote
Write-Host ""
Write-Host "Pushing to remote..." -ForegroundColor Yellow
git push origin $currentBranch
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed to remote" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to remote" -ForegroundColor Red
    exit 1
}

# Create PR using GitHub CLI
Write-Host ""
Write-Host "Creating pull request..." -ForegroundColor Yellow
Write-Host "  Base: $BaseBranch" -ForegroundColor Gray
Write-Host "  Head: $currentBranch" -ForegroundColor Gray
Write-Host ""

$prUrl = gh pr create `
    --base $BaseBranch `
    --head $currentBranch `
    --title $Title `
    --body $Description `
    --repo syedsanaulhaq/scl

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Pull Request Created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "PR URL: $prUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Review the PR on GitHub: $prUrl" -ForegroundColor Gray
    Write-Host "  2. CI/CD pipeline will run tests automatically" -ForegroundColor Gray
    Write-Host "  3. Get 1 approval to merge to $BaseBranch" -ForegroundColor Gray
    Write-Host "  4. Click 'Merge pull request' button" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Opening PR in browser..." -ForegroundColor Yellow
    Start-Process $prUrl
} else {
    Write-Host ""
    Write-Host "❌ Failed to create pull request" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  - Not authenticated with GitHub CLI (run: gh auth login)" -ForegroundColor Gray
    Write-Host "  - Branch has no changes compared to base branch" -ForegroundColor Gray
    Write-Host "  - Repository name is incorrect" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Done!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
