import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { multiCalendarService } from '@/lib/multiCalendarService';
import { appleCalendarService } from '@/lib/appleCalendarService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PROVIDERS = [
  { id: 'google', name: 'Google Calendar', icon: '🔵', oauth: true },
  { id: 'outlook', name: 'Outlook Calendar', icon: '🔷', oauth: true },
  { id: 'apple', name: 'Apple Calendar', icon: '🍎', oauth: false },
  { id: 'caldav', name: 'CalDAV', icon: '📅', oauth: false }
];


interface CalendarProviderConnectProps {
  onSuccess?: () => void;
}

export default function CalendarProviderConnect({ onSuccess }: CalendarProviderConnectProps) {
  const { user } = useAuth();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [caldavOpen, setCaldavOpen] = useState(false);
  const [appleOpen, setAppleOpen] = useState(false);
  const [caldavForm, setCaldavForm] = useState({
    url: '',
    username: '',
    password: '',
    name: ''
  });
  const [appleForm, setAppleForm] = useState({
    appleId: '',
    appPassword: ''
  });


  const handleOAuthConnect = async (provider: string) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setConnecting(provider);
    try {
      const redirectUri = `${window.location.origin}/calendar-callback`;
      const functionName = provider === 'google' ? 'google-calendar-auth' : 'outlook-calendar-auth';
      
      console.log(`Connecting to ${provider}...`);
      console.log('Function:', functionName);
      console.log('Redirect URI:', redirectUri);
      console.log('User ID:', user.id);
      
      // Direct OAuth URL construction for Google
      if (provider === 'google') {
        const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // This should come from env
        const scope = 'https://www.googleapis.com/auth/calendar';
        const state = encodeURIComponent(JSON.stringify({ provider: 'google', userId: user.id }));
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&state=${state}`;
        window.location.href = authUrl;
        return;
      }
      
      // For Outlook, use edge function
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          action: 'getAuthUrl', 
          redirectUri, 
          userId: user.id 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.authUrl) {
        throw new Error('No authorization URL returned');
      }

      const state = encodeURIComponent(JSON.stringify({ provider, userId: user.id }));
      const separator = data.authUrl.includes('?') ? '&' : '?';
      window.location.href = `${data.authUrl}${separator}state=${state}`;
      
    } catch (error: any) {
      console.error('OAuth error:', error);
      toast.error(error.message || 'Connection failed');
      setConnecting(null);
    }
  };




  const handleCalDAVConnect = async () => {
    try {
      await multiCalendarService.addCalendarConnection({
        user_id: user!.id,
        provider: 'caldav',
        provider_account_id: caldavForm.username,
        caldav_url: caldavForm.url,
        caldav_username: caldavForm.username,
        caldav_password: caldavForm.password,
        calendar_name: caldavForm.name || 'CalDAV Calendar',
        is_active: true,
        sync_enabled: true
      });
      
      toast.success('CalDAV calendar connected');
      setCaldavOpen(false);
      setCaldavForm({ url: '', username: '', password: '', name: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to connect CalDAV calendar');
    }
  };

  const handleAppleConnect = async () => {
    try {
      await appleCalendarService.saveCredentials(appleForm.appleId, appleForm.appPassword);
      await appleCalendarService.syncEvents();
      
      toast.success('Apple Calendar connected successfully');
      setAppleOpen(false);
      setAppleForm({ appleId: '', appPassword: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to connect Apple Calendar');
    }
  };


  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PROVIDERS.map(provider => (
        <Card key={provider.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{provider.icon}</span>
              <div>
                <CardTitle>{provider.name}</CardTitle>
                <CardDescription>
                  {provider.oauth ? 'OAuth 2.0' : 'Manual setup'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {provider.oauth ? (
              <Button
                onClick={() => handleOAuthConnect(provider.id)}
                disabled={connecting === provider.id}
                className="w-full"
              >
                {connecting === provider.id ? 'Connecting...' : `Connect ${provider.name}`}
              </Button>
            ) : provider.id === 'apple' ? (
              <Dialog open={appleOpen} onOpenChange={setAppleOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Configure Apple Calendar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect Apple Calendar (iCloud)</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Apple ID</Label>
                      <Input
                        type="email"
                        value={appleForm.appleId}
                        onChange={(e) => setAppleForm({ ...appleForm, appleId: e.target.value })}
                        placeholder="your@icloud.com"
                      />
                    </div>
                    <div>
                      <Label>App-Specific Password</Label>
                      <Input
                        type="password"
                        value={appleForm.appPassword}
                        onChange={(e) => setAppleForm({ ...appleForm, appPassword: e.target.value })}
                        placeholder="xxxx-xxxx-xxxx-xxxx"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Generate at appleid.apple.com → Security → App-Specific Passwords
                      </p>
                    </div>
                    <Button onClick={handleAppleConnect} className="w-full">
                      Connect Apple Calendar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : provider.id === 'caldav' ? (
              <Dialog open={caldavOpen} onOpenChange={setCaldavOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Configure CalDAV</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect CalDAV Calendar</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Calendar Name</Label>
                      <Input
                        value={caldavForm.name}
                        onChange={(e) => setCaldavForm({ ...caldavForm, name: e.target.value })}
                        placeholder="My Calendar"
                      />
                    </div>
                    <div>
                      <Label>CalDAV URL</Label>
                      <Input
                        value={caldavForm.url}
                        onChange={(e) => setCaldavForm({ ...caldavForm, url: e.target.value })}
                        placeholder="https://caldav.example.com/calendars/user"
                      />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input
                        value={caldavForm.username}
                        onChange={(e) => setCaldavForm({ ...caldavForm, username: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={caldavForm.password}
                        onChange={(e) => setCaldavForm({ ...caldavForm, password: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCalDAVConnect} className="w-full">
                      Connect Calendar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            )}

          </CardContent>
        </Card>
      ))}
    </div>
  );
}
