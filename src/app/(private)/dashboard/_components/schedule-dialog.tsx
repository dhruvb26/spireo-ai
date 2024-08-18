"use client";
import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getUserId } from "@/actions/user";
import { DatePicker } from "./date-picker";
import { extractContent } from "./editor-section";
import { CalendarBlank, Moon, Sun } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface ScheduleDialogProps {
  content: any;
  id: string;
  documentUrn?: string;
  disabled: boolean;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  content,
  id,
  documentUrn,
  disabled,
}) => {
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [postName, setPostName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleHours, setScheduleHours] = useState("");
  const [scheduleMinutes, setScheduleMinutes] = useState("");
  const [isPM, setIsPM] = useState(false);
  const router = useRouter();
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    // Set the default timezone to the local timezone
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(localTimezone);
  }, []);

  const handleSchedule = async () => {
    if (
      !scheduleDate ||
      !scheduleHours ||
      !scheduleMinutes ||
      !timezone ||
      !postName
    ) {
      console.error("Please fill in all fields");
      toast.error("Please fill in all fields");
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
        timezone: string;
      }

      let hours = parseInt(scheduleHours);
      const minutes = parseInt(scheduleMinutes);

      if (isPM && hours !== 12) {
        hours += 12;
      } else if (!isPM && hours === 12) {
        hours = 0;
      }

      const scheduledDate = new Date(scheduleDate);
      scheduledDate.setHours(hours, minutes);

      const scheduleData: ScheduleData = {
        name: postName,
        userId: userId,
        postId: id,
        content: postContent,
        scheduledTime: scheduledDate.toUTCString(),
        timezone: timezone,
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
        router.push("/dashboard/scheduler");
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

  const handleHoursChange = (value: string) => {
    setScheduleHours(value);
  };

  const handleMinutesChange = (value: string) => {
    setScheduleMinutes(value);
  };

  const timezones = Intl.supportedValuesOf("timeZone");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

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
      <DialogContent aria-description="schedule" aria-label="Schedule Post">
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
            <div className="flex w-3/4 items-center space-x-2">
              <Select value={scheduleHours} onValueChange={handleHoursChange}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem
                      key={hour}
                      value={hour.toString().padStart(2, "0")}
                    >
                      {hour.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select
                value={scheduleMinutes}
                onValueChange={handleMinutesChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem
                      key={minute}
                      value={minute.toString().padStart(2, "0")}
                    >
                      {minute.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isPM}
                  onCheckedChange={setIsPM}
                  id="am-pm-toggle"
                />
                <Label htmlFor="am-pm-toggle" className="flex items-center">
                  {isPM ? (
                    <>
                      <Moon
                        className="mr-1 text-blue-600"
                        size={16}
                        weight="duotone"
                      />
                      PM
                    </>
                  ) : (
                    <>
                      <Sun
                        className="mr-1 text-yellow-500"
                        size={16}
                        weight="duotone"
                      />
                      AM
                    </>
                  )}
                </Label>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Label htmlFor="timezone" className="w-[80px] text-center">
              Timezone
            </Label>
            <Select
              value={timezone}
              onValueChange={(value) => setTimezone(value)}
            >
              <SelectTrigger className="w-3/4">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
