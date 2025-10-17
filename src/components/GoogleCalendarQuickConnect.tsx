import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { googleCalendarService } from '@/lib/googleCalendarService';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function GoogleCalendarQuickConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      const tokens = await googleCalendarService.getTokens();
      setIsConnected(!!tokens);
    } catch (err: any) {
      console.error('Error checking connection:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      const authUrl = await googleCalendarService.getAuthUrl();
      
      toast({
        title: 'Redirecting to Google',
        description: 'Please authorize calendar access...'
      });
      
      window.location.href = authUrl;
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message);
      
      toast({
        title: 'Connection Failed',
        description: err.message || 'Failed to connect to Google Calendar',
        variant: 'destructive'
      });
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking connection...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Calendar className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold">Google Calendar</h3>
              <p className="text-sm text-gray-600">
                {isConnected 
                  ? 'Successfully connected and syncing' 
                  : 'Connect to enable calendar features'}
              </p>
            </div>
          </div>
          
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={connecting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Now'
              )}
            </Button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Connection Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <div className="mt-3 space-y-2 text-xs text-red-600">
                  <p className="font-medium">Troubleshooting:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Check if Google OAuth credentials are configured</li>
                    <li>Verify redirect URIs in Google Console</li>
                    <li>Ensure Calendar API is enabled</li>
                  </ul>
                  <a 
                    href="/GOOGLE_CALENDAR_CONNECTION_FIX.md" 
                    target="_blank"
                    className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 font-medium mt-2"
                  >
                    View Setup Guide <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isConnected && !error && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Benefits:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Show real-time availability</li>
              <li>✓ Auto-create events with Meet links</li>
              <li>✓ Two-way calendar sync</li>
              <li>✓ Send calendar invitations</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
