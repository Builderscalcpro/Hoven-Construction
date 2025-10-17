import { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

/**
 * Component for announcing dynamic content changes to screen readers
 * Uses ARIA live regions to announce messages without disrupting user flow
 */
export const ScreenReaderAnnouncer = ({ 
  message, 
  politeness = 'polite' 
}: ScreenReaderAnnouncerProps) => {
  const announcerRef = useRef<HTMLDivElement>(null);
  const previousMessage = useRef<string>('');

  useEffect(() => {
    if (message && message !== previousMessage.current) {
      // Clear the announcer first to ensure the message is announced
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
        // Use setTimeout to ensure the clear happens before the new message
        setTimeout(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = message;
          }
        }, 100);
      }
      previousMessage.current = message;
    }
  }, [message]);

  return (
    <div
      ref={announcerRef}
      className="sr-only"
      role="status"
      aria-live={politeness}
      aria-atomic="true"
    />
  );
};

// Global announcer instance for use throughout the app
let announceTimeout: NodeJS.Timeout;

export const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  // Clear any pending announcements
  clearTimeout(announceTimeout);
  
  // Create or get the global announcer element
  let announcer = document.getElementById('global-screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'global-screen-reader-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  
  // Clear and announce
  announcer.textContent = '';
  announcer.setAttribute('aria-live', politeness);
  
  announceTimeout = setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 100);
};

export default ScreenReaderAnnouncer;