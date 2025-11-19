import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function EnrollUsers() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Store full enrollment list
  const [allEnrollments, setAllEnrollments] = useState<Array<{
    user_id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    enrolled_at: string;
  }> | null>(null);

  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Fetch all enrollments for the course
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!courseId) return;
      setLoadingEnrollments(true);
      try {
        const response = await api.get(`/admin/courses/${courseId}/enrollments`);
        setAllEnrollments(response.data);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
        setMessage({ type: 'error', text: 'Failed to load enrolled users.' });
      } finally {
        setLoadingEnrollments(false);
      }
    };

    fetchEnrollments();
  }, [courseId]);

  // Compute displayed enrollments based on selected role
  const displayedEnrollments = useMemo(() => {
    if (!allEnrollments) return [];
    if (role === 'student') {
      return allEnrollments.filter(e => e.role === 'student');
    } else if (role === 'teacher') {
      return allEnrollments.filter(e => e.role === 'teacher');
    } else {
      // Show all: students first, then teachers (already sorted by backend: ORDER BY role, email)
      // But ensure deterministic order in case backend changes
      const students = allEnrollments.filter(e => e.role === 'student');
      const teachers = allEnrollments.filter(e => e.role === 'teacher');
      return [...students, ...teachers];
    }
  }, [allEnrollments, role]);

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

      // Refetch full enrollment list to update UI
      const response = await api.get(`/admin/courses/${courseId}/enrollments`);
      setAllEnrollments(response.data);

      // Auto-close modal after success
      setTimeout(() => {
        setShowModal(false);
        setMessage(null);
      }, 1500);
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
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">Enroll Users</h1>
        </div>

        {/* Role Selection */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setRole('student')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              role === 'student'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-5.356-5.356L12 18.644z"
              />
            </svg>
            Enroll Student
          </button>
          <button
            onClick={() => setRole('teacher')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              role === 'teacher'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-5.356-5.356L12 18.644z"
              />
            </svg>
            Enroll Teacher
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-900 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back To Admin Dashboard
          </button>
        </div>
      </div>

      {/* Right Panel - Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {role === 'student' && 'Enroll Student'}
                {role === 'teacher' && 'Enroll Teacher'}
                {!role && 'Manage Enrollments'}
              </h1>
              <p className="text-gray-600 mt-1">
                {role === 'student' &&
                  'Add students to this course by entering their email.'}
                {role === 'teacher' &&
                  'Add teachers to this course by entering their email.'}
                {!role &&
                  'Select a role on the left to enroll new users or view existing ones.'}
              </p>
            </div>
            {role && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Enrollment List */}
        <div className="p-6">
          {loadingEnrollments ? (
            <p className="text-gray-500">Loading enrollments...</p>
          ) : displayedEnrollments.length === 0 ? (
            <p className="text-gray-500">
              {role
                ? `No ${role}s enrolled in this course yet.`
                : 'No enrollments yet.'}
            </p>
          ) : (
            <div className="space-y-3">
              {displayedEnrollments.map((enrollment) => (
                <div
                  key={enrollment.user_id}
                  className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium">{enrollment.name}</p>
                    <p className="text-sm text-gray-600">{enrollment.email}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {enrollment.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Input Modal */}
      {showModal && role && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  Enroll {role === 'student' ? 'Student' : 'Teacher'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setMessage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

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
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setMessage(null);
                    }}
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
          </div>
        </div>
      )}
    </div>
  );
}