@echo off
REM Daily Progress Report Creator
REM Usage: create-daily-report.bat [date] [auto-commit]
REM Default: Creates report for today with auto-commit enabled

setlocal enabledelayedexpansion

REM Get today's date in YYYY-MM-DD format
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (
    set month=%%a
    set day=%%b
    set year=%%c
)
set TODAY=%year%-%month%-%day%

set PROJECT_ROOT=e:\SCL-Projects\SCL
set REPORT_DATE=%1
if "!REPORT_DATE!"=="" set REPORT_DATE=!TODAY!

echo.
echo ========================================
echo  Daily Progress Report Creator
echo ========================================
echo.
echo Date: !REPORT_DATE!
echo Project: !PROJECT_ROOT!
echo.

REM Run PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File "!PROJECT_ROOT!\create-daily-report.ps1" -Date "!REPORT_DATE!"

pause
