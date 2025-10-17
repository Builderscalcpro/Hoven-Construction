import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Mail, TrendingUp, Users, Clock } from 'lucide-react';

export default function EmailDripAnalytics() {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalReplied: 0,
    openRate: 0,
    clickRate: 0,
    replyRate: 0
  });
  const [campaignStats, setCampaignStats] = useState<any[]>([]);
  const [leadScoreBreakdown, setLeadScoreBreakdown] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Overall stats
    const { data: tracking } = await supabase.from('email_tracking').select('*');
    
    if (tracking) {
      const sent = tracking.filter(t => t.event_type === 'sent').length;
      const opened = tracking.filter(t => t.event_type === 'opened').length;
      const clicked = tracking.filter(t => t.event_type === 'clicked').length;
      const replied = tracking.filter(t => t.event_type === 'replied').length;

      setStats({
        totalSent: sent,
        totalOpened: opened,
        totalClicked: clicked,
        totalReplied: replied,
        openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
        clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
        replyRate: sent > 0 ? Math.round((replied / sent) * 100) : 0
      });
    }

    // Campaign performance
    const { data: campaigns } = await supabase
      .from('email_campaigns')
      .select('*, email_sequences(*, scheduled_emails(*, email_tracking(*)))');

    if (campaigns) {
      const campaignData = campaigns.map(c => {
        const allEmails = c.email_sequences.flatMap((s: any) => s.scheduled_emails || []);
        const allTracking = allEmails.flatMap((e: any) => e.email_tracking || []);
        
        const sent = allTracking.filter((t: any) => t.event_type === 'sent').length;
        const opened = allTracking.filter((t: any) => t.event_type === 'opened').length;

        return {
          name: c.name,
          sent,
          opened,
          openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0
        };
      });

      setCampaignStats(campaignData);
    }

    // Lead score breakdown
    const { data: leads } = await supabase.from('chatbot_leads').select('lead_score_type');
    
    if (leads) {
      const breakdown = [
        { name: 'High Value', value: leads.filter(l => l.lead_score_type === 'high').length, color: '#10b981' },
        { name: 'Medium Value', value: leads.filter(l => l.lead_score_type === 'medium').length, color: '#f59e0b' },
        { name: 'Standard', value: leads.filter(l => l.lead_score_type === 'standard').length, color: '#6b7280' }
      ];
      setLeadScoreBreakdown(breakdown);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
                <p className="text-3xl font-bold">{stats.totalSent}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-3xl font-bold">{stats.openRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-3xl font-bold">{stats.clickRate}%</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reply Rate</p>
                <p className="text-3xl font-bold">{stats.replyRate}%</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
                <Bar dataKey="opened" fill="#10b981" name="Opened" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leadScoreBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {leadScoreBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
