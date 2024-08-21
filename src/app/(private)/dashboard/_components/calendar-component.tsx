"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DraftCard from "./DraftCard";
import { Draft } from "@/actions/draft";
import { Dot } from "@phosphor-icons/react";

interface CalendarProps {
  drafts: Draft[];
}

const Calendar: React.FC<CalendarProps> = ({ drafts }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"1week" | "2weeks" | "month">(
    "1week",
  );

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

  const getMonthDates = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: Date[] = [];

    // Add days from previous month to start on Sunday
    for (let i = firstDay.getDay(); i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      dates.push(prevDate);
    }

    // Add all days of the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }

    // Add days from next month to complete the grid
    const remainingDays = 7 - (dates.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        dates.push(new Date(year, month + 1, i));
      }
    }

    return dates;
  };

  const formatMonthYearWeek = (date: Date): React.ReactNode => {
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);

    return (
      <div className="flex flex-row items-center">
        <span className="text-lg font-medium tracking-tight">
          {month} {year}
        </span>
        {currentView !== "month" && (
          <>
            <Dot weight="bold" className="text-brand-gray-500" size={32} />
            <span className="text-sm font-normal text-brand-gray-500">
              Week {weekNumber}
            </span>
          </>
        )}
      </div>
    );
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
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
      if (currentView === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setDate(newDate.getDate() - (currentView === "1week" ? 7 : 14));
      }
      return newDate;
    });
  };

  const goToNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (currentView === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setDate(newDate.getDate() + (currentView === "1week" ? 7 : 14));
      }
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

  const renderCalendarView = () => {
    const dates =
      currentView === "month"
        ? getMonthDates(currentDate)
        : getWeekDates(currentDate, currentView === "1week" ? 1 : 2);
    const today = new Date().toDateString();
    const currentMonth = currentDate.getMonth();

    return (
      <div
        className={`grid ${currentView === "month" ? "grid-cols-7" : "grid-cols-7"} gap-px bg-gray-200`}
      >
        {dates.map((date, index) => (
          <div
            key={index}
            className={`flex ${
              currentView === "month"
                ? "h-[25vh]"
                : currentView === "1week"
                  ? "h-[75vh]"
                  : "h-[50vh]"
            } flex-col ${
              date.toDateString() === today ? "bg-blue-50" : "bg-white"
            } ${isFirstDayOfMonth(date) ? "bg-blue-100" : ""} ${
              currentView === "month" && date.getMonth() !== currentMonth
                ? "opacity-50"
                : ""
            }`}
          >
            <div
              className={`flex-shrink-0 border-b p-2 ${
                date.toDateString() === today ? "bg-blue-100" : ""
              } ${isFirstDayOfMonth(date) ? "bg-blue-50 " : ""}`}
            >
              <div className="flex h-4 flex-row items-end space-x-2">
                <div className="text-xs text-blue-700">
                  {formatDayOfWeek(date).toUpperCase()}
                </div>

                <div className="text-xs">{formatDayOfMonth(date)}</div>
              </div>
            </div>
            <div
              className={`relative flex-grow space-y-2 p-2 ${
                currentView === "2weeks" || currentView === "month"
                  ? "overflow-y-auto"
                  : "overflow-hidden"
              }`}
            >
              {getDraftsForDate(date).map((draft) => (
                <DraftCard key={draft.id} draft={draft} view={currentView} />
              ))}
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
          <>{formatMonthYearWeek(currentDate)}</>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-row items-center space-x-4">
            <button
              onClick={goToPrevious}
              className="rounded-full bg-white p-1  shadow-md disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 text-blue-600" />
            </button>
            <button onClick={goToToday} className="text-sm">
              Today
            </button>
            <button
              onClick={goToNext}
              className="rounded-full bg-white p-1 shadow-md disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4 text-blue-600" />
            </button>
          </div>
          <Select
            value={currentView}
            onValueChange={(value) =>
              setCurrentView(value as "1week" | "2weeks" | "month")
            }
          >
            <SelectTrigger className="w-[120px] rounded-lg text-sm ">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week" className="text-sm">
                1 Week
              </SelectItem>
              <SelectItem value="2weeks" className="text-sm">
                2 Weeks
              </SelectItem>
              <SelectItem value="month" className="text-sm">
                Month
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
