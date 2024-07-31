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
import { usePostStore } from "@/store/postStore";
import { Paperclip } from "lucide-react";
import { updateDownloadUrl } from "@/app/actions/draft";

const FileAttachmentButton = ({
  postId,
  onFileUploaded,
}: {
  onFileUploaded: (urn: string, fileType: string) => void;
  postId: string;
}) => {
  const setDownloadUrl = usePostStore((state) => state.setDownloadUrl);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAttach = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("postId", postId);

        const isDocument = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type);

        const endpoint = isDocument ? "/api/file-upload" : "/api/image-upload";

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
            urn = result.documentUrn;
            fileType =
              selectedFile.type === "application/pdf" ? "pdf" : "document";
          } else {
            urn = result.imageUrn;
            fileType = "image";
          }

          onFileUploaded(urn, fileType);
          setSelectedFile(null);
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
      <DialogContent aria-describedby="Upload">
        <DialogHeader>
          <DialogTitle>Attach File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf,.pptx,.docx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          {selectedFile && (
            <p className="text-sm text-gray-500">
              Selected file: {selectedFile.name}
            </p>
          )}
          <Button
            onClick={handleAttach}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Attach"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileAttachmentButton;
