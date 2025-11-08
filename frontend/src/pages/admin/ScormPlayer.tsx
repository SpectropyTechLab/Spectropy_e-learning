// src/pages/admin/ScormPlayer.tsx
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function ScormPlayer() {
  const { id } = useParams<{ id: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadScorm = async () => {
      try {
        const res = await api.get(`/admin/content/${id}`);
        const { content_url } = res.data;

        // We'll handle API injection after iframe loads
        if (iframeRef.current) {
          iframeRef.current.src = content_url;
        }
      } catch (err) {
        console.error('Failed to load SCORM content', err);
      }
    };

    loadScorm();
  }, [id]);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    // Inject SCORM API into iframe
    const script = iframe.contentDocument?.createElement('script');
    if (!script) return;

    script.textContent = `
      // Simple SCORM 1.2 API Shim (minimal)
      var API = {
        initialized: false,

        LMSInitialize: function() {
          console.log('SCORM: LMSInitialize called');
          this.initialized = true;
          return 'true';
        },

        LMSFinish: function() {
          console.log('SCORM: LMSFinish called');
          return 'true';
        },

        LMSGetValue: function(element) {
          console.log('SCORM: LMSGetValue', element);
          // Simulate some values
          if (element === "cmi.core.lesson_status") return "completed";
          if (element === "cmi.core.score.raw") return "85";
          return "";
        },

        LMSSetValue: function(element, value) {
          console.log('SCORM: LMSSetValue', element, value);
          // TODO: Send to backend to save
          return 'true';
        },

        LMSCommit: function() {
          console.log('SCORM: LMSCommit called');
          return 'true';
        },

        LMSGetLastError: function() { return '0'; },
        LMSGetErrorString: function() { return 'No error'; },
        LMSGetDiagnostic: function() { return 'All good'; }
      };

      // Also support window.parent.API for nested contexts
      if (window.parent && !window.parent.API) {
        window.parent.API = API;
      }
    `;

    iframe.contentDocument?.head.appendChild(script);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        ref={iframeRef}
        onLoad={handleIframeLoad}
        title="SCORM Content"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}