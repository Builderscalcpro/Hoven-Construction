import { supabase } from './supabase';

export interface EdgeFunctionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'error' | 'warn' | 'debug';
  functionName: string;
  message: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  duration?: number;
  statusCode?: number;
  requestId?: string;
}

export interface LogFilter {
  functionName?: string;
  level?: string;
  startTime?: Date;
  endTime?: Date;
  searchQuery?: string;
}

class SupabaseLogsService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private mockLogs: EdgeFunctionLog[] = [];

  constructor() {
    this.generateMockLogs();
  }

  private generateMockLogs() {
    const functions = [
      'send-email', 'generate-ai-review-response', 'stripe-create-payment-intent',
      'sync-google-calendar', 'process-webhook', 'update-business-info'
    ];
    
    const levels: EdgeFunctionLog['level'][] = ['info', 'error', 'warn', 'debug'];
    const messages = [
      'Function execution started',
      'Processing webhook payload',
      'Database query executed successfully',
      'API rate limit approaching',
      'Authentication token refreshed',
      'Error: Invalid request payload',
      'Warning: Deprecated API version',
      'Email sent successfully',
      'Payment processed',
      'Calendar event synchronized'
    ];

    // Generate 50 mock logs
    for (let i = 0; i < 50; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const functionName = functions[Math.floor(Math.random() * functions.length)];
      
      this.mockLogs.push({
        id: `log-${Date.now()}-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        level,
        functionName,
        message: messages[Math.floor(Math.random() * messages.length)],
        duration: Math.floor(Math.random() * 2000),
        statusCode: level === 'error' ? 500 : 200,
        requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          userId: `user-${Math.floor(Math.random() * 100)}`,
          environment: 'production',
          region: 'us-east-1'
        },
        stackTrace: level === 'error' ? `Error: ${messages[5]}
  at processRequest (index.js:45:12)
  at async handler (index.js:12:5)
  at async Server.handleRequest (server.js:234:7)` : undefined
      });
    }

    this.mockLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async fetchLogs(filter?: LogFilter): Promise<EdgeFunctionLog[]> {
    try {
      // In production, this would call Supabase Management API
      // For now, return filtered mock data
      let logs = [...this.mockLogs];

      if (filter) {
        if (filter.functionName) {
          logs = logs.filter(log => log.functionName === filter.functionName);
        }
        
        if (filter.level) {
          logs = logs.filter(log => log.level === filter.level);
        }
        
        if (filter.startTime) {
          logs = logs.filter(log => 
            new Date(log.timestamp) >= filter.startTime!
          );
        }
        
        if (filter.endTime) {
          logs = logs.filter(log => 
            new Date(log.timestamp) <= filter.endTime!
          );
        }
        
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          logs = logs.filter(log => 
            log.message.toLowerCase().includes(query) ||
            log.functionName.toLowerCase().includes(query) ||
            JSON.stringify(log.metadata).toLowerCase().includes(query)
          );
        }
      }

      return logs.slice(0, 50);
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }

  async streamLogs(
    callback: (logs: EdgeFunctionLog[]) => void,
    filter?: LogFilter
  ): Promise<() => void> {
    // Start polling for new logs
    this.pollingInterval = setInterval(async () => {
      const logs = await this.fetchLogs(filter);
      callback(logs);
    }, 5000); // Poll every 5 seconds

    // Return cleanup function
    return () => {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    };
  }

  async getLogStats(): Promise<{
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    avgDuration: number;
    topFunctions: Array<{ name: string; count: number }>;
  }> {
    const logs = await this.fetchLogs();
    
    const stats = {
      totalLogs: logs.length,
      errorCount: logs.filter(l => l.level === 'error').length,
      warningCount: logs.filter(l => l.level === 'warn').length,
      avgDuration: 0,
      topFunctions: [] as Array<{ name: string; count: number }>
    };

    // Calculate average duration
    const durations = logs.filter(l => l.duration).map(l => l.duration!);
    stats.avgDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    // Get top functions
    const functionCounts = logs.reduce((acc, log) => {
      acc[log.functionName] = (acc[log.functionName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    stats.topFunctions = Object.entries(functionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return stats;
  }

  formatLogTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getLevelColor(level: EdgeFunctionLog['level']): string {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'debug': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  }
}

export const supabaseLogsService = new SupabaseLogsService();