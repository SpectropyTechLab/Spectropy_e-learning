// src/pages/admin/EnrollUsers.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function EnrollUsers() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !email.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await api.post(`/admin/courses/${courseId}/enroll-by-email`, {
        email: email.trim(),
        role,
      });

      setMessage({ type: 'success', text: `${role === 'student' ? 'Student' : 'Teacher'} enrolled successfully!` });
      setEmail('');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        `Failed to enroll ${role}. Make sure the user exists and is not already enrolled.`;
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (role) {
      setRole(null);
      setMessage(null);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {role ? `Enroll ${role === 'student' ? 'Student' : 'Teacher'}` : 'Enroll Users'}
        </h1>
        <button
          onClick={handleBack}
          className="text-blue-900 hover:text-blue-600"
        >
          ← Back
        </button>
      </div>

      {!role ? (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setRole('student')}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium"
          >
            Enroll Student
          </button>
          <button
            onClick={() => setRole('teacher')}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium"
          >
            Enroll Teacher
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-medium mb-4">
            Enter {role === 'student' ? 'Student' : 'Teacher'} Email
          </h2>

          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleEnroll} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder={`e.g. ${role}@example.com`}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRole(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {submitting ? 'Enrolling...' : 'Enroll'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}