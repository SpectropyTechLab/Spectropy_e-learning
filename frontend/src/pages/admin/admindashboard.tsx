// src/pages/admin/admindashboard.tsx
import { useState, useEffect, type SetStateAction, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import logo from "/logo.png";
import { PiUsersBold } from "react-icons/pi";
import { RiHome2Line } from "react-icons/ri";
import { BiBookOpen } from "react-icons/bi";
import { PiChatsCircleBold } from "react-icons/pi";
import { FiUpload } from 'react-icons/fi';
import { GrChapterAdd } from "react-icons/gr";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [courseToPublish, setCourseToPublish] = useState<number | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filterRef = useRef<HTMLDivElement | null>(null);

  // Close filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      fetchCourses();
      setShowCreateForm(false);
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

  const openPublishModal = (courseId: SetStateAction<number | null>) => {
    setCourseToPublish(courseId);
    setPublishModalOpen(true);
  };

  const closePublishModal = () => {
    setPublishModalOpen(false);
    setCourseToPublish(null);
  };

  const handlePublish = async () => {
    if (courseToPublish === null) return;
    try {
      await api.patch(`/admin/courses/${courseToPublish}/publish`);
      await fetchCourses();
      closePublishModal();
    } catch (err) {
      console.error('Failed to publish course:', err);
      alert('Failed to publish course. Please try again.');
    }
  };

  // 🔍 Final filtered list (search + status filter)
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
          ? course.published
          : !course.published;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src={logo} alt="Spectropy Logo" className="h-10 w-auto md:h-10 lg:h-12 rounded-md" />
          </div>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'home'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <RiHome2Line className="text-lg text-black mr-3" />
            Home
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'courses'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <BiBookOpen className="text-lg text-black mr-3" />
            Courses
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'users'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <PiUsersBold className="text-lg text-black mr-3" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'community'
                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <PiChatsCircleBold className="text-lg text-black mr-3" />
            Community
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleBackToLogin}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-900 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Right Panel */}
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
                onClick={() => setShowCreateForm(true)}
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
              {/* Search + Filters + View mode */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by Course Title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="flex gap-2 items-center">
                  {/* Filter Dropdown */}
                  <div ref={filterRef} className="relative">
                    <button
                      onClick={() => setShowFilters((prev) => !prev)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                    >
                      Filters
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showFilters && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-lg p-3 z-50">
                        <label className="text-xs font-semibold text-gray-600">Published Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => {
                            const val = e.target.value as 'all' | 'published' | 'draft';
                            setStatusFilter(val);
                            setShowFilters(false); // close on select
                          }}
                          className="w-full p-2 mt-1 border rounded text-sm"
                        >
                          <option value="all">All Courses</option>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Grid View Button */}
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 border rounded-lg ${viewMode === 'grid'
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    title="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v6H4zM14 16h6v6h-6z"
                      />
                    </svg>
                  </button>

                  {/* List View Button */}
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 border rounded-lg ${viewMode === 'list'
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    title="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Create Course Modal */}
              {showCreateForm && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Create New Course</h2>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close form"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
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
                <h2 className="text-lg font-semibold mb-4">
                  All Courses ({filteredCourses.length})
                </h2>

                {fetching ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900" />
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No courses found. {searchQuery && `Try a different search term or clear filters.`}
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow ${viewMode === 'list' ? 'p-4 flex items-center justify-between gap-4' : 'overflow-hidden'
                          }`}
                      >
                        {viewMode === 'list' ? (
                          // LIST VIEW
                          <>
                            {/* Left Side: Title + Date + Status */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div>
                                <h3 className="font-semibold text-base sm:text-lg">
                                  {course.title}
                                </h3>
                                {course.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                                    {course.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>
                                  Created: {new Date(course.created_at).toLocaleDateString()}
                                </span>
                                {course.published && (
                                  <span className="text-green-600 font-medium">● Published</span>
                                )}
                              </div>
                            </div>

                            {/* Right Side: Buttons */}
                            <div className="flex flex-wrap gap-2 justify-end">
                              {!course.published && (
                                <button
                                  onClick={() => openPublishModal(course.id)}
                                  className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50 flex items-center gap-1"
                                >
                                  <FiUpload className="text-sm" />
                                  <span>Publish</span>
                                </button>
                              )}

                              <button
                                onClick={() => navigate(`/admin/courses/${course.id}/content`)}
                                className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50 flex items-center gap-1"
                              >
                                <GrChapterAdd className="text-sm" />
                                <span>Add Items</span>
                              </button>

                              <button
                                onClick={() => navigate(`/admin/courses/${course.id}/enroll`)}
                                className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50 flex items-center gap-1"
                              >
                                <PiUsersBold className="text-sm" />
                                <span>Enroll Users</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          // GRID VIEW
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                            {course.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {course.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                              <span>
                                Created: {new Date(course.created_at).toLocaleDateString()}
                              </span>
                              {course.published && (
                                <span className="text-green-600">● Published</span>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              {!course.published && (
                                <button
                                  onClick={() => openPublishModal(course.id)}
                                  className="flex-1 text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                                >
                                  <FiUpload className="text-sm" />
                                  <span>Publish</span>
                                </button>
                              )}

                              <button
                                onClick={() => navigate(`/admin/courses/${course.id}/content`)}
                                className="flex-1 text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                              >
                                <GrChapterAdd className="text-sm" />
                                <span>Add Items</span>
                              </button>

                              <button
                                onClick={() => navigate(`/admin/courses/${course.id}/enroll`)}
                                className="flex-1 text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                              >
                                <PiUsersBold className="text-sm" />
                                <span>Enroll Users</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {publishModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
                    <h3 className="text-lg font-semibold mb-3">Publish Course?</h3>
                    <p className="text-gray-700 mb-5">
                      Are you sure you want to publish this course? It will become visible to learners.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={closePublishModal}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        No
                      </button>
                      <button
                        onClick={handlePublish}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Yes, Publish
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
