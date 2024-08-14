"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Provider>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
>(({ delayDuration = 10, ...props }, ref) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
));
TooltipProvider.displayName = TooltipPrimitive.Provider.displayName;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-visible rounded-md border-blue-600 bg-blue-50 px-3 py-1.5 text-xs text-blue-600 shadow-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // "before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-blue-100",
      "data-[side=top]:before:bottom-[-4px] data-[side=top]:before:left-1/2 data-[side=top]:before:-translate-x-1/2",
      "data-[side=bottom]:before:left-1/2 data-[side=bottom]:before:top-[-4px] data-[side=bottom]:before:-translate-x-1/2",
      "data-[side=left]:before:right-[-4px] data-[side=left]:before:top-1/2 data-[side=left]:before:-translate-y-1/2",
      "data-[side=right]:before:left-[-4px] data-[side=right]:before:top-1/2 data-[side=right]:before:-translate-y-1/2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
