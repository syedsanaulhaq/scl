# Phase 2 Quick Reference Card

## ✅ Status: COMPLETE - All Tests Passing

### Running Services
```
Docker Containers:
✅ MySQL 8.0         → localhost:3306 (scl_dev database)
✅ phpMyAdmin        → http://localhost:8080 (root/root)
✅ Node.js Backend   → http://localhost:5000/api/v1/
```

### API Endpoints

#### Public Endpoints
```
POST /api/v1/auth/register
  {name, email, password, role?}
  Returns: {user, accessToken, refreshToken}

POST /api/v1/auth/login
  {email, password}
  Returns: {user, accessToken, refreshToken}

POST /api/v1/auth/refresh
  {refreshToken}
  Returns: {accessToken}
```

#### Protected Endpoints (Bearer token required)
```
GET /api/v1/auth/profile
  Headers: Authorization: Bearer <token>
  Returns: {user}

PATCH /api/v1/auth/profile
  Headers: Authorization: Bearer <token>
  Body: {name?}
  Returns: {user}

POST /api/v1/auth/logout
  Headers: Authorization: Bearer <token>
  Returns: {success}
```

### Test Script
```powershell
cd E:\SCL-Projects\SCL
.\scripts\test-auth-endpoints.ps1
```

Results: All 7 tests pass ✅
- User registration
- Profile retrieval
- Profile update
- Token refresh
- Logout
- Security checks (unauthorized access)

### Docker Commands

```powershell
# Start services
docker-compose up -d

# View containers
docker-compose ps

# View backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Stop all services
docker-compose down

# Reset database (WARNING: deletes data)
docker-compose down -v && docker-compose up -d
```

### Database Access

**MySQL Command Line:**
```powershell
docker exec -it scl-mysql-dev mysql -u root -p
Password: root
```

**phpMyAdmin Web:**
```
URL: http://localhost:8080
Username: root
Password: root
```

### Key Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Services configuration |
| `backend/Dockerfile` | Backend image definition |
| `backend/src/models/User.js` | User database model |
| `backend/src/controllers/authController.js` | Auth business logic |
| `backend/src/middleware/authMiddleware.js` | JWT verification |
| `backend/src/routes/authRoutes.js` | Auth endpoints |
| `.env.dev` | Development environment variables |
| `database/init.sql` | Database schema |
| `scripts/test-auth-endpoints.ps1` | Endpoint tests |

### Test Data

Use any email/password for testing:
```
Email: any@example.com
Password: Password123! (min 6 chars)
Name: Test User
Role: student (default) | teacher | admin
```

### Troubleshooting

**Backend won't start:**
```powershell
docker-compose logs backend  # Check logs
docker-compose restart backend
```

**Can't connect to MySQL:**
```powershell
docker exec scl-mysql-dev mysql -u root -p
# If fails, MySQL may not be ready. Wait 30 seconds and try again.
```

**Port already in use:**
```powershell
# Check what's using port 5000
netstat -ano | findstr :5000
# Kill process: taskkill /PID <PID> /F
```

**Reset everything:**
```powershell
cd E:\SCL-Projects\SCL
docker-compose down -v
docker-compose up -d
Start-Sleep -Seconds 30  # Wait for MySQL to initialize
.\scripts\test-auth-endpoints.ps1
```

### Git Status

**Current Branch:** `feature/phase-2-user-auth`

**Recent Commits:**
- `9545197` - docs: add phase 2 implementation complete summary
- `178dde5` - phase-2: implement user authentication with docker development environment

**Ready to:**
1. Create Pull Request to `develop`
2. Request 1 approval
3. Merge when approved
4. Then PR to `main` (requires 2 approvals)

### Environment Variables

**.env.dev (Backend):**
```
DB_HOST=mysql
DB_PORT=3306
DB_USER=scl_dev
DB_PASSWORD=scl_dev_password
DB_NAME=scl_dev
JWT_SECRET=dev-secret-key-12345-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-12345-change-in-production
```

**.env.docker (Docker Compose):**
```
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=scl_dev
MYSQL_USER=scl_dev
MYSQL_PASSWORD=scl_dev_password
```

### Production Comparison

| Aspect | Development | Production |
|--------|-------------|-----------|
| **MySQL** | Docker (localhost:3306) | VPS (185.211.6.60:3306) |
| **Backend** | http://localhost:5000 | https://sclsandbox.xyz |
| **Environment** | .env.dev with Docker | .env.production |
| **Management** | Docker Compose | PM2 (4 processes) |
| **Database** | scl_dev | scl_prod |
| **SSL** | None | Let's Encrypt |

### Performance

- Backend startup: ~5 seconds
- First MySQL init: ~30 seconds
- Subsequent starts: ~5 seconds
- Database pool: 10 max, 2 min
- JWT verification: <1ms
- User registration: <200ms (password hashing)

---

**Everything is working and tested!** Ready for code review and merging. 🚀
