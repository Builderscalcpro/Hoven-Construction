import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Bell, BellOff } from 'lucide-react';
import { googleCalendarService } from '@/lib/googleCalendarService';
import { toast } from '@/components/ui/use-toast';

export function GoogleCalendarSetup() {

  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [webhookStatus, setWebhookStatus] = useState<any>(null);
  const [webhookLoading, setWebhookLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const tokens = await googleCalendarService.getTokens();
      setIsConnected(!!tokens);
      
      if (tokens) {
        const status = await googleCalendarService.getWebhookStatus();
        setWebhookStatus(status);
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      const authUrl = await googleCalendarService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: 'Connection Error',
        description: error.message || 'Failed to connect to Google Calendar. Please check your API credentials.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };


  const handleEnableWebhook = async () => {
    setWebhookLoading(true);
    try {
      const result = await googleCalendarService.subscribeToWebhook();
      setWebhookStatus(result);
      toast({
        title: 'Success',
        description: 'Two-way sync enabled! Calendar changes will now sync automatically.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable two-way sync',
        variant: 'destructive'
      });
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleDisableWebhook = async () => {
    setWebhookLoading(true);
    try {
      await googleCalendarService.unsubscribeFromWebhook();
      setWebhookStatus(null);
      toast({
        title: 'Success',
        description: 'Two-way sync disabled'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disable two-way sync',
        variant: 'destructive'
      });
    } finally {
      setWebhookLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Google Calendar Integration</h3>
            <p className="text-sm text-gray-600">
              {isConnected ? 'Connected and syncing' : 'Connect to show real-time availability'}
            </p>
          </div>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Connected</span>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Connect Calendar
          </button>
        )}
      </div>

      {isConnected && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {webhookStatus ? <Bell className="w-6 h-6 text-green-600" /> : <BellOff className="w-6 h-6 text-gray-400" />}
              <div>
                <h4 className="font-medium">Two-Way Sync</h4>
                <p className="text-sm text-gray-600">
                  {webhookStatus ? 'Active - External changes sync automatically' : 'Enable to sync external calendar changes'}
                </p>
              </div>
            </div>
            
            <button
              onClick={webhookStatus ? handleDisableWebhook : handleEnableWebhook}
              disabled={webhookLoading}
              className={`px-4 py-2 rounded-lg transition ${
                webhookStatus
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {webhookLoading ? 'Processing...' : webhookStatus ? 'Disable' : 'Enable'}
            </button>
          </div>
          
          {webhookStatus && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Webhook expires:</span>
                <span className="font-medium text-gray-800">
                  {new Date(webhookStatus.expiration).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>✓ Automatic renewal enabled</p>
                <p>System checks daily and renews webhooks before expiration</p>
              </div>
            </div>
          )}

        </div>
      )}

      {!isConnected && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Why connect your calendar?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Show real-time availability to clients</li>
              <li>Automatically create events with Google Meet links</li>
              <li>Enable two-way sync for external changes</li>
              <li>Send calendar invitations to clients</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

