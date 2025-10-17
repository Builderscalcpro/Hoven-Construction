import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ChatbotTest() {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState("Hello, can you help me?");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const testChatbot = async () => {
    setTestStatus('testing');
    setError("");
    setResponse(null);

    try {
      console.log('Testing chatbot with message:', testMessage);
      
      // Correct payload format matching the edge function
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: testMessage,
          conversationHistory: [],
          temperature: 0.7,
          maxTokens: 1024
        }
      });

      console.log('Test response:', { data, error });

      if (error) {
        throw error;
      }

      if (data?.message) {
        setResponse(data);
        setTestStatus('success');
      } else {
        throw new Error('No message in response');
      }
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message || 'Test failed');
      setTestStatus('error');
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Chatbot Test</h2>
      
      <div className="space-y-4">
        <div>

          <label className="block text-sm font-medium mb-2">Test Message</label>
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a test message"
          />
        </div>

        <Button 
          onClick={testChatbot}
          disabled={testStatus === 'testing'}
          className="w-full"
        >
          {testStatus === 'testing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test Chatbot Function
        </Button>

        {testStatus === 'success' && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Success!</strong> Chatbot is working properly.
              <div className="mt-2 p-2 bg-white rounded border">
                <strong>Response:</strong> {response?.message}
              </div>
              {response?.debug && (
                <div className="mt-2 text-xs text-gray-600">
                  Model: {response.debug.model} | 
                  Tokens: {response.debug.usage?.total_tokens}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {testStatus === 'error' && (
          <Alert className="border-red-500 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Error:</strong> {error}
              <div className="mt-2 text-sm">
                Check the browser console for more details.
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Verify API key is set in Supabase Dashboard → Edge Functions → Secrets</li>
            <li>Check that ANTHROPIC_API_KEY starts with "sk-ant-api"</li>
            <li>Ensure the edge function is deployed (version 8 or later)</li>
            <li>Check browser console for detailed error messages</li>
            <li>Try a simple message like "Hello" first</li>
          </ol>
        </div>
      </div>
    </Card>
  );
}