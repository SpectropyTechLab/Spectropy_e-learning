// src/pages/admin/admindashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Course {
  id: number;
  title: string;
  description: string | null;
  published: boolean;
  created_at: string;
}

export default function CourseStudents() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(true);

  // Fetch all courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setFetching(true);
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load courses');
    } finally {
      setFetching(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await api.post('/admin/courses', {
        title,
        description: description.trim() || null,
        published,
      });
      alert('Course created successfully!');
      setTitle('');
      setDescription('');
      setPublished(false);
      fetchCourses(); // Refresh list
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create course';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-900 hover:text-blue-600"
          >
            ← Back
          </button>
          <button
            onClick={handleBackToLogin}
            className="text-sm text-blue-900 hover:text-blue-600"
          >
            ↪ Back to Login
          </button>
        </div>
      </div>

      {/* Create Course Form */}
      <div className="bg-white p-4 rounded-lg border mb-8">
        <h2 className="text-lg font-semibold mb-3">Create New Course</h2>
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Optional course description"
              rows={3}
            />
          </div>

          {/* Publish Toggle + Create Button Row */}
          <div className="flex items-center justify-between pt-2">
            {/* Publish Toggle */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Publish Course</span>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${published ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                aria-label="Toggle publish"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
              <span className="ml-2 text-sm text-gray-600">
                {published ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Create Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>

      {/* Course List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">All Courses ({courses.length})</h2>
        {fetching ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No courses found.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex justify-between items-start p-3 border rounded"
              >
                <div>
                  <div className="font-medium">{course.title}</div>
                  {course.description && (
                    <div className="text-sm text-gray-600 mt-1">{course.description}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Created: {new Date(course.created_at).toLocaleDateString()}
                    {course.published && (
                      <span className="ml-2 text-green-600">● Published</span>
                    )}
                  </div>
                </div>

                {/* Right-aligned buttons */}
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => navigate(`/admin/courses/${course.id}/content`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Add course items
                  </button>
                  <button
                    onClick={() => navigate(`/admin/courses/${course.id}/enroll`)}
                    className="text-blue-900 hover:text-blue-600 text-sm font-medium"
                  >
                    Enroll Users
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}