import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface WebhookInfo {
  id: string;
  user_id: string;
  channel_id: string;
  expiration: string;
  user_email?: string;
}

export default function WebhookRenewalDashboard() {
  const [webhooks, setWebhooks] = useState<WebhookInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('google_calendar_webhooks')
        .select('*, user_profiles(email)')
        .order('expiration', { ascending: true });

      if (error) throw error;

      const formatted = data?.map(w => ({
        id: w.id,
        user_id: w.user_id,
        channel_id: w.channel_id,
        expiration: w.expiration,
        user_email: w.user_profiles?.email
      })) || [];

      setWebhooks(formatted);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerRenewal = async () => {
    setRenewing(true);
    try {
      const { data, error } = await supabase.functions.invoke('renew-calendar-webhooks');

      if (error) throw error;

      toast({
        title: 'Renewal Complete',
        description: `Renewed: ${data.renewed.length}, Failed: ${data.failed.length}`
      });

      await loadWebhooks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to trigger webhook renewal',
        variant: 'destructive'
      });
    } finally {
      setRenewing(false);
    }
  };

  const getDaysUntilExpiration = (expiration: string) => {
    const now = new Date();
    const exp = new Date(expiration);
    const diff = exp.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <div className="text-center py-8">Loading webhook status...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Webhook Renewal Status</h2>
        <button
          onClick={triggerRenewal}
          disabled={renewing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${renewing ? 'animate-spin' : ''}`} />
          {renewing ? 'Renewing...' : 'Trigger Renewal'}
        </button>
      </div>

      {webhooks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active webhooks found</p>
      ) : (
        <div className="space-y-4">
          {webhooks.map(webhook => {
            const daysLeft = getDaysUntilExpiration(webhook.expiration);
            const isExpiringSoon = daysLeft <= 2;
            const isExpired = daysLeft < 0;

            return (
              <div
                key={webhook.id}
                className={`p-4 rounded-lg border-2 ${
                  isExpired
                    ? 'border-red-300 bg-red-50'
                    : isExpiringSoon
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-green-300 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {isExpired ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : isExpiringSoon ? (
                        <Clock className="w-5 h-5 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <span className="font-medium">{webhook.user_email || 'Unknown User'}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Channel ID: {webhook.channel_id}</p>
                      <p>Expires: {new Date(webhook.expiration).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-green-600'
                      }`}
                    >
                      {daysLeft}
                    </div>
                    <div className="text-xs text-gray-500">days left</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Automatic Renewal</h3>
        <p className="text-sm text-blue-800">
          The system automatically checks webhooks daily and renews those expiring within 2 days.
          Users receive email notifications when their webhooks are renewed.
        </p>
      </div>
    </div>
  );
}
