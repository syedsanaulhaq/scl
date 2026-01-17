# Production Database Schema Update - Phase 2

## 🎯 Goal
Apply Phase 2 users table schema to production database (scl_prod on 185.211.6.60)

---

## ✅ Schema to Be Applied

The following SQL will be executed on production:

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
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🚀 How to Apply

### Option 1: Automated Script (Easiest)
```powershell
.\scripts\apply-phase2-schema.ps1
```

The script will:
1. Read the schema file
2. Show you what will be applied
3. Ask for confirmation
4. Connect to production server via SSH
5. Apply the schema
6. Verify the users table was created

### Option 2: Manual SSH Connection
```bash
ssh root@185.211.6.60

# Then run:
mysql -u root -p scl_prod < /path/to/phase-2-users-schema.sql

# Verify:
mysql -u root -p scl_prod -e "DESCRIBE users;"
```

### Option 3: Using Sequelize Sync (When Deploying)
The backend code has Sequelize ORM which can auto-sync:
```javascript
await sequelize.sync({ alter: true });
```

When Phase 2 code deploys, this will automatically create the users table.

---

## 📋 What Gets Created

| Column | Type | Details |
|--------|------|---------|
| id | UUID | Primary key, auto-generated |
| email | VARCHAR(255) | Unique, indexed |
| password | VARCHAR(255) | Hashed password |
| name | VARCHAR(255) | User's name |
| role | ENUM | student/teacher/admin |
| isActive | BOOLEAN | Active/inactive flag |
| lastLogin | DATETIME | Last login timestamp |
| createdAt | DATETIME | Auto timestamp |
| updatedAt | DATETIME | Auto update timestamp |

---

## ✨ After Update

Production database will be ready for Phase 2:
- ✅ Users can register
- ✅ Users can login with JWT
- ✅ Roles supported (student, teacher, admin)
- ✅ Profile management working

---

## 🔍 Verify It Worked

```bash
# On production server:
mysql -u root -p scl_prod -e "DESCRIBE users;"

# Should show all fields listed above
```

---

## 📁 Related Files

- **Schema file:** `database/phase-2-users-schema.sql`
- **Update script:** `scripts/apply-phase2-schema.ps1`
- **User model:** `backend/src/models/User.js`
- **Database config:** `backend/src/config/database.js`

---

## 🎯 Ready?

Run this to apply Phase 2 schema to production:

```powershell
.\scripts\apply-phase2-schema.ps1
```

Or wait for automatic deployment when main branch is merged. 🚀
