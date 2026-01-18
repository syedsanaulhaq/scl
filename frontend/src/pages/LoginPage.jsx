import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import * as authService from '@/services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { user, tokens } = await authService.login(formData.email, formData.password);
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card shadow-lg">
          {/* Card Header */}
          <div className="card-header border-b border-gray-200 bg-gradient-to-r from-teal-600 to-teal-700">
            <h1 className="card-title text-white text-2xl font-bold">Sign In</h1>
            <p className="text-teal-100 text-sm mt-1">Welcome back to KIAALAP</p>
          </div>

          {/* Card Body */}
          <div className="card-body">
            {/* API Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                  {error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className={`form-control w-full ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`form-control w-full ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-gray-700 font-medium">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-teal-600 hover:text-teal-700 font-semibold transition"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button type="button" disabled={isLoading} className="btn-outline py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92h7.84c.14 1.05.27 2.22.27 3.53C20.38 19.6 17.64 24 12.14 24c-5.86 0-10.6-4.75-10.6-10.6 0-5.86 4.75-10.6 10.6-10.6 2.68 0 5.15.96 7.07 2.57l-2.88 2.77c-.79-.78-2.04-1.37-3.29-1.37-2.68 0-4.84 2.16-4.84 4.84v.6h7.68c-.09.5-.09 1.08-.09 1.6.01 3.85-2.6 6.88-5.79 6.88-3.1 0-5.63-2.57-5.63-5.93 0-3.38 2.54-5.93 5.63-5.93.73 0 1.45.12 2.11.35l2.16-2.21z" />
                </svg>
                Google
              </button>
              <button type="button" disabled={isLoading} className="btn-outline py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm3.7-10c0 2.05-1.65 3.7-3.7 3.7s-3.7-1.65-3.7-3.7 1.65-3.7 3.7-3.7 3.7 1.65 3.7 3.7z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-teal-600 hover:text-teal-700 font-semibold transition"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-gray-600 text-sm">
          Protected by <span className="font-semibold text-gray-900">reCAPTCHA</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
