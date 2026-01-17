# MySQL Installation Guide for Windows

## Option A: MySQL Installer (Recommended - Easiest)

1. **Download MySQL**
   - Go to: https://dev.mysql.com/downloads/mysql/
   - Download "MySQL Community Server" (latest version, Windows installer)

2. **Install MySQL**
   - Run the installer (.msi file)
   - Choose "Developer Default" setup type
   - Click "Next" through the setup
   - When asked for config type, choose "Development Machine"
   - Port: Keep as 3306 (default)
   - MySQL Server Instance Configuration:
     - Config Type: Development Machine
     - TCP Port: 3306
     - Windows Service: Yes (with default name)
   - Account and Roles:
     - MySQL Root Password: Set a password (e.g., `root123`)
     - Add MySQL User: Optional (skip for now)
   - Complete the installation

3. **Verify Installation**
   - Open PowerShell as Administrator
   - Run: `mysql --version`
   - Should show: `mysql Ver ... for Windows`

4. **Test Connection**
   ```powershell
   mysql -u root -p
   # Enter password when prompted
   # Should show: mysql>
   # Type: exit
   ```

---

## Option B: MySQL via Chocolatey (if you have it installed)

```powershell
choco install mysql-server
```

---

## Option C: MySQL via Docker (Alternative)

```powershell
docker run --name mysql-dev `
  -e MYSQL_ROOT_PASSWORD=root123 `
  -p 3306:3306 `
  -d mysql:8.0
```

---

## After Installation

### Create Database for Development

```powershell
mysql -u root -p

# Then in MySQL:
CREATE DATABASE scl_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'scl_dev'@'localhost' IDENTIFIED BY 'scl_dev_password';
GRANT ALL PRIVILEGES ON scl_dev.* TO 'scl_dev'@'localhost';
FLUSH PRIVILEGES;
exit;
```

### Verify Database Created

```powershell
mysql -u scl_dev -p scl_dev
# Enter password: scl_dev_password
SHOW TABLES;
exit;
```

---

## For PHPMyAdmin Access (Optional)

If you want a web interface like phpMyAdmin:

```powershell
docker run --name phpmyadmin `
  -e PMA_HOST=host.docker.internal `
  -e PMA_USER=root `
  -e PMA_PASSWORD=root123 `
  -p 8080:80 `
  -d phpmyadmin
```

Then access at: http://localhost:8080

---

## Environment Variables for .env.dev

Once MySQL is installed locally, update your `.env.dev`:

```
# Database Configuration (Local Development)
DB_HOST=localhost
DB_PORT=3306
DB_USER=scl_dev
DB_PASSWORD=scl_dev_password
DB_NAME=scl_dev
DB_DIALECT=mysql
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Node Environment
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Troubleshooting

### MySQL Service Not Running
```powershell
# Start MySQL service
net start MySQL80
# or
services.msc  # Find MySQL80 and start it
```

### Port Already in Use
```powershell
netstat -ano | findstr :3306
# Kill the process using that port if needed
taskkill /PID <PID> /F
```

### Forgot Root Password
```powershell
# Stop MySQL
net stop MySQL80

# Start with skip-grant-tables
mysqld --skip-grant-tables

# In another window:
mysql -u root
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
exit;

# Restart MySQL normally
net start MySQL80
```

---

**Once installed, reply and we'll:**
1. ✅ Create local database
2. ✅ Update .env files
3. ✅ Remove Phase 2 code
4. ✅ Start fresh Phase 2 implementation
