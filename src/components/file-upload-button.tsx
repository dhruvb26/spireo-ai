"use client";

import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUploadStore } from "@/store/postStore";
import { Cross, TrashSimple, X } from "@phosphor-icons/react";

export default function FileUploadButton() {
  const { url, setUrl } = useUploadStore();

  const handleDelete = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/uploadthing", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        setUrl("");
        alert("File deleted successfully");
      } else {
        throw new Error("Failed to delete file");
      }
    } catch (error: any) {
      alert(`Error deleting file: ${error.message}`);
    }
  };

  return (
    <main className="flex w-full items-start space-x-4">
      <UploadButton
        className="ut-button:bg-blue-600 ut-button:w-full ut-button:mx-0 ut-button:h-10 ut-button:hover:bg-blue-700 ut-button:rounded-lg ut-button:px-4 ut-button:font-light ut-button:ring-0"
        endpoint="audioUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          if (res && res[0]?.url) {
            setUrl(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      <Input
        type="text"
        value={url}
        disabled
        className="w-fit flex-grow"
        placeholder="Uploaded file URL will appear here"
      />
      {url && (
        <Button
          onClick={handleDelete}
          className="rounded-lg bg-blue-50 text-blue-600 hover:text-white"
        >
          <X />
        </Button>
      )}
    </main>
  );
}
