import ChatbotTest from "@/components/ChatbotTest";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ChatbotTestPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">AI Chatbot Diagnostics</h1>
      
      <ChatbotTest />

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">API Key Status</h3>
          <p className="text-sm text-blue-800">
            The ANTHROPIC_API_KEY should be configured in Supabase Dashboard.
            Last updated: 2025-10-05
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3">Edge Function Status</h3>
          <p className="text-sm text-green-800">
            Function: ai-chatbot (Version 8)
            <br />
            Status: ACTIVE
          </p>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Quick Fix Guide</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            <strong>If getting 401 error:</strong> API key is invalid. Update ANTHROPIC_API_KEY in Supabase.
          </li>
          <li>
            <strong>If getting 429 error:</strong> Rate limit exceeded. Wait a moment and try again.
          </li>
          <li>
            <strong>If getting network error:</strong> Check that edge function is deployed and active.
          </li>
          <li>
            <strong>If no response:</strong> Redeploy the edge function to pick up new secrets.
          </li>
        </ol>
      </div>
    </div>
  );
}