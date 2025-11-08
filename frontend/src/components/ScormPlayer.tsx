// src/pages/student/ScormPlayer.tsx
import React, { useEffect, useRef } from "react";
import ScormAPI from "../utils/ScormAPIWrapper";
import { useAuth } from "../contexts/AuthContext";

interface Props {
    contentUrl: string;
    contentId: number;
}

const ScormPlayer: React.FC<Props> = ({ contentUrl, contentId }) => {
    const { user } = useAuth();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!user) return;

        const api = new ScormAPI(user.id, contentId);

        // Expose SCORM API globally so iframe content can access it
        (window as any).API = api;
    }, [user, contentId]);

    return (
        <div className="w-full h-screen bg-gray-100">
            <iframe
                ref={iframeRef}
                src={contentUrl}
                title="SCORM Content"
                className="w-full h-full border-none"
            />
        </div>
    );
};

export default ScormPlayer;
