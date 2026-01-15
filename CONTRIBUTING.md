# 📝 Contributing to SCL

Thank you for contributing to the SCL Education Institute Management System! This document provides guidelines for contributions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- Git installed
- MySQL 8.0+ (for database work)
- Code editor (VS Code recommended)

### Initial Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/scl.git
cd scl

# Create develop branch locally
git checkout -b develop origin/develop

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Create feature branch
git checkout -b feature/your-feature-name
```

---

## 🎯 Development Workflow

### 1. Start Feature Work
```bash
# Update develop
git checkout develop
git pull origin develop

# Create feature branch from develop
git checkout -b feature/amazing-feature

# For bug fixes
git checkout -b bugfix/issue-description

# For documentation
git checkout -b docs/documentation-improvement
```

### 2. Write Code
```bash
# Make changes to backend and/or frontend
# Backend: backend/src/
# Frontend: frontend/src/

# Test your changes locally
cd backend
npm run dev

# In another terminal
cd frontend
npm run dev

# Visit http://localhost:3173 to test
```

### 3. Commit Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat(auth): implement password reset endpoint"

# Push to GitHub
git push origin feature/amazing-feature
```

### 4. Create Pull Request
1. Go to GitHub and click "Create Pull Request"
2. Select `develop` as base branch
3. Use PR template below
4. Request reviewers
5. Wait for code review
6. Address feedback
7. Merge when approved

### 5. After Merge
```bash
# Switch back to develop
git checkout develop
git pull origin develop

# Delete local feature branch
git branch -d feature/amazing-feature
```

---

## 📋 Pull Request Template

```markdown
## 📝 Description
Brief description of what this PR does

## 🎯 Type of Change
- [ ] New feature (non-breaking)
- [ ] Bug fix (non-breaking)
- [ ] Breaking change
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## 🔗 Related Issues
Closes #123

## ✅ Testing Done
- [ ] Unit tests added/updated
- [ ] Integration tests passed
- [ ] Manual testing completed
- [ ] No console errors
- [ ] No new warnings

## 📸 Screenshots
[Add screenshots if applicable]

## 🔍 Review Checklist
- [ ] Code follows style guide
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] All tests passing
- [ ] No breaking changes
- [ ] Performance impact assessed

## 📌 Notes for Reviewers
[Any special instructions or context]
```

---

## 🎨 Code Style Guide

### Backend (Node.js/Express)
```javascript
// ✅ Good
const getUserById = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

// ❌ Bad
const getuserbyid = (userid, callback) => {
  User.find(userid, function(err, user) {
    if (err) callback(err);
    callback(user);
  });
};
```

**Rules:**
- Use `const`/`let`, not `var`
- Use arrow functions for modern syntax
- Use async/await, not callbacks
- Use meaningful variable names
- Max line length: 100 characters
- 2-space indentation
- Add JSDoc comments for functions

### Frontend (React/JSX)
```jsx
// ✅ Good
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </form>
  );
};

// ❌ Bad
const login_form = (props) => {
  const [state, setState] = useState({
    e: '', p: ''
  });

  return (
    <form>
      <input onChange={() => {
        // complex logic inline
      }} />
    </form>
  );
};
```

**Rules:**
- Use functional components with hooks
- Use destructuring
- Extract complex logic to custom hooks
- Meaningful component/variable names
- Props validation with PropTypes
- Separate container/presentation components
- Max 200 lines per component

---

## 🧪 Testing Requirements

### Backend Tests
```bash
cd backend

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage
```

**Test file location:** `backend/tests/` or `__tests__` folder  
**Minimum coverage:** 80%

### Frontend Tests
```bash
cd frontend

# Run tests
npm run test

# Check coverage
npm run test:coverage
```

**Test file location:** `frontend/src/__tests__/` or `.test.jsx` files  
**Minimum coverage:** 75%

### Test Examples

**Backend:**
```javascript
describe('User Authentication', () => {
  it('should login user with valid credentials', async () => {
    const result = await authService.login({
      email: 'user@test.com',
      password: 'password123'
    });
    expect(result).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    expect(() => authService.login({
      email: 'user@test.com',
      password: 'wrong'
    })).rejects.toThrow();
  });
});
```

**Frontend:**
```javascript
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const { getByLabelText, getByRole } = render(<LoginForm />);
    
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalled();
    });
  });
});
```

---

## 📚 Documentation Requirements

### API Endpoints
```javascript
/**
 * Login user
 * @route POST /api/v1/auth/login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} { token, refreshToken, user }
 * @throws {Error} 401 - Invalid credentials
 */
router.post('/login', authenticate, validate(loginSchema), loginController);
```

### Components
```jsx
/**
 * LoginForm Component
 * 
 * A login form with email and password fields.
 * Handles form submission and error display.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback on successful login
 * @returns {React.ReactElement}
 * 
 * @example
 * <LoginForm onSuccess={() => navigate('/dashboard')} />
 */
export const LoginForm = ({ onSuccess }) => {
  // ...
};
```

### README Updates
If adding a feature, update relevant README:
- `backend/README.md` - For backend changes
- `frontend/README.md` - For frontend changes
- `docs/API.md` - For API endpoint changes

---

## 🔐 Security Guidelines

### Backend Security
- ✅ Always validate input with Joi
- ✅ Use JWT with short expiry (15min)
- ✅ Hash passwords with bcryptjs
- ✅ Implement rate limiting
- ✅ Use HTTPS in non-dev environments
- ✅ Sanitize error messages (no stack traces)
- ✅ Use environment variables for secrets
- ❌ Never log sensitive data
- ❌ Never hardcode API keys

### Frontend Security
- ✅ Validate form input on client
- ✅ Use HTTPS in production
- ✅ Clear sensitive data on logout
- ✅ Implement CSRF protection
- ✅ Sanitize HTML output
- ❌ Never store passwords in localStorage
- ❌ Never expose API keys in frontend code

---

## 🐛 Bug Reports

### Format
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node version: 18.x
- SCL version: 1.0.0

## Screenshots
[Add if applicable]
```

---

## ✨ Feature Requests

### Format
```markdown
## Description
Brief description of feature

## Use Case
Why is this needed?

## Proposed Solution
How should this work?

## Alternatives
Other solutions considered

## Additional Context
Any relevant information
```

---

## 🚨 Common Mistakes to Avoid

❌ **Don't:**
- Commit `.env` files
- Use `console.log` in production code
- Mix tabs and spaces
- Commit without tests
- Create huge commits (>500 lines)
- Force push to main/develop
- Leave `console.error` uncaught
- Hardcode URLs/API keys
- Use `any` type in TypeScript
- Create overly complex functions

✅ **Do:**
- Run tests before committing
- Use meaningful commit messages
- Keep functions small (<50 lines)
- Comment complex logic
- Handle errors gracefully
- Use environment variables
- Ask for help when stuck
- Review others' PRs
- Keep commits focused
- Rebase before merging

---

## 🎓 Learning Resources

- [Git Workflow](https://www.atlassian.com/git/workflows)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn)
- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)

---

## 📞 Getting Help

- **Questions:** Use GitHub Discussions
- **Bugs:** Create an Issue
- **Security:** Email security@sclsandbox.xyz
- **Chat:** Slack #development channel
- **Documentation:** See `/docs` folder

---

## 🙏 Thank You

Thank you for contributing to SCL! Your efforts help build a better education management system for thousands of users.

---

**Version:** 1.0.0 | **Last Updated:** January 15, 2026 | **Maintainer:** SCL Team
