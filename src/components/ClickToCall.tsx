import React from 'react';
import { Phone } from 'lucide-react';
import { analytics } from '@/lib/analytics';


export const ClickToCall: React.FC = () => {
  const handleClick = () => {
    analytics.trackContactClick('phone');
  };

  return (
    <a
      href="tel:+13108532131"
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white px-6 py-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center gap-3 font-semibold"
      aria-label="Call us now"
    >
      <Phone className="h-5 w-5 animate-pulse" />
      <span className="hidden sm:inline">Call Now: (310) 853-2131</span>
      <span className="sm:hidden">Call Now</span>
    </a>
  );
};
