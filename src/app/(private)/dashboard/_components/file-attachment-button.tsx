"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Paperclip, Loader2 } from "lucide-react";
import { updateDraftDocumentTitle } from "@/actions/draft";

const FileAttachmentButton = ({
  postId,
  onFileUploaded,
}: {
  onFileUploaded: (
    urn: string,
    fileType: string,
    documentName?: string,
  ) => void;
  postId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type === "application/pdf") {
        setDocumentName(file.name.replace(".pdf", ""));
      }
    }
  };

  const handleAttach = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("postId", postId);
        if (selectedFile.type === "application/pdf") {
          formData.append("documentName", documentName);
        }

        const isDocument = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type);

        const isVideo = selectedFile.type === "video/mp4";

        let endpoint;
        if (isDocument) {
          endpoint = "/api/file-upload";
        } else if (isVideo) {
          endpoint = "/api/video-upload";
        } else {
          endpoint = "/api/image-upload";
        }

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          let urn, fileType;
          if (isDocument) {
            await updateDraftDocumentTitle(postId, documentName);
            urn = result.documentUrn;
            fileType =
              selectedFile.type === "application/pdf" ? "pdf" : "document";
          } else if (isVideo) {
            urn = result.videoUrn;
            fileType = "video";
          } else {
            urn = result.imageUrn;
            fileType = "image";
          }

          onFileUploaded(
            urn,
            fileType,
            selectedFile.type === "application/pdf" ? documentName : undefined,
          );
          setSelectedFile(null);
          setDocumentName("");
          setIsOpen(false);
        } else {
          throw new Error(result.message || "Upload failed");
        }
      } catch (error: any) {
        console.error("Error in file upload process:", error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Paperclip className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent aria-description="Upload" aria-describedby={"Upload"}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Attach File
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-3 py-4">
          <div>
            <Input
              id="file-upload"
              type="file"
              className="mb-1"
              onChange={handleFileChange}
              accept="image/jpeg,image/gif,image/png,image/heic,image/heif,image/webp,image/bmp,image/tiff,.pdf,.pptx,.docx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4,video/x-ms-asf,audio/mpeg,video/mpeg"
            />
            {selectedFile && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Selected file: </span>
                {selectedFile.name}
              </p>
            )}
          </div>
          {selectedFile && selectedFile.type === "application/pdf" && (
            <div>
              <Input
                className="mb-1"
                type="text"
                placeholder="Enter document name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                This name will appear as the title for your document on
                LinkedIn.
              </p>
            </div>
          )}
          <Button
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
            onClick={handleAttach}
            disabled={
              !selectedFile ||
              isUploading ||
              (selectedFile.type === "application/pdf" && !documentName)
            }
          >
            {isUploading ? (
              <>
                Uploading
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Attach"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileAttachmentButton;
