// src/pages/common/ContentViewer.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ScormPlayer from "../../components/ScormPlayer.tsx";

interface ContentItem {
    id: number;
    item_type: string;
    title: string;
    content_url?: string | null;
}

interface ContentViewerProps {
    item?: ContentItem | null; // supports direct prop
}

export default function ContentViewer({ item }: ContentViewerProps) {
    const { contentId } = useParams<{ contentId: string }>();

    const [content, setContent] = useState<ContentItem | null>(item || null);
    const [loading, setLoading] = useState(!item);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);

    // ✅ Load media for the given content item
    const loadMedia = async (data: ContentItem) => {
        if (data.item_type !== "scorm" && data.content_url) {
            const signedRes = await api.get(
                `/scorm/signed-url?path=${encodeURIComponent(data.content_url)}`
            );
            setMediaUrl(signedRes.data.url);
        } else {
            setMediaUrl(null);
        }
    };

    // ✅ 1. IF item comes through props, update viewer each time
    useEffect(() => {
        if (item) {
            setLoading(true);
            setMediaUrl(null);      // ✅ IMPORTANT: Reset previous media!
            setContent(item);

            loadMedia(item).finally(() => setLoading(false));
        }
    }, [item]);

    // ✅ 2. Load content if route param is used (/content/:contentId)
    useEffect(() => {
        if (!item && contentId) {
            fetchContentFromAPI(contentId);
        }
    }, [contentId]);

    // ✅ Fetch content from API only for route-based view
    const fetchContentFromAPI = async (id: string) => {
        setLoading(true);
        setMediaUrl(null);  // ✅ prevent leaking previous media

        try {
            const res = await api.get(`/student/content/${id}`);
            const data = res.data;

            setContent(data);
            loadMedia(data);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Loading states
    if (loading) return <p className="p-6">Loading...</p>;
    if (!content) return <p className="p-6 text-red-500">Content not found.</p>;

    const { item_type, title, content_url } = content;

    let viewerElement;

    // ✅ SELECT VIEWER BASED ON TYPE
    switch (item_type) {
        case "video":
            viewerElement = (
                <video controls className="w-full max-h-[80vh] rounded-lg shadow">
                    <source src={mediaUrl ?? undefined} />
                </video>
            );
            break;

        case "audio":
            viewerElement = (
                <audio controls className="w-full mt-4">
                    <source src={mediaUrl ?? undefined} />
                </audio>
            );
            break;

        case "pdf":
            viewerElement = (
                <iframe
                    src={mediaUrl ?? undefined}
                    className="w-full h-[80vh] border rounded-lg"
                />
            );
            break;

        case "scorm":
            viewerElement = (
                <ScormPlayer
                    key={content.id} // ✅ FORCE FULL REMOUNT
                    contentUrl={content_url!}
                    contentId={content.id}
                />
            );
            break;

        default:
            viewerElement = <div className="p-4 border rounded bg-gray-50">{title}</div>;
    }

    return (
        <div className="h-full p-6 w-full mx-auto">
            <h1 className="text-2xl font-semibold mb-4">{title}</h1>
            {viewerElement}
        </div>
    );
}
