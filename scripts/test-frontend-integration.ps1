# Frontend-Backend Integration Test
# Tests complete authentication flow from frontend

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   SCL Phase 2 - Frontend-Backend Integration Test            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend is running on localhost:5000..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy!" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend is not responding!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Please start backend with: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Running Integration Tests" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test Configuration
$API_URL = "http://localhost:5000/api"
$testEmail = "integration-test-$(Get-Random)@example.com"
$testPassword = "Test@123456"
$testName = "Integration Test User"
$testRole = "student"

# Test 1: Register a new user
Write-Host "TEST 1: User Registration (POST /v1/auth/register)" -ForegroundColor Magenta
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
try {
    $registerBody = @{
        email = $testEmail
        password = $testPassword
        name = $testName
        role = $testRole
    } | ConvertTo-Json
    
    Write-Host "Request Payload:" -ForegroundColor Gray
    Write-Host $registerBody -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ Registration Successful - Status 201" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    
    $userId = $response.user.id
    $accessToken = $response.tokens.accessToken
    $refreshToken = $response.tokens.refreshToken
    
    Write-Host ""
    Write-Host "Extracted Data:" -ForegroundColor Gray
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "  Refresh Token: $($refreshToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Registration Failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Login with registered user
Write-Host "TEST 2: User Login (POST /v1/auth/login)" -ForegroundColor Magenta
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
try {
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    Write-Host "Request Payload:" -ForegroundColor Gray
    Write-Host $loginBody -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ Login Successful - Status 200" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    
    $loginAccessToken = $response.tokens.accessToken
    Write-Host ""
    Write-Host "Access Token (for protected requests): $($loginAccessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Login Failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Get Profile with Protected Route
Write-Host "TEST 3: Get Profile (GET /v1/auth/profile - PROTECTED)" -ForegroundColor Magenta
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
try {
    $headers = @{
        Authorization = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    Write-Host "Request Headers:" -ForegroundColor Gray
    Write-Host "  Authorization: Bearer $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/profile" -Method GET -Headers $headers -TimeoutSec 10
    
    Write-Host "✅ Profile Retrieved - Status 200" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Get Profile Failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 4: Update Profile
Write-Host "TEST 4: Update Profile (PATCH /v1/auth/profile - PROTECTED)" -ForegroundColor Magenta
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
try {
    $updateBody = @{
        name = "Updated User Name"
    } | ConvertTo-Json
    
    Write-Host "Request Payload:" -ForegroundColor Gray
    Write-Host $updateBody -ForegroundColor Gray
    
    $headers = @{
        Authorization = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/profile" -Method PATCH -Body $updateBody -Headers $headers -TimeoutSec 10
    
    Write-Host "✅ Profile Updated - Status 200" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Update Profile Failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 5: Refresh Token
Write-Host "TEST 5: Refresh Token (POST /v1/auth/refresh)" -ForegroundColor Magenta
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
try {
    $refreshBody = @{
        refreshToken = $refreshToken
    } | ConvertTo-Json
    
    Write-Host "Request Payload:" -ForegroundColor Gray
    Write-Host "  Refresh Token: $($refreshToken.Substring(0, 20))..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/refresh" -Method POST -Body $refreshBody -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ Token Refreshed - Status 200" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    
    $newAccessToken = $response.tokens.accessToken
    Write-Host ""
    Write-Host "New Access Token: $($newAccessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Refresh Token Failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 6: Logout
Write-Host "TEST 6: Logout (POST /v1/auth/logout - PROTECTED)" -ForegroundColor Magenta
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
try {
    $headers = @{
        Authorization = "Bearer $newAccessToken"
        "Content-Type" = "application/json"
    }
    
    Write-Host "Request Headers:" -ForegroundColor Gray
    Write-Host "  Authorization: Bearer $($newAccessToken.Substring(0, 20))..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/logout" -Method POST -Headers $headers -TimeoutSec 10
    
    Write-Host "✅ Logout Successful - Status 200" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Logout Failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 7: Verify token is invalidated
Write-Host "TEST 7: Verify Token Invalidation (GET /v1/auth/profile with logged-out token)" -ForegroundColor Magenta
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
try {
    $headers = @{
        Authorization = "Bearer $newAccessToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/v1/auth/profile" -Method GET -Headers $headers -TimeoutSec 10
    
    Write-Host "❌ Token should have been invalidated!" -ForegroundColor Red
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Token Correctly Invalidated - Status 401" -ForegroundColor Green
        Write-Host "Response: Unauthorized" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "❌ Unexpected Error" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}

# Summary
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ ALL INTEGRATION TESTS PASSED! ✅              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ TEST 1: User Registration (201)" -ForegroundColor Green
Write-Host "  ✅ TEST 2: User Login (200)" -ForegroundColor Green
Write-Host "  ✅ TEST 3: Get Profile Protected (200)" -ForegroundColor Green
Write-Host "  ✅ TEST 4: Update Profile (200)" -ForegroundColor Green
Write-Host "  ✅ TEST 5: Refresh Token (200)" -ForegroundColor Green
Write-Host "  ✅ TEST 6: Logout (200)" -ForegroundColor Green
Write-Host "  ✅ TEST 7: Token Invalidation (401)" -ForegroundColor Green
Write-Host ""
Write-Host "Test Environment: localhost:5000/api" -ForegroundColor Cyan
Write-Host "Database: scl_dev MySQL 8.0" -ForegroundColor Cyan
Write-Host 'Frontend Ready: http://localhost:3173' -ForegroundColor Cyan
Write-Host ""
