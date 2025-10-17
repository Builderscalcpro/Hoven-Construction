import { useState, useEffect } from 'react';
import { SecretsStatusCard } from '@/components/SecretsStatusCard';
import { 
  checkGitHubSecrets, 
  checkSupabaseSecrets, 
  triggerWebhookSync,
  getSyncHistory,
  SecretStatus,
  SyncHistory 
} from '@/lib/secretsSyncService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Terminal, History, Webhook, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SecretsManagement() {
  const [githubStatus, setGithubStatus] = useState<SecretStatus[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<SecretStatus[]>([]);
  const [githubTotal, setGithubTotal] = useState(0);
  const [githubConfigured, setGithubConfigured] = useState(0);
  const [supabaseTotal, setSupabaseTotal] = useState(0);
  const [supabaseConfigured, setSupabaseConfigured] = useState(0);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadSyncHistory();
  }, []);

  const loadSyncHistory = async () => {
    try {
      const history = await getSyncHistory(10);
      setSyncHistory(history);
    } catch (error) {
      console.error('Failed to load sync history:', error);
    }
  };


  const loadGitHubStatus = async () => {
    if (!owner || !repo) {
      toast({
        title: 'Configuration Required',
        description: 'Please enter GitHub owner and repository name',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const data = await checkGitHubSecrets(owner, repo);
      setGithubStatus(data.status);
      setGithubTotal(data.total);
      setGithubConfigured(data.configured);
      toast({
        title: 'GitHub Status Updated',
        description: `${data.configured} of ${data.total} secrets configured`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check GitHub secrets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSupabaseStatus = async () => {
    setLoading(true);
    try {
      const data = await checkSupabaseSecrets();
      setSupabaseStatus(data.status);
      setSupabaseTotal(data.total);
      setSupabaseConfigured(data.configured);
      toast({
        title: 'Supabase Status Updated',
        description: `${data.configured} of ${data.total} secrets configured`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check Supabase secrets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const syncGitHub = () => {
    toast({
      title: 'Sync GitHub Secrets',
      description: 'Run: npm run sync-github-secrets'
    });
  };

  const syncSupabase = () => {
    toast({
      title: 'Sync Supabase Secrets',
      description: 'Run: npm run sync-supabase-secrets'
    });
  };

  const handleWebhookSync = async (platform: 'github' | 'supabase' | 'both') => {
    setLoading(true);
    try {
      const result = await triggerWebhookSync(platform);
      toast({
        title: 'Webhook Sync Triggered',
        description: `Status: ${result.status}`,
      });
      await loadSyncHistory();
      if (platform === 'github' || platform === 'both') await loadGitHubStatus();
      if (platform === 'supabase' || platform === 'both') await loadSupabaseStatus();
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to trigger webhook sync',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Secrets Management Dashboard</h1>
        <p className="text-muted-foreground">
          Automated sync system with weekly scheduling and webhook integration
        </p>
      </div>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Configuration</CardTitle>
              <CardDescription>Enter repository details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Input id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="username" />
                </div>
                <div>
                  <Label htmlFor="repo">Repository</Label>
                  <Input id="repo" value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="repo-name" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <SecretsStatusCard platform="GitHub" status={githubStatus} total={githubTotal} configured={githubConfigured} loading={loading} onRefresh={loadGitHubStatus} onSync={syncGitHub} />
            <SecretsStatusCard platform="Supabase" status={supabaseStatus} total={supabaseTotal} configured={supabaseConfigured} loading={loading} onRefresh={loadSupabaseStatus} onSync={syncSupabase} />
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Webhook className="h-5 w-5" />Webhook Sync</CardTitle>
              <CardDescription>Trigger instant validation and sync</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={() => handleWebhookSync('both')} disabled={loading}>Sync Both Platforms</Button>
                <Button variant="outline" onClick={() => handleWebhookSync('github')} disabled={loading}>GitHub Only</Button>
                <Button variant="outline" onClick={() => handleWebhookSync('supabase')} disabled={loading}>Supabase Only</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Scheduled Automation</CardTitle>
              <CardDescription>Weekly sync runs every Monday at 9 AM UTC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert><CheckCircle2 className="h-4 w-4" /><AlertTitle>Active</AlertTitle><AlertDescription>GitHub Actions workflow configured for weekly sync</AlertDescription></Alert>
              <div className="space-y-2"><p className="text-sm font-medium">Workflow File:</p><code className="text-xs bg-muted p-2 rounded block">.github/workflows/secrets-sync.yml</code></div>
            </CardContent>
          </Card>

          <Alert><Terminal className="h-4 w-4" /><AlertTitle>CLI Commands</AlertTitle><AlertDescription className="space-y-2 mt-2"><div className="font-mono text-sm bg-muted p-2 rounded">npm run sync-github-secrets</div><div className="font-mono text-sm bg-muted p-2 rounded">npm run sync-supabase-secrets</div><div className="font-mono text-sm bg-muted p-2 rounded">./scripts/automated-secrets-sync.sh</div></AlertDescription></Alert>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Sync History</CardTitle>
              <CardDescription>Recent sync operations</CardDescription>
            </CardHeader>
            <CardContent>
              {syncHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No sync history available</p>
              ) : (
                <div className="space-y-3">
                  {syncHistory.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={record.status === 'success' ? 'default' : record.status === 'partial' ? 'secondary' : 'destructive'}>{record.status}</Badge>
                          <span className="text-sm font-medium capitalize">{record.platform}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground capitalize">{record.syncType}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(record.createdAt).toLocaleString()}</span>
                      </div>
                      {record.secretsMissing.length > 0 && (
                        <div className="text-sm"><span className="font-medium">Missing:</span> {record.secretsMissing.join(', ')}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
