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
    const [content, setContent] = useState<ContentItem | null>(null);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null); // ✅ For signed URLs
    const [loading, setLoading] = useState(true);

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
            const res = await api.get(`/student/content/${contentId}`);
            const data = res.data;
            setContent(data);

            // ✅ For non-SCORM, get signed URL
            if (data.item_type !== 'scorm' && data.content_url) {
                const signedRes = await api.get(`/scorm/signed-url?path=${encodeURIComponent(data.content_url)}`);
                setMediaUrl(signedRes.data.url);
            } else {
                setMediaUrl(null);
            }
        } catch (err) {
            console.error('Failed to fetch content:', err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Loading states
    if (loading) return <p className="p-6">Loading...</p>;
    if (!content) return <p className="p-6 text-red-500">Content not found.</p>;

    const { item_type, title } = content;

    let viewerElement;
    console.log("this is commit",content);
    // ✅ SELECT VIEWER BASED ON TYPE
    switch (item_type) {
        case 'video':
            viewerElement = mediaUrl ? (
                <video controls className="w-full max-h-[80vh] rounded-lg shadow">
                    <source src={mediaUrl} type="video/mp4" />
                    Your browser does not support video playback.
                </video>
            ) : <p>Loading video...</p>;
            break;

        case 'audio':
            viewerElement = mediaUrl ? (
                <audio controls className="w-full mt-4">
                    <source src={mediaUrl} type="audio/mpeg" />
                    Your browser does not support audio playback.
                </audio>
            ) : <p>Loading audio...</p>;
            break;

        case 'pdf':
            viewerElement = mediaUrl ? (
                <iframe
                    src={mediaUrl}
                    title={title}
                    className="w-full h-[80vh] border rounded-lg"
                />
            ) : <p>Loading PDF...</p>;
            break;

        case "scorm":
            viewerElement = (
                <div >
                    <ScormPlayer contentUrl={content.content_url!} contentId={content.id} />
                </div>
            );
            break;

        default:
            viewerElement = <div className="p-4 border rounded bg-gray-50">{title}</div>;
            viewerElement = <div className="p-4 border rounded bg-gray-50">{title}</div>;
    }

    return (
        <div className="h-full p-6 w-full mx-auto">
            <h1 className="text-2xl font-semibold mb-4">{title}</h1>
            {viewerElement}
        </div>
    );
}