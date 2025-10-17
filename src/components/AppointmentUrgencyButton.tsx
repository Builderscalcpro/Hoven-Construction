import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppointmentUrgencyButton = () => {
  const navigate = useNavigate();
  const [appointmentsLeft, setAppointmentsLeft] = useState(3);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // After 45 seconds, reduce appointments and make urgent
    const timer = setTimeout(() => {
      setAppointmentsLeft(2);
      setIsUrgent(true);
    }, 45000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    // Navigate to booking page
    navigate('/consultations');
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Prompt text */}
      <div className={`
        mb-3 px-4 py-2 rounded-lg shadow-lg
        ${isUrgent ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'}
        transform transition-all duration-300
        ${isUrgent ? 'animate-bounce' : ''}
      `}>
        <p className="font-semibold text-sm">
          Book your appointment now!
        </p>
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        className={`
          px-6 py-4 rounded-full font-bold text-white shadow-xl
          transform transition-all duration-300 hover:scale-105
          ${isUrgent 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-green-600 hover:bg-green-700'
          }
        `}
        aria-label={`${appointmentsLeft} appointments left for the week - Book now`}
      >
        <div className="flex items-center gap-2">
          {/* Alert icon when urgent */}
          {isUrgent && (
            <svg 
              className="w-5 h-5 animate-pulse" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          
          {/* Text */}
          <span className="text-lg">
            {isUrgent ? 'Only ' : ''}
            {appointmentsLeft} appointment{appointmentsLeft !== 1 ? 's' : ''} left
            {!isUrgent && ' for the week'}
          </span>
        </div>
        
        {/* Additional urgency text */}
        {isUrgent && (
          <div className="text-xs mt-1 font-normal">
            Hurry - Limited availability!
          </div>
        )}
      </button>

      {/* Optional: Pulsing ring effect when urgent */}
      {isUrgent && (
        <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20 pointer-events-none" />
      )}
    </div>
  );
};

export default AppointmentUrgencyButton;
