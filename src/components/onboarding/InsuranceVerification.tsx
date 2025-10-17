import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InsuranceVerification({ contractorId }: any) {
  const [insurances, setInsurances] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    insurance_type: 'general_liability',
    provider_name: '',
    policy_number: '',
    coverage_amount: '',
    effective_date: '',
    expiration_date: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInsurances();
  }, [contractorId]);

  const fetchInsurances = async () => {
    const { data } = await supabase
      .from('contractor_insurance')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false });
    
    setInsurances(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('contractor_insurance')
        .insert({
          contractor_id: contractorId,
          ...formData,
          status: 'pending'
        });

      if (error) throw error;

      toast({ title: 'Insurance added successfully' });
      setShowForm(false);
      fetchInsurances();
      setFormData({
        insurance_type: 'general_liability',
        provider_name: '',
        policy_number: '',
        coverage_amount: '',
        effective_date: '',
        expiration_date: ''
      });
    } catch (error: any) {
      toast({ title: 'Failed to add insurance', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Insurance Verification
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Insurance
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={formData.insurance_type}
                  onChange={(e) => setFormData({ ...formData, insurance_type: e.target.value })}
                >
                  <option value="general_liability">General Liability</option>
                  <option value="workers_comp">Workers Comp</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <Label>Provider</Label>
                <Input
                  value={formData.provider_name}
                  onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Policy Number</Label>
                <Input
                  value={formData.policy_number}
                  onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Coverage Amount</Label>
                <Input
                  type="number"
                  value={formData.coverage_amount}
                  onChange={(e) => setFormData({ ...formData, coverage_amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Expiration Date</Label>
                <Input
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        )}

        <div className="space-y-3">
          {insurances.map((insurance) => (
            <div key={insurance.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium capitalize">{insurance.insurance_type.replace('_', ' ')}</h4>
                  <p className="text-sm text-muted-foreground">{insurance.provider_name}</p>
                </div>
                <Badge variant={insurance.status === 'verified' ? 'default' : 'secondary'}>
                  {insurance.status}
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <p>Policy: {insurance.policy_number}</p>
                <p>Coverage: ${insurance.coverage_amount?.toLocaleString()}</p>
                <p>Expires: {new Date(insurance.expiration_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
