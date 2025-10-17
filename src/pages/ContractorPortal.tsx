import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, Clock, FileText, TrendingUp, 
  DollarSign, MessageSquare, Calendar, Users,
  CheckCircle, AlertCircle, Home
} from 'lucide-react';
import JobAssignments from '@/components/contractor/JobAssignments';
import TimeTracking from '@/components/contractor/TimeTracking';
import DocumentManager from '@/components/contractor/DocumentManager';
import ProgressReports from '@/components/contractor/ProgressReports';
import PaymentHistory from '@/components/contractor/PaymentHistory';
import MessagingCenter from '@/components/contractor/MessagingCenter';

export default function ContractorPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    hoursThisWeek: 0,
    pendingPayments: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchContractorData();
  }, [user]);

  const fetchContractorData = async () => {
    try {
      const { data: contractorData } = await supabase
        .from('contractors')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!contractorData) {
        // Create contractor profile if doesn't exist
        const { data: newContractor } = await supabase
          .from('contractors')
          .insert({
            user_id: user?.id,
            email: user?.email,
            contact_name: user?.user_metadata?.full_name || 'Contractor',
            company_name: 'Independent Contractor',
            status: 'pending'
          })
          .select()
          .single();
        setContractor(newContractor);
      } else {
        setContractor(contractorData);
        await fetchStats(contractorData.id);
      }
    } catch (error) {
      console.error('Error fetching contractor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (contractorId: string) => {
    const { data: jobs } = await supabase
      .from('job_assignments')
      .select('id')
      .eq('contractor_id', contractorId)
      .eq('status', 'in_progress');

    const { data: timeEntries } = await supabase
      .from('time_entries')
      .select('hours_worked')
      .eq('contractor_id', contractorId)
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const { data: payments } = await supabase
      .from('contractor_payments')
      .select('amount')
      .eq('contractor_id', contractorId)
      .eq('status', 'pending');

    const { data: messages } = await supabase
      .from('contractor_messages')
      .select('id')
      .eq('contractor_id', contractorId)
      .eq('is_read', false);

    setStats({
      activeJobs: jobs?.length || 0,
      hoursThisWeek: timeEntries?.reduce((sum, e) => sum + Number(e.hours_worked), 0) || 0,
      pendingPayments: payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
      unreadMessages: messages?.length || 0
    });
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 pb-20 md:pb-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Contractor Portal</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back, {contractor?.contact_name}</p>
      </div>

      {contractor?.status === 'pending' && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <span className="text-sm sm:text-base">Complete your onboarding to access all features.</span>
            </div>
            <Button onClick={() => navigate('/contractor/onboarding')} size="sm" className="sm:size-default w-full sm:w-auto">
              Start Onboarding
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursThisWeek.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Total tracked hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingPayments.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">New messages</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 overflow-x-auto h-auto">
          <TabsTrigger value="jobs" className="text-xs sm:text-sm">Jobs</TabsTrigger>
          <TabsTrigger value="time" className="text-xs sm:text-sm">Time</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm">Docs</TabsTrigger>
          <TabsTrigger value="progress" className="hidden sm:flex text-xs sm:text-sm">Progress</TabsTrigger>
          <TabsTrigger value="payments" className="hidden sm:flex text-xs sm:text-sm">Payments</TabsTrigger>
          <TabsTrigger value="messages" className="hidden sm:flex text-xs sm:text-sm">Messages</TabsTrigger>
        </TabsList>


        <TabsContent value="jobs">
          <JobAssignments contractorId={contractor?.id} />
        </TabsContent>

        <TabsContent value="time">
          <TimeTracking contractorId={contractor?.id} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentManager contractorId={contractor?.id} />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressReports contractorId={contractor?.id} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory contractorId={contractor?.id} />
        </TabsContent>

        <TabsContent value="messages">
          <MessagingCenter contractorId={contractor?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}