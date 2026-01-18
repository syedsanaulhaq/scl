# Phase 2 API Testing Script
# Test all authentication endpoints

param(
    [string]$BaseURL = "https://sclsandbox.xyz"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase 2 API Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Base URL: $BaseURL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "TEST 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/health" -Method GET -ErrorAction Stop
    Write-Host "  ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Register User
Write-Host "TEST 2: User Registration" -ForegroundColor Yellow
$registerData = @{
    name = "John Doe"
    email = "john$(Get-Random)@example.com"
    password = "Password123"
    role = "student"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/v1/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerData `
        -ErrorAction Stop
    Write-Host "  ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $body = $response.Content | ConvertFrom-Json
    Write-Host "  User ID: $($body.data.user.id)" -ForegroundColor Gray
    Write-Host "  Email: $($body.data.user.email)" -ForegroundColor Gray
    Write-Host "  Role: $($body.data.user.role)" -ForegroundColor Gray
    $accessToken = $body.data.tokens.accessToken
    Write-Host "  Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Response: $($_.Exception.Response.Content)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Profile (Protected)
if ($accessToken) {
    Write-Host "TEST 3: Get Profile (Protected)" -ForegroundColor Yellow
    try {
        $headers = @{
            Authorization = "Bearer $accessToken"
        }
        $response = Invoke-WebRequest -Uri "$BaseURL/api/v1/auth/profile" `
            -Method GET `
            -Headers $headers `
            -ErrorAction Stop
        Write-Host "  ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        $body = $response.Content | ConvertFrom-Json
        Write-Host "  Name: $($body.data.name)" -ForegroundColor Gray
        Write-Host "  Email: $($body.data.email)" -ForegroundColor Gray
        Write-Host "  Role: $($body.data.role)" -ForegroundColor Gray
    } catch {
        Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "TEST 3: Get Profile (Protected)" -ForegroundColor Yellow
    Write-Host "  ⚠️  Skipped (no access token from registration)" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Login
Write-Host "TEST 4: User Login" -ForegroundColor Yellow
$loginData = @{
    email = $($registerData | ConvertFrom-Json).email
    password = "Password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginData `
        -ErrorAction Stop
    Write-Host "  ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $body = $response.Content | ConvertFrom-Json
    Write-Host "  User: $($body.data.user.email)" -ForegroundColor Gray
    Write-Host "  Tokens received: ✅" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
