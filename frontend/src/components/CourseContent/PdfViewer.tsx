// src/components/PdfViewer.tsx
import { useEffect, useRef, useState } from "react";
//import { AiOutlineDownload } from "react-icons/ai";

// ✔ Correct imports (v3.x)
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerProps {
    url: string;
    title?: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!url) return;
        loadPdf();
    }, [url]);

    const loadPdf = async () => {
        const pdf = await pdfjsLib.getDocument(url).promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
    };

    const renderPage = async (pageNum: number, canvas: HTMLCanvasElement) => {
        const page = await pdfDoc.getPage(pageNum);

        const viewport = page.getViewport({ scale: 1.2 });
        const context = canvas.getContext("2d")!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport,
        }).promise;
    };

    useEffect(() => {
        if (!pdfDoc || !numPages) return;

        const containers = containerRef.current?.querySelectorAll("canvas");
        if (!containers) return;

        containers.forEach((canvas, index) => {
            renderPage(index + 1, canvas as HTMLCanvasElement);
        });
    }, [pdfDoc, numPages]);

    return (
        <div className="flex flex-col items-center w-full h-full gap-4">

            {/* ⭐ Download PDF */}
            {/*<button
                onClick={() => window.open(url, "_blank")}
                className="flex items-center gap-2 px-4 py-2 bg-maincolor text-white rounded hover:bg-lightmain"
            >
                <AiOutlineDownload size={18} />
                Download PDF
            </button>*/}

            {/* ⭐ All Pages */}
            <div
                ref={containerRef}
                className="overflow-y-auto w-full h-full bg-gray-100 p-4 overflow-auto flex flex-col items-center gap-4"
            >
                {Array.from({ length: numPages }, (_, i) => (
                    <canvas key={i} className="shadow rounded" />
                ))}
            </div>
        </div>
    );
}
