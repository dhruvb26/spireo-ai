"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Draft {
  id: string;
  name: string | null;
  status: string | null;
  userId: string | null;
  scheduledFor: Date | null;
  linkedInId: string | null;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface CalendarProps {
  drafts: Draft[];
}

const Calendar: React.FC<CalendarProps> = ({ drafts }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"1week" | "2weeks">("1week");
  const [hoveredDraft, setHoveredDraft] = useState<Draft | null>(null);
  const [activeDraft, setActiveDraft] = useState<Draft | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setActiveDraft(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getWeekDates = (date: Date, weeks: number = 1): Date[] => {
    const dates: Date[] = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7 * weeks; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      dates.push(day);
    }
    return dates;
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatDayOfWeek = (date: Date): string => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDayOfMonth = (date: Date): number => {
    return date.getDate();
  };

  const goToPrevious = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - (currentView === "1week" ? 7 : 14));
      return newDate;
    });
  };

  const goToNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + (currentView === "1week" ? 7 : 14));
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDraftsForDate = (date: Date): Draft[] => {
    return drafts.filter(
      (draft) =>
        draft.scheduledFor &&
        new Date(draft.scheduledFor).toDateString() === date.toDateString(),
    );
  };

  const renderDraftTooltip = (draft: Draft) => {
    if (!activeDraft || activeDraft.id !== draft.id) return null;

    return (
      <div
        ref={tooltipRef}
        className="absolute right-full top-0 z-50 mr-2 w-[300px] rounded-lg border border-brand-gray-200 bg-brand-gray-25 p-4 shadow-lg"
      >
        <p className="mb-2 text-sm">
          <strong>Scheduled for:</strong> {draft.scheduledFor?.toLocaleString()}
        </p>
        <p className="mb-4 text-sm">
          <strong>Created at:</strong> {draft.createdAt.toLocaleString()}
        </p>
        <Link href={`/dashboard/draft/${draft.id}`} passHref>
          <Button variant="outline" size="sm" className="w-full">
            Edit Draft
          </Button>
        </Link>
      </div>
    );
  };

  const renderDraftCard = (draft: Draft) => {
    const getStatusColor = (status: string | null): string => {
      switch (status?.toLowerCase()) {
        case "scheduled":
          return "bg-green-500";
        default:
          return "bg-gray-400";
      }
    };

    return (
      <div className="relative" key={draft.id}>
        <div
          className="relative cursor-pointer rounded bg-slate-50 p-2 text-sm"
          onClick={() => setActiveDraft(draft)}
          onMouseEnter={() => setHoveredDraft(draft)}
          onMouseLeave={() => setHoveredDraft(null)}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${getStatusColor(draft.status)}`}
            ></div>
            <span className="truncate text-sm font-medium text-brand-gray-800">
              {draft.name || "Untitled"}
            </span>
          </div>
        </div>
        {renderDraftTooltip(draft)}
      </div>
    );
  };
  const renderCalendarView = () => {
    const dates = getWeekDates(currentDate, currentView === "1week" ? 1 : 2);
    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`flex h-64 flex-col ${
              isFirstDayOfMonth(date) ? "bg-blue-50" : "bg-white"
            }`}
          >
            <div
              className={`flex-shrink-0 border-b p-2 ${
                isFirstDayOfMonth(date) ? "bg-blue-100" : ""
              }`}
            >
              <div className="text-xs text-blue-700">
                {formatDayOfWeek(date).toUpperCase()}
              </div>
              <div className="flex flex-row items-end space-x-2">
                <div className="text-sm font-semibold">
                  {formatDayOfMonth(date)}
                </div>
                {isFirstDayOfMonth(date) && (
                  <div className="text-xs font-medium text-blue-600">
                    {date.toLocaleString("default", { month: "long" })}
                  </div>
                )}
              </div>
            </div>
            <div className="relative flex-grow overflow-visible p-2">
              {getDraftsForDate(date).map(renderDraftCard)}
            </div>
          </div>
        ))}
      </div>
    );
  };
  const isFirstDayOfMonth = (date: Date): boolean => {
    return date.getDate() === 1;
  };

  return (
    <div className="calendar-container">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-row space-x-2">
          <span className="text-2xl font-bold tracking-tighter">
            {formatMonthYear(currentDate)}
          </span>
          <div className="flex flex-row items-center space-x-4">
            <button onClick={goToPrevious} className="p-1">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={goToToday} className="text-sm font-medium">
              Today
            </button>
            <button onClick={goToNext} className="p-1">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={currentView}
            onValueChange={(value) =>
              setCurrentView(value as "1week" | "2weeks")
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week" className="text-sm">
                1 Week
              </SelectItem>
              <SelectItem value="2weeks" className="text-sm">
                2 Weeks
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {renderCalendarView()}
    </div>
  );
};

export default Calendar;
