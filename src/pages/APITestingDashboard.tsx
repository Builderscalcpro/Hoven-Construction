import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabaseLogsService, EdgeFunctionLog } from '@/lib/supabaseLogsService';
import { apiTestingService, edgeFunctions } from '@/lib/apiTestingService';
import { 
  Play, RefreshCw, Download, Search, Filter, ChevronDown, 
  ChevronRight, Clock, AlertCircle, CheckCircle, XCircle,
  Terminal, Activity, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export default function APITestingDashboard() {
  const [logs, setLogs] = useState<EdgeFunctionLog[]>([]);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testingAll, setTestingAll] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLogs();
    const interval = autoRefresh ? setInterval(fetchLogs, 5000) : null;
    return () => { if (interval) clearInterval(interval); };
  }, [selectedFunction, selectedLevel, searchQuery, autoRefresh]);

  const fetchLogs = async () => {
    const filter = {
      functionName: selectedFunction !== 'all' ? selectedFunction : undefined,
      level: selectedLevel !== 'all' ? selectedLevel : undefined,
      searchQuery: searchQuery || undefined
    };
    const fetchedLogs = await supabaseLogsService.fetchLogs(filter);
    setLogs(fetchedLogs);
  };

  const testFunction = async (funcId: string) => {
    const func = edgeFunctions.find(f => f.id === funcId);
    if (!func) return;
    
    setTesting(prev => ({ ...prev, [funcId]: true }));
    try {
      const result = await apiTestingService.testEdgeFunction(func);
      setTestResults(prev => ({ ...prev, [funcId]: result }));
      toast.success(`${func.name} test completed`);
    } catch (error) {
      toast.error(`${func.name} test failed`);
    } finally {
      setTesting(prev => ({ ...prev, [funcId]: false }));
    }
  };

  const testAllFunctions = async () => {
    setTestingAll(true);
    setProgress({ current: 0, total: edgeFunctions.length });
    
    try {
      const results = await apiTestingService.testAllEdgeFunctions((current, total) => {
        setProgress({ current, total });
      });
      
      const resultsMap = results.reduce((acc, r) => {
        acc[r.functionId] = r;
        return acc;
      }, {} as Record<string, any>);
      
      setTestResults(resultsMap);
      toast.success('All edge functions tested');
    } catch (error) {
      toast.error('Testing failed');
    } finally {
      setTestingAll(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const categories = apiTestingService.getCategories();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Testing Dashboard</h1>
        <p className="text-muted-foreground">Test edge functions and view real-time logs</p>
      </div>

      <Tabs defaultValue="functions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="functions">Edge Functions</TabsTrigger>
          <TabsTrigger value="logs">Function Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edge Functions Testing</CardTitle>
              <Button 
                onClick={testAllFunctions} 
                disabled={testingAll}
              >
                {testingAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing ({progress.current}/{progress.total})
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test All Functions
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category} className="border rounded-lg p-4">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h3 className="font-semibold">{category}</h3>
                      {expandedCategories.has(category) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                    
                    {expandedCategories.has(category) && (
                      <div className="mt-4 space-y-2">
                        {apiTestingService.getFunctionsByCategory(category).map(func => {
                          const result = testResults[func.id];
                          return (
                            <div key={func.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                              <div className="flex-1">
                                <p className="font-medium">{func.name}</p>
                                <p className="text-sm text-muted-foreground">{func.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {result && (
                                  <>
                                    <Badge variant={result.success ? "default" : "destructive"}>
                                      {result.success ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                      {result.responseTime}ms
                                    </Badge>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => testFunction(func.id)}
                                  disabled={testing[func.id]}
                                >
                                  {testing[func.id] ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    'Test'
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Real-time Logs</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={autoRefresh ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                  >
                    <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={fetchLogs}>
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedFunction} onValueChange={setSelectedFunction}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Functions</SelectItem>
                    {edgeFunctions.map(f => (
                      <SelectItem key={f.id} value={f.endpoint}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {logs.map(log => (
                    <div key={log.id} className="border rounded p-3">
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => toggleLogExpansion(log.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={supabaseLogsService.getLevelColor(log.level)}>
                              {log.level.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium">{log.functionName}</span>
                            <span className="text-xs text-muted-foreground">
                              {supabaseLogsService.formatLogTime(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{log.message}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedLogs.has(log.id) ? 'rotate-180' : ''}`} />
                      </div>
                      
                      {expandedLogs.has(log.id) && (
                        <div className="mt-3 pt-3 border-t">
                          {log.metadata && (
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          )}
                          {log.stackTrace && (
                            <pre className="text-xs bg-red-50 dark:bg-red-950 p-2 rounded mt-2 overflow-x-auto">
                              {log.stackTrace}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}