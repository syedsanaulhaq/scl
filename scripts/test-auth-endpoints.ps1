# Phase 2 Authentication Testing Script (PowerShell)
# Test all authentication endpoints

$baseUrl = "http://localhost:5000/api/auth"
$testEmail = "test$(Get-Random -Maximum 10000)@example.com"
$testPassword = "SecurePass123"
$testName = "Test User $(Get-Date -Format 'yyyyMMddHHmmss')"

Write-Host "=========================================="
Write-Host "Phase 2 Authentication Endpoint Testing"
Write-Host "=========================================="
Write-Host ""

# Test 1: Register
Write-Host "TEST 1: User Registration" -ForegroundColor Yellow
$registerBody = @{
    email = $testEmail
    password = $testPassword
    name = $testName
    role = "student"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$baseUrl/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $registerBody
    
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host $registerData | ConvertTo-Json -Depth 10
    
    $accessToken = $registerData.data.tokens.accessToken
    $refreshToken = $registerData.data.tokens.refreshToken
    $userId = $registerData.data.user.id
    
    if ($accessToken) {
        Write-Host "✅ Registration successful" -ForegroundColor Green
        Write-Host "Access Token: $($accessToken.Substring(0,20))..."
    } else {
        Write-Host "❌ Registration failed - no access token" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Registration error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Login
Write-Host "TEST 2: User Login" -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody
    
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host $loginData | ConvertTo-Json -Depth 10
    Write-Host "✅ Login successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Login error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Profile
Write-Host "TEST 3: Get User Profile (Protected)" -ForegroundColor Yellow
try {
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/profile" `
        -Method GET `
        -Headers @{"Authorization"="Bearer $accessToken"}
    
    $profileData = $profileResponse.Content | ConvertFrom-Json
    Write-Host $profileData | ConvertTo-Json -Depth 10
    Write-Host "✅ Profile retrieval successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Profile retrieval error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Update Profile
Write-Host "TEST 4: Update User Profile (Protected)" -ForegroundColor Yellow
$updateBody = @{
    name = "Updated User Name"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-WebRequest -Uri "$baseUrl/profile" `
        -Method PATCH `
        -Headers @{"Authorization"="Bearer $accessToken"; "Content-Type"="application/json"} `
        -Body $updateBody
    
    $updateData = $updateResponse.Content | ConvertFrom-Json
    Write-Host $updateData | ConvertTo-Json -Depth 10
    Write-Host "✅ Profile update successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Profile update error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Refresh Token
Write-Host "TEST 5: Refresh Access Token" -ForegroundColor Yellow
$refreshBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $refreshResponse = Invoke-WebRequest -Uri "$baseUrl/refresh" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $refreshBody
    
    $refreshData = $refreshResponse.Content | ConvertFrom-Json
    Write-Host $refreshData | ConvertTo-Json -Depth 10
    
    $newAccessToken = $refreshData.data.accessToken
    if ($newAccessToken) {
        Write-Host "✅ Token refresh successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Token refresh failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Token refresh error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Logout
Write-Host "TEST 6: User Logout (Protected)" -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-WebRequest -Uri "$baseUrl/logout" `
        -Method POST `
        -Headers @{"Authorization"="Bearer $accessToken"}
    
    $logoutData = $logoutResponse.Content | ConvertFrom-Json
    Write-Host $logoutData | ConvertTo-Json -Depth 10
    Write-Host "✅ Logout successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Logout error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 7: Try accessing protected endpoint without token (should fail)
Write-Host "TEST 7: Protected Endpoint Without Token (Should Fail)" -ForegroundColor Yellow
try {
    $noTokenResponse = Invoke-WebRequest -Uri "$baseUrl/profile" `
        -Method GET
    
    Write-Host "⚠️ Unexpectedly succeeded (should have failed)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq "Unauthorized") {
        Write-Host "✅ Properly rejected request without token" -ForegroundColor Green
    } else {
        Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=========================================="
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "=========================================="
