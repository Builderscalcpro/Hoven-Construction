import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, Sparkles } from 'lucide-react';

export default function AutoResponseSettings() {
  const [config, setConfig] = useState<any>(null);
  const [testReview, setTestReview] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('review_sync_config')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setConfig(data);
  };

  const updateConfig = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('review_sync_config')
        .update(updates)
        .eq('id', config.id);

      if (error) throw error;
      setConfig({ ...config, ...updates });
      toast({ title: 'Settings saved' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const testAIResponse = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-review-response', {
        body: {
          reviewText: testReview,
          rating: testRating,
          businessName: config?.business_name || 'our business'
        }
      });

      if (error) throw error;
      setGeneratedResponse(data.response);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Auto-Response Settings
          </CardTitle>
          <CardDescription>Configure automatic AI-powered responses to new reviews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Auto-Response</Label>
              <p className="text-sm text-muted-foreground">Automatically respond to new reviews with AI</p>
            </div>
            <Switch
              checked={config.auto_respond_enabled}
              onCheckedChange={(checked) => updateConfig({ auto_respond_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={config.business_name || ''}
              onChange={(e) => setConfig({ ...config, business_name: e.target.value })}
              onBlur={() => updateConfig({ business_name: config.business_name })}
              placeholder="Your Business Name"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Test AI Response Generator</h3>
            <div className="space-y-4">
              <div>
                <Label>Star Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= testRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setTestRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Test Review Text</Label>
                <Textarea
                  value={testReview}
                  onChange={(e) => setTestReview(e.target.value)}
                  placeholder="Enter a sample review to test AI response..."
                  rows={3}
                />
              </div>

              <Button onClick={testAIResponse} disabled={!testReview || generating}>
                {generating ? 'Generating...' : 'Generate Response'}
              </Button>

              {generatedResponse && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="mb-2 block">Generated Response:</Label>
                  <p className="text-sm">{generatedResponse}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
