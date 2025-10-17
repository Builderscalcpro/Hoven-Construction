import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SendGridDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    failed: 0
  });
  const [recentEmails, setRecentEmails] = useState<any[]>([]);

  useEffect(() => {
    loadEmailStats();
    loadRecentEmails();
  }, []);

  const loadEmailStats = async () => {
    const { data } = await supabase.from('sent_emails').select('status');
    
    if (data) {
      setStats({
        total: data.length,
        sent: data.filter(e => e.status === 'sent').length,
        delivered: data.filter(e => e.status === 'delivered').length,
        opened: data.filter(e => e.status === 'opened').length,
        clicked: data.filter(e => e.status === 'clicked').length,
        bounced: data.filter(e => e.status === 'bounced').length,
        failed: data.filter(e => e.status === 'failed').length
      });
    }
  };

  const loadRecentEmails = async () => {
    const { data } = await supabase
      .from('sent_emails')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10);
    
    if (data) setRecentEmails(data);
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      opened: 'bg-purple-100 text-purple-800',
      clicked: 'bg-indigo-100 text-indigo-800',
      bounced: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Opened</p>
                <p className="text-2xl font-bold">{stats.opened}</p>
                <p className="text-xs text-gray-500">
                  {stats.total ? Math.round((stats.opened/stats.total)*100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold">{stats.bounced + stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEmails.map((email) => (
              <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{email.subject}</p>
                  <p className="text-sm text-gray-600">{email.recipient}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(email.sent_at).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(email.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
