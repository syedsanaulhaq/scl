# Docker Development Setup for SCL

## Overview
This Docker setup provides:
- **MySQL 8.0** on port 3306
- **phpMyAdmin** on port 8080 (database management UI)
- **Node.js Backend** on port 5000

## Quick Start

### 1. Verify Docker Desktop is Running
Ensure Docker Desktop is running on your Windows machine.

### 2. Build and Start Services
```powershell
cd "E:\SCL-Projects\SCL"
docker-compose up -d
```

### 3. Wait for Services to Start
It takes 30-60 seconds for all services to be ready:
- MySQL: needs to initialize
- Backend: needs to install dependencies and connect to MySQL
- phpMyAdmin: depends on MySQL being healthy

### 4. Access Services

**phpMyAdmin (Database Management):**
- URL: http://localhost:8080
- Username: `root`
- Password: `root`

**Backend API:**
- URL: http://localhost:5000
- Health Check: http://localhost:5000/api/health

**MySQL Direct:**
- Host: `localhost`
- Port: `3306`
- Root User: `root`
- Root Password: `root`
- App User: `scl_dev`
- App Password: `scl_dev_password`
- Database: `scl_dev`

## Useful Docker Commands

### View Running Containers
```powershell
docker-compose ps
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f mysql
docker-compose logs -f phpmyadmin
```

### Stop Services
```powershell
docker-compose down
```

### Stop and Remove Volumes (Reset Database)
```powershell
docker-compose down -v
```

### Restart a Service
```powershell
docker-compose restart backend
docker-compose restart mysql
```

### Access MySQL in Container
```powershell
docker exec -it scl-mysql-dev mysql -u root -p
# Enter password: root
```

### Access Backend Container Shell
```powershell
docker exec -it scl-backend-dev sh
```

## Environment Variables

**Docker Compose sets these automatically:**
- `DB_HOST=mysql` (Docker container name)
- `DB_USER=scl_dev`
- `DB_PASSWORD=scl_dev_password`
- `DB_NAME=scl_dev`

**Local Development (Non-Docker):**
Update `.env.dev` for local MySQL if needed

## Troubleshooting

### Port Already in Use
If port 3306, 5000, or 8080 is already in use:
```powershell
# Check what's using port 3306
netstat -ano | findstr :3306

# Kill process
taskkill /PID <process_id> /F
```

### MySQL Not Starting
```powershell
# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Backend Not Connecting to Database
```powershell
# Check backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend
```

### Reset Everything
```powershell
# Remove containers and volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

## Development Workflow

1. **Edit Code** - Modify files in `backend/src/`
2. **Backend Auto-Reloads** - nodemon watches files and restarts automatically
3. **View Logs** - Run `docker-compose logs -f backend`
4. **Test API** - Use http://localhost:5000/api/endpoints
5. **Manage DB** - Use phpMyAdmin at http://localhost:8080

## Database Management with phpMyAdmin

1. Open http://localhost:8080
2. Login:
   - Server: `mysql`
   - Username: `root`
   - Password: `root`
3. Select `scl_dev` database
4. Manage tables, run SQL, view data, etc.

## File Structure

```
SCL/
├── docker-compose.yml       # Docker services configuration
├── .env.docker              # Docker environment variables
├── database/
│   └── init.sql            # Initial database schema
├── backend/
│   ├── Dockerfile          # Backend container image
│   ├── src/
│   │   ├── server.js       # Express server
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   └── ...
│   ├── package.json
│   └── .env.dev           # Development env vars
└── ...
```

## Next Steps

1. ✅ Start Docker: `docker-compose up -d`
2. ✅ Verify services running: `docker-compose ps`
3. ✅ Access phpMyAdmin: http://localhost:8080
4. ✅ Check backend logs: `docker-compose logs -f backend`
5. ✅ Test health endpoint: http://localhost:5000/api/health

## Network Communication

Services communicate within Docker network `scl-network`:
- Backend → MySQL: Uses hostname `mysql` (not localhost)
- Backend uses .env.dev with `DB_HOST=mysql`
- phpMyAdmin → MySQL: Uses hostname `mysql`

**Outside Docker (Your Computer):**
- MySQL: `localhost:3306`
- Backend: `localhost:5000`
- phpMyAdmin: `localhost:8080`

## Performance Notes

- First start takes longer (MySQL initialization, npm install)
- Subsequent starts are faster (volumes persist data)
- Database data persists in `mysql-data` volume
- Use `docker-compose down -v` to reset everything

---

**Status:** Ready to start! Run `docker-compose up -d` in the project root directory.
