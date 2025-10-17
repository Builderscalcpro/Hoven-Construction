import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, PlayCircle, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SafetyTraining({ contractorId, onboardingId }: any) {
  const [modules, setModules] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchModules();
    fetchProgress();
  }, [contractorId]);

  const fetchModules = async () => {
    const { data } = await supabase
      .from('safety_training_modules')
      .select('*')
      .eq('is_active', true)
      .order('order_index');
    
    setModules(data || []);
  };

  const fetchProgress = async () => {
    const { data } = await supabase
      .from('contractor_training_progress')
      .select('*')
      .eq('contractor_id', contractorId);
    
    setProgress(data || []);
  };

  const startModule = async (module: any) => {
    setActiveModule(module);
    
    const existing = progress.find(p => p.module_id === module.id);
    if (!existing) {
      await supabase
        .from('contractor_training_progress')
        .insert({
          contractor_id: contractorId,
          onboarding_id: onboardingId,
          module_id: module.id,
          status: 'in_progress',
          started_at: new Date().toISOString()
        });
      
      fetchProgress();
    }
  };

  const completeModule = async () => {
    try {
      const { error } = await supabase
        .from('contractor_training_progress')
        .update({
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString()
        })
        .eq('contractor_id', contractorId)
        .eq('module_id', activeModule.id);

      if (error) throw error;

      toast({ title: 'Module completed!' });
      setActiveModule(null);
      fetchProgress();
    } catch (error: any) {
      toast({ title: 'Failed to complete', description: error.message, variant: 'destructive' });
    }
  };

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.module_id === moduleId);
  };

  if (activeModule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{activeModule.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p>{activeModule.content}</p>
          </div>
          
          {activeModule.video_url && (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-gray-400" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={completeModule}>Mark as Complete</Button>
            <Button variant="outline" onClick={() => setActiveModule(null)}>Close</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Safety Training
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {modules.map((module) => {
          const moduleProgress = getModuleProgress(module.id);
          const isComplete = moduleProgress?.status === 'completed';
          
          return (
            <div key={module.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{module.title}</h4>
                  <p className="text-sm text-muted-foreground">{module.duration_minutes} minutes</p>
                </div>
                <Badge variant={isComplete ? 'default' : 'secondary'}>
                  {isComplete && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {isComplete ? 'Completed' : 'Not Started'}
                </Badge>
              </div>
              
              {moduleProgress && !isComplete && (
                <Progress value={moduleProgress.progress_percentage} className="mb-3" />
              )}
              
              <Button size="sm" onClick={() => startModule(module)} disabled={isComplete}>
                {isComplete ? 'Review' : moduleProgress ? 'Continue' : 'Start'}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
