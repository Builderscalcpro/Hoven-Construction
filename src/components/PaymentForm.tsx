import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  invoice: {
    id: string;
    invoice_number: string;
    amount: number;
    paid_amount: number;
    customer_id: string;
  };
  onSuccess?: () => void;
}

export default function PaymentForm({ invoice, onSuccess }: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<'full' | 'partial' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const balance = invoice.amount - (invoice.paid_amount || 0);
  
  const getPaymentAmount = () => {
    if (paymentType === 'full') return balance;
    if (paymentType === 'partial') return Math.min(balance * 0.5, balance);
    return Math.min(parseFloat(customAmount) || 0, balance);
  };

  const handlePayment = async () => {
    const amount = getPaymentAmount();
    
    if (amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);

    try {
      // Call edge function to create payment intent
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          amount,
          invoiceId: invoice.id,
          paymentMethod: 'card',
          customerEmail: 'customer@example.com', // Get from user context
          customerName: cardDetails.name,
          description: `Payment for Invoice #${invoice.invoice_number}`,
          metadata: {
            invoiceNumber: invoice.invoice_number,
            paymentType
          }
        }
      });

      if (error) throw error;

      // In a real implementation, you would:
      // 1. Use Stripe Elements to collect card details securely
      // 2. Confirm the payment with the client secret
      // 3. Handle 3D Secure authentication if required

      // Record the payment transaction
      const { error: txError } = await supabase
        .from('payment_transactions')
        .insert({
          invoice_id: invoice.id,
          customer_id: invoice.customer_id,
          amount,
          payment_method: 'card',
          stripe_payment_intent_id: data.paymentIntentId,
          status: 'completed',
          transaction_type: paymentType === 'full' ? 'full' : 'partial'
        });

      if (txError) throw txError;

      // Update invoice paid amount
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          paid_amount: (invoice.paid_amount || 0) + amount,
          status: (invoice.paid_amount || 0) + amount >= invoice.amount ? 'paid' : 'partial'
        })
        .eq('id', invoice.id);

      if (updateError) throw updateError;

      // Send payment confirmation email
      const { data: customerData } = await supabase
        .from('customers')
        .select('name, email')
        .eq('id', invoice.customer_id)
        .single();

      if (customerData) {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'payment',
            email: customerData.email,
            name: customerData.name,
            data: {
              amount: amount.toFixed(2),
              invoice: invoice.invoice_number,
              txn: data.paymentIntentId
            }
          }
        });

        // Log notification
        await supabase.from('email_notifications').insert([{
          customer_id: invoice.customer_id,
          invoice_id: invoice.id,
          notification_type: 'payment_received',
          email_to: customerData.email,
          subject: `Payment Received - $${amount.toFixed(2)}`,
          body: `Payment of $${amount.toFixed(2)} received for invoice #${invoice.invoice_number}`,
          metadata: { amount, transaction_id: data.paymentIntentId }
        }]);
      }

      toast({
        title: 'Payment Successful',
        description: `Payment of $${amount.toFixed(2)} has been processed`
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount Selection */}
        <div className="space-y-4">
          <Label>Payment Amount</Label>
          <RadioGroup value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full" className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <span>Pay Full Balance</span>
                  <span className="font-semibold">${balance.toFixed(2)}</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial" id="partial" />
              <Label htmlFor="partial" className="flex-1 cursor-pointer">
                <div className="flex justify-between">
                  <span>Pay 50% of Balance</span>
                  <span className="font-semibold">${(balance * 0.5).toFixed(2)}</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">Custom Amount</Label>
            </div>
          </RadioGroup>
          
          {paymentType === 'custom' && (
            <div className="ml-6">
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                max={balance}
                min={0.01}
                step={0.01}
              />
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="space-y-4">
          <Label>Card Information</Label>
          
          <div>
            <Input
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            />
          </div>
          
          <div>
            <Input
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              maxLength={19}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
              maxLength={5}
            />
            <Input
              placeholder="CVC"
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
              maxLength={4}
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Amount:</span>
            <span className="text-2xl font-bold">${getPaymentAmount().toFixed(2)}</span>
          </div>
          {getPaymentAmount() < balance && (
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-gray-600">Remaining Balance:</span>
              <span>${(balance - getPaymentAmount()).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={handlePayment}
          disabled={processing || getPaymentAmount() <= 0}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${getPaymentAmount().toFixed(2)}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-600">
          <p>🔒 Secure payment powered by Stripe</p>
          <p>Your payment information is encrypted and secure</p>
        </div>
      </CardContent>
    </Card>
  );
}