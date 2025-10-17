import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, ThumbsUp, ThumbsDown, Edit } from 'lucide-react';

interface ReviewResponseWorkflowProps {
  review: {
    id: string;
    reviewer_name: string;
    star_rating: number;
    comment?: string;
  };
  onResponsePosted?: () => void;
}

export function ReviewResponseWorkflow({ review, onResponsePosted }: ReviewResponseWorkflowProps) {
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [tone, setTone] = useState('professional');
  const [aiResponse, setAiResponse] = useState('');
  const [editedResponse, setEditedResponse] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    checkExistingResponse();
  }, [review.id]);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('ai_response_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setSettings(data);
      setTone(data.default_tone);
    }
  };

  const checkExistingResponse = async () => {
    const { data } = await supabase
      .from('review_responses')
      .select('*')
      .eq('review_id', review.id)
      .single();

    if (data) {
      setAiResponse(data.ai_generated_response);
      setEditedResponse(data.edited_response || data.ai_generated_response);
    }
  };

  const generateResponse = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-review-response', {
        body: {
          reviewText: review.comment || '',
          rating: review.star_rating,
          reviewerName: review.reviewer_name,
          tone,
          businessName: settings?.business_name,
          businessDescription: settings?.business_description,
          customInstructions: settings?.custom_instructions
        }
      });

      if (error) throw error;

      setAiResponse(data.response);
      setEditedResponse(data.response);

      // Save draft
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('review_responses').upsert({
          user_id: user.id,
          review_id: review.id,
          ai_generated_response: data.response,
          tone_used: tone,
          status: 'draft'
        });
      }

      toast({
        title: 'Response generated',
        description: 'AI has created a draft response for you to review.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate response',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const approveAndPost = async () => {
    setPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update response status
      await supabase
        .from('review_responses')
        .update({
          edited_response: editedResponse,
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('review_id', review.id);

      toast({
        title: 'Response approved',
        description: 'Your response has been saved and approved.'
      });

      onResponsePosted?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post response',
        variant: 'destructive'
      });
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Response Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateResponse} disabled={generating}>
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Response
          </Button>
        </div>

        {aiResponse && (
          <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">AI Generated</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Preview' : 'Edit'}
                </Button>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              ) : (
                <p className="mt-2 whitespace-pre-wrap">{editedResponse}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={approveAndPost} disabled={posting} className="flex-1">
                {posting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ThumbsUp className="w-4 h-4 mr-2" />
                )}
                Approve & Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAiResponse('');
                  setEditedResponse('');
                }}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
