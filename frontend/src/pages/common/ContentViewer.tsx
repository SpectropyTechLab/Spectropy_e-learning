// src/pages/common/ContentViewer.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ScormPlayer from "../../components/ScormPlayer";

interface ContentItem {
    id: number;
    item_type: string;
    title: string;
    content_url?: string | null;
}

interface ContentViewerProps {
    item?: ContentItem | null; // direct injection support
}

export default function ContentViewer({ item }: ContentViewerProps) {
    const { contentId } = useParams<{ contentId: string }>();

    const [content, setContent] = useState<ContentItem | null>(item || null);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // If item is passed directly (from a list), do NOT fetch
        if (item) {
            setLoading(true);
            setMediaUrl(null);
            setContent(item);
            handleSignedUrl(item);
            return;
        }

        // Route-based content loading
        if (contentId) fetchContentFromAPI(contentId);
    }, [contentId, item]);

    /** -----------------------------------------------------
     *  FETCH CONTENT BY ID (Route-based only)
     * ---------------------------------------------------- */
    const fetchContentFromAPI = async (id: string) => {
        try {
            setLoading(true);
            setMediaUrl(null);

            const res = await api.get(`/student/content/${id}`);
            const data: ContentItem = res.data;
            setContent(data);

            await handleSignedUrl(data);
        } catch (err) {
            console.error("❌ Failed to fetch content:", err);
        } finally {
            setLoading(false);
        }
    };

    /** -----------------------------------------------------
     *  Generate Signed URL for NON-SCORM content
     * ---------------------------------------------------- */
    const handleSignedUrl = async (content: ContentItem) => {
        console.log("generated content url for:", content.content_url);
        if (!content.content_url) return;



        try {
            const signedRes = await api.get(`/scorm/signed-url?path=${encodeURIComponent(content.content_url)}`);
            setMediaUrl(signedRes.data.url);
        } catch (err) {
            console.error("❌ Failed to get signed URL:", err);
        } finally {
            setLoading(false);
        }
    };

    /** -----------------------------------------------------
     *  Loading / Error UI
     * ---------------------------------------------------- */
    if (loading) return <p className="p-6">Loading...</p>;
    if (!content) return <p className="p-6 text-red-500">Content not found.</p>;

    const { item_type, title } = content;
    let viewerElement = null;

    /** -----------------------------------------------------
     *  CONTENT RENDERER (Based on Type)
     * ---------------------------------------------------- */
    switch (item_type) {
        case "video":
            viewerElement = mediaUrl ? (
                <video controls className="w-full max-h-[80vh] rounded-lg shadow">
                    <source src={mediaUrl} type="video/mp4" />
                </video>
            ) : (
                <p>Loading video...</p>
            );
            break;

        case "audio":
            viewerElement = mediaUrl ? (
                <audio controls className="w-full mt-4">
                    <source src={mediaUrl} type="audio/mpeg" />
                </audio>
            ) : (
                <p>Loading audio...</p>
            );
            break;

        case "pdf":
            viewerElement = mediaUrl ? (
                <iframe
                    src={mediaUrl}
                    title={title}
                    className="w-full h-[80vh] border rounded-lg"
                />
            ) : (
                <p>Loading PDF...</p>
            );
            break;

        case "scorm":
            viewerElement = (
                <div >
                    <ScormPlayer
                        contentUrl={content.content_url!}
                        contentId={content.id}
                    />
                </div>
            );
            break;

        default:
            viewerElement = (
                <div className="p-4 border rounded bg-gray-50">
                    {title}
                </div>
            );
    }
    console.log("content viewer rendered");
    /** -----------------------------------------------------
     *  FINAL RENDER
     * ---------------------------------------------------- */
    return (
        <div className="h-full p-6 w-full mx-auto">
            <h1 className="text-2xl font-semibold mb-4">{title}</h1>
            {viewerElement}
        </div>
    );
}
