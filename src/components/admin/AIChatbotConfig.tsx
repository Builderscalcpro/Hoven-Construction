import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, BookOpen, Settings, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIChatbotConfig() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Chatbot Management
          </CardTitle>
          <CardDescription>
            Configure and train your AI chatbot with custom knowledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer" 
                  onClick={() => navigate('/admin/chatbot-training')}>
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Knowledge Base Training</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add FAQs, company info, and service details to train your chatbot
                </p>
                <Button className="w-full">
                  Manage Knowledge Base
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/chatbot-training')}>
              <CardContent className="pt-6">
                <TestTube className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Test Chatbot</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Preview and test your chatbot responses with sample questions
                </p>
                <Button className="w-full" variant="outline">
                  Test Responses
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
