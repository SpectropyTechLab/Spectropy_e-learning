// src/pages/student/Dashboard.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  description: string | null;
}

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/student/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">My Courses</h1>
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course.id} className="border p-4 rounded">
            <h2 className="text-xl">{course.title}</h2>
            <p>{course.description}</p>
            <Link to={`/student/course/${course.id}`} className="text-blue-500 mt-2 inline-block">
              View Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}