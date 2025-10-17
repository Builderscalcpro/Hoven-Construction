import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) throw error;
      setAdminExists(data && data.length > 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  const setupAdmin = async () => {
    if (!user) {
      setError('You must be logged in to set up admin access');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First check if user profile exists
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Profile fetch error: ${fetchError.message}`);
      }

      // If profile doesn't exist, create it first
      if (!profile) {
        const { error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || 'Admin User',
            role: 'admin'
          });

        if (createError) {
          throw new Error(`Profile creation error: ${createError.message}`);
        }
      } else {
        // Update existing profile to admin
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);

        if (updateError) {
          throw new Error(`Profile update error: ${updateError.message}`);
        }
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to set up admin access');
      console.error('Admin setup error:', err);
    } finally {
      setLoading(false);
    }
  };


  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle>Admin Setup</CardTitle>
                <CardDescription>Configure administrator access</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!user && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You must be logged in to set up admin access. Please{' '}
                  <a href="/auth" className="underline">sign in</a> first.
                </AlertDescription>
              </Alert>
            )}

            {adminExists && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  An administrator account already exists. If you need admin access, contact your system administrator.
                </AlertDescription>
              </Alert>
            )}

            {!adminExists && user && !success && (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No administrator has been set up yet. Click the button below to grant yourself admin privileges.
                  </AlertDescription>
                </Alert>

                <Button onClick={setupAdmin} disabled={loading} className="w-full">
                  {loading ? 'Setting up...' : 'Make Me Admin'}
                </Button>
              </>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Admin access granted! Redirecting to admin dashboard...
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Manual Setup (SQL)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Alternatively, run this SQL query in your Supabase SQL Editor:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`-- Replace 'user-email@example.com' with your email
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'user-email@example.com'
);`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
