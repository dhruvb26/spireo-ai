"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Circle } from "@phosphor-icons/react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: string;
  device: "mobile" | "tablet" | "desktop";
  title?: string;
  postId?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  device,
  title,
  postId,
}) => {
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
      const containerWidth = window.innerWidth; // Get the full window width
      switch (device) {
        case "mobile":
          width = Math.min(280, containerWidth);
          break;
        case "tablet":
          width = Math.min(440, containerWidth);
          break;
        case "desktop":
          width = Math.min(520, containerWidth);
          break;
      }
      height = width * 1.414; // A4 aspect ratio
      setPageWidth(width);
      setPageHeight(height);
    };

    updatePageDimensions();
    window.addEventListener("resize", updatePageDimensions);
    return () => window.removeEventListener("resize", updatePageDimensions);
  }, [device]);

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
      className="relative h-full w-full max-w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
          <p className="text-red-600">Failed to load PDF.</p>
        </div>
      )}
      <div className="h-full overflow-hidden">
        <div className=" h-full">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="m-0 flex w-full flex-col items-center p-0"
          >
            <Page
              pageNumber={pageNumber}
              height={pageHeight}
              className="m-0 h-full object-contain p-0"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderSuccess={() => console.log("Page rendered successfully")}
              onRenderError={(error) =>
                console.error("Error rendering page:", error)
              }
            />
          </Document>
        </div>

        {isHovering && (
          <>
            <div
              className="absolute left-0 right-0 top-0 z-10 flex h-10 items-center justify-start
         bg-black/70 px-4 py-2"
            >
              <p className="text-sm font-semibold text-white">
                {title?.substring(0, 10)}...
              </p>
              <Circle className="mx-2 text-white" weight="fill" size={4} />
              <p className="text-xs text-white">{numPages} pages</p>
            </div>
            {numPages && numPages > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-10 flex h-10 items-center justify-center space-x-2 bg-black/70 px-4 text-white">
                <span className="rounded-full px-2 py-1 text-xs">
                  {pageNumber}/{numPages}
                </span>
                <input
                  type="range"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(parseInt(e.target.value))}
                  className=" w-full cursor-pointer appearance-none outline-none"
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
            )}
          </>
        )}
        {numPages && numPages > 1 && isHovering && (
          <>
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              hidden={pageNumber <= 1}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black/70  p-1 shadow-md transition-opacity duration-500 hover:bg-black disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6 stroke-1 text-white" />
            </button>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              hidden={pageNumber >= numPages}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black/70  p-1 shadow-md transition-opacity duration-500 hover:bg-black disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6 stroke-1 text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
