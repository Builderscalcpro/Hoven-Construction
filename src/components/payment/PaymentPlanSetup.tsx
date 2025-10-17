import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PaymentProcessor from './PaymentProcessor';

interface PaymentPlanSetupProps {
  invoiceId: string;
  totalAmount: number;
  customerId: string;
  onComplete?: () => void;
}

export default function PaymentPlanSetup({ 
  invoiceId, 
  totalAmount, 
  customerId, 
  onComplete 
}: PaymentPlanSetupProps) {
  const [planType, setPlanType] = useState<'full' | 'plan'>('full');
  const [downPayment, setDownPayment] = useState(totalAmount * 0.25);
  const [installments, setInstallments] = useState(3);
  const [frequency, setFrequency] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);
  const [planCreated, setPlanCreated] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const installmentAmount = (totalAmount - downPayment) / installments;

  const handleCreatePlan = async () => {
    setProcessing(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('stripe-create-payment-plan', {
        body: {
          invoiceId,
          customerId,
          totalAmount,
          downPayment,
          numberOfInstallments: installments,
          frequency
        }
      });

      if (error) throw error;

      setPlanCreated(true);
      if (downPayment > 0) {
        setShowPayment(true);
      } else if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create payment plan');
    } finally {
      setProcessing(false);
    }
  };

  if (showPayment && planCreated) {
    return (
      <PaymentProcessor
        invoiceId={invoiceId}
        amount={downPayment}
        customerId={customerId}
        onSuccess={() => {
          if (onComplete) onComplete();
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Payment Option</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={planType} onValueChange={(v) => setPlanType(v as 'full' | 'plan')}>
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="full" id="full" />
            <Label htmlFor="full" className="flex-1 cursor-pointer">
              <div className="font-medium">Pay in Full</div>
              <div className="text-sm text-gray-500">
                Total: ${totalAmount.toFixed(2)}
              </div>
            </Label>
          </div>

          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="plan" id="plan" />
            <Label htmlFor="plan" className="flex-1 cursor-pointer">
              <div className="font-medium">Payment Plan</div>
              <div className="text-sm text-gray-500">
                Split into installments with flexible terms
              </div>
            </Label>
          </div>
        </RadioGroup>

        {planType === 'plan' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label>Down Payment (25% minimum)</Label>
              <div className="flex items-center mt-2">
                <DollarSign className="h-4 w-4 mr-2" />
                <input
                  type="number"
                  min={totalAmount * 0.25}
                  max={totalAmount * 0.5}
                  step="100"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <Label>Number of Installments</Label>
              <RadioGroup value={installments.toString()} onValueChange={(v) => setInstallments(parseInt(v))}>
                <div className="flex gap-4 mt-2">
                  {[2, 3, 4, 6].map(num => (
                    <div key={num} className="flex items-center">
                      <RadioGroupItem value={num.toString()} id={`inst-${num}`} />
                      <Label htmlFor={`inst-${num}`} className="ml-2 cursor-pointer">
                        {num}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Payment Frequency</Label>
              <RadioGroup value={frequency} onValueChange={setFrequency}>
                <div className="flex gap-4 mt-2">
                  {['weekly', 'biweekly', 'monthly'].map(freq => (
                    <div key={freq} className="flex items-center">
                      <RadioGroupItem value={freq} id={`freq-${freq}`} />
                      <Label htmlFor={`freq-${freq}`} className="ml-2 cursor-pointer capitalize">
                        {freq}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-2">Payment Summary</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Down Payment:</span>
                  <span className="font-medium">${downPayment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{installments} Installments of:</span>
                  <span className="font-medium">${installmentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total:</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {planType === 'full' ? (
          <PaymentProcessor
            invoiceId={invoiceId}
            amount={totalAmount}
            customerId={customerId}
            onSuccess={() => {
              if (onComplete) onComplete();
            }}
          />
        ) : (
          <Button
            onClick={handleCreatePlan}
            disabled={processing}
            className="w-full"
          >
            {processing ? 'Creating Plan...' : 'Create Payment Plan'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}