// src/pages/admin/CourseContent.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface ContentItem {
  id: number;
  course_id: number;
  parent_id: number | null;
  item_type: string;
  title: string;
  content_url?: string | null;
  order_index: number;
  created_at: string;
}

const ITEM_TYPES = [
  { value: 'folder', label: 'Chapter (Folder)' },
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Text/Lesson' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'scorm', label: 'SCORM Package' },
];

export default function CourseContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [chapters, setChapters] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingChapter, setAddingChapter] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [chapterItems, setChapterItems] = useState<Record<number, ContentItem[]>>({});

  useEffect(() => {
    fetchContent();
  }, [courseId]);

  const fetchContent = async () => {
    try {
      const res = await api.get(`/admin/courses/${courseId}/content`);
      // Top-level chapters (folders with parent_id = null)
      const topLevel = res.data.filter((item: ContentItem) => item.parent_id === null);
      setChapters(topLevel);

      // Group child items by parent_id
      const itemsByParent: Record<number, ContentItem[]> = {};
      res.data.forEach((item: ContentItem) => {
        if (item.parent_id) {
          if (!itemsByParent[item.parent_id]) itemsByParent[item.parent_id] = [];
          itemsByParent[item.parent_id].push(item);
        }
      });
      setChapterItems(itemsByParent);
    } catch (err) {
      console.error('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitle.trim()) return;

    try {
      await api.post(`/admin/courses/${courseId}/content`, {
        item_type: 'folder',
        title: chapterTitle.trim(),
        parent_id: null,
      });
      alert('Chapter created!');
      setChapterTitle('');
      setAddingChapter(false);
      fetchContent();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add chapter');
    }
  };

  const handleAddItem = async (parentId: number, type: string, title: string) => {
    if (!title.trim()) return;

    try {
      await api.post(`/admin/courses/${courseId}/content`, {
        item_type: type,
        title: title.trim(),
        parent_id: parentId,
      });
      alert('Item added!');
      fetchContent();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add item');
    }
  };

  const toggleChapter = (id: number) => {
    setExpandedChapter(expandedChapter === id ? null : id);
    if (expandedChapter !== id && !chapterItems[id]) {
      // Optionally pre-load items (already done in fetchContent)
    }
  };

  const handleBackToLogin = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Content</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/dashboard`)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Courses
          </button>
          <button
            onClick={handleBackToLogin}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ↪ Back to Login
          </button>
        </div>
      </div>

      {/* Add Chapter Form */}
      {!addingChapter ? (
        <button
          onClick={() => setAddingChapter(true)}
          className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add New Chapter
        </button>
      ) : (
        <form onSubmit={handleAddChapter} className="mb-6 flex gap-2">
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Chapter title (e.g., Introduction)"
            className="flex-1 p-2 border rounded"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Chapter
          </button>
          <button
            type="button"
            onClick={() => {
              setAddingChapter(false);
              setChapterTitle('');
            }}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Chapters List */}
      {loading ? (
        <p>Loading content...</p>
      ) : chapters.length === 0 ? (
        <p className="text-gray-500">No chapters added yet.</p>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="border rounded-lg overflow-hidden">
              <div
                className="p-3 bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => toggleChapter(chapter.id)}
              >
                <span className="font-semibold">{chapter.title}</span>
                <span className="text-xs text-gray-500">
                  {chapterItems[chapter.id]?.length || 0} items
                </span>
              </div>

              {expandedChapter === chapter.id && (
                <div className="p-4 bg-white">
                  {/* Add Item Form */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Add Content to "{chapter.title}"</h3>
                    <div className="flex gap-2">
                      <select
                        defaultValue="video"
                        className="p-2 border rounded"
                        id={`type-${chapter.id}`}
                      >
                        {ITEM_TYPES.filter(t => t.value !== 'folder').map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Item title"
                        className="flex-1 p-2 border rounded"
                        id={`title-${chapter.id}`}
                      />
                      <button
                        className="bg-indigo-600 text-white px-3 py-2 rounded text-sm"
                        onClick={() => {
                          const type = (
                            document.getElementById(`type-${chapter.id}`) as HTMLSelectElement
                          )?.value;
                          const title = (
                            document.getElementById(`title-${chapter.id}`) as HTMLInputElement
                          )?.value;
                          handleAddItem(chapter.id, type, title);
                          // Clear input
                          if (document.getElementById(`title-${chapter.id}`)) {
                            (document.getElementById(`title-${chapter.id}`) as HTMLInputElement).value = '';
                          }
                        }}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  {/* Chapter Items List */}
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Items:</h4>
                    {chapterItems[chapter.id]?.length ? (
                      <ul className="space-y-1">
                        {chapterItems[chapter.id].map((item) => (
                          <li key={item.id} className="text-sm">
                            <span className="font-medium">{item.title}</span> ({item.item_type})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">No items yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}