import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import PaymentProcessor from '@/components/payment/PaymentProcessor';
import PaymentPlanSetup from '@/components/payment/PaymentPlanSetup';
import PaymentHistory from '@/components/payment/PaymentHistory';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
  items: any[];
  paid_amount: number;
}

interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  status: string;
  transaction_type: string;
  payment_method: string;
  created_at: string;
  receipt_url?: string;
}

export default function ClientPortal() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [paymentPlans, setPaymentPlans] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    try {
      // Get customer record
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_user_id', user?.id)
        .single();

      if (customer) {
        setCustomerId(customer.id);
        
        // Fetch invoices
        const { data: invoicesData } = await supabase
          .from('invoices')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });

        // Fetch payments
        const { data: paymentsData } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });

        // Fetch payment plans
        const { data: plansData } = await supabase
          .from('payment_plans')
          .select(`
            *,
            payment_plan_installments (*)
          `)
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });

        setInvoices(invoicesData || []);
        setPayments(paymentsData || []);
        setPaymentPlans(plansData || []);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setActiveTab('payment');
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoiceId }
      });

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([data.pdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Invoice downloaded successfully'
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
      paid: 'default',
      partial: 'secondary',
      overdue: 'destructive',
      pending: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };


  const calculateBalance = (invoice: Invoice) => {
    return invoice.amount - (invoice.paid_amount || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Client Portal</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${invoices.reduce((sum, inv) => sum + calculateBalance(inv), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter(inv => inv.status !== 'paid').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {invoices.filter(inv => inv.status !== 'paid')[0]?.due_date 
                ? format(new Date(invoices.filter(inv => inv.status !== 'paid')[0].due_date), 'MMM d, yyyy')
                : 'No pending invoices'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="plans">Payment Plans</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="payment">Make Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Invoice #{invoice.invoice_number}</h3>
                    <p className="text-sm text-gray-600">
                      Created: {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(invoice.status)}
                    <p className="text-2xl font-bold mt-2">${invoice.amount.toFixed(2)}</p>
                    {invoice.paid_amount > 0 && (
                      <p className="text-sm text-gray-600">
                        Paid: ${invoice.paid_amount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-sm font-semibold">
                      Balance: ${calculateBalance(invoice).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => downloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {invoice.status !== 'paid' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handlePayment(invoice)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="plans" className="space-y-4">
          {paymentPlans.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No payment plans found
              </CardContent>
            </Card>
          ) : (
            paymentPlans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Payment Plan</h3>
                      <p className="text-sm text-gray-600">
                        Created: {format(new Date(plan.created_at), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Frequency: {plan.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(plan.status)}
                      <p className="text-2xl font-bold mt-2">${plan.total_amount}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Installments</h4>
                    <div className="space-y-2">
                      {plan.payment_plan_installments?.map((inst: any) => (
                        <div key={inst.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            Installment #{inst.installment_number}
                          </span>
                          <span className="text-sm">
                            Due: {format(new Date(inst.due_date), 'MMM d, yyyy')}
                          </span>
                          <span className="font-medium">${inst.amount}</span>
                          {getStatusBadge(inst.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory customerId={customerId || undefined} />
        </TabsContent>

        <TabsContent value="payment">
          {selectedInvoice ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice #{selectedInvoice.invoice_number}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">${selectedInvoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span className="font-medium">${(selectedInvoice.paid_amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Balance Due:</span>
                      <span>${calculateBalance(selectedInvoice).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {calculateBalance(selectedInvoice) > 100 ? (
                <PaymentPlanSetup
                  invoiceId={selectedInvoice.id}
                  totalAmount={calculateBalance(selectedInvoice)}
                  customerId={selectedInvoice.customer_id}
                  onComplete={() => {
                    fetchClientData();
                    setActiveTab('plans');
                  }}
                />
              ) : (
                <PaymentProcessor
                  invoiceId={selectedInvoice.id}
                  amount={calculateBalance(selectedInvoice)}
                  customerId={selectedInvoice.customer_id}
                  allowPartial={true}
                  onSuccess={() => {
                    fetchClientData();
                    setActiveTab('payments');
                  }}
                />
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Select an invoice to make a payment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}