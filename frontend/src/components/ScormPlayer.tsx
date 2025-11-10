import React, { useEffect, useRef, useState } from "react";
import ScormAPI from "../utils/ScormAPIWrapper";
import { useAuth } from "../contexts/AuthContext";

interface Props {
    contentUrl: string;  // "8/1762712441564/res/index.html"
    contentId: number;
}

const ScormPlayer: React.FC<Props> = ({ contentUrl, contentId }) => {
    const { user } = useAuth();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [proxyUrl, setProxyUrl] = useState<string>("");

    useEffect(() => {
        if (!user || !contentUrl) return;

        // ✅ Initialize SCORM API (must be global!)
        const api = new ScormAPI(user.id, contentId);
        (window as any).API = api;

        // ✅ Fix any double slashes in contentUrl
        const cleanPath = contentUrl.replace(/^\/+/, "");

        // ✅ Build proxy URL for backend
        const backendBase = "http://localhost:5000/api/scorm";
        const finalUrl = `${backendBase}/${cleanPath}`;

        console.log("✅ SCORM Proxy URL:", finalUrl);

        setProxyUrl(finalUrl);

        return () => {
            api.LMSFinish();
            delete (window as any).API;
        };
    }, [user, contentUrl, contentId]);

    return (
        <div className="w-full h-screen bg-gray-100">
            {proxyUrl ? (
                <iframe
                    ref={iframeRef}
                    src={proxyUrl}
                    title="SCORM Content"
                    className="w-full h-full border-none"
                    allow="fullscreen"
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-600 text-lg">Loading SCORM content...</p>
                </div>
            )}
        </div>
    );
};

export default ScormPlayer;
