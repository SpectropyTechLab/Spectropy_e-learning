// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import type { JSX } from "react";

// Auth pages
import MainLoginPage from "./pages/auth/mainpagelogin";
import LoginForm from "./pages/auth/LoginForm";

// Dashboard pages
import SuperAdminDashboard from "./pages/superadmin/AdminHome";
import AdminDashboard from "./pages/admin/CourseStudents";
import TeacherDashboard from "./pages/teacher/Dashboard";
import CourseContentManager from "./pages/teacher/CourseContentManager";
import StudentDashboard from "./pages/student/Dashboard";
import CourseView from "./pages/student/CourseView";

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
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// Redirects to role-specific dashboard
function RoleRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "super_admin":
      return <Navigate to="/superadmin/dashboard" replace />;
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "teacher":
      return <Navigate to="/teacher/dashboard" replace />;
    case "student":
      return <Navigate to="/student/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

// 👇 Just a helper redirect for admin
function AdminDashboardRedirect() {
  return <Navigate to="/admin/courses/1/students" replace />;
}

// ✅ Moved all routes into a separate component
function AppRoutes() {
  const { loading } = useAuth();

  // 🔹 Prevent rendering routes while loading auth data
  if (loading) return <Spinner />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<MainLoginPage />} />
      <Route path="/login-form" element={<LoginForm />} />

      {/* Default redirect based on role */}
      <Route path="/" element={<RoleRedirect />} />

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
            <AdminDashboardRedirect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/:courseId/students"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <AdminDashboard />
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
