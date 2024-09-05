"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getContentStyles, ContentStyle } from "@/actions/style";
import Link from "next/link";

export function ContentStyleSelector({
  onSelectStyle,
}: {
  onSelectStyle: (style: ContentStyle) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentStyles, setContentStyles] = useState<ContentStyle[]>([]);

  useEffect(() => {
    const fetchContentStyles = async () => {
      const result = await getContentStyles();
      if (result.success) {
        setContentStyles(result.data || []);
      }
    };

    fetchContentStyles();
  }, []);

  const handleStyleSelect = (style: ContentStyle) => {
    onSelectStyle(style);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Select Content Style</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Choose a Content Style</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex">
          <div className="w-1/2 pr-4">
            <ScrollArea className="h-[60vh]">
              {contentStyles.map((style) => (
                <Button
                  key={style.id}
                  variant="ghost"
                  className="mb-2 w-full justify-start"
                  onClick={() => handleStyleSelect(style)}
                >
                  {style.name}
                </Button>
              ))}
            </ScrollArea>
          </div>
          <div className="flex w-1/2 flex-col items-center justify-center pl-4">
            <h3 className="mb-4 text-lg font-semibold">Create New Style</h3>
            <Link href="/create-content-style">
              <Button variant="outline">Create New Content Style</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
