// src/pages/auth/MainLoginPage.tsx
import { useNavigate } from 'react-router-dom';

const MainLoginPage = () => {
  const navigate = useNavigate();

  const roles = [
    { id: 'super_admin', label: 'Super Admin OS', icon: '🔧', description: 'Manage system-wide settings, schools, and user access.' },
    { id: 'admin', label: 'Admin OS', icon: '🏫', description: 'Oversee courses, enrollments, and institution analytics.' },
    { id: 'teacher', label: 'Teacher OS', icon: '👩‍🏫', description: 'Create courses, assign tasks, and grade student submissions.' },
    { id: 'student', label: 'Student OS', icon: '🎓', description: 'Access courses, submit assignments, and track progress.' },
  ];

  const handleRoleSelect = (role: string) => {
    navigate('/login-form', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-start pt-8 px-4">
      {/* Header */}
      <header className="w-full bg-blue-900 text-white py-4 px-6 flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <img 
            src="https://spectropy.com/wp-content/uploads/2023/02/final-blue-white-bg.png" 
            alt="Spectropy Logo" 
            className="h-10 rounded-md"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">SPECTROPY — Learning Management System</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleSelect(role.id)}
              className="flex flex-col items-center justify-center p-6 border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{role.icon}</span>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{role.label}</h3>
              <p className="text-sm text-gray-600 text-center">{role.description}</p>
            </button>
          ))}
        </div>

        {/* Help Link */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Need help? Contact <a href="mailto:spectropy.com" className="text-blue-600 hover:text-blue-800 underline">spectropy.com</a>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Spectropy. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLoginPage;