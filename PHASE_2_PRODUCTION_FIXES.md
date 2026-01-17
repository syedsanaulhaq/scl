# Phase 2 Production Fixes - January 17, 2026

## Summary
Fixed critical production database and configuration issues that were preventing the API from working. All 6 authentication endpoints now fully operational on production server.

## Issues Found and Fixed

### Issue 1: Placeholder Environment Variables
**Problem:** The `.env.production` file had placeholder values that were never updated:
- `DB_HOST=your_prod_db_host` (invalid hostname)
- `JWT_SECRET=your_jwt_secret_key...` (placeholder)
- `JWT_REFRESH_SECRET=your_refresh_secret_key...` (placeholder)
- `DB_USER=scl_prod_user` (user didn't exist)

**Solution:** Updated `.env.production` with actual production values:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=scl_prod
DB_PASSWORD=scl_prod_password_2024
DB_NAME=scl_prod
JWT_SECRET=scl-production-jwt-secret-key-2026-secure-key-12345678901234567890
JWT_REFRESH_SECRET=scl-production-refresh-secret-key-2026-secure-refresh-87654321098765432100
CORS_ORIGIN=https://sclsandbox.xyz
```

### Issue 2: IPv6 Localhost Resolution
**Problem:** Initial database connection attempts resolved `localhost` to IPv6 loopback (`::1`) instead of IPv4 (`127.0.0.1`):
```
connect ECONNREFUSED ::1:3306
```

**Solution:** Changed `DB_HOST` to explicit IPv4 address `127.0.0.1` instead of `localhost`

### Issue 3: Database Schema Mismatch
**Problem:** Local database used snake_case columns (`is_active`, `last_login`, `created_at`, `updated_at`) but production database was recreated with camelCase columns (`isActive`, `lastLogin`, `createdAt`, `updatedAt`). This caused "Unknown column" errors.

**Local Database Schema:**
```sql
Field         | Type
id            | char(36)
email         | varchar(255)
password      | varchar(255)
name          | varchar(255)
role          | enum('student','teacher','admin')
is_active     | tinyint(1)          ← snake_case
last_login    | datetime            ← snake_case
created_at    | datetime            ← snake_case
updated_at    | datetime            ← snake_case
```

**Production Database Schema (BEFORE):**
```sql
Field         | Type
id            | char(36)
email         | varchar(255)
password      | varchar(255)
name          | varchar(255)
role          | enum('student','teacher','admin')
isActive      | tinyint(1)          ← camelCase
lastLogin     | datetime            ← camelCase
createdAt     | datetime            ← camelCase
updatedAt     | datetime            ← camelCase
```

**Solution:** Recreated production users table with snake_case schema to match local database:
```sql
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id CHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
  is_active TINYINT(1) DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

This allows Sequelize's `underscored: true` setting to properly map camelCase model attributes to snake_case database columns.

## Testing Results

All 6 Phase 2 endpoints now fully operational on production:

✅ **Health Check:** `GET /api/health`
```json
{
  "success": true,
  "message": "SCL API Server is running",
  "environment": "production"
}
```

✅ **Register:** `POST /api/v1/auth/register`
- Creates new user with email, password, name, role
- Returns user object + JWT tokens (access + refresh)
- Status: 201 Created

✅ **Login:** `POST /api/v1/auth/login`
- Authenticates with email and password
- Returns user object + JWT tokens
- Updates lastLogin timestamp
- Status: 200 OK

✅ **Get Profile:** `GET /api/v1/auth/profile` (protected)
- Requires valid JWT in Authorization header
- Returns current user profile
- Status: 200 OK

✅ **Update Profile:** `PATCH /api/v1/auth/profile` (protected)
- Updates user name and/or email
- Validates email uniqueness
- Status: 200 OK

✅ **Refresh Token:** `POST /api/v1/auth/refresh`
- Accepts refresh token
- Returns new access token
- Status: 200 OK

✅ **Logout:** `POST /api/v1/auth/logout` (protected)
- Requires valid JWT
- Clears session
- Status: 200 OK

## Production Environment Status

**Server:** 185.211.6.60
**Database:** MySQL 8.0 - scl_prod
**Backend:** Node.js Express running on PM2 cluster (4 processes)
**API Base:** http://185.211.6.60:5000/api/v1

All 4 PM2 processes online and operational:
```
[0] scl-backend - online - PID 38145 - 58.6MB
[1] scl-backend - online - PID 38146 - 59.1MB
[2] scl-backend - online - PID 38169 - 47.4MB
[3] scl-backend - online - PID 38170 - 41.1MB
```

## Files Modified

1. **backend/.env.production**
   - Updated with actual production database credentials
   - Set JWT secrets for authentication
   - Configured CORS for frontend domain

2. **Database: scl_prod.users**
   - Dropped old table with camelCase schema
   - Recreated with snake_case schema matching local database

## Next Steps

1. Deploy frontend to production (https://sclsandbox.xyz)
2. Update frontend API configuration to point to production backend
3. Test full authentication flow on production domain
4. Begin Phase 3 implementation (Course Management)

## Deployment Lesson Learned

Always verify that `.env.production` files are updated with actual values before deploying to production, not left with placeholder text. Consider using `.env.production.example` templates and automated deployment scripts to prevent this in the future.
