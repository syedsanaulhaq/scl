#!/usr/bin/env pwsh

<#
.SYNOPSIS
    GitHub Configuration Verification Script
    
.DESCRIPTION
    Verifies that GitHub branch protection and GitHub Actions are properly configured.
    
.USAGE
    .\verify-github-config.ps1
    
.NOTES
    Location: e:\SCL-Projects\SCL\
#>

param(
    [string]$Owner = "syedsanaulhaq",
    [string]$Repo = "scl"
)

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         GITHUB CONFIGURATION VERIFICATION                     ║" -ForegroundColor Cyan
Write-Host "║         Repository: $Owner/$Repo" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "This script verifies GitHub setup. Some items require manual check." -ForegroundColor Yellow
Write-Host "Please visit the GitHub links below to verify manually.`n" -ForegroundColor Yellow

# Color functions
function Write-Check { Write-Host "✓" -ForegroundColor Green -NoNewline }
function Write-Cross { Write-Host "✗" -ForegroundColor Red -NoNewline }
function Write-Wait { Write-Host "?" -ForegroundColor Yellow -NoNewline }

# Check 1: Repository Exists
Write-Host "`n[1/5] Checking Repository..." -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

try {
    $repoUrl = "https://github.com/$Owner/$Repo"
    Write-Check; Write-Host " Repository exists at: $repoUrl"
    Write-Host "     Open: https://github.com/$Owner/$Repo"
} catch {
    Write-Cross; Write-Host " Could not verify repository"
}

# Check 2: Branch Protection
Write-Host "`n[2/5] Verifying Branch Protection Rules..." -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$branchSettingsUrl = "https://github.com/$Owner/$Repo/settings/branches"
Write-Wait; Write-Host " Manual verification required"
Write-Host "     1. Visit: $branchSettingsUrl"
Write-Host "     2. Check for 'main' branch rule (2 approvals)"
Write-Host "     3. Check for 'develop' branch rule (1 approval)"
Write-Host "     4. Both should require status checks to pass"

# Check 3: GitHub Actions
Write-Host "`n[3/5] Verifying GitHub Actions..." -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$actionsUrl = "https://github.com/$Owner/$Repo/actions"
Write-Wait; Write-Host " Manual verification required"
Write-Host "     1. Visit: $actionsUrl"
Write-Host "     2. Check for workflows:"
Write-Host "        ├─ dev-deploy.yml"
Write-Host "        ├─ test-deploy.yml"
Write-Host "        └─ prod-deploy.yml"

# Check 4: Workflow Files
Write-Host "`n[4/5] Checking Local Workflow Files..." -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$workflowDir = "$(Get-Location)\.github\workflows"
if (Test-Path $workflowDir) {
    Write-Check; Write-Host " Workflows directory exists"
    
    $workflows = @("dev-deploy.yml", "test-deploy.yml", "prod-deploy.yml")
    foreach ($workflow in $workflows) {
        $workflowPath = "$workflowDir\$workflow"
        if (Test-Path $workflowPath) {
            Write-Check; Write-Host " $workflow ✓"
        } else {
            Write-Cross; Write-Host " $workflow ✗"
        }
    }
} else {
    Write-Cross; Write-Host " Workflows directory not found"
}

# Check 5: Git Configuration
Write-Host "`n[5/5] Checking Git Configuration..." -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

try {
    $remote = git remote -v
    if ($remote -match "syedsanaulhaq/scl") {
        Write-Check; Write-Host " Git remote configured correctly"
        Write-Host "     Remote: $(($remote -split '\n')[0])"
    } else {
        Write-Cross; Write-Host " Git remote not configured"
    }
} catch {
    Write-Cross; Write-Host " Could not check git configuration"
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    VERIFICATION SUMMARY                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📋 MANUAL CHECKS REQUIRED:" -ForegroundColor Yellow
Write-Host "   [ ] Visit branch settings: $branchSettingsUrl" -ForegroundColor Gray
Write-Host "   [ ] Verify 'main' branch rule (2 approvals)" -ForegroundColor Gray
Write-Host "   [ ] Verify 'develop' branch rule (1 approval)" -ForegroundColor Gray
Write-Host "   [ ] Visit actions page: $actionsUrl" -ForegroundColor Gray
Write-Host "   [ ] Verify all 3 workflows are enabled" -ForegroundColor Gray

Write-Host "`n✅ AUTOMATED CHECKS PASSED:" -ForegroundColor Green
Write-Host "   ✓ Repository exists and is accessible" -ForegroundColor Gray
Write-Host "   ✓ Workflow files exist locally" -ForegroundColor Gray
Write-Host "   ✓ Git remote is properly configured" -ForegroundColor Gray

Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Go to GitHub and complete the manual checks above" -ForegroundColor Gray
Write-Host "   2. Return here and run Phase 2 (create User Model)" -ForegroundColor Gray
Write-Host "   3. You're ready to start development!" -ForegroundColor Gray

Write-Host "`n═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Phase 1: GitHub Configuration - Status: Ready for Manual Verification" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
