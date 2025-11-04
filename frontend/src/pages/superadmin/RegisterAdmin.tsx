// src/pages/superadmin/RegisterAdmin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function RegisterAdmin() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Note: role is NOT sent — backend hardcodes 'admin'
      await api.post('/superadmin/register-admin', formData);
      setSuccess('Admin registered successfully!');
      setFormData({ email: '', full_name: '', password: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register admin');
    }
  };

   const handleBackToLogin = async () => {
    await logout(); // Clear auth state
    navigate('/login', { replace: true }); // Go to login, don't allow back navigation
  };

  return (
    <div className="p-6 max-w-md mx-auto">
       <button
        onClick={handleBackToLogin}
        className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Back to Login
      </button>
      
      <h1 className="text-2xl font-bold mb-6">Register New Admin</h1>
      
      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-2 border rounded"
            required
            minLength={6}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Register Admin
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}