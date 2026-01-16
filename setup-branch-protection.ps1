#!/usr/bin/env pwsh

# GitHub Branch Protection Setup - Automated Script
# Sets up branch protection rules for main and develop branches using GitHub API
# Usage: .\setup-branch-protection.ps1 -Token "ghp_xxxxxxxxxxxx"

param(
    [Parameter(Mandatory=$false)]
    [string]$Token,
    [string]$Owner = "syedsanaulhaq",
    [string]$Repo = "scl"
)

Write-Host ""
Write-Host "=========================================="
Write-Host "GitHub Branch Protection Setup"
Write-Host "Repository: $Owner/$Repo"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if token is provided
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "STEP 1: Get your GitHub Personal Access Token" -ForegroundColor Yellow
    Write-Host "=========================================="
    Write-Host "To get your token:"
    Write-Host "  1. Go to: https://github.com/settings/tokens/new"
    Write-Host "  2. Give it a name: 'SCL Branch Protection'"
    Write-Host "  3. Select scopes:"
    Write-Host "     - repo (full control)"
    Write-Host "     - admin:repo_hook"
    Write-Host "  4. Click 'Generate token'"
    Write-Host "  5. Copy the token (starts with 'ghp_')"
    Write-Host ""
    
    $Token = Read-Host "Paste your GitHub token here"
    
    if ([string]::IsNullOrEmpty($Token)) {
        Write-Host "ERROR: No token provided. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Verify token
Write-Host ""
Write-Host "Verifying token..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -ErrorAction Stop
    Write-Host "SUCCESS: Token verified - User: $($response.login)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Invalid GitHub token or API call failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""
Write-Host "Setting up branch protection rules..." -ForegroundColor Cyan
Write-Host ""

# Function to set branch protection
function Set-BranchProtection {
    param(
        [string]$Branch,
        [int]$RequiredReviews,
        [string]$GitHubToken,
        [string]$RepoOwner,
        [string]$RepoName
    )
    
    Write-Host ">> Configuring $Branch branch (requires $RequiredReviews approvals)..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $GitHubToken"
        "Accept" = "application/vnd.github+json"
        "X-GitHub-Api-Version" = "2022-11-28"
    }
    
    $body = @{
        enforce_admins = $true
        required_pull_request_reviews = @{
            required_approving_review_count = $RequiredReviews
        }
        allow_force_pushes = $false
        allow_deletions = $false
    } | ConvertTo-Json -Depth 10
    
    $uri = "https://api.github.com/repos/$RepoOwner/$RepoName/branches/$Branch/protection"
    
    try {
        [void](Invoke-RestMethod -Uri $uri -Method PUT -Headers $headers -Body $body)
        Write-Host "   [SUCCESS] $Branch protected with $RequiredReviews approval(s)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "   [FAILED] Error protecting $Branch branch" -ForegroundColor Red
        Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Set protection for main branch (2 approvals)
$mainSuccess = Set-BranchProtection -Branch "main" -RequiredReviews 2 -GitHubToken $Token -RepoOwner $Owner -RepoName $Repo

Start-Sleep -Milliseconds 500

# Set protection for develop branch (1 approval)
$developSuccess = Set-BranchProtection -Branch "develop" -RequiredReviews 1 -GitHubToken $Token -RepoOwner $Owner -RepoName $Repo

# Summary
Write-Host ""
Write-Host "=========================================="
Write-Host "Branch Protection Setup Summary"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if ($mainSuccess -and $developSuccess) {
    Write-Host "[SUCCESS] All branch protections configured!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Configuration Applied:" -ForegroundColor Green
    Write-Host "  [main branch]"
    Write-Host "     - Requires 2 code approvals"
    Write-Host "     - Enforces for administrators"
    Write-Host "     - No force pushes allowed"
    Write-Host "     - No deletions allowed"
    
    Write-Host ""
    Write-Host "  [develop branch]"
    Write-Host "     - Requires 1 code approval"
    Write-Host "     - Enforces for administrators"
    Write-Host "     - No force pushes allowed"
    Write-Host "     - No deletions allowed"
    
    Write-Host ""
    Write-Host "Phase 1 - Branch Protection: COMPLETE!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Verify: https://github.com/$Owner/$Repo/settings/branches" -ForegroundColor White
    Write-Host "  2. Check Actions: https://github.com/$Owner/$Repo/actions" -ForegroundColor White
    Write-Host "  3. Make repo private: https://github.com/$Owner/$Repo/settings" -ForegroundColor White
    Write-Host "  4. Ready for Phase 2: User Model (Jan 17)" -ForegroundColor White
    
}
else {
    Write-Host "[PARTIAL] Some branches failed to configure" -ForegroundColor Yellow
    Write-Host ""
    
    if ($mainSuccess) {
        Write-Host "  [OK] main branch protected" -ForegroundColor Green
    }
    else {
        Write-Host "  [FAILED] main branch" -ForegroundColor Red
    }
    
    if ($developSuccess) {
        Write-Host "  [OK] develop branch protected" -ForegroundColor Green
    }
    else {
        Write-Host "  [FAILED] develop branch" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Check token has correct scopes (repo, admin:repo_hook)" -ForegroundColor White
    Write-Host "  - Verify token is not expired" -ForegroundColor White
    Write-Host "  - Ensure you are the repository owner" -ForegroundColor White
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
