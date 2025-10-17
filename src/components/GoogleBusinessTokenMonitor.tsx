import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Shield } from 'lucide-react';
import { googleBusinessTokenService } from '@/services/googleBusinessTokenService';
import { formatDistanceToNow } from 'date-fns';

interface TokenStatus {
  isActive: boolean;
  isExpired: boolean;
  needsRefresh: boolean;
  expiresAt: string;
  lastRefreshed?: string;
  refreshCount: number;
  timeUntilExpiry: number;
}

export default function GoogleBusinessTokenMonitor({ accountId }: { accountId?: string }) {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  useEffect(() => {
    if (!accountId) return;

    // Start token monitoring
    if (autoRefreshEnabled) {
      googleBusinessTokenService.startTokenMonitoring();
    }

    // Initial status check
    checkTokenStatus();

    // Set up periodic status updates
    const interval = setInterval(checkTokenStatus, 30000); // Check every 30 seconds

    return () => {
      clearInterval(interval);
      if (!autoRefreshEnabled) {
        googleBusinessTokenService.stopTokenMonitoring();
      }
    };
  }, [accountId, autoRefreshEnabled]);

  const checkTokenStatus = async () => {
    if (!accountId) return;
    const status = await googleBusinessTokenService.getTokenStatus(accountId);
    if (status) {
      setTokenStatus(status);
    }
  };

  const handleManualRefresh = async () => {
    if (!accountId) return;
    
    setIsRefreshing(true);
    try {
      const success = await googleBusinessTokenService.manualRefresh(accountId);
      if (success) {
        await checkTokenStatus();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleAutoRefresh = () => {
    const newState = !autoRefreshEnabled;
    setAutoRefreshEnabled(newState);
    
    if (newState) {
      googleBusinessTokenService.startTokenMonitoring();
    } else {
      googleBusinessTokenService.stopTokenMonitoring();
    }
  };

  if (!tokenStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            Loading token status...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (tokenStatus.isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (tokenStatus.needsRefresh) {
      return <Badge variant="secondary">Expiring Soon</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getTimeRemaining = () => {
    const hours = Math.floor(tokenStatus.timeUntilExpiry / (1000 * 60 * 60));
    const minutes = Math.floor((tokenStatus.timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            OAuth Token Status
          </span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${autoRefreshEnabled ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Auto-refresh</span>
          </div>
          <Button
            variant={autoRefreshEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoRefresh}
          >
            {autoRefreshEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {/* Token details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Expires in</p>
            <p className="font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {tokenStatus.isExpired ? 'Expired' : getTimeRemaining()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last refreshed</p>
            <p className="font-medium">
              {tokenStatus.lastRefreshed 
                ? formatDistanceToNow(new Date(tokenStatus.lastRefreshed), { addSuffix: true })
                : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Refresh count</p>
            <p className="font-medium">{tokenStatus.refreshCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium flex items-center gap-1">
              {tokenStatus.isActive ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Disconnected
                </>
              )}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {tokenStatus.isExpired && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Token has expired. Please refresh to continue accessing Google Business data.
            </AlertDescription>
          </Alert>
        )}

        {tokenStatus.needsRefresh && !tokenStatus.isExpired && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Token will expire soon. {autoRefreshEnabled 
                ? 'Auto-refresh will handle this automatically.' 
                : 'Manual refresh recommended.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Manual refresh button */}
        <Button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="w-full"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Manual Refresh
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}