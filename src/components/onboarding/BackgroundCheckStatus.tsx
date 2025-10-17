import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BackgroundCheckStatus({ contractorId, onboardingId }: any) {
  const [check, setCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCheck();
  }, [contractorId]);

  const fetchCheck = async () => {
    const { data } = await supabase
      .from('contractor_background_checks')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    setCheck(data);
  };

  const initiateCheck = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('initiate-background-check', {
        body: {
          contractorId,
          onboardingId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'contractor@example.com'
        }
      });

      if (error) throw error;
      toast({ title: 'Background check initiated' });
      fetchCheck();
    } catch (error: any) {
      toast({ title: 'Failed to initiate check', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!check) return Clock;
    switch (check.status) {
      case 'clear': return CheckCircle2;
      case 'flagged': case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Background Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {check ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-medium">Status</span>
              <Badge variant={check.status === 'clear' ? 'default' : 'secondary'}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {check.status}
              </Badge>
            </div>
            {check.completed_at && (
              <div className="text-sm text-muted-foreground">
                Completed: {new Date(check.completed_at).toLocaleDateString()}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              No background check has been initiated yet
            </p>
            <Button onClick={initiateCheck} disabled={loading}>
              Initiate Background Check
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
