import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Smile, Meh, Frown, AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react';

export default function AISentimentAnalysis() {
  const [text, setText] = useState('');
  const [type, setType] = useState('email');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-sentiment-analysis', {
        body: { text, type, context: 'Customer communication analysis' }
      });

      if (error) throw error;
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Sentiment analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-5 w-5 text-green-500" />;
      case 'negative': return <Frown className="h-5 w-5 text-red-500" />;
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Communication Type</label>
            <div className="flex gap-2">
              {['email', 'review', 'message', 'feedback'].map((t) => (
                <Button
                  key={t}
                  variant={type === t ? 'default' : 'outline'}
                  onClick={() => setType(t)}
                  size="sm"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Paste customer communication here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />

          <Button onClick={analyzeSentiment} disabled={!text || loading}>
            {loading ? 'Analyzing...' : 'Analyze Sentiment'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getSentimentIcon(analysis.sentiment)}
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sentiment</p>
                <Badge variant={analysis.sentiment === 'positive' ? 'default' : 'destructive'}>
                  {analysis.sentiment}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{analysis.score}/100</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgency</p>
                <Badge variant={analysis.urgency === 'critical' ? 'destructive' : 'secondary'}>
                  {analysis.urgency}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge>{analysis.riskLevel}</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Summary</p>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Key Themes</p>
              <div className="flex flex-wrap gap-2">
                {analysis.themes?.map((theme: string, i: number) => (
                  <Badge key={i} variant="outline">{theme}</Badge>
                ))}
              </div>
            </div>

            {analysis.actionItems?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Action Items</p>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.actionItems.map((item: string, i: number) => (
                    <li key={i} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}