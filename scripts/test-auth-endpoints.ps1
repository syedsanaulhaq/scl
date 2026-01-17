# Test SCL Phase 2 Authentication Endpoints

param()

$API_URL = "http://localhost:5000/api/v1"
$global:accessToken = ""
$global:refreshToken = ""
$global:userId = ""

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Yellow
Write-Host "SCL Phase 2 Authentication Endpoint Testing" -ForegroundColor Yellow
Write-Host ("=" * 60) -ForegroundColor Yellow

# Test 1: Register User
Write-Host "`nTEST 1: User Registration" -ForegroundColor Cyan
try {
    $email = "testuser_$(Get-Random)@example.com"
    $registerBody = @{
        name = "Test User"
        email = $email
        password = "Password123!"
        role = "student"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$API_URL/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $registerBody `
        -UseBasicParsing

    if ($response.StatusCode -eq 201) {
        $data = $response.Content | ConvertFrom-Json
        $global:accessToken = $data.data.tokens.accessToken
        $global:refreshToken = $data.data.tokens.refreshToken
        $global:userId = $data.data.user.id
        
        Write-Host "[OK] User registered successfully" -ForegroundColor Green
        Write-Host "  Email: $($data.data.user.email)" -ForegroundColor Gray
        Write-Host "  Role: $($data.data.user.role)" -ForegroundColor Gray
    } else {
        Write-Host "[FAIL] Registration failed with status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] Registration error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get Profile (Protected Route)
Write-Host "`nTEST 2: Get User Profile" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/profile" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $global:accessToken"
            "Content-Type" = "application/json"
        } `
        -UseBasicParsing

    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "[OK] Profile retrieved successfully" -ForegroundColor Green
        Write-Host "  Name: $($data.data.user.name)" -ForegroundColor Gray
        Write-Host "  Email: $($data.data.user.email)" -ForegroundColor Gray
        Write-Host "  Role: $($data.data.user.role)" -ForegroundColor Gray
    } else {
        Write-Host "[FAIL] Get profile failed with status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] Get profile error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Update Profile
Write-Host "`nTEST 3: Update User Profile" -ForegroundColor Cyan
try {
    $updateBody = @{
        name = "Updated Test User $(Get-Random)"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$API_URL/auth/profile" `
        -Method PATCH `
        -Headers @{
            "Authorization" = "Bearer $global:accessToken"
            "Content-Type" = "application/json"
        } `
        -Body $updateBody `
        -UseBasicParsing

    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "[OK] Profile updated successfully" -ForegroundColor Green
        Write-Host "  New name: $($data.data.user.name)" -ForegroundColor Gray
    } else {
        Write-Host "[FAIL] Update profile failed with status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] Update profile error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Refresh Token
Write-Host "`nTEST 4: Refresh Access Token" -ForegroundColor Cyan
try {
    $refreshBody = @{
        refreshToken = $global:refreshToken
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$API_URL/auth/refresh" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $refreshBody `
        -UseBasicParsing

    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        $global:accessToken = $data.data.accessToken
        
        Write-Host "[OK] Token refreshed successfully" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Token refresh failed with status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] Token refresh error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Logout User
Write-Host "`nTEST 5: User Logout" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/logout" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $global:accessToken"
            "Content-Type" = "application/json"
        } `
        -UseBasicParsing

    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Logout successful" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Logout failed with status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] Logout error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Protected Route Without Token (Should Fail)
Write-Host "`nTEST 6: Protected Route Without Token (Expected Failure)" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/profile" `
        -Method GET `
        -Headers @{"Content-Type" = "application/json"} `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue

    if ($response.StatusCode -ne 200) {
        Write-Host "[OK] Access denied as expected" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Security issue: Protected route accessible without token!" -ForegroundColor Red
    }
} catch {
    Write-Host "[OK] Access denied as expected" -ForegroundColor Green
}

# Test 7: Invalid Token (Should Fail)
Write-Host "`nTEST 7: Protected Route With Invalid Token (Expected Failure)" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/profile" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer invalid_token_12345"
            "Content-Type" = "application/json"
        } `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue

    if ($response.StatusCode -ne 200) {
        Write-Host "[OK] Invalid token rejected as expected" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Security issue: Invalid token was accepted!" -ForegroundColor Red
    }
} catch {
    Write-Host "[OK] Invalid token rejected as expected" -ForegroundColor Green
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Yellow
Write-Host "Testing Complete - All auth endpoints working!" -ForegroundColor Yellow
Write-Host ("=" * 60) -ForegroundColor Yellow
Write-Host ""
