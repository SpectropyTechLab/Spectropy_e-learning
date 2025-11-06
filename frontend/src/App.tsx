// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

// Auth pages
import LandingPage from './pages/auth/LandingPage'; // Contains inline login portal selection
import MainLoginPage from './pages/auth/mainpagelogin'; // Role selector (for E-Learning)
import LoginForm from './pages/auth/LoginForm';

// Dashboard pages
import SuperAdminDashboard from './pages/superadmin/RegisterAdmin';
import AdminDashboard from './pages/admin/admindashboard';
import CourseContent from './pages/admin/CourseContent';
import TeacherDashboard from './pages/teacher/Dashboard';
import CourseContentManager from './pages/teacher/CourseContentManager';
import StudentDashboard from './pages/student/Dashboard';
import CourseView from './pages/student/CourseView';


// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login/e-learning" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login/e-learning" replace />;
  return children;
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🟢 Landing Page is the first and home page */}
          <Route path="/" element={<LandingPage />} />

          {/* 🔑 E-Learning login flow (your existing role-based login) */}
          <Route path="/login/e-learning" element={<MainLoginPage />} />
          <Route path="/login-form" element={<LoginForm />} />

          {/* 🛡️ Protected Dashboard Routes */}
          <Route
            path="/superadmin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses/:courseId/content"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <CourseContent />
              </ProtectedRoute>
           }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/course/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'teacher']}>
                <CourseContentManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CourseView />
              </ProtectedRoute>
            }
          />

          {/* ⛔ Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}