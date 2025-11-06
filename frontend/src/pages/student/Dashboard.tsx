// src/pages/student/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Course {
  id: number;
  title: string;
  description: string | null;
}

interface Profile {
  grade: number | null;
  board: string | null;
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'courses' | 'bookmarks' | 'community'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<Profile>({ grade: null, board: null });
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const { logout} = useAuth();

  // Fetch profile and courses on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, coursesRes] = await Promise.all([
          api.get('/student/profile'),
          api.get('/student/courses'),
        ]);

        const profileData = profileRes.data;
        setProfile(profileData);
        setCourses(coursesRes.data);

        const complete = profileData.grade && profileData.board;
        setIsProfileComplete(complete);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put('/student/profile', {
        grade: profile.grade,
        board: profile.board,
      });

      setIsProfileComplete(true);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile({ ...profile, grade: Number(e.target.value) });
  };

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile({ ...profile, board: e.target.value });
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show profile completion form if incomplete
  if (!isProfileComplete) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <button
          onClick={handleBackToLogin}
          className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to Login
        </button>

        <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which Grade are you studying? <span className="text-red-500">*</span>
            </label>
            <select
              value={profile.grade || ''}
              onChange={handleGradeChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose Grade</option>
              {Array.from({ length: 13 }, (_, i) => i + 1).map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Board */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which Board are you studying? <span className="text-red-500">*</span>
            </label>
            <select
              value={profile.board || ''}
              onChange={handleBoardChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose Board</option>
              <option value="state">State Board</option>
              <option value="cbse">CBSE</option>
              <option value="ib">IB</option>
              <option value="icse">ICSE</option>
              <option value="igcse">IGCSE</option>
              <option value="others">Others</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-900 disabled:opacity-60 transition"
          >
            {submitting ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  // Render full dashboard with tabs
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={handleBackToLogin}
        className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Back to Login
      </button>

      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['courses', 'bookmarks', 'community'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'courses' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            {courses.length === 0 ? (
              <p className="text-gray-500">You are not enrolled in any courses yet.</p>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                  >
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {course.description || 'No description'}
                    </p>
                    <Link
                      to={`/student/course/${course.id}`}
                      className="mt-2 inline-block text-blue-600 hover:underline"
                    >
                      Start Learning →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Bookmarks</h2>
            <p className="text-gray-500">Your saved lessons and resources will appear here.</p>
            {/* You can later integrate API to fetch bookmarks */}
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Community</h2>
            <p className="text-gray-500">Join discussions, ask questions, and connect with peers.</p>
            {/* Later: embed forum, chat, or discussion threads */}
          </div>
        )}
      </div>
    </div>
  );
}