import { supabase } from './supabase';

export interface EdgeFunctionInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  endpoint: string;
  testPayload?: any;
}

export interface TestResult {
  functionId: string;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
  response?: any;
  timestamp: string;
}

export const edgeFunctions: EdgeFunctionInfo[] = [
  // AI Functions
  {
    id: 'ai-review-response',
    name: 'AI Review Response',
    category: 'AI',
    description: 'Generate AI-powered review responses',
    endpoint: 'generate-ai-review-response',
    testPayload: { reviewText: 'Great service!', rating: 5, test: true }
  },
  {
    id: 'ai-email-suggestions',
    name: 'AI Email Suggestions',
    category: 'AI',
    description: 'Generate email content suggestions',
    endpoint: 'generate-email-suggestions',
    testPayload: { context: 'follow-up', test: true }
  },
  {
    id: 'ai-project-estimator',
    name: 'AI Project Estimator',
    category: 'AI',
    description: 'Estimate project costs with AI',
    endpoint: 'ai-project-estimator',
    testPayload: { projectType: 'kitchen', test: true }
  },
  {
    id: 'ai-chatbot',
    name: 'AI Chatbot',
    category: 'AI',
    description: 'Process chatbot queries',
    endpoint: 'process-chatbot-query',
    testPayload: { message: 'Hello', test: true }
  },
  
  // Calendar Functions
  {
    id: 'sync-google-calendar',
    name: 'Sync Google Calendar',
    category: 'Calendar',
    description: 'Synchronize with Google Calendar',
    endpoint: 'sync-google-calendar',
    testPayload: { test: true }
  },
  {
    id: 'sync-outlook-calendar',
    name: 'Sync Outlook Calendar',
    category: 'Calendar',
    description: 'Synchronize with Outlook Calendar',
    endpoint: 'sync-outlook-calendar',
    testPayload: { test: true }
  },
  {
    id: 'calendar-webhook',
    name: 'Calendar Webhook',
    category: 'Calendar',
    description: 'Process calendar webhooks',
    endpoint: 'process-calendar-webhook',
    testPayload: { event: 'test', test: true }
  },
  
  // Business Functions
  {
    id: 'sync-google-business',
    name: 'Sync Google Business',
    category: 'Business',
    description: 'Sync Google Business Profile',
    endpoint: 'sync-google-business',
    testPayload: { test: true }
  },
  {
    id: 'fetch-reviews',
    name: 'Fetch Reviews',
    category: 'Business',
    description: 'Fetch business reviews',
    endpoint: 'fetch-business-reviews',
    testPayload: { test: true }
  },
  {
    id: 'update-business-info',
    name: 'Update Business Info',
    category: 'Business',
    description: 'Update business information',
    endpoint: 'update-business-info',
    testPayload: { test: true }
  },
  
  // Email Functions
  {
    id: 'send-email',
    name: 'Send Email',
    category: 'Email',
    description: 'Send emails via SendGrid',
    endpoint: 'send-email',
    testPayload: { to: 'test@example.com', subject: 'Test', html: '<p>Test</p>', test: true }
  },
  {
    id: 'send-reminder',
    name: 'Send Reminder',
    category: 'Email',
    description: 'Send appointment reminders',
    endpoint: 'send-appointment-reminder',
    testPayload: { appointmentId: 'test-123', test: true }
  },
  {
    id: 'email-automation',
    name: 'Email Automation',
    category: 'Email',
    description: 'Process email automation',
    endpoint: 'process-email-automation',
    testPayload: { trigger: 'test', test: true }
  },
  
  // Payment Functions
  {
    id: 'create-payment-intent',
    name: 'Create Payment Intent',
    category: 'Payments',
    description: 'Create Stripe payment intent',
    endpoint: 'stripe-create-payment-intent',
    testPayload: { amount: 100, test: true }
  },
  {
    id: 'process-payment',
    name: 'Process Payment',
    category: 'Payments',
    description: 'Process payment transactions',
    endpoint: 'process-payment',
    testPayload: { amount: 100, test: true }
  },
  {
    id: 'create-invoice',
    name: 'Create Invoice',
    category: 'Payments',
    description: 'Generate invoices',
    endpoint: 'create-invoice',
    testPayload: { projectId: 'test-123', test: true }
  },
  
  // Document Functions
  {
    id: 'generate-contract',
    name: 'Generate Contract',
    category: 'Documents',
    description: 'Generate project contracts',
    endpoint: 'generate-contract',
    testPayload: { projectId: 'test-123', test: true }
  },
  {
    id: 'generate-report',
    name: 'Generate Report',
    category: 'Documents',
    description: 'Generate project reports',
    endpoint: 'generate-report',
    testPayload: { type: 'progress', test: true }
  },
  
  // SEO Functions
  {
    id: 'generate-sitemap',
    name: 'Generate Sitemap',
    category: 'SEO',
    description: 'Generate XML sitemap',
    endpoint: 'generate-sitemap',
    testPayload: { test: true }
  },
  {
    id: 'update-meta-tags',
    name: 'Update Meta Tags',
    category: 'SEO',
    description: 'Update SEO meta tags',
    endpoint: 'update-meta-tags',
    testPayload: { pageId: 'home', test: true }
  },
  
  // System Functions
  {
    id: 'health-check',
    name: 'Health Check',
    category: 'System',
    description: 'System health check',
    endpoint: 'health-check',
    testPayload: {}
  },
  {
    id: 'cleanup-old-data',
    name: 'Cleanup Old Data',
    category: 'System',
    description: 'Clean up old data',
    endpoint: 'cleanup-old-data',
    testPayload: { test: true }
  },
  {
    id: 'backup-database',
    name: 'Backup Database',
    category: 'System',
    description: 'Backup database',
    endpoint: 'backup-database',
    testPayload: { test: true }
  }
];

class APITestingService {
  private testResults: Map<string, TestResult> = new Map();

  async testEdgeFunction(func: EdgeFunctionInfo): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke(func.endpoint, {
        body: func.testPayload || {}
      });

      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        functionId: func.id,
        success: !error,
        responseTime,
        statusCode: error ? 500 : 200,
        error: error?.message,
        response: data,
        timestamp: new Date().toISOString()
      };

      this.testResults.set(func.id, result);
      return result;
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        functionId: func.id,
        success: false,
        responseTime,
        statusCode: 500,
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      };

      this.testResults.set(func.id, result);
      return result;
    }
  }

  async testAllEdgeFunctions(
    onProgress?: (completed: number, total: number) => void
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    for (let i = 0; i < edgeFunctions.length; i++) {
      const result = await this.testEdgeFunction(edgeFunctions[i]);
      results.push(result);
      
      if (onProgress) {
        onProgress(i + 1, edgeFunctions.length);
      }
    }
    
    return results;
  }

  getTestResult(functionId: string): TestResult | undefined {
    return this.testResults.get(functionId);
  }

  getAllTestResults(): TestResult[] {
    return Array.from(this.testResults.values());
  }

  clearTestResults(): void {
    this.testResults.clear();
  }

  exportTestResults(): string {
    const results = this.getAllTestResults();
    return JSON.stringify(results, null, 2);
  }

  getCategories(): string[] {
    return [...new Set(edgeFunctions.map(f => f.category))];
  }

  getFunctionsByCategory(category: string): EdgeFunctionInfo[] {
    return edgeFunctions.filter(f => f.category === category);
  }
}

export const apiTestingService = new APITestingService();