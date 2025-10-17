import { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface EstimateResult {
  costEstimate: { low: number; medium: number; high: number };
  timelineWeeks: { min: number; max: number };
  breakdown: Array<{ category: string; cost: number; percentage: number }>;
  factors: string[];
  challenges: string[];
  recommendations: string[];
  confidence: number;
}

export default function AIProjectEstimator() {
  const [projectType, setProjectType] = useState("");
  const [scope, setScope] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [materials, setMaterials] = useState("standard");
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateEstimate = async () => {
    if (!projectType || !scope) {
      toast({
        title: "Missing Information",
        description: "Please provide project type and scope",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch historical project data for comparison
      const { data: historicalData } = await supabase
        .from('projects')
        .select('name, total_cost, timeline_weeks, square_footage')
        .eq('status', 'completed')
        .limit(10);

      const { data, error } = await supabase.functions.invoke('ai-project-estimator', {
        body: {
          projectType,
          scope,
          squareFootage: squareFootage || null,
          materials,
          historicalData: historicalData || []
        }
      });

      if (error) throw error;
      setEstimate(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate estimate",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            AI Project Estimator
          </CardTitle>
          <CardDescription>
            Get instant, AI-powered estimates based on historical project data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                  <SelectItem value="bathroom">Bathroom Renovation</SelectItem>
                  <SelectItem value="addition">Home Addition</SelectItem>
                  <SelectItem value="basement">Basement Finishing</SelectItem>
                  <SelectItem value="deck">Deck/Patio</SelectItem>
                  <SelectItem value="whole-house">Whole House Remodel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                placeholder="e.g., 500"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="scope">Project Scope & Details</Label>
            <Textarea
              id="scope"
              placeholder="Describe the project scope, special requirements, desired features..."
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="materials">Material Quality</Label>
            <Select value={materials} onValueChange={setMaterials}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateEstimate} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Generating Estimate..." : "Generate AI Estimate"}
          </Button>
        </CardContent>
      </Card>

      {estimate && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Cost Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Low Estimate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(estimate.costEstimate.low)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Most Likely</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(estimate.costEstimate.medium)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">High Estimate</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(estimate.costEstimate.high)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <span className="text-sm">{estimate.confidence}%</span>
                </div>
                <Progress value={estimate.confidence} />
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Cost Breakdown</h4>
                <div className="space-y-2">
                  {estimate.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatCurrency(item.cost)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span>Estimated Duration</span>
                <span className="font-semibold">
                  {estimate.timelineWeeks.min} - {estimate.timelineWeeks.max} weeks
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Factors</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {estimate.factors.map((factor, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Potential Challenges</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {estimate.challenges.map((challenge, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {estimate.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}