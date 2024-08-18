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
import { Button } from "@/components/ui/button";
import DraftCard from "./DraftCard";
import { Draft } from "@/actions/draft";
import { ArrowUpRight, Dot } from "@phosphor-icons/react";

interface CalendarProps {
  drafts: Draft[];
}

const Calendar: React.FC<CalendarProps> = ({ drafts }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"1week" | "2weeks">("1week");

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

  const formatMonthYearWeek = (date: Date): React.ReactNode => {
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);

    return (
      <div className="flex flex-row items-center">
        <span className="text-lg font-medium tracking-tight">
          {month} {year}
        </span>
        <Dot weight="bold" className="text-brand-gray-500" size={32} />
        <span className="text-sm font-normal text-brand-gray-500">
          Week {weekNumber}
        </span>
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

  const renderCalendarView = () => {
    const dates = getWeekDates(currentDate, currentView === "1week" ? 1 : 2);
    const today = new Date().toDateString();
    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`flex ${
              currentView === "1week" ? "h-[75vh]" : "h-[50vh]"
            } flex-col ${
              date.toDateString() === today ? "bg-blue-50" : "bg-white"
            } ${isFirstDayOfMonth(date) ? "bg-blue-100" : ""}`}
          >
            <div
              className={`flex-shrink-0 border-b p-2 ${
                date.toDateString() === today ? "bg-blue-100" : ""
              } ${isFirstDayOfMonth(date) ? "bg-blue-50 " : ""}`}
            >
              <div className="text-sm font-semibold text-blue-700">
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
            <div className="relative flex-grow space-y-2 overflow-hidden p-2">
              {getDraftsForDate(date).map((draft) => (
                <DraftCard key={draft.id} draft={draft} />
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
              setCurrentView(value as "1week" | "2weeks")
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
            </SelectContent>
          </Select>
        </div>
      </div>
      {renderCalendarView()}
    </div>
  );
};

export default Calendar;
