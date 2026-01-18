import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import CoursesPage from '@/pages/CoursesPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import UserList from '@/pages/admin/users/UserList';

function App() {
  const { user, restoreAuth, isLoading } = useAuthStore();

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-slate-400">Loading SCL Institute...</p>
        </div>
      </div>
    );
  }

  const DashboardRouter = () => {
    if (user?.role === 'admin') return <AdminDashboard />;
    if (user?.role === 'student') return <StudentDashboard />;
    return <Dashboard />; // Fallback or Guest view
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main Dashboard - Role Based */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardRouter />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserList />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Courses Routes - Protected */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CoursesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
