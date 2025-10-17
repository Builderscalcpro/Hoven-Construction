import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, DollarSign, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Analytics {
  timeline: {
    predictedCompletion: string;
    confidenceInterval: { early: string; late: string };
    delayRisk: number;
    criticalPath: string[];
  };
  cost: {
    predictedTotal: number;
    overrunRisk: number;
    riskFactors: Array<{ factor: string; impact: number }>;
    savingOpportunities: Array<{ area: string; potential: number }>;
  };
  risks: Array<{
    type: string;
    probability: number;
    impact: string;
    mitigation: string;
  }>;
  recommendations: Array<{
    priority: string;
    action: string;
    impact: string;
  }>;
  confidence: number;
}

export default function AIPredictiveAnalytics({ projectId }: { projectId?: string }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch project data
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId || '')
        .single();

      // Fetch historical projects
      const { data: historicalProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'completed')
        .limit(10);

      // Fetch current progress
      const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId || '');

      const { data, error } = await supabase.functions.invoke('ai-predictive-analytics', {
        body: {
          projectData: projectData || {},
          historicalProjects: historicalProjects || [],
          currentProgress: {
            completedMilestones: milestones?.filter(m => m.status === 'completed').length || 0,
            totalMilestones: milestones?.length || 0,
            daysElapsed: 30,
            budgetSpent: 45000
          }
        }
      });

      if (error) throw error;
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch predictive analytics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchAnalytics();
    }
  }, [projectId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return "text-green-600";
    if (risk < 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (!analytics && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Predictive Analytics
          </CardTitle>
          <CardDescription>
            Get AI-powered insights into project timeline and cost predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchAnalytics} className="w-full">
            Generate Analytics
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <TrendingUp className="h-12 w-12 text-primary mx-auto" />
            </div>
            <p className="text-muted-foreground">Analyzing project data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Predicted Completion</p>
              <p className="text-xl font-bold">
                {format(new Date(analytics!.timeline.predictedCompletion), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Case</p>
              <p className="text-lg">
                {format(new Date(analytics!.timeline.confidenceInterval.early), 'MMM d')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Worst Case</p>
              <p className="text-lg">
                {format(new Date(analytics!.timeline.confidenceInterval.late), 'MMM d')}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Delay Risk</span>
              <span className={`text-sm font-bold ${getRiskColor(analytics!.timeline.delayRisk)}`}>
                {analytics!.timeline.delayRisk}%
              </span>
            </div>
            <Progress value={analytics!.timeline.delayRisk} className="h-2" />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Critical Path</p>
            <div className="flex flex-wrap gap-2">
              {analytics!.timeline.criticalPath.map((item, idx) => (
                <Badge key={idx} variant="outline">{item}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Predicted Total</p>
              <p className="text-2xl font-bold">
                {formatCurrency(analytics!.cost.predictedTotal)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overrun Risk</p>
              <p className={`text-2xl font-bold ${getRiskColor(analytics!.cost.overrunRisk)}`}>
                {analytics!.cost.overrunRisk}%
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Risk Factors</p>
            <div className="space-y-2">
              {analytics!.cost.riskFactors.map((factor, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{factor.factor}</span>
                  <Badge variant={factor.impact > 5000 ? "destructive" : "secondary"}>
                    {formatCurrency(factor.impact)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {analytics!.cost.savingOpportunities.length > 0 && (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Saving Opportunities</p>
                {analytics!.cost.savingOpportunities.map((opp, idx) => (
                  <div key={idx} className="flex justify-between mt-1">
                    <span className="text-sm">{opp.area}</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(opp.potential)}
                    </span>
                  </div>
                ))}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics!.risks.map((risk, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">{risk.type}</span>
                  <Badge 
                    variant={risk.probability > 60 ? "destructive" : risk.probability > 30 ? "secondary" : "outline"}
                  >
                    {risk.probability}% probability
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Impact: {risk.impact}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Mitigation:</span> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics!.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Badge 
                  variant={rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"}
                >
                  {rec.priority}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium text-sm">{rec.action}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expected Impact: {rec.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}