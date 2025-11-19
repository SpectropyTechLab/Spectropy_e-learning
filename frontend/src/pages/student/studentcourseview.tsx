// src/pages/student/StudentCourseView.tsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Outlet } from 'react-router-dom';

interface ContentItem {
  id: number;
  title: string;
  item_type: 'video' | 'pdf' | 'text' | 'scorm' | 'audio' | string;
  content_url: string | null;
}

interface Chapter {
  id: number;
  title: string;
  position: number;
  content_items: ContentItem[];
}

interface CourseData {
  id: number;
  title: string;
  description: string | null;
  chapters: Chapter[];
}

export default function StudentCourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!courseId) {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await api.get<CourseData>(`/student/course/${courseId}`);
        setCourse(res.data);
      } catch (err: any) {
        const msg = err.response?.data?.error || 'Failed to load course content.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const toggleChapter = (chapterId: number) => {
  const newExpanded = new Set(expandedChapters);
  if (newExpanded.has(chapterId)) {
    newExpanded.delete(chapterId);
  } else {
    newExpanded.add(chapterId);
  }
  setExpandedChapters(newExpanded);
};

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 bg-white border-r p-4">
          <Link to="/student/dashboard" className="text-blue-600 mb-4 inline-block">← Back</Link>
          <p>Loading course content...</p>
        </div>
        <div className="flex-1 p-6 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 bg-white border-r p-4">
          <Link to="/student/dashboard" className="text-blue-600 mb-4 inline-block">← Back</Link>
          <p className="text-red-600">Error: {error}</p>
        </div>
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 bg-white border-r p-4">
          <Link to="/student/dashboard" className="text-blue-600 mb-4 inline-block">← Back</Link>
          <p>Course not found.</p>
        </div>
        <div className="flex-1 p-6 flex items-center justify-center">
          <p>Course not found.</p>
        </div>
      </div>
    );
  }

  // Helper: Get all content items flat for Previous/Next
  const allContentItems = course.chapters.flatMap(chapter => chapter.content_items);

  // Find current content ID from URL (if any)
  const currentPath = window.location.pathname;
  const contentIdMatch = currentPath.match(/\/content\/(\d+)/);
  const currentContentId = contentIdMatch ? parseInt(contentIdMatch[1]) : null;

  // Get current index
  const currentIndex = currentContentId
    ? allContentItems.findIndex(item => item.id === currentContentId)
    : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevItem = allContentItems[currentIndex - 1];
      navigate(`content/${prevItem.id}`);
    }
  };

  const goToNext = () => {
    if (currentIndex < allContentItems.length - 1) {
      const nextItem = allContentItems[currentIndex + 1];
      navigate(`content/${nextItem.id}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT BAR - Navigation & Progress */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">courses view</h1>
        </div>

        {/* Chapters & Content Items List */}
<div className="flex-1 overflow-y-auto pr-2">
  {course.chapters.map((chapter) => (
    <div key={chapter.id} className="mb-3">
      {/* Chapter Header (Toggle) */}
      <div
        className="font-semibold text-lg mb-1.8 flex items-center cursor-pointer bg-gray-100 p-1 rounded"
        onClick={() => toggleChapter(chapter.id)}
      >
        <span className="mr-2">
          {expandedChapters.has(chapter.id) ? 'v' : '>'}
        </span>
        {chapter.title}
      </div>

      {/* Content Items (Only if expanded) */}
      {expandedChapters.has(chapter.id) && (
        <div className="pl-5 space-y-1.5">
          {chapter.content_items.map((item) => (
            <div
              key={item.id}
              className=" font-semibold text-lg mb-1.8 flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`content/${item.id}`)}
            >
              <span className="inline-flex w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] items-center justify-center">
                {item.item_type === 'video' ? '🎥' : 
                 item.item_type === 'pdf' ? '📄' : 
                 item.item_type === 'scorm' ? '📦' :
                 item.item_type === 'audio' ? '🔊' : '📝'}
              </span>
              <span className="text-xs truncate flex-1">{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>
     <div className="p-4 border-t border-gray-200">
          <Link to="/student/dashboard" className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-900 hover:text-blue-600">
          <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
             Back to My Courses
          </Link>
        </div>
      </div>

      {/* RIGHT BAR - Content Viewer */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex <= 0}
              className={`px-4 py-2 text-sm rounded ${
                currentIndex <= 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <span className="mr-1">◀</span> Previous
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= allContentItems.length - 1}
              className={`px-4 py-2 text-sm rounded ${
                currentIndex >= allContentItems.length - 1
                  ? 'bg-indigo-300 text-white cursor-not-allowed'
                  : 'bg-blue-900 text-white hover:bg-indigo-700'
              }`}
            >
              Next <span className="ml-1">▶</span>
            </button>
          </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}