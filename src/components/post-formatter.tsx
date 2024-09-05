"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { toast } from "sonner";
import { Tour } from "@frigade/react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { CircleAlert } from "lucide-react";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

export interface PostFormat {
  templates: string[];
  category: string;
}

import { getPostFormats, savePostFormat } from "@/actions/formats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function PostFormatSelector({
  onSelectFormat,
  triggerDialog,
}: {
  onSelectFormat: (format: string) => void;
  triggerDialog?: boolean;
}) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [editedFormat, setEditedFormat] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [publicFormats, setPublicFormats] = useState<PostFormat[]>([]);
  const [privateFormats, setPrivateFormats] = useState<PostFormat[]>([]);

  useEffect(() => {
    if (triggerDialog) {
      setIsDialogOpen(true);
    }
    fetchPublicFormats();
    fetchPrivateFormats();
  }, [triggerDialog]);

  const fetchPublicFormats = async () => {
    const result = await getPostFormats(true);
    if (result.success) {
      setPublicFormats(result.data || []);
    } else {
      toast.error(result.message);
    }
  };

  const fetchPrivateFormats = async () => {
    const result = await getPostFormats(false);
    if (result.success) {
      setPrivateFormats(result.data || []);
    } else {
      toast.error(result.message);
    }
  };

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const handleFormatChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedFormat(e.target.value);
  };

  const handleSaveCustomFormat = async () => {
    if (editedFormat && customCategory) {
      try {
        const result = await savePostFormat(
          editedFormat,
          customCategory,
          false,
        );
        if (result.success) {
          toast.success("Custom format saved successfully");
          fetchPrivateFormats(); // Refresh the private formats
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error saving custom format:", error);
        toast.error("Failed to save custom format");
      }
    } else {
      toast.error("Please enter a custom format and category");
    }
  };

  const publicCategories = Array.from(
    new Set(publicFormats.map((format) => format.category)),
  );

  return (
    <>
      <Tour
        onPrimary={(step) => {
          if (step.order === 0) setIsDialogOpen(true);
          return true;
        }}
        className="[&_.fr-title]:text-md [&_.fr-button-primary:hover]:bg-blue-700 [&_.fr-button-primary]:rounded-lg [&_.fr-button-primary]:bg-blue-600 [&_.fr-title]:font-semibold [&_.fr-title]:tracking-tight [&_.fr-title]:text-brand-gray-900"
        flowId="flow_JNu34mog"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="relative flex items-center justify-start space-x-2">
          <DialogTrigger asChild>
            <Button
              ref={buttonRef}
              className="rounded-lg bg-blue-600 font-light text-white hover:bg-blue-700"
              onClick={() => setIsDialogOpen(true)}
              id="post-format-tooltip"
            >
              Post Format
            </Button>
          </DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger disabled>
                <CircleAlert className={`animate-bounce text-blue-600 `} />
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="max-w-xs">
                  <p>
                    Boost engagement with structured, professional content. Save
                    time and ensure consistency across your posts.{" "}
                    <strong>Click on Post Format</strong> and choose one of the
                    templates.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DialogContent
          aria-describedby={undefined}
          className="min-h-[80vh] sm:max-w-[1000px]"
        >
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-lg font-semibold tracking-tight text-brand-gray-900">
              Post Format
            </DialogTitle>
            <DialogDescription className="text-sm font-normal text-brand-gray-500">
              Select a post format from the given categories, edit if needed,
              and use it to structure your content.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={publicCategories[0]} className="w-full">
            <TabsList className="mb-4">
              {publicCategories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
              <TabsTrigger value="Custom">Custom</TabsTrigger>
            </TabsList>
            {publicCategories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="flex h-[500px] w-full">
                  <div className="w-1/2 pr-4">
                    <ScrollArea className="h-full">
                      <div className="pr-4 text-sm">
                        {publicFormats
                          .filter((format) => format.category === category)
                          .flatMap((format) =>
                            format.templates.map((template, index) => (
                              <div
                                key={`${format.category}-${index}`}
                                className={`mb-4 rounded-lg p-4 transition-all duration-200 ${
                                  selectedFormat === template
                                    ? " bg-blue-100"
                                    : " bg-gray-50 hover:bg-gray-100"
                                }`}
                                onClick={() => {
                                  setSelectedFormat(template);
                                  setEditedFormat(template);
                                }}
                              >
                                <div className="mb-2 text-sm font-semibold text-blue-600">
                                  #{index + 1}
                                </div>
                                <pre className="whitespace-pre-wrap font-sans ">
                                  {template}
                                </pre>
                              </div>
                            )),
                          )}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="h-full">
                      <Textarea
                        id="editFormat"
                        className="mt-1 h-full w-full rounded-lg border-brand-gray-200 text-sm "
                        value={editedFormat || ""}
                        onChange={handleFormatChange}
                        placeholder="Select a format on the left to edit"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
            <TabsContent value="Custom">
              <div className="flex h-[500px] w-full">
                <div className="w-1/2 pr-4">
                  <ScrollArea className="h-full">
                    <div className="pr-4 text-sm">
                      {privateFormats.flatMap((format) =>
                        format.templates.map((template, index) => (
                          <div
                            key={`${format.category}-${index}`}
                            className={`mb-4 rounded-lg p-4 transition-all duration-200 ${
                              selectedFormat === template
                                ? " bg-blue-100"
                                : " bg-gray-50 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setSelectedFormat(template);
                              setEditedFormat(template);
                            }}
                          >
                            <div className="mb-2 text-sm font-semibold text-blue-600">
                              #{index + 1}
                            </div>
                            <pre className="whitespace-pre-wrap font-sans ">
                              {template}
                            </pre>
                          </div>
                        )),
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <div className="w-1/2 pl-4">
                  <div className="h-full">
                    <Textarea
                      id="editFormat"
                      className="mt-1 h-full w-full rounded-lg border-brand-gray-200 text-sm "
                      value={editedFormat || ""}
                      onChange={handleFormatChange}
                      placeholder="Enter your custom format"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2 py-0">
            {selectedCategory === "Custom" && (
              <Button
                className="rounded-lg bg-green-600 text-sm text-white hover:bg-green-700"
                onClick={handleSaveCustomFormat}
              >
                Save Custom Format
              </Button>
            )}
            <Button
              className="rounded-lg bg-brand-gray-800 text-sm text-white hover:bg-brand-gray-900 hover:text-white"
              onClick={() => {
                if (editedFormat) {
                  onSelectFormat(editedFormat);
                  setIsDialogOpen(false);
                } else {
                  toast.error(
                    "Please select and optionally edit a format before using it.",
                  );
                }
              }}
            >
              Use Format
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
