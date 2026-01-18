[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

$ErrorActionPreference = "Continue"

$baseUrl = "http://localhost:5000"
$testEmail = "local_test_$(Get-Random)@example.com"
$testPassword = "TestPassword123"
$testName = "Local Test User"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase 2 LOCAL API Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl"
Write-Host "Test Email: $testEmail"
Write-Host ""

# TEST 1: Health Check
Write-Host "TEST 1: Health Check" -ForegroundColor Green
try {
  $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method Get -UseBasicParsing
  $json = $response.Content | ConvertFrom-Json
  Write-Host "✅ Status: $($response.StatusCode)"
  Write-Host "Message: $($json.message)"
} catch {
  Write-Host "❌ Failed: $($_.Exception.Message)"
}

Write-Host ""

# TEST 2: User Registration
Write-Host "TEST 2: User Registration" -ForegroundColor Green
try {
  $body = @{
    name = $testName
    email = $testEmail
    password = $testPassword
    role = "student"
  } | ConvertTo-Json

  Write-Host "Sending: email=$testEmail, name=$testName"
  
  $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing
  
  $json = $response.Content | ConvertFrom-Json
  Write-Host "✅ Status: $($response.StatusCode)"
  
  if ($json.data.tokens.accessToken) {
    $global:accessToken = $json.data.tokens.accessToken
    $global:refreshToken = $json.data.tokens.refreshToken
    Write-Host "✅ Access Token: $($global:accessToken.Substring(0, 30))..."
    Write-Host "✅ User Email: $($json.data.user.email)"
    Write-Host "✅ User Role: $($json.data.user.role)"
  } else {
    Write-Host "Response: $($json | ConvertTo-Json)"
  }
} catch {
  Write-Host "❌ Failed: $($_.Exception.Message)"
  if ($_.ErrorDetails.Message) {
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Error: $($errorContent.message)"
  }
}

Write-Host ""

# TEST 3: Get Profile (Protected)
Write-Host "TEST 3: Get Profile (Protected)" -ForegroundColor Green
if ($global:accessToken) {
  try {
    $headers = @{
      "Authorization" = "Bearer $($global:accessToken)"
    }
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/profile" `
      -Method Get `
      -Headers $headers `
      -UseBasicParsing
    
    $json = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "✅ Name: $($json.data.name)"
    Write-Host "✅ Email: $($json.data.email)"
    Write-Host "✅ Role: $($json.data.role)"
  } catch {
    Write-Host "❌ Failed: $($_.Exception.Message)"
  }
} else {
  Write-Host "⚠️  Skipped (no access token from registration)"
}

Write-Host ""

# TEST 4: Update Profile
Write-Host "TEST 4: Update Profile" -ForegroundColor Green
if ($global:accessToken) {
  try {
    $body = @{
      name = "Updated Local Test User"
    } | ConvertTo-Json
    
    $headers = @{
      "Authorization" = "Bearer $($global:accessToken)"
    }
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/profile" `
      -Method Patch `
      -ContentType "application/json" `
      -Headers $headers `
      -Body $body `
      -UseBasicParsing
    
    $json = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "✅ Updated Name: $($json.data.name)"
  } catch {
    Write-Host "❌ Failed: $($_.Exception.Message)"
  }
} else {
  Write-Host "⚠️  Skipped (no access token)"
}

Write-Host ""

# TEST 5: Login
Write-Host "TEST 5: User Login" -ForegroundColor Green
try {
  $body = @{
    email = $testEmail
    password = $testPassword
  } | ConvertTo-Json
  
  $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing
  
  $json = $response.Content | ConvertFrom-Json
  Write-Host "✅ Status: $($response.StatusCode)"
  Write-Host "✅ New Access Token: $($json.data.tokens.accessToken.Substring(0, 30))..."
  Write-Host "✅ Refresh Token: $($json.data.tokens.refreshToken.Substring(0, 30))..."
  $global:newAccessToken = $json.data.tokens.accessToken
} catch {
  Write-Host "❌ Failed: $($_.Exception.Message)"
}

Write-Host ""

# TEST 6: Refresh Token
Write-Host "TEST 6: Refresh Token" -ForegroundColor Green
if ($global:refreshToken) {
  try {
    $body = @{
      refreshToken = $global:refreshToken
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/refresh" `
      -Method Post `
      -ContentType "application/json" `
      -Body $body `
      -UseBasicParsing
    
    $json = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "✅ New Access Token: $($json.data.accessToken.Substring(0, 30))..."
  } catch {
    Write-Host "❌ Failed: $($_.Exception.Message)"
  }
} else {
  Write-Host "⚠️  Skipped (no refresh token)"
}

Write-Host ""

# TEST 7: Logout
Write-Host "TEST 7: Logout" -ForegroundColor Green
if ($global:newAccessToken) {
  try {
    $headers = @{
      "Authorization" = "Bearer $($global:newAccessToken)"
    }
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/auth/logout" `
      -Method Post `
      -Headers $headers `
      -UseBasicParsing
    
    $json = $response.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "✅ Message: $($json.message)"
  } catch {
    Write-Host "❌ Failed: $($_.Exception.Message)"
  }
} else {
  Write-Host "⚠️  Skipped (no access token)"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
