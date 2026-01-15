# SCL Backend - Express.js API Server

Express.js backend for the SCL (Education Institute Management System).

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files (database, logger, etc.)
│   ├── middleware/       # Express middleware (auth, validation, error handling)
│   ├── models/           # Sequelize ORM models (User, Institute, Course, etc.)
│   ├── controllers/      # Route controllers (business logic)
│   ├── routes/           # API route definitions
│   ├── utils/            # Utility functions (token generation, encryption, etc.)
│   ├── errors/           # Custom error classes
│   └── server.js         # Server entry point
├── package.json          # Dependencies
├── .env.dev              # Development environment variables
├── .env.test             # Test environment variables
├── .env.production       # Production environment variables
└── README.md            # This file
```

## Environment Variables

Copy the appropriate `.env.*` file and update with your values:

**Development:**
```bash
cp .env.dev .env
```

**Key Variables:**
- `NODE_ENV` - Environment (development, test, production)
- `PORT` - Server port (default: 5000)
- `DB_*` - Database connection details
- `JWT_SECRET` - Secret key for JWT signing
- `FRONTEND_URL` - Frontend URL for CORS

## Installation

```bash
npm install
```

## Running

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

**Testing:**
```bash
npm test
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

## Features

- ✅ Express.js framework
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Sequelize ORM for MySQL
- ✅ Request validation with Joi
- ✅ Error handling
- ✅ CORS support
- ✅ Rate limiting
- ✅ Winston logging
- ✅ Helmet security headers

## Development Notes

1. All routes must have proper error handling
2. Use async/await for asynchronous operations
3. Validate all inputs using Joi schemas
4. Log important operations
5. Follow RESTful API conventions
6. Add TypeScript support later for type safety

## Next Steps (Phase 1 Week 1-2)

- [ ] Implement User model and controller
- [ ] Add authentication endpoints (login/register/refresh)
- [ ] Create role management system
- [ ] Add database models for all modules
- [ ] Write unit and integration tests
- [ ] Deploy to DEV environment

## Support

For issues or questions, please contact the SCL team.
