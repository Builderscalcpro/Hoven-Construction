import { useState } from "react";
import { FileText, Upload, Tag, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ClassificationResult {
  classification: string;
  confidence: number;
  tags: string[];
  extractedInfo: {
    dates: string[];
    amounts: string[];
    parties: string[];
    other: string[];
  };
  summary: string;
}

export default function AIDocumentClassifier() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const classifyDocument = async () => {
    if (!file) {
      toast({
        title: "No File",
        description: "Please select a file to classify",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let fileContent = "";
      
      // For text files, read content
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        fileContent = await file.text();
      }

      const { data, error } = await supabase.functions.invoke('ai-document-classifier', {
        body: {
          fileName: file.name,
          fileContent: fileContent.substring(0, 2000), // Send first 2000 chars
          fileType: file.type
        }
      });

      if (error) throw error;
      setResult(data);

      // Store classification in database
      await supabase.from('document_classifications').insert({
        file_name: file.name,
        file_type: file.type,
        classification: data.classification,
        confidence: data.confidence,
        tags: data.tags,
        extracted_info: data.extractedInfo,
        summary: data.summary
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to classify document",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    const colors: Record<string, string> = {
      Contract: "bg-blue-500",
      Invoice: "bg-green-500",
      Permit: "bg-purple-500",
      Blueprint: "bg-indigo-500",
      Photo: "bg-pink-500",
      Report: "bg-yellow-500",
      Correspondence: "bg-orange-500",
      Other: "bg-gray-500"
    };
    return colors[classification] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Document Classifier
          </CardTitle>
          <CardDescription>
            Automatically classify and extract information from documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Upload Document
            </label>
            <div className="flex gap-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx,.jpg,.png"
              />
            </div>
            {file && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                  <Badge variant="outline" className="ml-auto">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={classifyDocument} 
            disabled={!file || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>Analyzing Document...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Classify Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Classification Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getClassificationColor(result.classification)}`} />
                  <span className="text-2xl font-bold">{result.classification}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-xl font-semibold">{result.confidence}%</p>
                </div>
              </div>

              <Progress value={result.confidence} className="h-2" />

              <div>
                <h4 className="font-semibold mb-2">Document Summary</h4>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.extractedInfo.dates.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Dates</h4>
                  <div className="space-y-1">
                    {result.extractedInfo.dates.map((date, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">• {date}</p>
                    ))}
                  </div>
                </div>
              )}

              {result.extractedInfo.amounts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Amounts</h4>
                  <div className="space-y-1">
                    {result.extractedInfo.amounts.map((amount, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">• {amount}</p>
                    ))}
                  </div>
                </div>
              )}

              {result.extractedInfo.parties.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Parties Involved</h4>
                  <div className="space-y-1">
                    {result.extractedInfo.parties.map((party, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">• {party}</p>
                    ))}
                  </div>
                </div>
              )}

              {result.extractedInfo.other.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Other Information</h4>
                  <div className="space-y-1">
                    {result.extractedInfo.other.map((info, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">• {info}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}