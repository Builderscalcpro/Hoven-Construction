import React, { useState } from 'react';
import { Login } from '@/components/auth/Login';
import { Signup } from '@/components/auth/Signup';
import { PasswordReset } from '@/components/auth/PasswordReset';
import { ErrorBoundary } from '@/components/ErrorBoundary';

type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        {mode === 'login' && (
          <Login 
            onToggleMode={() => setMode('signup')} 
            onForgotPassword={() => setMode('reset')} 
          />
        )}
        {mode === 'signup' && (
          <Signup onToggleMode={() => setMode('login')} />
        )}
        {mode === 'reset' && (
          <PasswordReset onBack={() => setMode('login')} />
        )}
      </div>
    </ErrorBoundary>
  );
}

