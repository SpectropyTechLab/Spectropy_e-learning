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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

 useEffect(() => {
  fetch('http://localhost:5000/api/courses') // ← removed /admin
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
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      <div className="space-y-3">
        {publishedCourses.length === 0 ? (
          <p>No published courses available.</p>
        ) : (
          publishedCourses.map((course) => (
            <div key={course.id} className="border p-4 rounded">
              <h2 className="font-semibold">{course.title}</h2>
              {course.description && <p>{course.description}</p>}
              <p className="text-sm text-gray-500">
                Published: Yes •{' '}
                Created: {new Date(course.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}