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
  enrolled_learners?: number;
}

export default function CourseStudents() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'courses' | 'home' | 'users' | 'community'>('courses');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false); // NEW STATE

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

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'home' 
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7m-2 0l-2-2m-2 2l-2-2" />
            </svg>
            Home
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'courses' 
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Courses
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'users' 
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-5.356-5.356L12 18.644z" />
            </svg>
            Users
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'community' 
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2v-7h18v7a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-4c0-1.105 1.343-2 3-2h10c1.657 0 3 .895 3 2v4M3 19h18v-4c0-1.105-1.343-2-3-2H6c-1.657 0-3 .895-3 2v4z" />
            </svg>
            Community
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleBackToLogin}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-900 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 6v.01M6 6h.01M6 6h.01" />
            </svg>
            Logout
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
                {activeTab === 'courses' && 'Courses'}
                {activeTab === 'home' && 'Dashboard'}
                {activeTab === 'users' && 'Users'}
                {activeTab === 'community' && 'Community'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'courses' && 'Set up your courses and share your knowledge.'}
                {activeTab === 'home' && 'Welcome to your admin dashboard.'}
                {activeTab === 'users' && 'Manage your users and their activities.'}
                {activeTab === 'community' && 'Monitor community interactions and content.'}
              </p>
            </div>
            
            {activeTab === 'courses' && (
              <button
              onClick={() => setShowCreateForm(true)} // ALWAYS SHOW FORM
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Create Course
            </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {activeTab === 'courses' && (
            <div>
              {/* Search and Filters */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by Course Title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Add Filters
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <button className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
               
               {/* Create Course Modal */}
{showCreateForm && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Create New Course</h2>
        <button 
          onClick={() => setShowCreateForm(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleCreateCourse} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            placeholder="Enter course title"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            placeholder="Optional course description"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-3">Publish Course</span>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${published ? 'bg-green-500' : 'bg-gray-300'}`}
              aria-label="Toggle publish"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${published ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className="ml-2 text-sm text-gray-600">
              {published ? 'Published' : 'Draft'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
              
              {/* Course List */}
              <div>
                <h2 className="text-lg font-semibold mb-4">All Courses ({filteredCourses.length})</h2>
                {fetching ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No courses found. {searchQuery && `Try a different search term.`}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div key={course.id} className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Placeholder for course image */}
                        <div>
                          <div className="h-full flex items-center justify-center">
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                          {course.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                            {course.published && (
                              <span className="text-green-600">● Published</span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => navigate(`/admin/courses/${course.id}/details`)}
                              className="flex-1 text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Details
                            </button>
                            
                            <button
                              onClick={() => navigate(`/admin/courses/${course.id}/content`)}
                              className="flex-1 text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-.426 1.038-.426 1.464 0l1.514 1.514c1.038 1.038 1.038 2.704 0 3.742l-1.514 1.514a1.038 1.038 0 01-1.464 0l-1.514-1.514a1.038 1.038 0 010-1.464l1.514-1.514a1.038 1.038 0 011.464 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.75 12h-1.5a6 6 0 00-6-6h-1.5m-3 6a6 6 0 006 6h1.5m3-6a6 6 0 00-6-6h-1.5m12 12h-1.5a6 6 0 00-6-6h-1.5m3 6a6 6 0 006 6h1.5" />
                              </svg>
                              Add Items
                            </button>
                            
                            <button
                              onClick={() => navigate(`/admin/courses/${course.id}/enroll`)}
                              className="flex-1 text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-5.356-5.356L12 18.644z" />
                              </svg>
                              Enroll Users
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold mb-2">Welcome to the Admin Dashboard</h2>
              <p className="text-gray-600">Select a section from the left menu to get started.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold mb-2">User Management</h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold mb-2">Community Management</h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}