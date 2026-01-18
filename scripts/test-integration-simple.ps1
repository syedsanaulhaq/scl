# Frontend-Backend Integration Test

Write-Host "====== SCL Phase 2 - Integration Test ======" -ForegroundColor Cyan
Write-Host ""

# Check backend
Write-Host "Checking backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend is healthy!" -ForegroundColor Green
} catch {
    Write-Host "Backend not responding!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Testing endpoints..." -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:5000/api"
$testEmail = "test-$(Get-Random)@example.com"
$testPassword = "Test@123456"
$testName = "Test User"

# Test 1: Register
Write-Host "1. Testing Registration..." -ForegroundColor Magenta
try {
    $body = @{
        email = $testEmail
        password = $testPassword
        name = $testName
        role = "student"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/register" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "PASS: Registration successful" -ForegroundColor Green
    $accessToken = $response.data.tokens.accessToken
    $refreshToken = $response.data.tokens.refreshToken
    Write-Host "Token retrieved successfully" -ForegroundColor Gray
} catch {
    Write-Host "FAIL: Registration failed - $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Login
Write-Host "2. Testing Login..." -ForegroundColor Magenta
try {
    $body = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "PASS: Login successful" -ForegroundColor Green
    $loginToken = $response.data.tokens.accessToken
} catch {
    Write-Host "FAIL: Login failed - $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Get Profile
Write-Host "3. Testing Protected Route (Get Profile)..." -ForegroundColor Magenta
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest -Uri "$API_URL/v1/auth/profile" -Method GET -Headers $headers -UseBasicParsing -TimeoutSec 10
    $body = $response.Content | ConvertFrom-Json
    Write-Host "PASS: Profile retrieved" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Get profile failed - $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 4: Update Profile
Write-Host "4. Testing Update Profile..." -ForegroundColor Magenta
try {
    $body = @{ name = "Updated Name" } | ConvertTo-Json
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest -Uri "$API_URL/v1/auth/profile" -Method PATCH -Body $body -Headers $headers -UseBasicParsing -TimeoutSec 10
    Write-Host "PASS: Profile updated" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Update profile failed - $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 5: Refresh Token
Write-Host "5. Testing Token Refresh..." -ForegroundColor Magenta
try {
    $body = @{ refreshToken = $refreshToken } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/refresh" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "PASS: Token refreshed" -ForegroundColor Green
    $newToken = $response.data.accessToken
} catch {
    Write-Host "FAIL: Refresh failed - $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 6: Logout
Write-Host "6. Testing Logout..." -ForegroundColor Magenta
try {
    $headers = @{
        "Authorization" = "Bearer $newToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest -Uri "$API_URL/v1/auth/logout" -Method POST -Headers $headers -UseBasicParsing -TimeoutSec 10
    Write-Host "PASS: Logout successful" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Logout failed - $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 7: Verify token still works after logout (JWT is stateless)
Write-Host "7. Testing Token Still Valid After Logout..." -ForegroundColor Magenta
try {
    $headers = @{
        "Authorization" = "Bearer $newToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-WebRequest -Uri "$API_URL/v1/auth/profile" -Method GET -Headers $headers -UseBasicParsing -TimeoutSec 10
    Write-Host "PASS: Token still valid (JWT is stateless)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Token should still work - $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ALL TESTS PASSED! Phase 2 is working!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
