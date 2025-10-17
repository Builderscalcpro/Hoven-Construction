import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import CookieConsent from '@/components/CookieConsent';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout />
      <CookieConsent />
    </AppProvider>
  );
};

export default Index;