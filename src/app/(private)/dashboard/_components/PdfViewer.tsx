"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: string;
  device: "mobile" | "tablet" | "desktop";
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file, device }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePageDimensions = () => {
      let width, height;
      switch (device) {
        case "mobile":
          width = 280;
          height = width * 1.414; // A4 aspect ratio
          break;
        case "tablet":
          width = 440;
          height = width * 1.414; // A4 aspect ratio
          break;
        case "desktop":
          width = 520;
          height = width * 1.414; // A4 aspect ratio
          break;
      }
      setPageWidth(width);
      setPageHeight(height);
    };

    updatePageDimensions();
    console.log(
      "Device:",
      device,
      "Page width:",
      pageWidth,
      "Page height:",
      pageHeight,
    );
  }, [device, pageWidth, pageHeight]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
    console.log("PDF loaded successfully. Number of pages:", numPages);
  }

  function onDocumentLoadError(error: Error) {
    setLoading(false);
    setError(true);
    console.error("Error loading PDF:", error);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      console.log("Changing page to:", newPageNumber);
      return Math.max(1, Math.min(newPageNumber, numPages || 1));
    });
  };

  console.log("Rendering PdfViewer. File:", file);

  return (
    <div
      className="relative w-full max-w-full"
      style={{ height: `${pageHeight}px` }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
          <p className="text-red-600">Failed to load PDF.</p>
        </div>
      )}
      <div className="relative h-full overflow-hidden">
        <div className="h-full overflow-auto">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="m-0 flex flex-col items-center p-0"
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              className="m-0 p-0"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderSuccess={() => console.log("Page rendered successfully")}
              onRenderError={(error) =>
                console.error("Error rendering page:", error)
              }
            />
          </Document>
        </div>
        {numPages && numPages > 1 && isHovering && (
          <>
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-neutral-900 p-1 shadow-md transition-opacity duration-500 hover:bg-black disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-neutral-900 p-1 shadow-md transition-opacity duration-500 hover:bg-black disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 z-20 flex h-10 items-center justify-center space-x-2 bg-neutral-900 px-4 text-white transition-opacity duration-500">
              <span className="rounded-full px-2 py-1 text-xs">
                {pageNumber}/{numPages}
              </span>
              <input
                type="range"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value))}
                className="h-[10px] w-full cursor-pointer appearance-none bg-[#9a905d] outline-none"
              />
              <style jsx>{`
                input[type="range"] {
                  -webkit-appearance: none;
                  width: 100%;
                  background: transparent;
                }

                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 12px;
                  height: 12px;
                  cursor: pointer;
                  background: white;
                  border-radius: 50%;
                  margin-top: -5px;
                  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
                }

                input[type="range"]::-moz-range-thumb {
                  width: 12px;
                  height: 12px;
                  cursor: pointer;
                  background: white;
                  border-radius: 50%;
                  border: none;
                  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
                }

                input[type="range"]::-ms-thumb {
                  width: 12px;
                  height: 12px;
                  cursor: pointer;
                  background: white;
                  border-radius: 50%;
                  margin-top: 0;
                  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
                }

                input[type="range"]::-webkit-slider-runnable-track {
                  width: 100%;
                  height: 2px;
                  cursor: pointer;
                  background: #ddd;
                  border-radius: 1px;
                }

                input[type="range"]::-moz-range-track {
                  width: 100%;
                  height: 2px;
                  cursor: pointer;
                  background: #ddd;
                  border-radius: 1px;
                }

                input[type="range"]::-ms-track {
                  width: 100%;
                  height: 2px;
                  cursor: pointer;
                  background: transparent;
                  border-color: transparent;
                  color: transparent;
                }

                input[type="range"]::-ms-fill-lower {
                  background: #ddd;
                  border-radius: 1px;
                }

                input[type="range"]::-ms-fill-upper {
                  background: #ddd;
                  border-radius: 1px;
                }
              `}</style>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
