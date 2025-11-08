// src/pages/common/ContentViewer.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import ScormPlayer from '../../components/ScormPlayer.tsx';

interface ContentItem {
    id: number;
    item_type: string;
    title: string;
    content_url?: string | null;
}

export default function ContentViewer() {
    const { contentId } = useParams<{ contentId: string }>();
    const [content, setContent] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (contentId) fetchContent();
    }, [contentId]);

    const fetchContent = async () => {
        try {
            const res = await api.get(`/student/content/${contentId}`);
            console.log('Fetched content data:', res.data);
            setContent(res.data);
        } catch (err) {
            console.error('Failed to fetch content:', err);
            console.log('Content ID causing error:', contentId);
        } finally {
            setLoading(false);
        }
    };
    console.log("Content ID:", contentId);
    console.log("Content Data:", content);
    console.log("Loading State:", loading);
    if (loading) return <p className="p-6">Loading...</p>;
    if (!content) return <p className="p-6 text-red-500">Content not found.</p>;

    const { item_type, title, content_url } = content;

    // Handle based on content type
    let viewerElement;

    switch (item_type) {
        case 'video':
            viewerElement = (
                <video controls className="w-full max-h-[80vh] rounded-lg shadow">
                    <source src={content_url!} type="video/mp4" />
                    Your browser does not support video playback.
                </video>
            );
            break;

        case 'audio':
            viewerElement = (
                <audio controls className="w-full mt-4">
                    <source src={content_url!} type="audio/mpeg" />
                    Your browser does not support audio playback.
                </audio>
            );
            break;

        case 'pdf':
            viewerElement = (
                <iframe
                    src={content_url!}
                    title={title}
                    className="w-full h-[80vh] border rounded-lg"
                />
            );
            break;

        case 'scorm':
            viewerElement = (
                <div className="w-full h-[80vh] border rounded-lg overflow-hidden">
                    <ScormPlayer contentUrl={content_url!} />
                </div>
            );
            break;

        case 'text':
        default:
            viewerElement = (
                <div className="p-4 border rounded bg-gray-50">{title}</div>
            );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">{title}</h1>
            {viewerElement}
        </div>
    );
}
