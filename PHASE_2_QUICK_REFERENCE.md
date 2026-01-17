# Phase 2: Quick Reference Guide

## What Was Built

**Complete JWT-based Authentication System** with User Model, Password Hashing, and Protected Endpoints

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:5000`

### 2. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "name": "Test User",
    "role": "student"
  }'
```

### 3. Copy Access Token from Response
```json
{
  "data": {
    "tokens": {
      "accessToken": "eyJhbGc..." // <-- Copy this
    }
  }
}
```

### 4. Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 📋 All 6 Endpoints

### Public (No Auth Required)
1. **POST /api/auth/register** - Create account
2. **POST /api/auth/login** - Login
3. **POST /api/auth/refresh** - Get new access token

### Protected (Requires Bearer Token)
4. **GET /api/auth/profile** - Get user info
5. **PATCH /api/auth/profile** - Update user info
6. **POST /api/auth/logout** - Logout

---

## 🔐 Security Features

✅ Passwords hashed with bcryptjs (10 rounds)  
✅ JWT tokens with 15-minute expiry  
✅ Refresh tokens valid for 7 days  
✅ Passwords never returned in API  
✅ Email uniqueness enforced  
✅ Role-based access control ready  
✅ Input validation with Joi  

---

## 📊 User Model Fields

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Auto-generated |
| email | String | Unique, indexed |
| password | String | Auto-hashed on save |
| name | String | 2-100 chars |
| role | Enum | student/teacher/admin |
| isActive | Boolean | Default: true |
| lastLogin | DateTime | Updated on login |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Auto-set |

---

## 🔧 Environment Variables

Add to `.env.production`:
```bash
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

---

## 📁 Files Created

```
backend/src/
├── models/User.js              (NEW)
├── controllers/authController.js (NEW)
├── middleware/authMiddleware.js  (NEW)
└── routes/authRoutes.js         (UPDATED)
```

---

## ✅ Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Get user profile
- [ ] Update user profile
- [ ] Refresh token
- [ ] Logout
- [ ] Try accessing protected route without token (should fail)
- [ ] Try accessing with invalid token (should fail)

---

## 🎓 How It Works

```
1. User registers → Password hashed → JWT tokens generated
2. User logs in → Credentials verified → New tokens issued
3. Protected requests → Bearer token verified → Request allowed
4. Access token expires → Use refresh token for new access token
5. Refresh token expires → User must login again
```

---

## 📖 Documentation Files

- **PHASE_2_USER_MODEL_COMPLETE.md** - Full technical documentation
- **PHASE_2_COMPLETION_REPORT.md** - Implementation report with examples

---

## 🧪 Run Tests

```bash
# Automated testing script
bash scripts/test-auth-endpoints.sh
```

---

## 🚀 What's Next?

1. **Test the endpoints** manually with cURL
2. **Connect React frontend** to these API endpoints
3. **Store tokens** in localStorage
4. **Add auth context** to React app
5. **Update login/register forms** to call API

---

## 💡 Key Commands

```bash
# Install dependencies
cd backend && npm install

# Run development server
npm run dev

# Run tests
bash scripts/test-auth-endpoints.sh

# Check git status
git status

# View API response (JSON formatted)
curl http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '...' | jq .
```

---

## 📞 Common Issues

### "password is required" validation error
- Make sure password is at least 6 characters
- Check you're sending it in the request body

### "Invalid email or password" on login
- Verify email matches exactly (case-insensitive)
- Verify password is correct

### 401 Unauthorized on protected endpoint
- Include Bearer token in header: `Authorization: Bearer <token>`
- Verify token hasn't expired

### Email already exists
- Use a different email or check database for existing user

---

## 📚 Quick Reference

**Token Expiry:**
- Access Token: 15 minutes
- Refresh Token: 7 days

**Password Requirements:**
- Minimum 6 characters
- Auto-hashed before storage

**Allowed Roles:**
- student (default)
- teacher
- admin

**HTTP Status Codes:**
- 200: Success
- 201: Created (registration)
- 400: Validation error
- 401: Unauthorized (auth failed)
- 403: Forbidden (insufficient role)
- 404: Not found
- 409: Conflict (duplicate email)

---

**Phase 2 Status:** ✅ COMPLETE & READY FOR TESTING  
**Last Updated:** January 17, 2026  
**Repository:** https://github.com/syedsanaulhaq/scl
