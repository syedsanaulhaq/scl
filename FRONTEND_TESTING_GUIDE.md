# SCL Phase 2 - Frontend Testing Guide

**Last Updated:** January 17, 2026  
**Status:** ✅ Ready for Frontend Testing

## Quick Start

### 1. Verify Backend is Running

```bash
# Check Docker containers
docker-compose ps

# Should show: scl-mysql-dev (Healthy), scl-backend-dev (Running), scl-phpmyadmin-dev (Running)

# Test backend API
curl http://localhost:5000/api/health
# Expected response: {"success":true,"message":"Server is healthy"}
```

### 2. Start Frontend Development Server

```bash
cd frontend
npm install  # Only needed if not already installed
npm run dev
```

Frontend will start on **http://localhost:3173**

### 3. Test Authentication Flow

#### Test 1: Register a New User
1. Navigate to http://localhost:3173
2. Click "Register" button
3. Fill in the form:
   - **Full Name:** John Doe
   - **Email:** john@example.com
   - **Password:** Test@123456
   - **Confirm Password:** Test@123456
   - **Role:** Student (dropdown)
4. Click "Register"
5. **Expected:** Redirected to home page, user logged in

#### Test 2: Login with Registered User
1. Click "Logout" in navbar
2. Click "Login" button
3. Fill in credentials:
   - **Email:** john@example.com
   - **Password:** Test@123456
4. Click "Login"
5. **Expected:** Redirected to home page, tokens stored in localStorage

#### Test 3: Verify Token Storage
1. Open browser DevTools (F12)
2. Go to Application → Local Storage → http://localhost:3173
3. **Expected to see:**
   - `accessToken` (JWT starting with eyJ...)
   - `refreshToken` (JWT starting with eyJ...)
   - `user` (JSON object with user data)

#### Test 4: Protected Route Access
1. Logged in, open DevTools → Console
2. Run: `localStorage.removeItem('accessToken')`
3. Refresh page
4. Try to access protected route
5. **Expected:** Redirected to login page

#### Test 5: Multiple Users
1. Register another user with different email
2. Login with first user
3. Logout
4. Login with second user
5. **Expected:** Different user data displayed

### 4. Expected Frontend Behavior

#### HomePage
```
- Hero section with "SCL" title
- Login and Register buttons
- 7 Module cards showing:
  - Partner Management
  - Accreditation & QA
  - Course Offerings
  - Student Portal
  - Faculty Management
  - Learning Management
  - Governance & ERP
```

#### LoginPage
```
- Email field (required)
- Password field (required)
- Login button
- Error messages for invalid credentials
- "Don't have an account? Register here" link
- Loading spinner during login
```

#### RegisterPage
```
- Full Name field (required)
- Email field (required, email format)
- Password field (required, min 6 chars)
- Confirm Password field (required, must match)
- Role dropdown (student/teacher/admin)
- Register button
- Error messages for validation failures
- "Already have an account? Login here" link
- Loading spinner during registration
```

### 5. Test API Calls in Console

Open browser DevTools and run these commands:

```javascript
// Get current user from store
const authStore = window.authStore; // if exported globally
authStore.getState(); // See auth state

// Get tokens
localStorage.getItem('accessToken');
localStorage.getItem('refreshToken');

// Get stored user
JSON.parse(localStorage.getItem('user'));
```

### 6. Monitor Network Requests

1. Open DevTools → Network tab
2. Filter by XHR/Fetch
3. Perform register/login
4. **Expected requests:**
   - `POST /v1/auth/register` or `POST /v1/auth/login` → 201 or 200
   - Response includes `data.tokens.accessToken` and `data.tokens.refreshToken`
   - Subsequent requests include `Authorization: Bearer <token>` header

### 7. Test Error Cases

#### Invalid Email Format
- Register with: `notanemail`
- Expected: Form validation error

#### Password Too Short
- Register with password: `123`
- Expected: Error "Password must be at least 6 characters"

#### Passwords Don't Match
- Password: `Test@123456`
- Confirm: `Different123`
- Expected: Error "Passwords do not match"

#### Duplicate Email
- Register user1@example.com
- Try to register user1@example.com again
- Expected: Error "Email already registered"

#### Invalid Credentials
- Register with: test@example.com / password123
- Try to login with: test@example.com / wrongpassword
- Expected: Error "Invalid email or password"

---

## Backend API Endpoints (Reference)

All endpoints return JSON with structure:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { /* endpoint-specific data */ },
  "statusCode": 200-500
}
```

### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name",
  "role": "student"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200): Same structure as register
```

### Get Profile
```
GET /api/v1/auth/profile
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "user": { /* user object */ }
  }
}
```

### Update Profile
```
PATCH /api/v1/auth/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "New Name"
}

Response (200): Same as Get Profile
```

### Refresh Token
```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJ..."
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJ..."
  }
}
```

### Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Frontend File Locations

| File | Purpose | Status |
|------|---------|--------|
| `src/pages/LoginPage.jsx` | Login form with authService integration | ✅ Complete |
| `src/pages/RegisterPage.jsx` | Registration form with authService integration | ✅ Complete |
| `src/services/authService.js` | API wrapper functions for all auth endpoints | ✅ Complete |
| `src/services/api.js` | Axios instance with JWT interceptors | ✅ Complete |
| `src/store/authStore.js` | Zustand store for auth state management | ✅ Complete |
| `src/App.jsx` | Root component with restoreAuth on mount | ✅ Complete |
| `.env` | API URL configuration | ✅ Complete |

---

## Common Issues During Testing

### Issue: "CORS error"
**Solution:** Check that `VITE_API_URL` in `.env` matches backend port (5000)

### Issue: "Token not stored"
**Solution:** Check localStorage in DevTools is not disabled

### Issue: "Can't register same email twice"
**Expected behavior:** Email must be unique in database

### Issue: "API returning 502 Bad Gateway"
**Solution:** Check backend container is running: `docker logs scl-backend-dev`

### Issue: "Form validation not working"
**Solution:** Open browser console for validation errors

---

## Success Criteria

Phase 2 Frontend is complete when:

- ✅ Can register new user and receive JWT tokens
- ✅ Can login with registered credentials
- ✅ Tokens stored in localStorage
- ✅ Tokens sent with each API request
- ✅ Can access protected routes when authenticated
- ✅ Redirected to login when not authenticated
- ✅ Can logout and tokens cleared
- ✅ Can update profile (PATCH endpoint)
- ✅ Token refresh works automatically on 401
- ✅ Form validation displays appropriate errors

---

## Next Phase Tasks

After frontend testing is complete:

1. Implement Protected Route Component
2. Add User Profile/Dashboard Page
3. Add Logout functionality to Navbar
4. Implement Token Refresh Auto-Retry
5. Add Loading states and error toasts
6. Test on production VPS

---

## Support & Debugging

### View Backend Logs
```bash
docker logs scl-backend-dev -f  # Follow logs in real-time
```

### View Database
```bash
docker exec scl-mysql-dev mysql -u root -proot scl_dev
# Then: SELECT * FROM users;
```

### Restart Services
```bash
docker-compose down
docker-compose up -d
```

### View Frontend Console
- Open browser DevTools (F12)
- Go to Console tab
- Look for any red errors

---

**Ready to test! Open http://localhost:3173 and start registering users.**
