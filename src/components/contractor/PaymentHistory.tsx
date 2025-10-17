import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Download, FileText, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  invoice_number?: string;
  amount: number;
  payment_type: string;
  description?: string;
  period_start?: string;
  period_end?: string;
  hours_billed?: number;
  hourly_rate?: number;
  materials_cost?: number;
  status: string;
  payment_method?: string;
  payment_date?: string;
  due_date?: string;
  job_assignment?: any;
}

export default function PaymentHistory({ contractorId }: { contractorId: string }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingAmount: 0,
    thisMonth: 0,
    averagePayment: 0,
  });

  useEffect(() => {
    if (contractorId) fetchPayments();
  }, [contractorId]);

  const fetchPayments = async () => {
    const { data } = await supabase
      .from('contractor_payments')
      .select('*, job_assignment:job_assignments(*)')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false });

    if (data) {
      setPayments(data);
      calculateStats(data);
    }
  };

  const calculateStats = (paymentData: Payment[]) => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalEarned = paymentData
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingAmount = paymentData
      .filter(p => p.status === 'pending' || p.status === 'approved')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const thisMonth = paymentData
      .filter(p => p.payment_date && new Date(p.payment_date) >= thisMonthStart)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const paidPayments = paymentData.filter(p => p.status === 'paid');
    const averagePayment = paidPayments.length > 0
      ? totalEarned / paidPayments.length
      : 0;

    setStats({
      totalEarned,
      pendingAmount,
      thisMonth,
      averagePayment,
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hourly: 'Hourly',
      milestone: 'Milestone',
      fixed: 'Fixed Price',
      material_reimbursement: 'Materials',
      bonus: 'Bonus',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.thisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Payment</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averagePayment.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per invoice</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">
                        {payment.invoice_number || 'Payment'}
                      </h4>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                      <Badge variant="outline">
                        {getPaymentTypeLabel(payment.payment_type)}
                      </Badge>
                    </div>
                    
                    {payment.job_assignment && (
                      <p className="text-sm text-gray-600 mb-1">
                        {payment.job_assignment.title}
                      </p>
                    )}

                    {payment.description && (
                      <p className="text-sm text-gray-600 mb-2">{payment.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {payment.period_start && payment.period_end && (
                        <div>
                          <span className="text-gray-500">Period:</span>
                          <p className="font-medium">
                            {format(new Date(payment.period_start), 'MMM d')} - 
                            {format(new Date(payment.period_end), 'MMM d')}
                          </p>
                        </div>
                      )}

                      {payment.hours_billed && (
                        <div>
                          <span className="text-gray-500">Hours:</span>
                          <p className="font-medium">
                            {payment.hours_billed} @ ${payment.hourly_rate}/hr
                          </p>
                        </div>
                      )}

                      {payment.materials_cost && payment.materials_cost > 0 && (
                        <div>
                          <span className="text-gray-500">Materials:</span>
                          <p className="font-medium">${payment.materials_cost.toFixed(2)}</p>
                        </div>
                      )}

                      {payment.due_date && (
                        <div>
                          <span className="text-gray-500">Due:</span>
                          <p className="font-medium">
                            {format(new Date(payment.due_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      )}

                      {payment.payment_date && (
                        <div>
                          <span className="text-gray-500">Paid:</span>
                          <p className="font-medium">
                            {format(new Date(payment.payment_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold">${payment.amount.toFixed(2)}</p>
                    {payment.invoice_number && (
                      <Button size="sm" variant="outline" className="mt-2">
                        <Download className="h-4 w-4 mr-1" /> Invoice
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {payments.length === 0 && (
              <p className="text-center text-gray-500 py-8">No payment history yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}