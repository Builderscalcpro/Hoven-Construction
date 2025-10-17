import { useState, useEffect } from 'react';
import { RefreshCw, Database, AlertTriangle, CheckCircle, XCircle, Shield, List } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { checkDatabaseHealth, refreshSchemaCache, DatabaseHealth } from '@/lib/databaseHealthService';
import { toast } from 'sonner';

export default function DatabaseHealthDashboard() {
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const data = await checkDatabaseHealth();
      setHealth(data);
    } catch (error) {
      toast.error('Failed to load database health');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCache = async () => {
    setRefreshing(true);
    try {
      const result = await refreshSchemaCache();
      if (result.success) {
        toast.success(result.message);
        await loadHealth();
      } else {
        toast.error(result.message);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <XCircle className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading database health...</div>;
  }

  if (!health) {
    return <Alert><AlertDescription>Failed to load database health</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Database Health Monitor</h2>
          <p className="text-muted-foreground">Last checked: {health.lastChecked.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshCache} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Schema Cache
          </Button>
          <Button onClick={loadHealth} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={getStatusColor(health.overallStatus)}>
              {getStatusIcon(health.overallStatus)}
            </span>
            Overall Status: {health.overallStatus.toUpperCase()}
          </CardTitle>
          <CardDescription>
            Connection: {health.connected ? '✓ Connected' : '✗ Disconnected'}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {health.tables.map((table) => (
          <Card key={table.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{table.name}</span>
                <div className="flex gap-2">
                  {table.exists ? (
                    <Badge variant="outline" className="bg-green-50">Exists</Badge>
                  ) : (
                    <Badge variant="destructive">Missing</Badge>
                  )}
                  {table.rlsEnabled ? (
                    <Badge variant="outline" className="bg-blue-50">RLS Enabled</Badge>
                  ) : (
                    <Badge variant="destructive">RLS Disabled</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Row Count</p>
                  <p className="font-semibold">{table.rowCount ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Policies
                  </p>
                  <p className="font-semibold">{table.policies.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <List className="h-3 w-3" /> Indexes
                  </p>
                  <p className="font-semibold">{table.indexes.length}</p>
                </div>
              </div>

              {table.issues.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {table.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}