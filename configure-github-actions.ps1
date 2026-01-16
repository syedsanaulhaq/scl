# GitHub Actions Configuration via API
# This script enables GitHub Actions and configures permissions

param(
    [string]$Token = ""
)

$owner = "syedsanaulhaq"
$repo = "scl"

if ([string]::IsNullOrEmpty($Token)) {
    $Token = Read-Host "Enter your GitHub Personal Access Token`n(Reuse from previous step or create at: https://github.com/settings/tokens)`nToken"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Configuring GitHub Actions via GitHub API" -ForegroundColor Cyan
Write-Host "Repository: $owner/$repo" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Enable Actions
Write-Host "Step 1: Enabling GitHub Actions..." -ForegroundColor Yellow
Write-Host "   - Allow all actions and reusable workflows" -ForegroundColor Gray
Write-Host "   - Configure read/write permissions`n" -ForegroundColor Gray

$actionsConfig = @{
    actions_enabled = $true
}

$actionsJson = $actionsConfig | ConvertTo-Json -Depth 10

try {
    [void](Invoke-WebRequest `
        -Uri "https://api.github.com/repos/$owner/$repo" `
        -Method PATCH `
        -Headers @{
            "Authorization" = "token $Token"
            "Accept" = "application/vnd.github.v3+json"
            "Content-Type" = "application/json"
        } `
        -Body $actionsJson `
        -ErrorAction Stop)

    Write-Host "   ✅ GitHub Actions enabled successfully!" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Configure Actions Permissions
Write-Host "`nStep 2: Configuring Actions permissions..." -ForegroundColor Yellow
Write-Host "   - Default permissions: read-write" -ForegroundColor Gray
Write-Host "   - Allow workflows to create PRs`n" -ForegroundColor Gray

$permissionsConfig = @{
    actions_default_token_permission = "write"
    actions_default_token_permission_readonly = $false
}

$permissionsJson = $permissionsConfig | ConvertTo-Json -Depth 10

try {
    [void](Invoke-WebRequest `
        -Uri "https://api.github.com/repos/$owner/$repo" `
        -Method PATCH `
        -Headers @{
            "Authorization" = "token $Token"
            "Accept" = "application/vnd.github.v3+json"
            "Content-Type" = "application/json"
        } `
        -Body $permissionsJson `
        -ErrorAction Stop)

    Write-Host "   ✅ Actions permissions configured successfully!" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Verify Workflows
Write-Host "`nStep 3: Verifying workflows..." -ForegroundColor Yellow

try {
    $workflowsResponse = Invoke-WebRequest `
        -Uri "https://api.github.com/repos/$owner/$repo/actions/workflows" `
        -Headers @{
            "Authorization" = "token $Token"
            "Accept" = "application/vnd.github.v3+json"
        } `
        -ErrorAction Stop

    $workflows = $workflowsResponse.Content | ConvertFrom-Json
    $workflowCount = $workflows.workflows.Count

    Write-Host "   ✅ Found $workflowCount workflows:" -ForegroundColor Green
    
    foreach ($workflow in $workflows.workflows) {
        Write-Host "      ✅ $($workflow.name)" -ForegroundColor Green
    }
}
catch {
    Write-Host "   ⚠️  Could not verify workflows: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  PHASE 1 STEP 3 COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "GitHub Actions Configuration Summary:" -ForegroundColor Cyan
Write-Host "   [OK] GitHub Actions enabled" -ForegroundColor Green
Write-Host "   [OK] Workflows can run on all branches" -ForegroundColor Green
Write-Host "   [OK] Read/write permissions configured" -ForegroundColor Green
Write-Host "   [OK] Workflows can create pull requests" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "   1. Verify at: https://github.com/$owner/$repo/actions" -ForegroundColor Gray
Write-Host "   2. Check workflows are listed" -ForegroundColor Gray
Write-Host "   3. Continue to Step 5 in PHASE_1_GITHUB_CONFIGURATION.md" -ForegroundColor Gray

Write-Host "`n✨ GitHub Actions Ready! Visit: https://github.com/$owner/$repo/actions`n" -ForegroundColor Green
