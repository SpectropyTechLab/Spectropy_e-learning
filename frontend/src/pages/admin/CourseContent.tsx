// ✅ src/pages/admin/CourseContent.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import LeftPanel from "../../components/CourseContent/LeftPanel"; // ✅ IMPORT LEFT PANEL
import ContentViewer from "../common/ContentViewer";
import { SlControlPlay, SlControlRewind } from "react-icons/sl";

interface ContentItem {
  id: number;
  course_id: number;
  parent_id: number | null;
  item_type: string;
  title: string;
  content_url?: string | null;
  order_index: number;
  created_at: string;
  completion_status?: string | null; // 👈 ADD THIS

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

  const [allItems, setAllItems] = useState<ContentItem[]>([]);



  const items = allItems;
  const currentIndex = items.findIndex(i => i.id === selectedItem?.id);

  const isFirstItem = currentIndex === 0;
  const isLastItem = currentIndex === items.length - 1;


  const { user } = useAuth();

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

      // 🔥 store raw list

      // ✅ Build chapters → items mapping
      const topChapters = items.filter((i: ContentItem) => i.parent_id === null);//sets the top chapters with no parent id
      const chapterMap: any[] = topChapters.map((chapter: ContentItem) => ({
        id: chapter.id,
        title: chapter.title,
        items: items.filter((i: ContentItem) => i.parent_id === chapter.id),

      }));

      setChapters(chapterMap); //sets the chapters with their respective items to state

      // 🔥 set all items for progress tracking
      setAllItems(items.filter((i: ContentItem) => i.item_type !== "folder"));
    } catch (err) {
      console.error("Failed to load course content", err);
    }
    finally {
      // Any final steps if needed
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
  // ✅ update the item as completed
  const markItemCompleted = async (itemId: number) => {
    try {
      await api.post(`/student/item-attempt`, {
        content_item_id: itemId,
        completion_status: "completed"
      });
    } catch (err) {
      console.error("❌ Failed to mark item completed", err);
    }
  };


  const goToNext = async () => {
    if (!selectedItem) return;

    const index = items.findIndex(i => i.id === selectedItem.id);
    await markItemCompleted(selectedItem.id);
    if (user?.role === "student") {
      await markItemCompleted(selectedItem.id);
    }
    // 🔥 Update chapters state
    setChapters(prev =>
      prev.map((ch: any) => ({
        ...ch,
        items: ch.items.map((i: ContentItem) =>
          i.id === selectedItem?.id
            ? { ...i, completion_status: "completed" }
            : i
        )
      }))
    );


    // 🔥 Update ALL ITEMS (progress bar source)
    setAllItems(prev =>
      prev.map(i =>
        i.id === selectedItem.id
          ? { ...i, completion_status: "completed" }
          : i
      )
    );


    if (index < items.length - 1) {
      setSelectedItem(items[index + 1]);
    }
  };



  const goToPrevious = () => {
    if (!selectedItem) return;

    const index = items.findIndex(i => i.id === selectedItem.id);

    if (index > 0) {
      setSelectedItem(items[index - 1]);
    }
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
  console.log("************************************************************************************************************\nRendering CourseContent with items:", items);
  return (
    <div className="w-full h-screen flex flex-col">

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 min-h-0 ">

        {/* ✅ LEFT PANEL */}
        <div className=" w-[320px] border-r bg-white shrink-0">
          <LeftPanel
            chapters={chapters}
            allItems={items}
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
        <div className="flex-1 bg-white  shrink-0 overflow-y-none flex flex-col">
          {/* HEADER */}
          <div className="w-full flex justify-between items-center px-4 pt-4 pb-2.5 border-b border-gray-200 ">
            <h1 className="text-xl font-semibold ">{selectedItem ? selectedItem.title.toUpperCase() : ""}</h1>


            {/* RIGHT SIDE — PREVIOUS / NEXT */}
            <div className="flex items-center gap-4">

              {/* PREVIOUS BUTTON */}
              <button
                onClick={goToPrevious}
                disabled={!selectedItem || isFirstItem}
                className={`flex items-center gap-2 py-2 rounded-md border justify-center
  transition-all duration-200 text-xs bg-maincolor text-white w-20
  ${!selectedItem || isFirstItem
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-lightmain hover:border-gray-300 active:scale-95"
                  }`}
              >
                <SlControlRewind /> Previous
              </button>



              {/* NEXT BUTTON */}
              <button
                onClick={goToNext}
                disabled={!selectedItem || isLastItem}
                className={`flex items-center gap-2 py-2 rounded-md border justify-center
  transition-all duration-200 text-xs bg-maincolor text-white w-20
  ${!selectedItem || isLastItem
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-lightmain hover:border-gray-300 active:scale-95"
                  }`}
              >
                Next <SlControlPlay />
              </button>



            </div>
          </div>

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