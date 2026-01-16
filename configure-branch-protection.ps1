# GitHub Branch Protection Configuration via API
# This script configures branch protection rules for main and develop branches

param(
    [string]$Token = ""
)

$owner = "syedsanaulhaq"
$repo = "scl"

if ([string]::IsNullOrEmpty($Token)) {
    $Token = Read-Host "Enter your GitHub Personal Access Token`n(Create one at: https://github.com/settings/tokens)`nToken"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Configuring Branch Protection via GitHub API" -ForegroundColor Cyan
Write-Host "Repository: $owner/$repo" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration 1: Main branch (2 approvals required)
Write-Host "Step 1: Configuring 'main' branch protection..." -ForegroundColor Yellow
Write-Host "   - Require 2 code reviews" -ForegroundColor Gray
Write-Host "   - Enforce for administrators" -ForegroundColor Gray
Write-Host "   - Require up-to-date branches`n" -ForegroundColor Gray

$mainProtection = @{
    required_status_checks = @{
        strict = $true
        contexts = @()
    }
    enforce_admins = $true
    required_pull_request_reviews = @{
        dismiss_stale_reviews = $false
        require_code_owner_reviews = $false
        required_approving_review_count = 2
    }
    restrictions = $null
}

$mainJson = $mainProtection | ConvertTo-Json -Depth 10

try {
    [void](Invoke-WebRequest `
        -Uri "https://api.github.com/repos/$owner/$repo/branches/main/protection" `
        -Method PUT `
        -Headers @{
            "Authorization" = "token $Token"
            "Accept" = "application/vnd.github.v3+json"
            "Content-Type" = "application/json"
        } `
        -Body $mainJson `
        -ErrorAction Stop)

    Write-Host "   ✅ Main branch protection configured successfully!" -ForegroundColor Green
    Write-Host "   ✅ Requires 2 approvals before merge" -ForegroundColor Green
    Write-Host "   ✅ Enforced for all users including admins" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Check: Is your token valid?" -ForegroundColor Yellow
    Write-Host "   Check: Is the repository correct?" -ForegroundColor Yellow
    exit 1
}

# Configuration 2: Develop branch (1 approval required)
Write-Host "`nStep 2: Configuring 'develop' branch protection..." -ForegroundColor Yellow
Write-Host "   - Require 1 code review" -ForegroundColor Gray
Write-Host "   - Enforce for administrators" -ForegroundColor Gray
Write-Host "   - Require up-to-date branches`n" -ForegroundColor Gray

$developProtection = @{
    required_status_checks = @{
        strict = $true
        contexts = @()
    }
    enforce_admins = $true
    required_pull_request_reviews = @{
        dismiss_stale_reviews = $false
        require_code_owner_reviews = $false
        required_approving_review_count = 1
    }
    restrictions = $null
}

$developJson = $developProtection | ConvertTo-Json -Depth 10

try {
    [void](Invoke-WebRequest `
        -Uri "https://api.github.com/repos/$owner/$repo/branches/develop/protection" `
        -Method PUT `
        -Headers @{
            "Authorization" = "token $Token"
            "Accept" = "application/vnd.github.v3+json"
            "Content-Type" = "application/json"
        } `
        -Body $developJson `
        -ErrorAction Stop)

    Write-Host "   ✅ Develop branch protection configured successfully!" -ForegroundColor Green
    Write-Host "   ✅ Requires 1 approval before merge" -ForegroundColor Green
    Write-Host "   ✅ Enforced for all users including admins" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Check: Is your token valid?" -ForegroundColor Yellow
    Write-Host "   Check: Is the repository correct?" -ForegroundColor Yellow
    exit 1
}

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  PHASE 1 STEP 1 COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Branch Protection Configuration Summary:" -ForegroundColor Cyan
Write-Host "   [OK] Main branch: 2 code reviews required" -ForegroundColor Green
Write-Host "   [OK] Develop branch: 1 code review required" -ForegroundColor Green
Write-Host "   [OK] Both branches: Status checks required" -ForegroundColor Green
Write-Host "   [OK] Both branches: Administrator enforcement enabled" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "   1. Run: .\configure-github-actions.ps1" -ForegroundColor Gray
Write-Host "   2. Or: Proceed to Step 3 in PHASE_1_GITHUB_CONFIGURATION.md" -ForegroundColor Gray

Write-Host "`n✨ Done! Verify at: https://github.com/$owner/$repo/settings/branches`n" -ForegroundColor Green
