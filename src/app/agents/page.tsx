'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Play, RotateCcw } from 'lucide-react';

interface AgentInfo {
  capability: string;
  agent: {
    id: string;
    name: string;
    description: string;
  } | null;
}

interface AgentResult {
  ok: boolean;
  data?: any;
  error?: string;
  metadata?: {
    duration: number;
    tokensUsed?: number;
    confidence?: number;
  };
}

interface AgentStats {
  totalAgents: number;
  builtinAgents: number;
  externalAgents: number;
  capabilities: number;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<string>('');
  const [recordType, setRecordType] = useState<string>('');
  const [recordId, setRecordId] = useState<string>('');
  const [payload, setPayload] = useState<string>('{}');
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);

  // Load available agents on component mount
  useEffect(() => {
    loadAgentsInfo();
  }, []);

  const loadAgentsInfo = async () => {
    try {
      const response = await fetch('/api/agents/run');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.data.agents);
        setStats(data.data.stats);
      } else {
        console.error('Failed to load agents info');
      }
    } catch (error) {
      console.error('Error loading agents info:', error);
    }
  };

  const executeAgent = async () => {
    if (!selectedCapability) {
      alert('Please select a capability');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Parse payload JSON
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (error) {
        throw new Error('Invalid JSON in payload');
      }

      // Prepare context
      const context = {
        recordType: recordType || undefined,
        recordId: recordId || undefined,
        userId: 'demo-user',
        orgId: 'demo-org',
        payload: parsedPayload,
      };

      // Execute agent
      const response = await fetch('/api/agents/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capability: selectedCapability,
          context,
        }),
      });

      const result = await response.json();
      setResult(result);

      // Add to execution history
      setExecutionHistory(prev => [
        {
          timestamp: new Date(),
          capability: selectedCapability,
          success: result.ok,
          duration: result.metadata?.duration,
          error: result.error,
        },
        ...prev.slice(0, 9), // Keep last 10 executions
      ]);

    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCapability('');
    setRecordType('');
    setRecordId('');
    setPayload('{}');
    setResult(null);
  };

  const getCapabilityExamples = (capability: string) => {
    const examples = {
      'enrichment.waterfall': {
        recordType: 'ACCOUNT',
        recordId: 'account_123',
        payload: '{"maxCost": 50}',
      },
      'conversation.insights': {
        recordType: 'DEAL',
        recordId: 'deal_123',
        payload: '{"transcript": "Customer seems interested in our solution..."}',
      },
      'sequence.orchestrate': {
        recordType: '',
        recordId: '',
        payload: '{"action": "create", "name": "Enterprise Outreach", "profile": "Enterprise Decision Makers"}',
      },
      'process.autonomy': {
        recordType: 'LEAD',
        recordId: 'lead_123',
        payload: '{"goal": "qualify_lead", "parameters": {"maxEnrichmentCost": 100}}',
      },
    };
    return examples[capability as keyof typeof examples];
  };

  const loadExample = () => {
    if (selectedCapability) {
      const example = getCapabilityExamples(selectedCapability);
      if (example) {
        setRecordType(example.recordType);
        setRecordId(example.recordId);
        setPayload(example.payload);
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Agent Testing Console</h1>
            <p className="text-muted-foreground mt-2">
              Test and debug AI agents for CRM automation
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadAgentsInfo} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Registry Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalAgents}</div>
                  <div className="text-sm text-muted-foreground">Total Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.builtinAgents}</div>
                  <div className="text-sm text-muted-foreground">Built-in</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.externalAgents}</div>
                  <div className="text-sm text-muted-foreground">External</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.capabilities}</div>
                  <div className="text-sm text-muted-foreground">Capabilities</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="execute" className="w-full">
          <TabsList>
            <TabsTrigger value="execute">Execute Agent</TabsTrigger>
            <TabsTrigger value="history">Execution History</TabsTrigger>
            <TabsTrigger value="agents">Agent Details</TabsTrigger>
          </TabsList>

          <TabsContent value="execute" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Execution Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Agent Execution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="capability">Capability</Label>
                    <Select value={selectedCapability} onValueChange={setSelectedCapability}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a capability" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.capability} value={agent.capability}>
                            {agent.capability}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recordType">Record Type (optional)</Label>
                      <Select value={recordType} onValueChange={setRecordType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select record type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="ACCOUNT">Account</SelectItem>
                          <SelectItem value="CONTACT">Contact</SelectItem>
                          <SelectItem value="LEAD">Lead</SelectItem>
                          <SelectItem value="DEAL">Deal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="recordId">Record ID (optional)</Label>
                      <Input
                        id="recordId"
                        value={recordId}
                        onChange={(e) => setRecordId(e.target.value)}
                        placeholder="e.g., account_123"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payload">Payload (JSON)</Label>
                    <Textarea
                      id="payload"
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      placeholder="Enter JSON payload"
                      className="min-h-[120px] font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={executeAgent} disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Execute Agent
                        </>
                      )}
                    </Button>
                    <Button onClick={loadExample} variant="outline" disabled={!selectedCapability}>
                      Load Example
                    </Button>
                    <Button onClick={resetForm} variant="outline">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Result */}
              <Card>
                <CardHeader>
                  <CardTitle>Execution Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {result.ok ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <Badge variant={result.ok ? 'default' : 'destructive'}>
                          {result.ok ? 'Success' : 'Error'}
                        </Badge>
                        {result.metadata?.duration && (
                          <Badge variant="outline">
                            {result.metadata.duration}ms
                          </Badge>
                        )}
                      </div>

                      {result.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-700 text-sm">{result.error}</p>
                        </div>
                      )}

                      {result.data && (
                        <div>
                          <Label>Response Data</Label>
                          <pre className="bg-gray-50 border rounded-lg p-3 text-sm overflow-auto max-h-96">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {result.metadata && (
                        <div>
                          <Label>Metadata</Label>
                          <pre className="bg-gray-50 border rounded-lg p-3 text-sm">
                            {JSON.stringify(result.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Execute an agent to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
              </CardHeader>
              <CardContent>
                {executionHistory.length > 0 ? (
                  <div className="space-y-2">
                    {executionHistory.map((execution, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {execution.success ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium">{execution.capability}</div>
                            <div className="text-sm text-muted-foreground">
                              {execution.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {execution.duration && (
                            <Badge variant="outline">{execution.duration}ms</Badge>
                          )}
                          {execution.error && (
                            <div className="text-sm text-red-600 mt-1">
                              {execution.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No executions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agentInfo) => (
                <Card key={agentInfo.capability}>
                  <CardHeader>
                    <CardTitle className="text-lg">{agentInfo.capability}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {agentInfo.agent ? (
                      <div className="space-y-2">
                        <div>
                          <Label>Agent ID</Label>
                          <p className="text-sm font-mono">{agentInfo.agent.id}</p>
                        </div>
                        <div>
                          <Label>Name</Label>
                          <p className="text-sm">{agentInfo.agent.name}</p>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <p className="text-sm text-muted-foreground">
                            {agentInfo.agent.description}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No agent available</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}