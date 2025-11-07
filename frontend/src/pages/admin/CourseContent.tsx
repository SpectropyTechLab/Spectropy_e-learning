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
  { value: 'audio', label: 'Audio File' },
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

  // State for item form
  const [itemType, setItemType] = useState<string>('video');
  const [itemTitle, setItemTitle] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAddItem = async (parentId: number) => {
  if (!itemTitle.trim()) {
    alert('Please enter a title');
    return;
  }

  try {
    if (['video', 'audio', 'pdf', 'scorm'].includes(itemType) && uploadMethod === 'upload') {
      // File upload path
      if (!selectedFile) {
        alert('Please select a file');
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('item_type', itemType);
      formData.append('title', itemTitle.trim());
      formData.append('parent_id', parentId.toString());

      await api.post(`/admin/courses/${courseId}/content/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Item uploaded and added!');
    } else {
      // Public URL or 'text' type
      let content_url = null;
      if (['video', 'audio', 'pdf', 'scorm'].includes(itemType) && uploadMethod === 'url') {
        if (!publicUrl.trim()) {
          alert('Please enter a public URL');
          return;
        }
        content_url = publicUrl.trim();
      }

      await api.post(`/admin/courses/${courseId}/content`, {
        item_type: itemType,
        title: itemTitle.trim(),
        parent_id: parentId,
        content_url,
      });
      alert('Item added!');
    }

    // Reset form
    setItemTitle('');
    setUploadMethod('upload');
    setSelectedFile(null);
    setPublicUrl('');
    fetchContent();
  } catch (err: any) {
    console.error('Add item error:', err);
    alert(err.response?.data?.error || 'Failed to add item');
  } finally {
    setIsUploading(false);
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

  // Helper: Get accepted file types based on item type
  const getAcceptTypes = (type: string) => {
    switch (type) {
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      case 'pdf':
        return '.pdf';
      case 'scorm':
        return '.zip,.scorm'; // Adjust as needed
      default:
        return '*';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Content</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/dashboard`)}
            className="text-blue-900 hover:text-blue-600"
          >
            ← Back to Courses
          </button>
          <button
            onClick={handleBackToLogin}
            className="text-sm text-blue-900 hover:text-blue-600"
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
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                    <div className="flex gap-2 mb-2">
                      <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        className="p-2 border rounded"
                      >
                        {ITEM_TYPES.filter(t => t.value !== 'folder').map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={itemTitle}
                        onChange={(e) => setItemTitle(e.target.value)}
                        placeholder="Item title"
                        className="flex-1 p-2 border rounded"
                      />
                    </div>

                    {/* Upload Method Toggle */}
                    {['video', 'audio', 'pdf', 'scorm'].includes(itemType) && (
                      <div className="mb-3">
                        <div className="flex items-center gap-4 mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`uploadMethod-${chapter.id}`}
                              checked={uploadMethod === 'upload'}
                              onChange={() => setUploadMethod('upload')}
                              className="mr-2"
                            />
                            Upload
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`uploadMethod-${chapter.id}`}
                              checked={uploadMethod === 'url'}
                              onChange={() => setUploadMethod('url')}
                              className="mr-2"
                            />
                            Public URL
                          </label>
                        </div>

                        {uploadMethod === 'upload' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept={getAcceptTypes(itemType)}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setSelectedFile(e.target.files[0]);
                                }
                              }}
                              className="p-2 border rounded"
                            />
                            <button
                              disabled={isUploading}
                              onClick={() => handleAddItem(chapter.id)}
                              className="bg-blue-900 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                            >
                              {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={publicUrl}
                              onChange={(e) => setPublicUrl(e.target.value)}
                              placeholder="Enter public URL"
                              className="flex-1 p-2 border rounded"
                            />
                            <button
                              onClick={() => handleAddItem(chapter.id)}
                              className="bg-blue-900 text-white px-3 py-2 rounded text-sm"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* For Text/Lesson, no upload needed */}
                    {itemType === 'text' && (
                      <button
                        onClick={() => handleAddItem(chapter.id)}
                        className="bg-indigo-600 text-white px-3 py-2 rounded text-sm"
                      >
                        Add Item
                      </button>
                    )}
                  </div>

                  {/* Chapter Items List */}
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Items:</h4>
                    {chapterItems[chapter.id]?.length ? (
                      <ul className="space-y-1">
                        {chapterItems[chapter.id].map((item) => (
                          <li key={item.id} className="text-sm">
                            <span className="font-medium">{item.title}</span> ({item.item_type})
                            {item.content_url && (
                              <a href={item.content_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 text-xs">
                                View
                              </a>
                            )}
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