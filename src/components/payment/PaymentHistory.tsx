import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Receipt, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  processed_at: string;
  receipt?: {
    receipt_number: string;
    pdf_url?: string;
  };
}

interface PaymentHistoryProps {
  customerId?: string;
  invoiceId?: string;
}

export default function PaymentHistory({ customerId, invoiceId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, [customerId, invoiceId]);

  const fetchPayments = async () => {
    try {
      let query = supabase
        .from('payment_transactions')
        .select(`
          *,
          receipts (
            receipt_number,
            pdf_url
          )
        `)
        .eq('status', 'completed')
        .order('processed_at', { ascending: false });

      if (invoiceId) {
        query = query.eq('invoice_id', invoiceId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setPayments(data || []);
      const total = data?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      setTotalPaid(total);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (receiptUrl: string) => {
    window.open(receiptUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
      completed: 'success',
      pending: 'default',
      failed: 'destructive',
      refunded: 'secondary'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };


  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading payment history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Payment History</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            <span>Total Paid: </span>
            <span className="font-bold text-lg">${totalPaid.toFixed(2)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No payments found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {format(new Date(payment.processed_at), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${parseFloat(payment.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {payment.payment_method}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    {payment.receipt?.receipt_number && (
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {payment.receipt.receipt_number}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.receipt?.pdf_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReceipt(payment.receipt.pdf_url!)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}