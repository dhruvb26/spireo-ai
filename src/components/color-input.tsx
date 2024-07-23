import React, { useState } from "react";
import { TwitterPicker } from "react-color";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <Input
          autoComplete="off"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div
              className="h-10 w-10 cursor-pointer rounded-md border border-gray-300"
              style={{ backgroundColor: value }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <TwitterPicker
              color={value}
              onChangeComplete={(color: any) => {
                onChange(color.hex);
                setIsOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ColorInput;
