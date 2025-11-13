// ✅ src/pages/admin/CourseContent.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import LeftPanel from "../../components/CourseContent/LeftPanel"; // ✅ IMPORT LEFT PANEL
import ContentViewer from "../common/ContentViewer";

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
  { value: "folder", label: "Chapter (Folder)" },
  { value: "video", label: "Video" },
  { value: "text", label: "Text/Lesson" },
  { value: "pdf", label: "PDF Document" },
  { value: "scorm", label: "SCORM Package" },
  { value: "audio", label: "Audio File" },
];

export default function CourseContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [rawItems, setRawItems] = useState<ContentItem[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  // ✅ Add Item Modal
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [itemType, setItemType] = useState("video");
  const [itemTitle, setItemTitle] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [publicUrl, setPublicUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);


  // ✅ Add Chapter Modal
  const [chapterTitle, setChapterTitle] = useState("");
  const [addingChapter, setAddingChapter] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [courseId]);

  // ✅ FETCH CONTENT + TRANSFORM INTO CHAPTER STRUCTURE
  const fetchContent = async () => {
    try {
      const res = await api.get(`/admin/courses/${courseId}/content`);
      const items = res.data;
      setRawItems(items);   //set raw items from  course to state


      // ✅ Build chapters → items mapping
      const topChapters = items.filter((i: ContentItem) => i.parent_id === null);//sets the top chapters with no parent id
      const chapterMap: any[] = topChapters.map((chapter: ContentItem) => ({
        id: chapter.id,
        title: chapter.title,
        items: items.filter((i: ContentItem) => i.parent_id === chapter.id),

      }));
      setChapters(chapterMap); //sets the chapters with their respective items to state
    } catch (err) {
      console.error("Failed to load course content", err);
    }
  };

  // ✅ ADD CHAPTER
  const handleAddChapter = async () => {
    if (!chapterTitle.trim()) return alert("Enter a chapter title");

    await api.post(`/admin/courses/${courseId}/content`, {
      item_type: "folder",
      title: chapterTitle.trim(),
      parent_id: null,
    });

    setChapterTitle("");
    setAddingChapter(false);
    fetchContent();
  };

  // ✅ ADD ITEM TO CHAPTER
  const handleAddItem = async (chapterId: number) => {
    if (!itemTitle.trim()) return alert("Enter a title");

    const formData = new FormData();
    formData.append("item_type", itemType);
    formData.append("title", itemTitle);
    formData.append("parent_id", chapterId.toString());

    if (uploadMethod === "upload" && selectedFile) {
      formData.append("file", selectedFile);

      await api.post(
        `/admin/courses/${courseId}/content/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      await api.post(`/admin/courses/${courseId}/content`, {
        item_type: itemType,
        title: itemTitle,
        parent_id: chapterId,
        content_url: publicUrl.trim(),
      });
    }

    setItemTitle("");
    setSelectedFile(null);
    setPublicUrl("");
    setShowAddItemModal(false);
    fetchContent();
  };

  // ✅ DRAG & DROP — REORDER CHAPTERS
  const handleReorderChapters = async (newOrder: any[]) => {
    setChapters(newOrder);
    // TODO: send reordered array to backend
  };

  // ✅ DRAG & DROP — REORDER ITEMS
  const handleReorderItems = async (chapterId: number, newItems: any[]) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, items: newItems } : ch
      )
    );
    // TODO: send reordered items to backend
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* HEADER */}
      <div className="w-full flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-2xl font-semibold">Course Content</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-lg hover:text-lightmain"
        >
          Back to Courses
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1">

        {/* ✅ LEFT PANEL */}
        <div className="w-[320px] border-r bg-white">
          <LeftPanel
            chapters={chapters}
            onSelectItem={(item: ContentItem) => {
              console.log("Selected item:", item);
              setSelectedItem(item);        // ✅ store the entire item
            }}

            onAddChapter={() => setAddingChapter(true)}
            onAddItem={(id) => {
              setSelectedChapter(id);
              setShowAddItemModal(true);
            }}
            onReorderChapters={handleReorderChapters}
            onReorderItems={handleReorderItems}
          />
        </div>

        {/* ✅ RIGHT SIDE — VIEW CONTENT */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">

          {!selectedItem ? (
            <p className="text-gray-400 text-center mt-20">
              Select a chapter from the left panel →
            </p>
          ) : (
            <ContentViewer item={selectedItem} />
          )}
        </div>
      </div>

      {/* ✅ ADD ITEM MODAL */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Item</h3>

            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              {ITEM_TYPES.filter((t) => t.value !== "folder").map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Item title"
              className="w-full p-2 border rounded mb-3"
            />

            {["video", "audio", "pdf", "scorm"].includes(itemType) && (
              <>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={uploadMethod === "upload"}
                      onChange={() => setUploadMethod("upload")}
                      className="mr-2"
                    />
                    Upload
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={uploadMethod === "url"}
                      onChange={() => setUploadMethod("url")}
                      className="mr-2"
                    />
                    Public URL
                  </label>
                </div>

                {uploadMethod === "upload" ? (
                  <input
                    type="file"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="w-full p-2 border rounded mb-3"
                  />
                ) : (
                  <input
                    type="url"
                    value={publicUrl}
                    onChange={(e) => setPublicUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="w-full p-2 border rounded mb-3"
                  />
                )}
              </>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (selectedChapter !== null) {
                    handleAddItem(selectedChapter);
                  }
                }}
                className="px-4 py-2 bg-blue-900 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADD CHAPTER MODAL */}
      {addingChapter && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Chapter</h3>

            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="Chapter title"
              className="w-full p-2 border rounded mb-3"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setAddingChapter(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddChapter}
                className="px-4 py-2 bg-blue-900 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}