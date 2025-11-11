import React, { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
} from "@hello-pangea/dnd";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

import {
    FaVideo,
    FaFilePdf,
    FaFileAlt,
    FaMusic,
    FaFolder,
    FaBoxOpen
} from "react-icons/fa";

interface CourseItem {
    id: number;
    course_id: number;
    parent_id: number | null;
    item_type: string;
    title: string;
    content_url?: string | null;
    order_index: number;
    created_at: string;
}

interface Chapter {
    id: number;
    title: string;
    items: CourseItem[];
}

interface Props {
    chapters: Chapter[];
    onSelectItem: (item: CourseItem) => void;
    onAddChapter: () => void;
    onAddItem: (chapterId: number) => void;
    onReorderChapters: (newChapters: Chapter[]) => void;
    onReorderItems: (chapterId: number, newItems: CourseItem[]) => void;
}

const LeftPanel: React.FC<Props> = ({
    chapters,
    onSelectItem,
    onAddChapter,
    onAddItem,
    onReorderChapters,
    onReorderItems,
}) => {
    const [expanded, setExpanded] = useState<number | null>(null);
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [openItemMenu, setOpenItemMenu] = useState<number | null>(null);

    const toggleExpand = (chapterId: number) => {
        setExpanded(expanded === chapterId ? null : chapterId);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case "video":
                return <FaVideo className="text-blue-600" />;
            case "pdf":
                return <FaFilePdf className="text-red-600" />;
            case "audio":
                return <FaMusic className="text-purple-600" />;
            case "text":
                return <FaFileAlt className="text-gray-700" />;
            case "scorm":
                return <FaBoxOpen className="text-green-600" />;
            default:
                return <FaFolder className="text-gray-500" />;
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;

        if (type === "CHAPTER") {
            const reordered = Array.from(chapters);
            const [moved] = reordered.splice(source.index, 1);
            reordered.splice(destination.index, 0, moved);
            onReorderChapters(reordered);
            return;
        }

        if (type.startsWith("ITEM-")) {
            const chapterId = parseInt(type.split("-")[1]);
            const chapter = chapters.find((c) => c.id === chapterId);
            if (!chapter) return;

            const reorderedItems = Array.from(chapter.items);
            const [movedItem] = reorderedItems.splice(source.index, 1);
            reorderedItems.splice(destination.index, 0, movedItem);

            onReorderItems(chapterId, reorderedItems);
        }
    };

    return (
        <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">

            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-lg font-semibold">Course Content</h1>

                <button
                    onClick={onAddChapter}
                    className="flex items-center gap-1 px-2 py-1 bg-maincolor hover:bg-lightmain text-white rounded-md text-sm"
                >
                    <MdAdd className="text-lg" />
                    Add Chapter
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="chapters" type="CHAPTER">
                    {(provided) => (
                        <div className="p-3" {...provided.droppableProps} ref={provided.innerRef}>

                            {chapters.map((chapter, chapterIndex) => (
                                <Draggable
                                    key={chapter.id}
                                    draggableId={`chapter-${chapter.id}`}
                                    index={chapterIndex}
                                >
                                    {(dragProvided) => (
                                        <div
                                            ref={dragProvided.innerRef}
                                            {...dragProvided.draggableProps}
                                            className="mb-3 border border-gray-300 rounded-lg bg-white"
                                        >

                                            {/* Chapter Header */}
                                            <div
                                                className="flex justify-between items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-t-lg cursor-pointer"
                                            >
                                                <div
                                                    className="flex items-center gap-2 flex-1"
                                                    onClick={() => toggleExpand(chapter.id)}
                                                >
                                                    {expanded === chapter.id ? (
                                                        <FiChevronDown className="text-xl" />
                                                    ) : (
                                                        <FiChevronRight className="text-xl" />
                                                    )}
                                                    <span className="font-medium">{chapter.title}</span>
                                                </div>

                                                <div
                                                    {...dragProvided.dragHandleProps}
                                                    className="px-1 cursor-move text-gray-500 hover:text-black"
                                                >
                                                    ::
                                                </div>

                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenu(openMenu === chapter.id ? null : chapter.id);
                                                    }}
                                                    className="relative"
                                                >
                                                    <BsThreeDotsVertical className="text-gray-600 hover:text-black cursor-pointer" />

                                                    {openMenu === chapter.id && (
                                                        <div className="absolute right-0 top-6 bg-white border shadow-md rounded-md w-32 z-20">
                                                            <button className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-sm">
                                                                Rename
                                                            </button>
                                                            <button className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-sm">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ITEM LIST */}
                                            {expanded === chapter.id && (
                                                <Droppable
                                                    droppableId={`items-${chapter.id}`}
                                                    type={`ITEM-${chapter.id}`}
                                                >
                                                    {(dropProvided) => (
                                                        <div
                                                            className="px-4 py-2 bg-white border-t border-gray-300"
                                                            ref={dropProvided.innerRef}
                                                            {...dropProvided.droppableProps}
                                                        >
                                                            {chapter.items.map((item, itemIndex) => (
                                                                <Draggable
                                                                    key={item.id}
                                                                    draggableId={`item-${chapter.id}-${item.id}`}
                                                                    index={itemIndex}
                                                                >
                                                                    {(itemProvided) => (
                                                                        <div
                                                                            ref={itemProvided.innerRef}
                                                                            {...itemProvided.draggableProps}
                                                                            {...itemProvided.dragHandleProps}
                                                                            className="flex justify-between items-center p-2 my-1 rounded border border-gray-200 relative group hover:bg-blue-50 cursor-pointer"
                                                                        >

                                                                            <div
                                                                                className="flex items-center gap-2"
                                                                                onClick={() => onSelectItem(item)}
                                                                            >
                                                                                {getIconForType(item.item_type)}
                                                                                <span className="text-gray-700 font-medium">
                                                                                    {item.title}
                                                                                </span>
                                                                            </div>

                                                                            <div
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setOpenItemMenu(openItemMenu === item.id ? null : item.id);
                                                                                }}
                                                                                className="opacity-0 group-hover:opacity-100 transition"
                                                                            >
                                                                                <BsThreeDotsVertical className="text-gray-500 hover:text-black cursor-pointer" />
                                                                            </div>

                                                                            {openItemMenu === item.id && (
                                                                                <div className="absolute right-2 top-10 w-32 bg-white shadow-md border rounded-md z-50">
                                                                                    <button
                                                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            alert("Rename item " + item.id);
                                                                                            setOpenItemMenu(null);
                                                                                        }}
                                                                                    >
                                                                                        Rename
                                                                                    </button>

                                                                                    <button
                                                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            alert("Delete item " + item.id);
                                                                                            setOpenItemMenu(null);
                                                                                        }}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}

                                                            {dropProvided.placeholder}

                                                            <button
                                                                onClick={() => onAddItem(chapter.id)}
                                                                className="text-blue-600 text-sm mt-2 hover:underline"
                                                            >
                                                                + Add item
                                                            </button>
                                                        </div>
                                                    )}
                                                </Droppable>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default LeftPanel;
