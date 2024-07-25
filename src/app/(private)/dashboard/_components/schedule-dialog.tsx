"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getUserId } from "@/app/actions/user";
import { DatePicker } from "./date-picker";
import { extractContent } from "./editor-section";

const ScheduleDialog = ({
  content,
  id,
  documentUrn,
  disabled,
}: {
  content: any;
  id: string;
  documentUrn?: any;
  disabled: any;
}) => {
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [postName, setPostName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedule = async () => {
    if (!scheduleDate) {
      console.error("Please select both date and time");
      toast.error("Please select both date and time");
      return;
    }

    const postContent = extractContent(content);

    setIsLoading(true);
    const userId = await getUserId();

    try {
      interface ScheduleData {
        userId: string | undefined;
        postId: string;
        content: string;
        scheduledTime: string;
        documentUrn?: string; // Make this optional
      }

      const scheduleData: ScheduleData = {
        userId: userId,
        postId: id,
        content: postContent,
        scheduledTime: scheduleDate.toISOString(),
      };

      // Include documentUrn in the request if it exists and is not null
      if (documentUrn !== null && documentUrn !== undefined) {
        scheduleData.documentUrn = documentUrn;
      }

      const response = await fetch(`/api/schedule`, {
        method: "POST",
        body: JSON.stringify(scheduleData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Draft scheduled successfully");
      } else {
        toast.error(data.error || "Failed to schedule draft");
      }
    } catch (error) {
      console.error("Error scheduling draft:", error);
      toast.error("An error occurred while scheduling the draft");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      if (scheduleDate) {
        newDate.setHours(scheduleDate.getHours());
        newDate.setMinutes(scheduleDate.getMinutes());
      }
      setScheduleDate(newDate);
    } else {
      setScheduleDate(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    if (scheduleDate) {
      const newDate = new Date(scheduleDate);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      setScheduleDate(newDate);
    } else {
      const newDate = new Date();
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      setScheduleDate(newDate);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-brand-gray-800 font-light text-white hover:bg-brand-gray-900 hover:text-white"
          disabled={disabled}
        >
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent aria-description="schedule" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <div className="grid w-fit gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postName" className="text-right">
              Post Name
            </Label>
            <Input
              autoComplete="off"
              id="postName"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <DatePicker selected={scheduleDate} onSelect={handleDateChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              autoComplete="off"
              id="time"
              type="time"
              value={
                scheduleDate ? scheduleDate.toTimeString().slice(0, 5) : ""
              }
              onChange={handleTimeChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button
          className="rounded-lg bg-brand-purple-500 px-[1rem]  font-light hover:bg-brand-purple-700"
          disabled={isLoading}
          onClick={handleSchedule}
        >
          Schedule Post
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
