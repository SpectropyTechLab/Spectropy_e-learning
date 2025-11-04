// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

// Auth pages
import MainLoginPage from './pages/auth/mainpagelogin';
import LoginForm from './pages/auth/LoginForm';

// Dashboard pages
import SuperAdminDashboard from './pages/superadmin/RegisterAdmin';
import AdminDashboard from './pages/admin/CourseStudents'; // This is for course-specific view
import TeacherDashboard from './pages/teacher/Dashboard';
import CourseContentManager from './pages/teacher/CourseContentManager';
import StudentDashboard from './pages/student/Dashboard';
import CourseView from './pages/student/CourseView';

// 👇 ADD THIS: Minimal redirector for /admin/dashboard
function AdminDashboardRedirect() {
  // Redirect to first course or show message
  // For now, redirect to course ID 1 (you can improve later)
  return <Navigate to="/admin/courses/1/students" replace />;
}

import type { JSX } from 'react';

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'super_admin':
      return <Navigate to="/superadmin/dashboard" />;
    case 'admin':
      return <Navigate to="/admin/dashboard" />;
    case 'teacher':
      return <Navigate to="/teacher/dashboard" />;
    case 'student':
      return <Navigate to="/student/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<MainLoginPage />} />
          <Route path="/login-form" element={<LoginForm />} />

          <Route path="/" element={<RoleRedirect />} />

          {/* Protected Routes */}
          <Route
            path="/superadmin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ CORRECT: Course-specific student management */}
          <Route
            path="/admin/courses/:courseId/students"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ FIX: /admin/dashboard no longer renders CourseStudents directly */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminDashboardRedirect />
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
                <CourseContentManager/>
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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}