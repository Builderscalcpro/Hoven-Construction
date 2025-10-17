import { useState } from "react";
import { Mail, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface EmailSuggestion {
  style: string;
  subject: string;
  body: string;
}

export default function AIEmailSuggestions() {
  const [emailContent, setEmailContent] = useState("");
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!emailContent.trim()) {
      toast({
        title: "No Content",
        description: "Please enter the email you want to respond to",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-email-suggestions', {
        body: {
          emailContent,
          context: "Construction/remodeling business correspondence",
          tone: "Professional and friendly"
        }
      });

      if (error) throw error;
      setSuggestions(data.suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate email suggestions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Email content copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const getStyleBadge = (style: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info', label: string }> = {
      brief: { variant: "secondary", label: "Brief & Direct" },
      detailed: { variant: "default", label: "Detailed & Thorough" },
      warm: { variant: "outline", label: "Warm & Personable" }
    };
    return variants[style] || { variant: "default" as const, label: style };
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          AI Email Assistant
        </CardTitle>
        <CardDescription>
          Generate professional email responses instantly with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Original Email / Context
          </label>
          <Textarea
            placeholder="Paste the email you need to respond to, or describe what you need to write..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows={6}
          />
        </div>

        <Button 
          onClick={generateSuggestions} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>Generating Suggestions...</>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Email Suggestions
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Suggested Responses</h3>
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {suggestions.map((_, idx) => {
                  const style = getStyleBadge(suggestions[idx].style);
                  return (
                    <TabsTrigger key={idx} value={idx.toString()}>
                      {style.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {suggestions.map((suggestion, idx) => {
                const style = getStyleBadge(suggestion.style);
                return (
                  <TabsContent key={idx} value={idx.toString()} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={style.variant}>{style.label}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(
                          `Subject: ${suggestion.subject}\n\n${suggestion.body}`,
                          idx
                        )}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Subject
                        </label>
                        <p className="font-medium mt-1">{suggestion.subject}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Body
                        </label>
                        <div className="mt-1 p-4 bg-muted rounded-lg">
                          <p className="whitespace-pre-wrap text-sm">
                            {suggestion.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}