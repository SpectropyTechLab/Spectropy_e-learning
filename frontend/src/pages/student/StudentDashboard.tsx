// src/pages/student/StudentDashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface EnrolledCourse {
  id: number;
  title: string;
  description: string | null;
  enrolled_at: string;
}

export default function StudentDashboard() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await api.get<EnrolledCourse[]>('/student/enrolled-courses');
        setCourses(res.data);
      } catch (err: any) {
        console.error('Failed to load courses:', err);
        alert('Failed to load your courses. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);
 
  const handleBackToLogin = async () => {
    await logout();
    navigate('/login', { replace: true });
  }; 

 return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — fixed width, no toggle */}
      <aside className="bg-white border-r w-64">
        <div className="p-4 border-b">
          <h1 className="font-bold text-lg">Student Portal</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/student/dashboard"
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-blue-900 font-medium"
              >
                <span>📊</span>
                <span>Course</span>
              </Link>
            </li>
            <li>
              <Link
                to="/student/profile"
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-gray-700"
              >
                <span>👤</span>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleBackToLogin}
                className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-red-50 text-red-600"
              >
                <span>↪</span>
                <span>Back to Login</span>
              </button>
            </li>
            
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold mb-6">Active Courses</h1>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">You are not enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="bg-gray-100 h-32 flex items-center justify-center">
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold text-sm">{course.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.description || 'Instructor: Not specified'}
                    </p>

                    <Link
                      to={`/student/course/${course.id}`}
                      className="mt-4 w-full text-center bg-blue-900 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 font-medium block"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}