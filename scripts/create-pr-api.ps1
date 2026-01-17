# Automated PR Creator - No Dependencies Version
# Works with just git and PowerShell (no GitHub CLI required)

param(
    [string]$BaseBranch = "develop",
    [string]$Title = "New feature implementation",
    [string]$Description = "Automated PR creation"
)

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Automated PR Creation Tool" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# Get repository information
Write-Host "Gathering repository information..." -ForegroundColor Yellow

# Get current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "  Current branch: $currentBranch" -ForegroundColor Gray

# Get repository URL
$repoUrl = git config --get remote.origin.url
$repoMatch = [regex]::Match($repoUrl, 'github\.com[:/]([^/]+)/([^/]+?)(?:\.git)?$')
if ($repoMatch.Success) {
    $owner = $repoMatch.Groups[1].Value
    $repo = $repoMatch.Groups[2].Value
    Write-Host "  Repository: $owner/$repo" -ForegroundColor Gray
} else {
    Write-Host "❌ Could not parse repository URL" -ForegroundColor Red
    exit 1
}

# Check for uncommitted changes
Write-Host ""
Write-Host "Checking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "  Found uncommitted changes:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Gray
    $confirm = Read-Host "  Commit changes? (y/n)"
    if ($confirm -eq 'y') {
        $message = Read-Host "  Commit message"
        git add -A
        git commit -m $message
        Write-Host "  ✅ Changes committed" -ForegroundColor Green
    }
} else {
    Write-Host "  No uncommitted changes" -ForegroundColor Green
}

# Push to remote
Write-Host ""
Write-Host "Pushing to remote..." -ForegroundColor Yellow
git push origin $currentBranch
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Pushed to remote" -ForegroundColor Green
} else {
    Write-Host "  ❌ Failed to push" -ForegroundColor Red
    exit 1
}

# Get GitHub token from environment or prompt
Write-Host ""
Write-Host "GitHub authentication..." -ForegroundColor Yellow
$token = $env:GITHUB_TOKEN
if (-not $token) {
    Write-Host "  GITHUB_TOKEN not found in environment" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  To set it up:" -ForegroundColor Gray
    Write-Host "    1. Go to: https://github.com/settings/tokens/new" -ForegroundColor Gray
    Write-Host "    2. Create token with 'repo' scope" -ForegroundColor Gray
    Write-Host "    3. Copy the token" -ForegroundColor Gray
    Write-Host "    4. Run: \$env:GITHUB_TOKEN = 'your_token'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  For now, use GitHub CLI instead:" -ForegroundColor Yellow
    Write-Host "    1. Install: choco install gh" -ForegroundColor Gray
    Write-Host "    2. Login: gh auth login" -ForegroundColor Gray
    Write-Host "    3. Use: .\scripts\create-pr.ps1" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "  ✅ GitHub token found" -ForegroundColor Green

# Create PR via GitHub API
Write-Host ""
Write-Host "Creating pull request..." -ForegroundColor Yellow
Write-Host "  Base: $BaseBranch" -ForegroundColor Gray
Write-Host "  Head: $currentBranch" -ForegroundColor Gray

$prBody = @{
    title       = $Title
    body        = $Description
    head        = $currentBranch
    base        = $BaseBranch
} | ConvertTo-Json

$headers = @{
    Authorization = "token $token"
    Accept        = "application/vnd.github.v3+json"
}

try {
    $response = Invoke-WebRequest `
        -Uri "https://api.github.com/repos/$owner/$repo/pulls" `
        -Method POST `
        -Headers $headers `
        -Body $prBody `
        -ContentType "application/json" `
        -UseBasicParsing

    $pr = $response.Content | ConvertFrom-Json
    $prUrl = $pr.html_url

    Write-Host "  ✅ Pull Request Created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "PR Number: #$($pr.number)" -ForegroundColor Cyan
    Write-Host "PR URL: $prUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Review PR on GitHub: $prUrl" -ForegroundColor Gray
    Write-Host "  2. CI/CD pipeline will run automatically" -ForegroundColor Gray
    Write-Host "  3. Get approvals and merge when ready" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Opening in browser..." -ForegroundColor Yellow
    Start-Process $prUrl
} catch {
    Write-Host "  ❌ Failed to create PR" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Done!" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""
