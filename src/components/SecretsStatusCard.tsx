import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecretStatus } from '@/lib/secretsSyncService';

interface SecretsStatusCardProps {
  platform: 'GitHub' | 'Supabase';
  status: SecretStatus[];
  total: number;
  configured: number;
  loading: boolean;
  onRefresh: () => void;
  onSync: () => void;
}

export const SecretsStatusCard = ({
  platform,
  status,
  total,
  configured,
  loading,
  onRefresh,
  onSync
}: SecretsStatusCardProps) => {
  const percentage = total > 0 ? Math.round((configured / total) * 100) : 0;
  const allConfigured = configured === total;
  const someConfigured = configured > 0 && configured < total;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {platform} Secrets
              {allConfigured && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {someConfigured && <AlertCircle className="h-5 w-5 text-yellow-600" />}
              {configured === 0 && <XCircle className="h-5 w-5 text-red-600" />}
            </CardTitle>
            <CardDescription>
              {configured} of {total} secrets configured ({percentage}%)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={onRefresh} disabled={loading} size="sm" variant="outline">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={onSync} disabled={loading} size="sm">
              Sync All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {status.map((secret) => (
            <div key={secret.name} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm font-mono">{secret.name}</span>
              <Badge variant={secret.configured ? 'default' : 'destructive'}>
                {secret.configured ? 'Configured' : 'Missing'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
