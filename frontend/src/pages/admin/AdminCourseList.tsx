// src/pages/admin/AdminCourseList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Course {
  id: number;
  title: string;
}

export default function AdminCourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/admin/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <h2 className="text-xl mb-4">Manage Course Enrollments</h2>
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-4 border rounded-lg hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/admin/courses/${course.id}/students`)}
            >
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">Click to manage students</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}