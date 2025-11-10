// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";

// Auth pages
import LandingPage from './pages/auth/LandingPage'; // Contains inline login portal selection
import MainLoginPage from './pages/auth/mainpagelogin'; // Role selector (for E-Learning)
import LoginForm from './pages/auth/LoginForm';
import Courses from './pages/auth/courses';
// Dashboard pages
import SuperAdminDashboard from './pages/superadmin/RegisterAdmin';
import AdminDashboard from './pages/admin/admindashboard';
import CourseContent from './pages/admin/CourseContent';
import TeacherDashboard from './pages/teacher/Dashboard';
import CourseContentManager from './pages/teacher/CourseContentManager';
import StudentDashboard from './pages/student/Dashboard';
import CourseView from './pages/student/CourseView';

import ContentViewer from './pages/common/ContentViewer';


// Protected Route Component
// Small spinner shown while fetching user info
function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );
}

// ✅ Protects routes based on user role
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {

  const { user } = useAuth();

  //if (loading) {
  //   return <Spinner />;
  //}

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ✅ Moved all routes into a separate component
function AppRoutes() {
  const { loading } = useAuth();

  // 🔹 Prevent rendering routes while loading auth data
  if (loading) return <Spinner />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<MainLoginPage />} />
      <Route path="/login-form" element={<LoginForm />} />
      <Route path="/courses" element={<Courses/>} />



      <Route path="/content/:contentId" element={<ContentViewer />} />


      {/* SuperAdmin */}
      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
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

      {/* Teacher */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin", "teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/course/:id"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin", "teacher"]}>
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
      {/* Student */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses/:courseId"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CourseView />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ✅ Wrap everything inside AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
