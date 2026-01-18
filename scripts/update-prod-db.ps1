# Production Database Update Script
# Updates scl_prod database with Phase 2 schema (users table)

param(
    [string]$ServerIP = "185.211.6.60",
    [string]$SSHUser = "root"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Production Database Update - Phase 2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Target Server: $ServerIP" -ForegroundColor Yellow
Write-Host "Database: scl_prod" -ForegroundColor Yellow
Write-Host ""

# Check if schema file exists
$schemaFile = "database/phase-2-users-schema.sql"
if (-not (Test-Path $schemaFile)) {
    Write-Host "❌ Schema file not found: $schemaFile" -ForegroundColor Red
    exit 1
}

Write-Host "Schema file: $schemaFile" -ForegroundColor Green
Write-Host ""

# Read the SQL file
$sqlContent = Get-Content $schemaFile -Raw
Write-Host "SQL content:" -ForegroundColor Yellow
Write-Host $sqlContent -ForegroundColor Gray
Write-Host ""

# Confirm before executing
$confirm = Read-Host "Apply this schema to production database? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Connecting to production server: $ServerIP" -ForegroundColor Yellow

# Create temporary SQL file
$tempSqlFile = "$env:TEMP\phase2-schema.sql"
$sqlContent | Out-File -FilePath $tempSqlFile -Encoding UTF8

Write-Host "Uploading schema file to server..." -ForegroundColor Yellow

# Copy file to server
scp -o StrictHostKeyChecking=no "$tempSqlFile" "${SSHUser}@${ServerIP}:/tmp/phase2-schema.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to upload file" -ForegroundColor Red
    Remove-Item $tempSqlFile -Force
    exit 1
}

Write-Host "✅ File uploaded" -ForegroundColor Green
Write-Host ""

Write-Host "Executing SQL on production database..." -ForegroundColor Yellow

# Execute SQL on server
ssh -o StrictHostKeyChecking=no "${SSHUser}@${ServerIP}" "
    mysql -u root -p\$DB_ROOT_PASSWORD scl_prod < /tmp/phase2-schema.sql
    rm /tmp/phase2-schema.sql
"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Users table created/verified on production" -ForegroundColor Green
} else {
    Write-Host "❌ Database update failed" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $tempSqlFile -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Production database is ready for Phase 2!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
