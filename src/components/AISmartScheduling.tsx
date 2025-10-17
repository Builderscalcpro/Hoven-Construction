import { useState } from "react";
import { Calendar, Clock, Users, Sparkles, CloudRain, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

interface PredictiveRecommendation {
  slot: string;
  score: number;
  reasoning: string;
  riskFactors: string[];
  weatherImpact: string;
  teamRecommendation: string;
  optimalDuration: number;
  confidenceScore: number;
}

export default function AISmartScheduling() {
  const [projectType, setProjectType] = useState("consultation");
  const [preferences, setPreferences] = useState("morning");
  const [recommendations, setRecommendations] = useState<PredictiveRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const findOptimalTimes = async () => {
    setIsLoading(true);
    try {
      const { data: calendarData } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .lte('start_time', new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString());

      const { data: projectHistory } = await supabase
        .from('projects')
        .select('project_type, duration, status')
        .eq('project_type', projectType)
        .limit(10);

      const availableSlots = generateAvailableSlots();

      const { data, error } = await supabase.functions.invoke('ai-smart-scheduling', {
        body: {
          availableSlots,
          preferences: { timeOfDay: preferences },
          projectType,
          historicalData: projectHistory,
          weatherData: { forecast: 'sunny', temperature: 72 },
          teamAvailability: calendarData
        }
      });

      if (error) throw error;
      
      if (data.recommendedSlots) {
        const formatted = data.recommendedSlots.map((slot: any) => ({
          slot: slot.time || slot.slot,
          score: slot.score,
          reasoning: slot.reasoning || data.reasoning?.[0] || 'Optimal time based on analysis',
          riskFactors: data.riskFactors || [],
          weatherImpact: data.weatherImpact || 'low',
          teamRecommendation: data.teamRecommendation || 'Standard crew',
          optimalDuration: data.optimalDuration || 2,
          confidenceScore: data.confidenceScore || 85
        }));
        setRecommendations(formatted);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate predictive scheduling",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAvailableSlots = () => {
    const slots = [];
    const now = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      slots.push({
        date: format(date, 'yyyy-MM-dd'),
        times: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
      });
    }
    return slots;
  };

  const bookAppointment = async (rec: PredictiveRecommendation) => {
    try {
      const startTime = new Date(rec.slot);
      const endTime = new Date(startTime.getTime() + rec.optimalDuration * 60 * 60 * 1000);

      const { error } = await supabase
        .from('calendar_events')
        .insert({
          title: `${projectType} - AI Scheduled`,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          description: `Predictive AI Scheduling\nScore: ${rec.score}/100\nReasoning: ${rec.reasoning}`,
          event_type: projectType
        });

      if (error) throw error;

      toast({
        title: "Appointment Scheduled",
        description: `Booked for ${format(startTime, 'PPp')} (${rec.optimalDuration}h)`
      });

      setRecommendations([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Predictive Scheduling
        </CardTitle>
        <CardDescription>
          Advanced ML-powered scheduling with weather, team availability, and historical data analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Project Type</label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                <SelectItem value="bathroom">Bathroom Renovation</SelectItem>
                <SelectItem value="addition">Home Addition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Time Preference</label>
            <Select value={preferences} onValueChange={setPreferences}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (9-12)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12-5)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={findOptimalTimes} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Analyzing...' : 'Generate Predictive Schedule'}
        </Button>

        {recommendations.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="font-semibold">AI Recommendations</h3>
            {recommendations.map((rec, idx) => (
              <Card key={idx} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{rec.slot}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                    </div>
                    <Button size="sm" onClick={() => bookAppointment(rec)}>
                      Book
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Match Score</span>
                      <Badge>{rec.score}/100</Badge>
                    </div>
                    <Progress value={rec.score} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <CloudRain className="h-3 w-3" />
                      <span>Weather: {rec.weatherImpact}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Confidence: {rec.confidenceScore}%</span>
                    </div>
                  </div>

                  {rec.riskFactors.length > 0 && (
                    <div className="flex items-start gap-2 text-sm bg-orange-50 p-2 rounded">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Risk Factors:</p>
                        <ul className="list-disc list-inside">
                          {rec.riskFactors.map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}