# GitHub CLI Authentication Script
# Quick setup for GitHub authentication

$ghPath = 'C:\Program Files\GitHub CLI\gh.exe'

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "GitHub CLI Authentication Setup" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Check if gh is installed
if (-not (Test-Path $ghPath)) {
    Write-Host "❌ GitHub CLI not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install using: winget install --id GitHub.cli" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI found: $ghPath" -ForegroundColor Green
Write-Host ""

# Check current auth status
Write-Host "Checking current authentication status..." -ForegroundColor Yellow
Write-Host ""

& $ghPath auth status

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Prompt to authenticate if needed
$authChoice = Read-Host "Do you want to authenticate with GitHub? (y/n)"
if ($authChoice -eq 'y') {
    Write-Host ""
    Write-Host "Starting GitHub authentication..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Choose these options when prompted:" -ForegroundColor Yellow
    Write-Host "  1. GitHub.com" -ForegroundColor Gray
    Write-Host "  2. HTTPS (recommended for Windows)" -ForegroundColor Gray
    Write-Host "  3. Paste an authentication token" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To create a token:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://github.com/settings/tokens/new" -ForegroundColor Cyan
    Write-Host "  2. Give it a name (e.g., 'SCL Development')" -ForegroundColor Gray
    Write-Host "  3. Select scopes: repo, workflow" -ForegroundColor Gray
    Write-Host "  4. Generate and copy the token" -ForegroundColor Gray
    Write-Host "  5. Paste it in the prompt below" -ForegroundColor Gray
    Write-Host ""
    
    & $ghPath auth login
    
    Write-Host ""
    Write-Host "Verifying authentication..." -ForegroundColor Yellow
    & $ghPath auth status
} else {
    Write-Host "Skipped authentication setup" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Use PR automation scripts" -ForegroundColor Yellow
Write-Host "  .\scripts\create-pr-gh.ps1" -ForegroundColor Cyan
Write-Host ""
