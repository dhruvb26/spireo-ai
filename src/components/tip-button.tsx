import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TipButtonProps {
  heading: string;
  content: string;
}

const TipButton: React.FC<TipButtonProps> = ({ heading, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center">
      <button
        className="relative ml-2 h-6 w-6 focus:outline-none"
        onClick={() => setIsOpen(true)}
        aria-label="Embed information"
      >
        <span className="absolute inset-0 rounded-full bg-blue-600"></span>
        <span className="absolute inset-0 animate-ping rounded-full bg-blue-600 opacity-75 "></span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{heading}</DialogTitle>
          </DialogHeader>
          <p>{content}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TipButton;
