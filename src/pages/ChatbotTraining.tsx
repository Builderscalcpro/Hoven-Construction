import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KnowledgeBaseEditor from '@/components/admin/KnowledgeBaseEditor';
import ChatbotTester from '@/components/admin/ChatbotTester';
import ChatbotTrainingDashboard from '@/components/admin/ChatbotTrainingDashboard';
import { Brain, TestTube, Database, Zap } from 'lucide-react';

export default function ChatbotTraining() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Chatbot Training</h1>
        <p className="text-muted-foreground">
          Train your chatbot with custom FAQs, company information, and service details
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test Chatbot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ChatbotTrainingDashboard />
        </TabsContent>

        <TabsContent value="knowledge">
          <KnowledgeBaseEditor />
        </TabsContent>

        <TabsContent value="test">
          <ChatbotTester />
        </TabsContent>
      </Tabs>
    </div>
  );
}

