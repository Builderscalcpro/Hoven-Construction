import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SkillAssessment({ contractorId, onboardingId }: any) {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAssessments();
    fetchResults();
  }, [contractorId]);

  const fetchAssessments = async () => {
    const { data } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('is_active', true)
      .order('category');
    
    setAssessments(data || []);
  };

  const fetchResults = async () => {
    const { data } = await supabase
      .from('contractor_assessment_results')
      .select('*')
      .eq('contractor_id', contractorId);
    
    setResults(data || []);
  };

  const startAssessment = (assessment: any) => {
    setActiveAssessment(assessment);
    setAnswers({});
  };

  const submitAssessment = async () => {
    const questions = activeAssessment.questions;
    let score = 0;
    
    questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correct_answer) {
        score += 1;
      }
    });

    const finalScore = Math.round((score / questions.length) * 100);
    const passed = finalScore >= activeAssessment.passing_score;

    try {
      const { error } = await supabase
        .from('contractor_assessment_results')
        .insert({
          contractor_id: contractorId,
          onboarding_id: onboardingId,
          assessment_id: activeAssessment.id,
          answers,
          score: finalScore,
          passed
        });

      if (error) throw error;

      toast({ 
        title: passed ? 'Assessment Passed!' : 'Assessment Failed',
        description: `You scored ${finalScore}%. ${passed ? 'Great job!' : 'Please try again.'}`
      });
      
      setActiveAssessment(null);
      fetchResults();
    } catch (error: any) {
      toast({ title: 'Failed to submit', description: error.message, variant: 'destructive' });
    }
  };

  const getResult = (assessmentId: string) => {
    return results.find(r => r.assessment_id === assessmentId);
  };

  if (activeAssessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{activeAssessment.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activeAssessment.questions.map((q: any, idx: number) => (
            <div key={idx} className="space-y-3">
              <p className="font-medium">{idx + 1}. {q.question}</p>
              <RadioGroup value={answers[idx]} onValueChange={(val) => setAnswers({ ...answers, [idx]: val })}>
                {q.options.map((opt: string, optIdx: number) => (
                  <div key={optIdx} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`q${idx}-${optIdx}`} />
                    <Label htmlFor={`q${idx}-${optIdx}`}>{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <div className="flex gap-2">
            <Button onClick={submitAssessment}>Submit Assessment</Button>
            <Button variant="outline" onClick={() => setActiveAssessment(null)}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Assessments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assessments.map((assessment) => {
          const result = getResult(assessment.id);
          
          return (
            <div key={assessment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{assessment.title}</h4>
                  <p className="text-sm text-muted-foreground">{assessment.category}</p>
                </div>
                {result ? (
                  <Badge variant={result.passed ? 'default' : 'destructive'}>
                    {result.passed ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {result.score}%
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Not Started
                  </Badge>
                )}
              </div>
              {!result && (
                <Button size="sm" onClick={() => startAssessment(assessment)}>
                  Start Assessment
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
