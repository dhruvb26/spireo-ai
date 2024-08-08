"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  file: string;
  device: "mobile" | "tablet" | "desktop";
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file, device }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updatePageWidth = () => {
      switch (device) {
        case "mobile":
          setPageWidth(280);
          break;
        case "tablet":
          setPageWidth(440);
          break;
        case "desktop":
          setPageWidth(520);
          break;
      }
    };

    updatePageWidth();
  }, [device]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(newPageNumber, numPages || 1));
    });
  };

  return (
    <div className="relative w-full max-w-full" style={{ height: "400px" }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
      <div className="relative h-full overflow-hidden">
        <div className="h-full overflow-auto">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex flex-col items-center"
          >
            <Page pageNumber={pageNumber} width={pageWidth} className="mb-4" />
          </Document>
        </div>
        {numPages && numPages > 1 && (
          <>
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="absolute left-0 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6 text-blue-600" />
            </button>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className="absolute right-0 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6 text-blue-600" />
            </button>
            <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 transform rounded-full bg-white px-2 py-1 text-xs text-brand-gray-900 shadow-md">
              Page {pageNumber} of {numPages}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
