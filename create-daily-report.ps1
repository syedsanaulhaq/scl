#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Daily Progress Report Generator & Git Commit Tool
    
.DESCRIPTION
    Automatically creates daily progress reports, commits them to GitHub,
    and maintains a consistent progress tracking system.
    
.USAGE
    .\create-daily-report.ps1
    
.NOTES
    Location: e:\SCL-Projects\SCL\
    Runs at: End of each day
    Auto-commits: Yes
#>

param(
    [string]$Date = (Get-Date -Format "yyyy-MM-dd"),
    [string]$Developer = "Syed Sanaulhaq",
    [switch]$AutoCommit = $true,
    [switch]$AutoPush = $true
)

# Configuration
$ProjectRoot = "e:\SCL-Projects\SCL"
$ReportDir = "$ProjectRoot\progress-reports"
$ReportFile = "$ReportDir\$Date-daily.md"

# Ensure directory exists
if (-not (Test-Path $ReportDir)) {
    New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null
    Write-Host "✓ Created progress-reports directory" -ForegroundColor Green
}

# Get day of week
$DayOfWeek = (Get-Date -Date $Date).DayOfWeek.ToString()

# Create report template
$ReportContent = @"
# Daily Progress Report - $(Get-Date -Date $Date -Format "MMMM dd, yyyy")

**Date:** $(Get-Date -Date $Date -Format "MMMM dd, yyyy")  
**Day:** $DayOfWeek  
**Developer:** $Developer  
**Total Duration:** [?] hours  

---

## ✅ COMPLETED TODAY

### Feature Development
- [ ] Feature 1
  - Time: [?] hours
  - Status: ✅ Done

- [ ] Feature 2
  - Time: [?] hours
  - Status: ✅ Done

### Testing & QA
- [ ] Test coverage improvement
- [ ] Bug fixes
- [ ] Code review

### DevOps/Infrastructure
- [ ] Deployment work
- [ ] Configuration updates

### Documentation
- [ ] API documentation
- [ ] Code comments
- [ ] README updates

## 📊 METRICS

**Code Statistics:**
- **Lines of Code Added:** [?]
- **Files Changed:** [?]
- **Commits Made:** [?]
- **Tests Written:** [?]
- **Tests Passing:** [?]/[?]

**Quality Metrics:**
- **Code Coverage:** [?]%
- **Lint Errors:** [?]
- **Security Issues:** [?]

## 🔄 IN PROGRESS

- [ ] Task 1 (Est. completion: [DATE])
- [ ] Task 2 (Est. completion: [DATE])
- [ ] Task 3 (Est. completion: [DATE])

## 🚧 BLOCKERS

- [ ] Issue 1 - Impact: High - Resolution: [Plan]
- [ ] Issue 2 - Impact: Medium - Resolution: [Plan]

## 📅 TOMORROW'S PLAN

**Priority 1: [Main Task] ([X] hours)**
- [ ] Subtask 1
- [ ] Subtask 2

**Priority 2: [Task] ([X] hours)**
- [ ] Subtask 1

**Priority 3: [Task] ([X] hours)**
- [ ] Subtask 1

**Total Estimated Hours:** [X] hours

## 🔗 GIT OPERATIONS

\`\`\`bash
# Branches worked on
git checkout -b feature/[feature-name]  # Created feature branch
git commit -m "feat: [description]"     # Committed changes
git push origin feature/[feature-name]  # Pushed to GitHub

# Summary
- Commits: [?]
- Files Changed: [?]
- Merge Status: [Pending Review / Merged]
\`\`\`

## 📊 CURRENT STATUS

**Week Progress:** Day [X] of [X]  
**Completion:** [X]%

**Current Focus Area:**
- [Feature/Task name]: [Status]
- [Feature/Task name]: [Status]

## 📈 QUALITY METRICS

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| LOC Added | 100+ | [?] | [✅/❌] |
| Tests | 80%+ | [?]% | [✅/❌] |
| Coverage | 80%+ | [?]% | [✅/❌] |
| Code Review | ✅ | [Status] | [✅/❌] |

## 📝 NOTES & LEARNINGS

### Key Achievements
1. [Achievement 1]
2. [Achievement 2]

### Challenges Faced
1. [Challenge 1] - Solution: [Solution]
2. [Challenge 2] - Solution: [Solution]

### Decisions Made
- [Decision 1]: Rationale
- [Decision 2]: Rationale

### Team Updates
- [Update 1]
- [Update 2]

---

**Status:** DAY [X] [STATUS]  
**Next Update:** $(Get-Date -Date (Get-Date -Date $Date).AddDays(1) -Format "MMMM dd, yyyy") (EOD)  
**Report Created:** $(Get-Date -Format "MMMM dd, yyyy 'at' HH:mm")  

---

*For full project context, see [DAILY_PROGRESS_REPORTS.md](../DAILY_PROGRESS_REPORTS.md)*
"@

# Check if report already exists
if (Test-Path $ReportFile) {
    Write-Host "⚠ Report for $Date already exists" -ForegroundColor Yellow
    Write-Host "Opening existing report in editor..." -ForegroundColor Cyan
    & code $ReportFile
} else {
    # Create new report
    $ReportContent | Out-File -FilePath $ReportFile -Encoding UTF8
    Write-Host "✓ Created: $ReportFile" -ForegroundColor Green
    Write-Host "✓ Opening in editor..." -ForegroundColor Green
    & code $ReportFile
}

# Auto-commit if enabled
if ($AutoCommit) {
    Write-Host "`n📝 Preparing git commit..." -ForegroundColor Cyan
    
    Push-Location $ProjectRoot
    
    # Add files
    git add "$ReportFile" 2>&1 | Out-Null
    
    # Commit with timestamp
    $CommitMessage = "docs: update daily progress report for $Date"
    git commit -m $CommitMessage 2>&1 | ForEach-Object {
        if ($_ -match "create|changed") {
            Write-Host "✓ $_" -ForegroundColor Green
        } else {
            Write-Host "$_" -ForegroundColor Gray
        }
    }
    
    # Auto-push if enabled
    if ($AutoPush) {
        Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Cyan
        $CurrentBranch = git rev-parse --abbrev-ref HEAD
        git push origin $CurrentBranch 2>&1 | ForEach-Object {
            if ($_ -match "origin|main|develop") {
                Write-Host "✓ $_" -ForegroundColor Green
            }
        }
    }
    
    Pop-Location
}

Write-Host "`n✅ Daily report ready! Edit the file, save, and it will be auto-committed." -ForegroundColor Green
Write-Host "📍 Location: $ReportFile" -ForegroundColor Cyan
