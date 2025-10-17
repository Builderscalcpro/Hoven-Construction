import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function OnboardingDashboard({ contractorId }: { contractorId: string }) {
  const [onboarding, setOnboarding] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchOnboarding();
  }, [contractorId]);

  const fetchOnboarding = async () => {
    const { data } = await supabase
      .from('contractor_onboarding')
      .select('*')
      .eq('contractor_id', contractorId)
      .single();
    
    setOnboarding(data);
    calculateProgress(data);
  };

  const calculateProgress = (data: any) => {
    if (!data) return;
    const stages = ['documents', 'background_check', 'insurance', 'assessments', 'training', 'compliance'];
    const currentIndex = stages.indexOf(data.current_stage);
    setProgress(((currentIndex + 1) / stages.length) * 100);
  };

  const stages = [
    { id: 'documents', label: 'Documents', icon: CheckCircle2 },
    { id: 'background_check', label: 'Background Check', icon: Clock },
    { id: 'insurance', label: 'Insurance', icon: CheckCircle2 },
    { id: 'assessments', label: 'Skill Assessment', icon: AlertCircle },
    { id: 'training', label: 'Safety Training', icon: Clock },
    { id: 'compliance', label: 'Compliance', icon: Clock }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-3">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isComplete = onboarding?.current_stage !== stage.id;
            const isCurrent = onboarding?.current_stage === stage.id;

            return (
              <div key={stage.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isComplete ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{stage.label}</span>
                </div>
                <Badge variant={isComplete ? 'default' : isCurrent ? 'secondary' : 'outline'}>
                  {isComplete ? 'Complete' : isCurrent ? 'In Progress' : 'Pending'}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
