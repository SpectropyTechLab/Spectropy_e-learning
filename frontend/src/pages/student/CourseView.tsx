// src/pages/student/CourseView.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

interface ContentItem {
  id: number;
  parent_id: number | null;
  item_type: string;
  title: string;
  content_url: string | null;
}

export default function CourseView() {
  const { courseId } = useParams();
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get(`/student/courses/${courseId}/content`);
        setContent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, [courseId]);

  const renderContent = (parentId: number | null = null) => {
    return content
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.id - b.id)
      .map(item => (
        <div key={item.id} className="ml-4 mt-2">
          <div className="font-medium">{item.title}</div>
          {item.item_type === 'scorm' && item.content_url && (
            <button 
              onClick={() => launchScorm(item.id, item.content_url)}
              className="text-green-600 mt-1"
            >
              Launch SCORM
            </button>
          )}
          {renderContent(item.id)}
        </div>
      ));
  };

  const launchScorm = (contentItemId: number, url: string) => {
    // In real app: open SCORM player in iframe or new tab
    // For demo: simulate SCORM save
    alert(`Launching SCORM: ${url}`);
    
    // Simulate saving attempt
    api.post(`/student/scorm/${contentItemId}/save`, {
      score_raw: 90.5,
      completion_status: 'completed',
      total_time: '00:45:30',
      suspend_data: ''
    }).then(() => alert('SCORM data saved!'));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Course Content</h1>
      <div className="border p-4 rounded">
        {renderContent()}
      </div>
    </div>
  );
}