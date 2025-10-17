import { supabase } from './supabase';

export interface AuditResult {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  critical: boolean;
}

export interface AuditReport {
  timestamp: string;
  overallScore: number;
  criticalIssues: AuditResult[];
  warnings: AuditResult[];
  passed: AuditResult[];
  recommendation: 'GO' | 'NO-GO';
  nextSteps: string[];
}

class ProductionAuditService {
  private results: AuditResult[] = [];

  async runFullAudit(): Promise<AuditReport> {
    this.results = [];
    
    await this.auditAPIs();
    await this.auditDatabase();
    await this.auditSecurity();
    await this.auditEnvironment();
    
    return this.generateReport();
  }

  private async auditAPIs(): Promise<void> {
    const apis = [
      { name: 'ai-chatbot', payload: { message: 'test', test: true } },
      { name: 'send-email', payload: { to: 'test@test.com', subject: 'Test', html: 'Test', test: true } },
      { name: 'stripe-process-payment', payload: { amount: 100, test: true } }
    ];

    for (const api of apis) {
      try {
        const start = Date.now();
        const { error } = await supabase.functions.invoke(api.name, { body: api.payload });
        const latency = Date.now() - start;

        this.results.push({
          category: 'API',
          item: api.name,
          status: error ? 'fail' : latency > 3000 ? 'warning' : 'pass',
          message: error ? error.message : `Response time: ${latency}ms`,
          critical: true
        });
      } catch (err: any) {
        this.results.push({
          category: 'API',
          item: api.name,
          status: 'fail',
          message: err.message,
          critical: true
        });
      }
    }
  }

  private async auditDatabase(): Promise<void> {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      this.results.push({
        category: 'Database',
        item: 'Connection',
        status: error ? 'fail' : 'pass',
        message: error ? error.message : 'Connected',
        critical: true
      });
    } catch (err: any) {
      this.results.push({
        category: 'Database',
        item: 'Connection',
        status: 'fail',
        message: err.message,
        critical: true
      });
    }
  }

  private async auditSecurity(): Promise<void> {
    const isHTTPS = window.location.protocol === 'https:';
    this.results.push({
      category: 'Security',
      item: 'SSL/TLS',
      status: isHTTPS ? 'pass' : 'fail',
      message: isHTTPS ? 'HTTPS enabled' : 'HTTPS not enabled',
      critical: true
    });
  }

  private async auditEnvironment(): Promise<void> {
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    
    for (const varName of requiredVars) {
      const exists = !!import.meta.env[varName];
      this.results.push({
        category: 'Environment',
        item: varName,
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Configured' : 'Missing',
        critical: true
      });
    }
  }

  private generateReport(): AuditReport {
    const critical = this.results.filter(r => r.status === 'fail' && r.critical);
    const warnings = this.results.filter(r => r.status === 'warning');
    const passed = this.results.filter(r => r.status === 'pass');

    const score = (passed.length / this.results.length) * 10;
    const recommendation = critical.length === 0 ? 'GO' : 'NO-GO';

    return {
      timestamp: new Date().toISOString(),
      overallScore: Math.round(score * 10) / 10,
      criticalIssues: critical,
      warnings,
      passed,
      recommendation,
      nextSteps: this.generateNextSteps(critical, warnings)
    };
  }

  private generateNextSteps(critical: AuditResult[], warnings: AuditResult[]): string[] {
    const steps: string[] = [];
    
    if (critical.length > 0) {
      steps.push(`Fix ${critical.length} critical issue(s) before launch`);
    }
    if (warnings.length > 0) {
      steps.push(`Address ${warnings.length} warning(s) for optimal performance`);
    }
    if (critical.length === 0) {
      steps.push('Monitor logs after launch');
      steps.push('Set up automated health checks');
      steps.push('Configure backup systems');
    }
    
    return steps;
  }
}

export const productionAuditService = new ProductionAuditService();
