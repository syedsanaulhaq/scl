# SCL - Education Institute Management System

Complete education institute management system with 7 core modules, built with React, Express.js, MySQL, and Moodle LMS integration.

## 📁 Project Structure

```
SCL/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/         # Database, logger, CORS config
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Sequelize ORM models
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API endpoint definitions
│   │   ├── utils/          # Helper functions
│   │   ├── errors/         # Custom error classes
│   │   └── server.js       # Entry point
│   ├── package.json
│   ├── .env.dev
│   ├── .env.test
│   ├── .env.production
│   └── README.md
│
├── frontend/                # React.js Web Application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Zustand state management
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Vite entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.development
│   ├── .env.test
│   ├── .env.production
│   └── README.md
│
├── .gitignore              # Git ignore rules
└── README.md              # This file
```

## 🎯 7 Core Modules

1. **Partner & Associates Management** - Partner CRUD, agreement tracking, multi-partner support
2. **Accreditation, QA & Compliance** - Accreditation tracking, QA audits, compliance checklists
3. **Course Offerings & Program Catalog** - Program management, course scheduling, prerequisites
4. **Student Portal** - Induction, support tickets, appeals, document uploads
5. **Faculty Management & HR** - Faculty profiles, departments, attendance, leave management
6. **Learning Management** - Moodle OAuth2 SSO, grade sync, activity tracking, LMS dashboard
7. **Governance & ERP Lite** - Fees management, vendor management, facility booking, workflow engine

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18.x LTS
- **Framework:** Express.js 4.x
- **Database:** MySQL 8.0
- **ORM:** Sequelize
- **Authentication:** JWT + OAuth2
- **Validation:** Joi
- **Logging:** Winston
- **Security:** Helmet, CORS, rate limiting
- **Payments:** Stripe, PayPal SDKs

### Frontend
- **Framework:** React.js 18.x
- **Build Tool:** Vite
- **UI Library:** Material-UI
- **Styling:** Tailwind CSS + Custom CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Theme:** Purple (#6B46C1)

### Infrastructure
- **Environments:** DEV (local), TEST (VPS staging), PROD (VPS live)
- **Domains:** sclsandbox.xyz with subdomains
- **File Storage:** Local server
- **Email:** SMTP mail.sclsandbox.xyz
- **VPS:** Ubuntu-based

## 📊 Database

- **40+ tables** covering all 7 modules
- **Multi-tenancy** support (institute-level isolation)
- **Role-based access control** with 8 user roles
- **Audit trail** logging on all operations
- **Moodle integration** tables for SSO and sync

See `SCL_Database_Schema.md` for complete table documentation.

## 🔐 Security Features

✅ JWT authentication (15m expiry)  
✅ Refresh tokens (7d expiry)  
✅ OAuth2 Moodle SSO  
✅ bcryptjs password hashing (10 rounds)  
✅ SQL injection prevention  
✅ XSS protection  
✅ CSRF tokens  
✅ Rate limiting  
✅ Audit logging  
✅ Role-based authorization  
✅ Data encryption ready  
✅ HTTPS/TLS support  

## 📅 Timeline

**Phase 1 (Weeks 1-2):** Core Platform Setup
- Express.js backend
- React frontend with authentication
- Database schema
- JWT implementation
- DEV environment deployment

**Phase 2 (Weeks 3-4):** Admissions Module
- Application forms with file uploads
- Reviewer workflow
- Student portal features
- TEST environment ready

**Phase 3 (Weeks 5-6):** ERP Lite Essentials
- Fees management
- Vendor management
- HR modules
- Facility management

**Phase 4 (Weeks 7-10):** Moodle Integration
- OAuth2 SSO setup
- REST API synchronization
- Activity tracking
- Reporting dashboards

**Phase 5 (Weeks 11-12):** QA & Go-Live
- Testing (99%+ coverage)
- User training
- Performance optimization
- PROD deployment
- 30-day support

## 💰 Budget

| Phase | Focus | Cost |
|-------|-------|------|
| Phase 1 | Core Platform | ₨250,000 |
| Phase 2 | Admissions | ₨250,000 |
| Phase 3 | ERP Essentials | ₨400,000 |
| Phase 4 | Moodle Integration | ₨250,000 |
| Contingency | Fixes & Plugins | ₨150,000 |
| Final | Delivery & Support | ₨200,000 |
| **TOTAL** | **12 Weeks** | **₨1,500,000** |

## 📈 Performance Targets

| Metric | Target |
|--------|--------|
| Page Load | < 2 seconds |
| API Response | < 500ms |
| Database Query | < 200ms |
| Uptime | 99.5% |
| Concurrent Users | 500+ |
| Max File Upload | 100MB |

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x LTS
- MySQL 8.0
- npm or yarn
- Git

### Setup Backend

```bash
cd backend
npm install
cp .env.dev .env
npm run dev
```

Backend runs on `http://localhost:5000`

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3173`

### API Health Check

```bash
curl http://localhost:5000/api/health
```

## 📚 Documentation

Complete documentation files are provided:

- `SCL_Complete_Documentation_Summary.md` - Executive summary
- `SCL_Project_Plan.md` - Detailed timeline and budget
- `SCL_Technical_Specifications.md` - Architecture and tech stack
- `SCL_Database_Schema.md` - Table design and relationships
- `SCL_GitHub_Setup_Guide.md` - Repository configuration
- `SCL_Quick_Start_Guide.md` - Developer onboarding
- `backend/README.md` - Backend setup guide
- `frontend/README.md` - Frontend setup guide

## 🔄 Development Workflow

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote and create pull request
4. Code review and merge to `develop`
5. Deploy to TEST environment
6. After approval, merge to `main` for PROD

## 🧪 Testing

**Backend:**
```bash
cd backend
npm test
npm run test:coverage
```

**Frontend:**
```bash
cd frontend
npm test
npm run test:coverage
```

## 📝 Git Branches

- `main` → PROD environment
- `staging` → TEST environment
- `develop` → DEV environment

All branches have protection rules requiring:
- Pull request approval
- Status check passing
- No direct commits

## 🎨 Theme Customization

**Primary Color:** `#6B46C1` (Purple)  
**Dark Variant:** `#553399`  
**Light Variant:** `#8B5CF6`  

To customize:
- Backend: `.env` files
- Frontend: `tailwind.config.js`, Material-UI theme in `App.jsx`

## 📞 Support

**Technical Issues:**
1. Check documentation in respective README.md files
2. Review database schema for data structure
3. Check API endpoints in backend routes

**Post-Launch Support:**
- 30-day bug fix guarantee
- Critical issues: 2 hours response
- Non-critical: 24 hours response
- User training: Week 11

## ✅ Success Criteria

- ✅ 7 modules fully operational
- ✅ 40+ database tables
- ✅ 50+ API endpoints
- ✅ 99%+ test pass rate
- ✅ 99.5% uptime target
- ✅ 500+ concurrent users
- ✅ Complete documentation
- ✅ User training delivered

## 📄 License

© 2026 SCL - Education Institute Management System. All rights reserved.

---

**Status:** Phase 1 Development in Progress  
**Go-Live Target:** April 15, 2026  
**Budget:** ₨1,500,000  
**Team Size:** 5 developers recommended
