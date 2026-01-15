# SCL Frontend - React Application

React.js 18 frontend for the SCL (Education Institute Management System).

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/           # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/        # API service functions
│   │   ├── api.js
│   │   └── authService.js
│   ├── store/           # Zustand state management
│   │   └── authStore.js
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Vite entry point
│   └── index.css        # Global styles with Tailwind
├── package.json
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── .env.development     # Dev environment variables
├── .env.test            # Test environment variables
├── .env.production      # Production environment variables
└── README.md            # This file
```

## Environment Variables

Create a `.env` file from the appropriate environment template:

**Development:**
```bash
cp .env.development .env
```

**Key Variables:**
- `VITE_API_URL` - Backend API URL
- `VITE_FRONTEND_URL` - Frontend URL for CORS
- `VITE_ENV` - Environment name

## Installation

```bash
npm install
```

## Running

**Development (with hot reload):**
```bash
npm run dev
```

Visit `http://localhost:3173`

**Production Build:**
```bash
npm run build
npm run preview
```

**Testing:**
```bash
npm test
npm run test:coverage
```

## Features

- ✅ React 18 with Vite
- ✅ React Router v6
- ✅ Material-UI components
- ✅ Tailwind CSS styling
- ✅ Purple theme (#6B46C1)
- ✅ Zustand state management
- ✅ Axios API client
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Responsive design

## Pages

### Public Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Pages
- Coming soon in Phase 1

## Authentication Flow

1. User logs in with email/password
2. Backend returns `accessToken` and `refreshToken`
3. Tokens stored in `localStorage`
4. API requests include `Authorization: Bearer <token>` header
5. Expired tokens automatically refreshed
6. Failed refresh redirects to login

## Purple Theme

Primary Color: `#6B46C1`  
Dark Variant: `#553399`  
Light Variant: `#8B5CF6`  

Theme applied via Material-UI and Tailwind CSS.

## Development Notes

1. Use Material-UI for complex components
2. Use Tailwind for utility-first styling
3. Keep components small and reusable
4. Use Zustand for global state
5. Validate all inputs before submission
6. Handle loading and error states

## Next Steps (Phase 1 Week 1-2)

- [ ] Implement login functionality
- [ ] Implement registration
- [ ] Create student dashboard
- [ ] Create faculty dashboard
- [ ] Create admin dashboard
- [ ] Add profile management
- [ ] Write component tests
- [ ] Deploy to DEV environment

## Support

For issues or questions, please contact the SCL team.
