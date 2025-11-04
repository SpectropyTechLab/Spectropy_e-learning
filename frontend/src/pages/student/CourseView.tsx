// src/pages/student/CourseView.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface ContentItem {
  id: number;
  parent_id: number | null;
  item_type: string;
  title: string;
  content_url: string | null;
  order_index: number;
}

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!courseId) {
        setError('Invalid course ID');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/student/courses/${courseId}/content`);
        setContent(res.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to load course content:', err);
        setError(err.response?.data?.error || 'Failed to load course content');
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseId]);

  const renderContent = (parentId: number | null = null) => {
    return content
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.order_index - b.order_index || a.id - b.id)
      .map(item => (
        <div key={item.id} className="ml-4 mt-2">
          <div className="flex items-center">
            {item.item_type === 'folder' ? (
              <span className="mr-2">📁</span>
            ) : item.item_type === 'video' ? (
              <span className="mr-2">🎥</span>
            ) : item.item_type === 'pdf' ? (
              <span className="mr-2">📄</span>
            ) : item.item_type === 'text' ? (
              <span className="mr-2">📝</span>
            ) : item.item_type === 'scorm' ? (
              <span className="mr-2">🎓</span>
            ) : null}
            <span className="font-medium">{item.title}</span>
          </div>
          
          {item.item_type === 'scorm' && item.content_url && (
            <button 
              onClick={() => launchScorm(item.id, item.content_url!)}
              className="ml-6 mt-1 text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              <span>▶ Launch SCORM</span>
            </button>
          )}
          
          {item.item_type === 'video' && item.content_url && (
            <button 
              onClick={() => launchVideo(item.content_url!)}
              className="ml-6 mt-1 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <span>▶ Watch Video</span>
            </button>
          )}
          
          {item.item_type === 'pdf' && item.content_url && (
            <a 
              href={item.content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-6 mt-1 text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
            >
              📄 Open PDF
            </a>
          )}
          
          {renderContent(item.id)}
        </div>
      ));
  };

  const launchScorm = (contentItemId: number, url: string) => {
    // In production, you'd open a SCORM player in a modal or new tab
    // For now, simulate SCORM launch and save
    const confirmed = window.confirm(`Launch SCORM package: ${url}?`);
    if (!confirmed) return;

    // Simulate SCORM runtime data
    const scormData = {
      score_raw: 90.5,
      completion_status: 'completed',
      total_time: '00:45:30',
      suspend_data: '',
      success_status: 'passed'
    };

    // Save to backend
    api.post(`/student/scorm/${contentItemId}/save`, scormData)
      .then(() => {
        alert('SCORM activity completed! Progress saved.');
      })
      .catch(err => {
        console.error('Failed to save SCORM data:', err);
        alert('SCORM completed, but failed to save progress.');
      });
  };

  const launchVideo = (url: string) => {
    // Open video in new tab (or embed in modal for better UX)
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl mb-4">Loading Course...</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded ml-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl mb-4">Course Error</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="mt-3 text-blue-600 hover:text-blue-800"
          >
            ← Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Content</h1>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Courses
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
        {content.length === 0 ? (
          <p className="text-gray-500">No content available for this course yet.</p>
        ) : (
          <div className="space-y-2">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
}