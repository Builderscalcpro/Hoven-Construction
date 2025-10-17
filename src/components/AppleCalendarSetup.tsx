import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Apple, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { appleCalendarService } from '@/lib/appleCalendarService';

export default function AppleCalendarSetup() {
  const [appleId, setAppleId] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const creds = await appleCalendarService.getCredentials();
      setConnected(!!creds?.is_active);
      if (creds) setAppleId(creds.apple_id);
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await appleCalendarService.saveCredentials(appleId, appPassword);
      await appleCalendarService.syncEvents();
      setSuccess('Apple Calendar connected successfully!');
      setConnected(true);
      setAppPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to connect Apple Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await appleCalendarService.disconnect();
      setConnected(false);
      setAppleId('');
      setSuccess('Apple Calendar disconnected');
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Apple className="h-6 w-6" />
          <CardTitle>Apple Calendar (iCloud)</CardTitle>
        </div>
        <CardDescription>
          Connect your iCloud calendar using an app-specific password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {connected ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Connected as {appleId}
              </AlertDescription>
            </Alert>
            <Button onClick={handleDisconnect} variant="destructive" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Disconnect
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appleId">Apple ID</Label>
              <Input
                id="appleId"
                type="email"
                placeholder="your@icloud.com"
                value={appleId}
                onChange={(e) => setAppleId(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appPassword">App-Specific Password</Label>
              <Input
                id="appPassword"
                type="password"
                placeholder="xxxx-xxxx-xxxx-xxxx"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Generate at appleid.apple.com → Security → App-Specific Passwords
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect Apple Calendar
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
