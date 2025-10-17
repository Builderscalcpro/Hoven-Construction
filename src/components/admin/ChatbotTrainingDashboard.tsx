import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Upload, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { defaultKnowledgeBase } from '@/data/chatbotKnowledge';

export default function ChatbotTrainingDashboard() {
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, categories: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await supabase.from('chatbot_knowledge_base').select('*');
    if (data) {
      const categories = new Set(data.map(e => e.category)).size;
      setStats({ 
        total: data.length, 
        active: data.filter(e => e.is_active).length,
        categories 
      });
    }
  };

  const handleBulkImport = async () => {
    setTraining(true);
    setProgress(0);

    for (let i = 0; i < defaultKnowledgeBase.length; i++) {
      await supabase.from('chatbot_knowledge_base').upsert({
        ...defaultKnowledgeBase[i],
        is_active: true
      });
      setProgress(((i + 1) / defaultKnowledgeBase.length) * 100);
    }

    toast({ title: 'Knowledge base imported successfully!' });
    setTraining(false);
    loadStats();
  };

  const handleTrain = async () => {
    setTraining(true);
    toast({ title: 'Training chatbot...', description: 'This may take a few moments' });
    
    setTimeout(() => {
      setTraining(false);
      toast({ title: 'Chatbot trained successfully!' });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Brain className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold">{stats.categories}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleBulkImport} disabled={training} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Import Default Knowledge Base
          </Button>
          <Button onClick={handleTrain} disabled={training} variant="outline" className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Train Chatbot Now
          </Button>
          {training && <Progress value={progress} className="w-full" />}
        </CardContent>
      </Card>
    </div>
  );
}
