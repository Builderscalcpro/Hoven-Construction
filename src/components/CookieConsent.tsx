import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from './ui/button';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-1">We use cookies</h3>
            <p className="text-sm text-gray-300">
              We use cookies to improve your experience and analyze site traffic. 
              By clicking "Accept", you consent to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={declineCookies}
            className="bg-transparent border-white text-white hover:bg-white/10"
          >
            Decline
          </Button>
          <Button 
            onClick={acceptCookies}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
