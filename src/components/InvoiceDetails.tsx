import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Send, Download, Eye, DollarSign, Calendar, Mail } from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: any;
  onClose: () => void;
  onUpdate: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose, onUpdate }) => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const sendInvoice = async () => {
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: invoice.customers.email,
          subject: `Invoice #${invoice.invoice_number} - ${invoice.project_name}`,
          html: `<h2>Invoice #${invoice.invoice_number}</h2>
            <p>Project: ${invoice.project_name}</p>
            <p>Amount Due: $${invoice.balance_due.toFixed(2)}</p>
            <p>Due Date: ${new Date(invoice.due_date).toLocaleDateString()}</p>
            <p>Please remit payment according to the terms specified.</p>`
        }
      });

      if (error) throw error;

      await supabase
        .from('invoices')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', invoice.id);

      toast({ title: 'Invoice sent successfully' });
      onUpdate();
    } catch (error) {
      toast({ title: 'Failed to send invoice', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const { data } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoiceData: invoice }
      });
      
      const blob = new Blob([data.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoice_number}.html`;
      a.click();
    } catch (error) {
      toast({ title: 'Failed to generate PDF', variant: 'destructive' });
    }
  };

  const markAsPaid = async () => {
    try {
      await supabase
        .from('invoices')
        .update({ 
          status: 'paid', 
          paid_amount: invoice.total_amount,
          paid_at: new Date().toISOString() 
        })
        .eq('id', invoice.id);

      toast({ title: 'Invoice marked as paid' });
      onUpdate();
      onClose();
    } catch (error) {
      toast({ title: 'Failed to update invoice', variant: 'destructive' });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice #{invoice.invoice_number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{invoice.customers?.name}</h3>
              <p className="text-sm text-gray-600">{invoice.customers?.email}</p>
            </div>
            <Badge className={
              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }>
              {invoice.status.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Project</p>
              <p className="font-medium">{invoice.project_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Invoice Date</p>
              <p className="font-medium">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium capitalize">{invoice.invoice_type}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">${invoice.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid Amount:</span>
                <span className="font-medium">${invoice.paid_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Balance Due:</span>
                <span className={invoice.balance_due > 0 ? 'text-red-600' : 'text-green-600'}>
                  ${invoice.balance_due.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {invoice.payment_terms && (
            <div>
              <p className="text-sm font-semibold mb-1">Payment Terms</p>
              <p className="text-sm text-gray-600">{invoice.payment_terms}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={sendInvoice} disabled={sending}>
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Invoice'}
            </Button>
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {invoice.status !== 'paid' && (
              <Button variant="outline" onClick={markAsPaid}>
                <DollarSign className="w-4 h-4 mr-2" />
                Mark as Paid
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetails;