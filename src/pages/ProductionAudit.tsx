import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Download,
  Play,
  Shield,
  Database,
  Zap,
  Settings
} from 'lucide-react';
import { productionAuditService, AuditReport } from '@/lib/productionAuditService';
import { apiTestingService } from '@/lib/apiTestingService';

const ProductionAudit: React.FC = () => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiTestProgress, setApiTestProgress] = useState(0);

  const runAudit = async () => {
    setLoading(true);
    try {
      const auditReport = await productionAuditService.runFullAudit();
      setReport(auditReport);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAllAPIs = async () => {
    setLoading(true);
    setApiTestProgress(0);
    
    try {
      await apiTestingService.testAllEdgeFunctions((completed, total) => {
        setApiTestProgress((completed / total) * 100);
      });
    } finally {
      setLoading(false);
      runAudit();
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-audit-${new Date().toISOString()}.json`;
    a.click();
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Production Readiness Audit</h1>
          <p className="text-lg text-gray-600">
            Comprehensive pre-launch testing and validation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button onClick={runAudit} disabled={loading} className="w-full">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Run Full Audit
          </Button>
          <Button onClick={testAllAPIs} disabled={loading} variant="outline" className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Test All APIs
          </Button>
          <Button onClick={downloadReport} disabled={!report} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        {apiTestProgress > 0 && apiTestProgress < 100 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Testing APIs...</span>
                  <span>{Math.round(apiTestProgress)}%</span>
                </div>
                <Progress value={apiTestProgress} />
              </div>
            </CardContent>
          </Card>
        )}

        {report && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overall Status</span>
                  <Badge 
                    variant={report.recommendation === 'GO' ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {report.recommendation}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Readiness Score: {report.overallScore}/10
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={report.overallScore * 10} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{report.passed.length}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{report.warnings.length}</div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{report.criticalIssues.length}</div>
                    <div className="text-sm text-gray-600">Critical</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {report.criticalIssues.length > 0 && (
              <Alert variant="destructive" className="mb-8">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Critical Issues Found:</strong> Fix these before launching to production
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    API Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...report.criticalIssues, ...report.warnings, ...report.passed]
                      .filter(r => r.category === 'API')
                      .map((result, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {result.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {result.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                            {result.status === 'fail' && <XCircle className="h-5 w-5 text-red-600" />}
                            <div>
                              <div className="font-medium">{result.item}</div>
                              <div className="text-sm text-gray-600">{result.message}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Database & Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...report.criticalIssues, ...report.warnings, ...report.passed]
                      .filter(r => r.category === 'Database' || r.category === 'Security')
                      .map((result, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {result.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {result.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                            {result.status === 'fail' && <XCircle className="h-5 w-5 text-red-600" />}
                            <div>
                              <div className="font-medium">{result.item}</div>
                              <div className="text-sm text-gray-600">{result.message}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  {report.nextSteps.map((step, idx) => (
                    <li key={idx} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductionAudit;
