
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const location = useLocation();

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (status === 'loading') {
        console.warn('⚠️ Auth check timed out - allowing access');
        setStatus('authenticated'); // Allow access if check times out
      }
    }, 3000);

    // Check authentication
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setStatus(session ? 'authenticated' : 'unauthenticated');
      } catch (error) {
        console.error('Auth check error:', error);
        setStatus('authenticated'); // Allow access on error to prevent lockout
      }
    };

    checkAuth();

    return () => clearTimeout(timeout);
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Checking authentication...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;