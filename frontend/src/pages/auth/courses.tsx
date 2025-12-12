// app/courses/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string | null;
  published: boolean | null;
  created_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

 useEffect(() => {
  const url = API_BASE 
      ? `${API_BASE}/api/course/courses` 
      : '/api/course/courses';

  fetch( url) // ← removed /admin
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error('Unexpected response format:', data);
        setCourses([]);
      }
    })
    .catch((err) => {
      console.error('Failed to load courses:', err);
      setCourses([]); // fallback to empty array
    });
}, []);

 // Filter to show only published courses
  const publishedCourses = courses.filter(course => course.published === true);
  
   return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
    
    {publishedCourses.length === 0 ? (
      <p>No published courses available.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {publishedCourses.map((course) => (
          <div
            key={course.id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <h2 className="font-bold text-lg text-gray-900 mb-2">
              {course.title.toUpperCase()}
            </h2>
           {course.description ? (
              <p
                className="text-gray-700 text-sm mb-3 line-clamp-3"
                title={course.description} // ✅ Full text on hover
              >
                {course.description}
              </p>
            ) : (
              <p className="text-gray-500 text-sm mb-3 italic">No description</p>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
}