import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, MousePointer, Clock } from 'lucide-react';

export default function EmailTracking() {
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, opened: 0, clicked: 0 });

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    const { data } = await supabase
      .from('sent_emails')
      .select('*, customers(name, email), email_templates(name)')
      .order('sent_at', { ascending: false });
    
    if (data) {
      setSentEmails(data);
      setStats({
        total: data.length,
        opened: data.filter(e => e.opened_at).length,
        clicked: data.filter(e => e.clicked_at).length
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'opened': return 'bg-green-100 text-green-800';
      case 'clicked': return 'bg-purple-100 text-purple-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
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
                <p className="text-sm text-gray-600">Opened</p>
                <p className="text-2xl font-bold">{stats.opened}</p>
                <p className="text-xs text-gray-500">{stats.total ? Math.round((stats.opened/stats.total)*100) : 0}% rate</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clicked</p>
                <p className="text-2xl font-bold">{stats.clicked}</p>
                <p className="text-xs text-gray-500">{stats.total ? Math.round((stats.clicked/stats.total)*100) : 0}% rate</p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sent Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sentEmails.map((email) => (
              <div key={email.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{email.customers?.name}</p>
                    <p className="text-sm text-gray-600">{email.customers?.email}</p>
                  </div>
                  <Badge className={getStatusColor(email.status)}>{email.status}</Badge>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{email.subject}</p>
                {email.email_templates && (
                  <p className="text-xs text-gray-500 mb-2">Template: {email.email_templates.name}</p>
                )}
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Sent: {new Date(email.sent_at).toLocaleString()}
                  </span>
                  {email.opened_at && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Opened: {new Date(email.opened_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {sentEmails.length === 0 && (
              <p className="text-center text-gray-500 py-8">No emails sent yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
