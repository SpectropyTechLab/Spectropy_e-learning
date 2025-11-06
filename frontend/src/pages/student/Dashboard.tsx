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

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/student/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses');
      }
    };
    fetchCourses();
  }, []);

  const handleBackToLogin = async () => {
    await logout(); // Clear auth state (token, user, etc.)
    navigate('/login', { replace: true }); // Go to login, prevent back navigation
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
       <button
        onClick={handleBackToLogin}
        className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
      >
        ← Back to Login
      </button>
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You are not enrolled in any courses yet.</p>
          <p className="text-gray-400 mt-2">Courses you enroll in will appear here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
              <p className="text-gray-600 mt-2">
                {course.description || 'No description available'}
              </p>
              <div className="mt-4">
                <Link
                  to={`/student/course/${course.id}`}
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  Start Learning →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}