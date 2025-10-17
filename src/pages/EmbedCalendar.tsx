import React from 'react';
import { EmbeddableCalendarWidget } from '@/components/calendar/EmbeddableCalendarWidget';

export default function EmbedCalendar() {
  // This page is designed to be embedded in an iframe
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
      <EmbeddableCalendarWidget />
    </div>
  );
}