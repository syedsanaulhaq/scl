# SCL Project - Phase 2 Complete Documentation

**Date:** January 17, 2026  
**Status:** Phase 2 User Authentication - Implementation Complete (Testing Phase)

---

## 1. ARCHITECTURE OVERVIEW

### Technology Stack
```
Frontend:
- React 18 + Vite
- Tailwind CSS
- Axios for API calls
- Zustand for state management

Backend:
- Node.js 18 LTS
- Express.js
- Sequelize 6.35.2 (ORM)
- MySQL 8.0
- JWT (jsonwebtoken 9.0.3)
- bcryptjs 2.4.3 (password hashing)
- Joi (validation)
- express-rate-limit
- helmet (security headers)

Production Deployment:
- PM2 (4 cluster processes)
- Nginx (reverse proxy with SSL/TLS)
- Docker Compose (local development)
- GitHub (version control)
- GitHub Actions (CI/CD)
```

### Database Schema
```sql
CREATE TABLE users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student','teacher','admin') NOT NULL DEFAULT 'student',
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 2. PHASE 2 API ENDPOINTS

### Authentication Endpoints

#### 1. Register User
```
POST /api/v1/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "TestPassword123",
  "name": "John Doe",
  "role": "student"  // optional, defaults to "student"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "student",
      "isActive": true,
      "lastLogin": null,
      "createdAt": "2026-01-17T12:00:00Z",
      "updatedAt": "2026-01-17T12:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

#### 2. Login User
```
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "TestPassword123"
}

Response (200):
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "student",
      "isActive": true
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

#### 3. Get User Profile
```
GET /api/v1/auth/profile
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "isActive": true,
    "lastLogin": "2026-01-17T11:30:00Z"
  }
}
```

#### 4. Update User Profile
```
PATCH /api/v1/auth/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

Request Body:
{
  "name": "Updated Name"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Updated Name",
    "role": "student"
  }
}
```

#### 5. Refresh Access Token
```
POST /api/v1/auth/refresh
Content-Type: application/json

Request Body:
{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

#### 6. Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "message": "User logged out successfully"
}
```

#### 7. Health Check
```
GET /api/health

Response (200):
{
  "success": true,
  "message": "SCL API Server is running",
  "timestamp": "2026-01-17T12:00:00Z",
  "environment": "production"
}
```

---

## 3. BACKEND CODE STRUCTURE

### File: `backend/src/models/User.js` (133 lines)
```javascript
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export default function (sequelize) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        index: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { len: [6, 255] },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { len: [2, 255] },
      },
      role: {
        type: DataTypes.ENUM('student', 'teacher', 'admin'),
        defaultValue: 'student',
        index: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'isActive', // Map to camelCase column
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'lastLogin',
      },
    },
    {
      timestamps: true,
      tableName: 'users',
      underscored: false, // Important: Don't convert to snake_case
      indexes: [
        { fields: ['email'], unique: true },
        { fields: ['role'] },
      ],
    }
  );

  // Password hashing before save
  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Instance Methods
  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  User.prototype.updateLastLogin = async function () {
    this.lastLogin = new Date();
    return this.save();
  };

  // Static Methods
  User.findByEmail = async function (email) {
    return User.findOne({ where: { email: email.toLowerCase() } });
  };

  return User;
}
```

### File: `backend/src/controllers/authController.js` (272 lines)
Key functions:
- `register(req, res, next)` - Create new user
- `login(req, res, next)` - Authenticate and return tokens
- `refreshToken(req, res, next)` - Issue new access token
- `getProfile(req, res, next)` - Get current user profile
- `updateProfile(req, res, next)` - Update user name
- `logout(req, res, next)` - Logout (optional)

Helper functions:
- `generateAccessToken(user)` - Returns JWT valid for 15 minutes
- `generateRefreshToken(user)` - Returns JWT valid for 7 days

### File: `backend/src/middleware/authMiddleware.js` (83 lines)
```javascript
// verifyToken() - Validates Bearer token and JWT signature
// Returns: req.user = decoded token data

// verifyRole(...roles) - Role-based access control factory
// Returns: middleware that checks if user.role is in allowed roles

// optionalToken() - Soft validation, doesn't fail if no token
```

### File: `backend/src/routes/authRoutes.js` (83 lines)
```javascript
router.post('/register', validate(validationSchemas.register), register);
router.post('/login', validate(validationSchemas.login), login);
router.post('/refresh', validate(validationSchemas.refreshToken), refreshToken);

router.get('/profile', verifyToken(), getProfile);
router.patch('/profile', verifyToken(), validate(validationSchemas.updateProfile), updateProfile);
router.post('/logout', verifyToken(), logout);
```

### File: `backend/src/config/database.js`
```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,  // Global setting - careful with column names!
    },
    pool: { max: 10, min: 2 },
  }
);
```

### File: `backend/src/middleware/validation.js`
Joi schemas for request validation:
- `register` - name, email, password, role
- `login` - email, password
- `updateProfile` - name (optional)
- `refreshToken` - refreshToken (required)
- `pagination` - page, limit, search, sort (optional)

### File: `backend/src/server.js` - KEY CONFIGURATION
```javascript
// IMPORTANT: Trust proxy for Nginx reverse proxy
app.set('trust proxy', 1);

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
});
app.use('/api/', limiter);

// CORS configured for frontend URL
app.use(corsMiddleware);

// Security headers with Helmet
app.use(helmet());
```

---

## 4. ENVIRONMENT VARIABLES

### `.env.dev` (Local Development)
```
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=scl_dev
DB_DIALECT=mysql
DB_POOL_MIN=1
DB_POOL_MAX=5

JWT_SECRET=dev_jwt_secret_change_in_production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=dev_refresh_secret_change_in_production
REFRESH_TOKEN_EXPIRES_IN=7d

API_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:5173

RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### `.env.production` (Production Server)
```
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=scl_prod
DB_PASSWORD=scl_prod_password_2024
DB_NAME=scl_prod
DB_DIALECT=mysql
DB_POOL_MIN=2
DB_POOL_MAX=10

JWT_SECRET=scl_jwt_secret_prod_2024_min_32chars_key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=YOUR_LONG_RANDOM_REFRESH_SECRET_HERE
REFRESH_TOKEN_EXPIRES_IN=7d

API_URL=https://sclsandbox.xyz
CORS_ORIGIN=https://sclsandbox.xyz

RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

LOG_FILE=/var/log/scl/app.log
ERROR_LOG_FILE=/var/log/scl/error.log
```

---

## 5. FRONTEND INTEGRATION

### File: `frontend/src/services/authService.js`
```javascript
export async function register(email, password, name, role = 'student') {
  const response = await apiClient.post('/v1/auth/register', {
    email, password, name, role
  });
  return response.data.data;
}

export async function login(email, password) {
  const response = await apiClient.post('/v1/auth/login', { email, password });
  return response.data.data;
}

export async function getProfile() {
  const response = await apiClient.get('/v1/auth/profile');
  return response.data.data;
}

export async function updateProfile(name) {
  const response = await apiClient.patch('/v1/auth/profile', { name });
  return response.data.data;
}

export async function refreshToken(token) {
  const response = await apiClient.post('/v1/auth/refresh', {
    refreshToken: token
  });
  return response.data.data;
}

export async function logout() {
  await apiClient.post('/v1/auth/logout');
}
```

### File: `frontend/src/store/authStore.js`
Zustand store with:
- `user` - current logged-in user
- `tokens` - accessToken & refreshToken
- `isAuthenticated` - boolean flag
- Actions: `setAuth()`, `clearAuth()`, `updateUser()`

### File: `frontend/src/components/ProtectedRoute.jsx`
Wrapper component that:
- Checks if user is authenticated
- Redirects to login if not
- Automatically refreshes access token before expiry

---

## 6. DATABASE SETUP SCRIPT

### SQL: `database/phase-2-users-schema.sql`
```sql
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE KEY,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student','teacher','admin') NOT NULL DEFAULT 'student',
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  lastLogin DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_email (email),
  KEY idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 7. DOCKER SETUP (Local Development)

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: scl_dev
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

  phpmyadmin:
    image: phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_USER: root
      PMA_PASSWORD: root
    ports:
      - "8080:80"
    depends_on:
      - mysql

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: development
      DB_HOST: mysql
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - mysql

volumes:
  mysql_data:
```

### `backend/Dockerfile`
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

---

## 8. PRODUCTION DEPLOYMENT

### Server Details
- **IP:** 185.211.6.60
- **User:** root
- **App Directory:** `/home/scl-app/scl`
- **Domain:** https://sclsandbox.xyz
- **Database:** scl_prod (MySQL)

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'scl-backend',
    script: './backend/src/server.js',
    instances: 4,
    exec_mode: 'cluster',
    watch: false,
    env: { NODE_ENV: 'production' }
  }]
};
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name sclsandbox.xyz;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }

    location / {
        root /home/scl-app/scl/frontend/dist;
        try_files $uri /index.html;
    }
}
```

### Deployment Steps
```bash
# SSH to production
ssh root@185.211.6.60

# Navigate to app
cd /home/scl-app/scl

# Checkout develop branch (or main for production)
git checkout develop
git pull origin develop

# Create users table if not exists
mysql -u root -proot scl_prod < database/phase-2-users-schema.sql

# Install dependencies
cd backend
npm install --production

# Restart PM2
pm2 restart all
pm2 save

# Check status
pm2 status
pm2 logs scl-backend
```

---

## 9. TESTING

### PowerShell Test Script: `scripts/test-api-proper.ps1`
Tests all 6 endpoints:
1. Health check (public)
2. User registration (public)
3. Get profile (protected)
4. Update profile (protected)
5. User login (public)
6. Refresh token (public)

### Key Test Points
- User registration with valid/invalid data
- JWT token generation and validation
- Password hashing verification
- Protected route access
- Role-based access control
- Token refresh mechanism

---

## 10. KEY ISSUES & SOLUTIONS

### Issue 1: Sequelize Column Name Mapping
**Problem:** Global `underscored: true` converts `isActive` to `is_active`, but database uses camelCase.
**Solution:** Add explicit `field` mapping in model:
```javascript
isActive: {
  type: DataTypes.BOOLEAN,
  field: 'isActive', // Map to camelCase
}
```

### Issue 2: Nginx Reverse Proxy - X-Forwarded-For
**Problem:** Rate limiter warns about X-Forwarded-For header but no trust proxy set.
**Solution:** Add to server.js:
```javascript
app.set('trust proxy', 1);
```

### Issue 3: JWT Secret Not Loading
**Problem:** dotenv loads but environment variables undefined at runtime.
**Solution:** Ensure `.env.production` exists with valid JWT_SECRET value and is readable.

### Issue 4: Password Comparison Failing
**Problem:** bcrypt comparison fails if password hashing didn't occur.
**Solution:** Ensure `beforeSave` hook is called - use `user.save()` not direct SQL updates.

---

## 11. WORKFLOW - STEP BY STEP

### Local Development Workflow
```
1. Start Docker containers
   docker-compose up

2. Create/modify features in feature branch
   git checkout -b feature/new-feature

3. Test locally
   cd backend && npm run test
   cd frontend && npm run dev

4. Commit and push
   git add .
   git commit -m "feat: description"
   git push origin feature/new-feature

5. Create PR to develop
   gh pr create --base develop --title "PR Title"

6. Merge after approval
   git checkout develop
   git merge feature/new-feature
   git push origin develop

7. Deploy to production (when ready)
   git checkout main
   git merge develop
   git push origin main
```

### Production Deployment Workflow
```
1. SSH to production
   ssh root@185.211.6.60

2. Pull latest code
   cd /home/scl-app/scl
   git checkout develop  # or main for stable
   git pull origin develop

3. Apply any database changes
   mysql -u root -proot scl_prod < database/phase-2-users-schema.sql

4. Install dependencies
   cd backend && npm install --production

5. Restart backend services
   pm2 restart all
   pm2 save

6. Verify deployment
   pm2 logs scl-backend
   curl https://sclsandbox.xyz/api/health
```

---

## 12. GIT BRANCH STRUCTURE

```
main (Production)
  ├── Protected - 1 approval required
  ├── Deployed to: https://sclsandbox.xyz
  └── Last commit: Phase 1 (ea35d78)

develop (Development)
  ├── No protection (fast iteration)
  ├── Deployed to: /home/scl-app/scl (develop branch)
  └── Latest commit: Phase 2 fixes (cb8b848)

feature/phase-2-user-auth
  └── Merged to develop ✅

feature/testing-branch-setup
  └── Experimental

release/phase-2-production
  └── Staging branch before main merge
```

---

## 13. IMPORTANT CONFIGURATION NOTES

### Database Connection Pool
```
Production: min=2, max=10 connections
Development: min=1, max=5 connections
```

### JWT Tokens
```
Access Token: 15 minutes (short-lived)
Refresh Token: 7 days (long-lived)
Both signed with separate secrets
```

### Rate Limiting
```
Window: 15 minutes
Max Requests: 100 per window per IP
Applied to: /api/* routes
```

### CORS
```
Development: http://localhost:5173
Production: https://sclsandbox.xyz
```

### Password Security
```
Hashing Algorithm: bcryptjs
Salt Rounds: 10
Min Length: 6 characters
```

---

## 14. COMMON COMMANDS

```bash
# Backend
npm install               # Install dependencies
npm start                # Start production
npm run dev              # Start with nodemon (dev)
npm run lint             # Check code quality
npm run test             # Run tests

# Frontend
npm install              # Install dependencies
npm run dev              # Start dev server (port 5173)
npm run build            # Build for production
npm run preview          # Preview build locally

# PM2
pm2 start ecosystem.config.js  # Start from config
pm2 restart all                 # Restart all processes
pm2 stop all                    # Stop all processes
pm2 kill                        # Kill PM2 daemon
pm2 logs scl-backend            # View logs
pm2 status                      # View process status
pm2 save                        # Save PM2 state
pm2 startup                     # Run on boot

# Database
mysql -u root -proot scl_prod                    # Connect to DB
mysql -u root -proot scl_prod < schema.sql      # Run SQL file
SHOW TABLES;                                     # List tables
DESCRIBE users;                                  # Show table structure

# Git
git checkout develop             # Switch branch
git pull origin develop          # Get latest code
git push origin develop          # Push changes
git log --oneline -5             # View commit history
```

---

## 15. NEXT STEPS (Phase 3+)

### Phase 3: Course Management
```
Database:
- CREATE TABLE courses (id, name, description, instructor_id, ...)
- CREATE TABLE enrollments (id, user_id, course_id, status, ...)

Endpoints:
- POST /api/v1/courses - Create course
- GET /api/v1/courses - List courses
- POST /api/v1/enrollments - Enroll in course
- GET /api/v1/enrollments - List user enrollments

Models:
- Course model with validations
- Enrollment model with foreign keys
- Course-User association (many-to-many)
```

### Phase 4: Advanced Features
```
- Content/lessons management
- Assignments and submissions
- Grading system
- Notifications
- Reporting/analytics
- Payment integration (if needed)
```

---

## 16. TROUBLESHOOTING CHECKLIST

- [ ] Database connection working?
  ```bash
  mysql -u root -proot scl_prod -e "SELECT 1;"
  ```

- [ ] Environment variables loaded?
  ```bash
  echo $JWT_SECRET  # Should print secret
  ```

- [ ] PM2 processes running?
  ```bash
  pm2 status
  ```

- [ ] Port 5000 listening?
  ```bash
  netstat -tlnp | grep 5000
  ```

- [ ] Nginx proxy configured?
  ```bash
  curl https://sclsandbox.xyz/api/health
  ```

- [ ] Logs showing errors?
  ```bash
  pm2 logs scl-backend --lines 50
  ```

---

**This document contains all information needed to recreate Phase 2 User Authentication system on any platform.**
