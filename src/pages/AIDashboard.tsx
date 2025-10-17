import { useState } from "react";
import { Brain, Sparkles, Bot, Calendar, Calculator, Mail, FileText, TrendingUp, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AIChatbot from "@/components/AIChatbot";
import AISmartScheduling from "@/components/AISmartScheduling";
import AIProjectEstimator from "@/components/AIProjectEstimator";
import AIEmailSuggestions from "@/components/AIEmailSuggestions";
import AIDocumentClassifier from "@/components/AIDocumentClassifier";
import AIPredictiveAnalytics from "@/components/AIPredictiveAnalytics";
import AISentimentAnalysis from "@/components/AISentimentAnalysis";

export default function AIDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const aiFeatures = [
    {
      icon: Bot,
      title: "AI Chatbot",
      description: "24/7 customer support with intelligent responses",
      status: "Active",
      color: "text-green-600"
    },
    {
      icon: Calendar,
      title: "Predictive Scheduling",
      description: "ML-powered scheduling with weather & team analysis",
      status: "Active",
      color: "text-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Sentiment Analysis",
      description: "Real-time emotion & urgency detection in communications",
      status: "Active",
      color: "text-rose-600"
    },
    {
      icon: Calculator,
      title: "Project Estimator",
      description: "AI-powered cost and timeline estimates",
      status: "Active",
      color: "text-purple-600"
    },
    {
      icon: Mail,
      title: "Email Assistant",
      description: "Automated email response suggestions",
      status: "Active",
      color: "text-orange-600"
    },
    {
      icon: FileText,
      title: "Document Classifier",
      description: "Intelligent document categorization and extraction",
      status: "Active",
      color: "text-indigo-600"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Project timeline and cost predictions",
      status: "Active",
      color: "text-pink-600"
    }
  ];


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI-Powered Features</h1>
        </div>
        <p className="text-muted-foreground">
          Leverage artificial intelligence to streamline operations and enhance customer experience
        </p>
      </div>

      <Alert className="mb-6">
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>AI Features Active:</strong> All AI-powered features are running on Claude 3.5 Sonnet and analyzing your business data in real-time to provide intelligent insights and automation.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-8 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="estimator">Estimator</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>


        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                      <Badge variant="outline" className="text-green-600">
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Performance Metrics</CardTitle>
              <CardDescription>Real-time AI usage and performance statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">2,847</p>
                  <p className="text-sm text-muted-foreground">AI Interactions Today</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">94%</p>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">1.2s</p>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">$3,450</p>
                  <p className="text-sm text-muted-foreground">Cost Savings This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Chatbot Configuration</CardTitle>
                <CardDescription>Customer support automation powered by Claude 3.5</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Capabilities</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">✓</Badge>
                      <span className="text-sm">Answer questions about services</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">✓</Badge>
                      <span className="text-sm">Schedule consultations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">✓</Badge>
                      <span className="text-sm">Provide cost estimates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">✓</Badge>
                      <span className="text-sm">Explain remodeling process</span>
                    </li>
                  </ul>
                </div>
                <Alert>
                  <AlertDescription>
                    The AI chatbot is available 24/7 and appears as a floating widget on all pages.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Kitchen Remodel Inquiry</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago • Resolved</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Permit Question</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago • Resolved</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Scheduling Request</p>
                    <p className="text-xs text-muted-foreground">1 hour ago • Resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduling">
          <AISmartScheduling />
        </TabsContent>

        <TabsContent value="sentiment">
          <AISentimentAnalysis />
        </TabsContent>

        <TabsContent value="estimator">
          <AIProjectEstimator />
        </TabsContent>

        <TabsContent value="email">
          <AIEmailSuggestions />
        </TabsContent>

        <TabsContent value="documents">
          <AIDocumentClassifier />
        </TabsContent>

        <TabsContent value="analytics">
          <AIPredictiveAnalytics />
        </TabsContent>
      </Tabs>

      {/* Floating AI Chatbot */}
      <AIChatbot />
    </div>
  );
}