// src/pages/auth/LoginForm.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Only used in registration
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { login, register, user } = useAuth();  // Access user info
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRole = location.state?.role || 'student';
  const CAN_REGISTER = ['student', 'teacher'].includes(selectedRole);

  // Redirect after login
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'super_admin': navigate('/superadmin/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        case 'teacher': navigate('/teacher/dashboard'); break;
        case 'student': navigate('/student/dashboard'); break;
        default: navigate('/login');
      }
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login flow
      try {
        await login(email, password);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Login failed.');
      }
    } else {
      // Registration flow
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        await register(email, fullName, password, selectedRole);
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Registration failed.');
      }
    }
  };

  // Role-specific icons and titles
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { icon: '🔐', title: 'Super Admin Login', subtitle: 'Manage system-wide settings' };
      case 'admin':
        return { icon: '🏢', title: 'Admin Login', subtitle: 'Oversee schools and courses' };
      case 'teacher':
        return { icon: '👩‍🏫', title: 'Teacher Login', subtitle: 'Upload assignments and grades' };
      case 'student':
        return { icon: '🎓', title: 'Student Login', subtitle: 'Access courses and track progress' };
      default:
        return { icon: '👤', title: 'Login', subtitle: 'Enter your credentials' };
    }
  };

  const { icon, title, subtitle } = getRoleConfig(selectedRole);
  console.log("login form loaded");
  return (
    <div className="min-h-screen bg-spectropy-light flex flex-col items-center justify-start py-6 px-4">
      {/* Header */}
      <Header />

      {/* Main Form Card */}
      <main className="w-full max-w-md bg-spectropy-white rounded-xl shadow-lg p-6 mt-8">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">{icon}</div>
          <h1 className="text-xl font-bold text-spectropy-blue mb-1">{title}</h1>
          <p className="text-spectropy-gray text-sm">{subtitle}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          {!isLogin && CAN_REGISTER && (
            <div>
              <label htmlFor="fullName" className="block text-spectropy-gray text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-spectropy-border rounded-md focus:outline-none focus:ring-2 focus:ring-spectropy-blue"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-spectropy-gray text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-spectropy-border rounded-md focus:outline-none focus:ring-2 focus:ring-spectropy-blue"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-spectropy-gray text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-spectropy-border rounded-md focus:outline-none focus:ring-2 focus:ring-spectropy-blue"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && CAN_REGISTER && (
            <div>
              <label htmlFor="confirmPassword" className="block text-spectropy-gray text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-spectropy-border rounded-md focus:outline-none focus:ring-2 focus:ring-spectropy-blue"
                placeholder="Re-enter your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!isLogin && !CAN_REGISTER}
            className={`w-full py-2 px-4 font-medium rounded-md 
    transition-all duration-300 ease-in-out transform
    ${!isLogin && !CAN_REGISTER
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : isLogin
                  ? "bg-maincolor hover:bg-lightmain hover:scale-105 text-white shadow-md hover:shadow-lg"
                  : "bg-green-700 hover:bg-green-600 hover:scale-105 text-white shadow-md hover:shadow-lg"
              }`}
          >
            {isLogin ? "Sign In" : "Register"}
          </button>

        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-4 text-center">
          {isLogin ? (
            CAN_REGISTER ? (
              <button
                onClick={() => setIsLogin(false)}
                className="text-spectropy-blue hover:text-blue-800 text-sm"
              >
                Don't have an account? Register
              </button>
            ) : (
              <p className="text-spectropy-gray text-sm">
                Registration is not available for this role.
              </p>
            )
          ) : (
            <button
              onClick={() => setIsLogin(true)}
              className="text-spectropy-blue hover:text-blue-800 text-sm"
            >
              Already have an account? Login
            </button>
          )}
        </div>

        {isLogin && (
          <div className="mt-2 text-center">
            <a href="#" className="text-spectropy-blue hover:text-blue-800 text-sm">
              Forgot password?
            </a>
          </div>
        )}

        {/* Back to Role Selection */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="text-spectropy-blue hover:text-blue-800 text-sm flex items-center justify-center mx-auto"
          >
            ← Back to Role Selection
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-spectropy-gray text-sm">
        © {new Date().getFullYear()} Spectropy. All rights reserved.
      </footer>
    </div>
  );
}