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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getUserId } from "@/actions/user";
import { DatePicker } from "./date-picker";
import { extractContent } from "./editor-section";
import { CalendarBlank } from "@phosphor-icons/react";

interface ScheduleDialogProps {
  content: any;
  id: string;
  documentUrn?: any;
  disabled: any;
}

const ScheduleDialog = ({
  content,
  id,
  documentUrn,
  disabled,
}: ScheduleDialogProps) => {
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [postName, setPostName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [amPm, setAmPm] = useState("");

  const handleSchedule = async () => {
    if (!scheduleDate || !hour || !minute || !amPm) {
      console.error("Please select both date and time");
      toast.error("Please select both date and time");
      return;
    }

    const postContent = extractContent(content);

    setIsLoading(true);
    const userId = await getUserId();

    try {
      interface ScheduleData {
        name: string;
        userId: string | undefined;
        postId: string;
        content: string;
        scheduledTime: string;
        documentUrn?: string;
      }

      let hours = parseInt(hour);
      if (amPm === "PM" && hours !== 12) {
        hours += 12;
      } else if (amPm === "AM" && hours === 12) {
        hours = 0;
      }

      const scheduledDate = new Date(scheduleDate);
      scheduledDate.setHours(hours, parseInt(minute));

      const scheduleData: ScheduleData = {
        name: postName,
        userId: userId,
        postId: id,
        content: postContent,
        scheduledTime: scheduledDate.toISOString(),
      };

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
    setScheduleDate(date);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-lg bg-brand-gray-800 font-light text-white hover:bg-brand-gray-900 hover:text-white"
          disabled={disabled}
        >
          Schedule
          <CalendarBlank className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent aria-description="schedule" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Schedule Post
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-6 p-4">
          <div className="flex items-center">
            <Label htmlFor="postName" className="w-[80px] text-center">
              Name
            </Label>
            <Input
              autoComplete="off"
              id="postName"
              value={postName}
              placeholder="Choose a name"
              onChange={(e) => setPostName(e.target.value)}
              className="w-3/4"
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="date" className="w-[80px] text-center">
              Date
            </Label>
            <div className="w-3/4">
              <DatePicker selected={scheduleDate} onSelect={handleDateChange} />
            </div>
          </div>
          <div className="flex items-center">
            <Label htmlFor="time" className="w-[80px] text-center">
              Time
            </Label>
            <div className="flex w-3/4 space-x-2">
              <Select onValueChange={(value) => setHour(value)}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={(i + 1).toString().padStart(2, "0")}
                    >
                      {(i + 1).toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setMinute(value)}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={(i * 5).toString().padStart(2, "0")}
                    >
                      {(i * 5).toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setAmPm(value)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Button
          className="rounded-lg bg-brand-purple-600 px-[1rem] font-light hover:bg-brand-purple-700"
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
