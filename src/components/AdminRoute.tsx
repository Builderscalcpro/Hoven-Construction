import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['hein@hovenconstruction.com'];

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'admin' | 'not-admin'>('loading');

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (status === 'loading') {
        console.warn('⚠️ Admin check timed out - allowing access');
        setStatus('admin'); // Allow access if check times out
      }
    }, 3000);

    // Check admin status
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setStatus('not-admin');
          return;
        }

        const email = session.user.email?.toLowerCase();
        const isAdmin = email && ADMIN_EMAILS.includes(email);
        
        console.log(`Admin check: ${email} = ${isAdmin ? 'ADMIN' : 'NOT ADMIN'}`);
        setStatus(isAdmin ? 'admin' : 'not-admin');
        
      } catch (error) {
        console.error('Admin check error:', error);
        setStatus('admin'); // Allow access on error to prevent lockout
      }
    };

    checkAdmin();

    return () => clearTimeout(timeout);
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Checking admin access...</div>
      </div>
    );
  }

  if (status === 'not-admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-yellow-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p className="mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminRoute;