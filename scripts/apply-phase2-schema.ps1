# Quick Production Database Update
# Directly applies Phase 2 users schema to production

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Apply Phase 2 Schema to Production Database" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Read schema file
$schemaFile = "database/phase-2-users-schema.sql"
if (-not (Test-Path $schemaFile)) {
    Write-Host "❌ Schema file not found: $schemaFile" -ForegroundColor Red
    exit 1
}

$schema = Get-Content $schemaFile -Raw

Write-Host "📋 Schema to apply:" -ForegroundColor Yellow
Write-Host ""
Write-Host $schema -ForegroundColor Gray
Write-Host ""

# Confirm
$confirm = Read-Host "Apply to production database scl_prod? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Connecting to production server (185.211.6.60)..." -ForegroundColor Yellow

# Create temp file on server and execute
$tempFile = "/tmp/phase2.sql"

ssh -o StrictHostKeyChecking=no root@185.211.6.60 @"
cat > $tempFile << 'SQLEOF'
$schema
SQLEOF

echo "Executing SQL..."
mysql -u root -p\`grep -o 'password=.*' /var/www/scl/prod/.env | cut -d'=' -f2\` scl_prod < $tempFile

echo "Verifying..."
mysql -u root -p\`grep -o 'password=.*' /var/www/scl/prod/.env | cut -d'=' -f2\` scl_prod -e "DESCRIBE users;"

rm $tempFile
echo "Done!"
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Production database updated successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️ Check connection to production server" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Phase 2 schema ready on production!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
