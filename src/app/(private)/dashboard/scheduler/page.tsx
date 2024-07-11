"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  DateLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getScheduledDrafts } from "@/app/actions/draft";

// Setup the localizer for react-big-calendar
const localizer: DateLocalizer = momentLocalizer(moment);

interface Draft {
  id: string;
  status: string;
  userId: string;
  scheduledFor: string; // Assuming this is an ISO date string
  linkedInId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  draft: Draft;
}

interface ServerResponse {
  success: boolean;
  message: string;
  data: Draft[];
}

const PostVisualizer: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchScheduledDrafts = async () => {
      const result: any = await getScheduledDrafts();
      if (result.success) {
        const calendarEvents: CalendarEvent[] = result.data.map(
          (draft: Draft) => ({
            id: draft.id,
            title:
              draft.content.substring(0, 50) +
              (draft.content.length > 50 ? "..." : ""),
            start: new Date(draft.scheduledFor),
            end: new Date(draft.scheduledFor), // Since there's no end time, we use the same as start
            draft: draft,
          }),
        );
        setEvents(calendarEvents);
      } else {
        console.error("Failed to fetch scheduled drafts:", result.message);
      }
    };

    fetchScheduledDrafts();
  }, []);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const eventStyleGetter = (
    event: CalendarEvent,
    start: Date,
    end: Date,
    isSelected: boolean,
  ) => {
    const style: React.CSSProperties = {
      backgroundColor: "#2fb4ff",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "100%" }}
      view={view}
      onView={handleViewChange}
      date={date}
      onNavigate={handleNavigate}
      eventPropGetter={eventStyleGetter}
      tooltipAccessor={(event: CalendarEvent) => event.draft.content}
    />
  );
};

export default PostVisualizer;
