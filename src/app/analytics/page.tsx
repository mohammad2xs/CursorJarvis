'use client'

import { useState, useEffect } from 'react'
import { listSubagents, callSubagent } from '@/lib/subagents-client'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { WeeklyDigestComponent } from '@/components/dashboard/weekly-digest'
import { toast } from 'sonner'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { WeeklyDigest } from '@/types'

export default function AnalyticsPage() {
  const [digest] = useState<WeeklyDigest>({
    topPlays: [
      { playType: 'PRE_MEETING', count: 12, successRate: 85 },
      { playType: 'POST_MEETING', count: 8, successRate: 92 },
      { playType: 'NEW_LEAD', count: 15, successRate: 67 },
      { playType: 'VP_CMO_NO_TOUCH', count: 6, successRate: 78 },
      { playType: 'PERPLEXITY_NEWS', count: 4, successRate: 88 }
    ],
    stalls: [
      { type: 'Idle Opportunities', count: 3, description: 'Opportunities with no activity for 7+ days' },
      { type: 'Stalled Discovery', count: 2, description: 'Discovery stage taking longer than 14 days' },
      { type: 'Low Engagement', count: 5, description: 'Contacts with minimal engagement' }
    ],
    pillarPerformance: [
      { subIndustry: 'Tech/SaaS', meetings: 8, opportunities: 12, revenue: 150000 },
      { subIndustry: 'Oil & Gas/Energy', meetings: 4, opportunities: 6, revenue: 200000 },
      { subIndustry: 'Healthcare/MedSys', meetings: 3, opportunities: 4, revenue: 75000 },
      { subIndustry: 'Consumer/CPG', meetings: 2, opportunities: 3, revenue: 50000 },
      { subIndustry: 'Aerospace & Defense', meetings: 1, opportunities: 2, revenue: 100000 }
    ],
    ruleChanges: {
      promote: [
        { playType: 'PRE_MEETING', segment: 'Tech/SaaS', reason: '85% acceptance rate, 92% meeting success' },
        { playType: 'PERPLEXITY_NEWS', segment: 'Oil & Gas/Energy', reason: '88% acceptance rate, high engagement' }
      ],
      retire: [
        { playType: 'VP_CMO_NO_TOUCH', segment: 'Consumer/CPG', reason: 'Only 45% acceptance rate for 2 weeks' }
      ]
    },
    nextWeekFocus: [
      { 
        subIndustry: 'Tech/SaaS', 
        priority: 'Focus on AI/ML companies with creative needs',
        actions: ['Target AI startups', 'Emphasize automation benefits', 'Leverage Perplexity insights']
      },
      { 
        subIndustry: 'Oil & Gas/Energy', 
        priority: 'ESG-focused messaging and sustainability',
        actions: ['Highlight ESG content library', 'Share sustainability case studies', 'Target ESG initiatives']
      }
    ],
    perplexityWins: [
      { 
        signal: 'TechCorp announced AI initiative', 
        action: 'Sent AI-focused case study', 
        outcome: 'Scheduled demo meeting' 
      },
      { 
        signal: 'Energy Corp hired new CMO', 
        action: 'Congratulatory outreach with ESG content', 
        outcome: 'Positive response and follow-up meeting' 
      },
      { 
        signal: 'Healthcare company regulatory update', 
        action: 'Compliance-focused value proposition', 
        outcome: 'Moved to proposal stage' 
      }
    ]
  })

  const [agents, setAgents] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const [task, setTask] = useState<string>('')
  const [context, setContext] = useState<string>('')
  const [companyId, setCompanyId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [autoInsights, setAutoInsights] = useState<Record<string, unknown>[]>([])
  const [loadingAuto, setLoadingAuto] = useState<boolean>(false)
  const [seededCompanies, setSeededCompanies] = useState<Array<{ id: string; name: string; createdAt: string }>>([])
  const [loadingSeeds, setLoadingSeeds] = useState<boolean>(false)
  const [persistedInsights, setPersistedInsights] = useState<Array<{ id: string; title: string; summary: string; source: string; detectedAt: string; tags: string[] }>>([])
  const [health, setHealth] = useState<{ ok: boolean; version: string; db: boolean; envs: Record<string, boolean> } | null>(null)
  const [healthLoading, setHealthLoading] = useState<boolean>(false)

  useEffect(() => {
    const load = async () => {
      try {
        const a = await listSubagents()
        setAgents(a)
        if (a.length > 0) setSelectedAgent(a[0])
      } catch {
        // ignore
      }
    }
    load()
    // Load health on mount
    ;(async () => {
      try {
        setHealthLoading(true)
        const h = await fetch('/api/health').then(r => r.json())
        setHealth(h)
      } catch {
        setHealth({ ok: false, version: '', db: false, envs: {} })
      } finally {
        setHealthLoading(false)
      }
    })()
  }, [])

  const handleRun = async () => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await callSubagent(selectedAgent || '_', task, { context, companyId: companyId || undefined })
      setResult(res?.answer || '')
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Failed to execute subagent')
    } finally {
      setLoading(false)
    }
  }

  const handleRunAutoSubagents = async () => {
    if (!companyId) {
      setError('Please enter a Company ID to run auto-subagents')
      return
    }
    
    setLoadingAuto(true)
    setError('')
    try {
      const res = await fetch('/api/auto-subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId })
      })
      const data = await res.json()
      if (res.ok) {
        setAutoInsights(data.results || [])
        // after run, attempt to fetch persisted signals
        try {
          const pi = await fetch(`/api/insights/recent?companyId=${encodeURIComponent(companyId)}`).then(r => r.json())
          if (Array.isArray(pi?.insights)) setPersistedInsights(pi.insights)
        } catch {}
      } else {
        setError(data.error || 'Failed to run auto-subagents')
      }
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Failed to run auto-subagents')
    } finally {
      setLoadingAuto(false)
    }
  }

  const handleCreateTestCompany = async () => {
    setError('')
    try {
      const res = await fetch('/api/dev/create-test-company', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data?.company?.id) {
        throw new Error(data?.error || 'Failed to create test company')
      }
      setCompanyId(String(data.company.id))
      toast.success('Test company created', { description: `Company ID set to ${data.company.id}` })
    } catch (e: unknown) {
      const msg = (e as Error)?.message || 'Failed to create test company'
      setError(msg)
      toast.error('Error', { description: msg })
    }
  }

  const handlePromoteRule = async (playType: string, segment: string) => {
    try {
      const response = await fetch('/api/rules/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playType, segment }),
      })

      if (response.ok) {
        console.log(`Promoted rule: ${playType} for ${segment}`)
        // In real app, update the digest state
      }
    } catch (error) {
      console.error('Error promoting rule:', error)
    }
  }

  const handleLoadSeededCompanies = async () => {
    setLoadingSeeds(true)
    setError('')
    try {
      const res = await fetch('/api/dev/seeded-companies')
      const data = await res.json()
      const list = Array.isArray(data?.companies) ? data.companies : []
      setSeededCompanies(list)
      if (list.length === 0) {
        toast('No test companies found', { description: 'Click "Create Test Company" to seed one.' })
      } else {
        toast.success('Loaded test companies', { description: `${list.length} found` })
      }
    } catch (e: unknown) {
      const msg = (e as Error)?.message || 'Failed to load test companies'
      setError(msg)
      toast.error('Error', { description: msg })
    } finally {
      setLoadingSeeds(false)
    }
  }

  const handleCleanTestData = async () => {
    setError('')
    try {
      const res = await fetch('/api/dev/clean-test-data', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to clean test data')
      setSeededCompanies([])
      setCompanyId('')
      toast.success('Test data removed', { description: `${data?.deletedCount || 0} companies deleted` })
    } catch (e: unknown) {
      const msg = (e as Error)?.message || 'Failed to clean test data'
      setError(msg)
      toast.error('Error', { description: msg })
    }
  }

  const handleLoadPersistedInsights = async () => {
    if (!companyId) {
      setError('Please enter a Company ID to load insights')
      return
    }
    setError('')
    try {
      const pi = await fetch(`/api/insights/recent?companyId=${encodeURIComponent(companyId)}`).then(r => r.json())
      if (Array.isArray(pi?.insights)) setPersistedInsights(pi.insights)
      toast.success('Loaded persisted insights', { description: `${pi?.insights?.length || 0} found` })
    } catch (e: unknown) {
      const msg = (e as Error)?.message || 'Failed to load insights'
      setError(msg)
      toast.error('Error', { description: msg })
    }
  }

  const handleRetireRule = async (playType: string, segment: string) => {
    try {
      const response = await fetch('/api/rules/retire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playType, segment }),
      })

      if (response.ok) {
        console.log(`Retired rule: ${playType} for ${segment}`)
        // In real app, update the digest state
      }
    } catch (error) {
      console.error('Error retiring rule:', error)
    }
  }

  const handleRefreshHealth = async () => {
    try {
      setHealthLoading(true)
      const h = await fetch('/api/health').then(r => r.json())
      setHealth(h)
      toast.success('Health refreshed')
    } catch (e: unknown) {
      const msg = (e as Error)?.message || 'Failed to refresh health'
      setError(msg)
      toast.error('Error', { description: msg })
    } finally {
      setHealthLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Dev Tools */}
          <div className="mb-6 grid grid-cols-1 gap-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dev Tools</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleRefreshHealth} disabled={healthLoading}>
                    {healthLoading ? 'Refreshing…' : 'Refresh Health'}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Health</div>
                  <div className="text-sm text-gray-700">
                    <div>Status: {health?.ok && health?.db ? 'OK' : 'Degraded'}</div>
                    <div>DB: {health?.db ? 'OK' : 'Unavailable'}</div>
                    <div>Version: {health?.version || '-'}</div>
                    {health && (
                      <div className="mt-1 text-xs text-gray-500">
                        Missing envs: {Object.entries(health.envs || {}).filter(([,v]) => !v).map(([k]) => k).join(', ') || 'none'}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Seed & Data</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" onClick={handleLoadSeededCompanies} disabled={loadingSeeds}>
                      {loadingSeeds ? 'Loading…' : 'Load Test Companies'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCreateTestCompany}>Create Test Company</Button>
                    <Button type="button" variant="destructive" onClick={handleCleanTestData}>Clean Test Data</Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Quick Links</div>
                  <div className="text-sm text-blue-700 underline space-x-3">
                    <a href="/ui-demo">UI Demo</a>
                    <a href="/ui-advanced-demo">Advanced UI</a>
                    <a href="/reports">Reports</a>
                    <a href="/settings">Settings</a>
                    <a href="/api/health" target="_blank" rel="noreferrer">/api/health</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Run Subagent</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Agent</label>
                  <Select value={selectedAgent} onValueChange={(v) => setSelectedAgent(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Company ID (optional)</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="company id" className="w-[220px]" />
                    <Select onValueChange={(v) => setCompanyId(v)}>
                      <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select Test Company" /></SelectTrigger>
                      <SelectContent>
                        {seededCompanies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={handleLoadSeededCompanies} disabled={loadingSeeds}>
                      {loadingSeeds ? 'Loading…' : 'Load Test Companies'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCreateTestCompany}>Create Test Company</Button>
                    <Button type="button" variant="destructive" onClick={handleCleanTestData}>Clean Test Data</Button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium">Task</label>
                <Textarea value={task} onChange={(e) => setTask(e.target.value)} rows={3} placeholder="Describe what you want the agent to do" />
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium">Context (optional)</label>
                <Textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="Add any additional context" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button onClick={handleRun} disabled={loading || !selectedAgent || !task}>
                  {loading ? 'Running…' : 'Run Agent'}
                </Button>
                <Button onClick={handleRunAutoSubagents} disabled={loadingAuto || !companyId} variant="outline">
                  {loadingAuto ? 'Running Auto…' : 'Run Auto-Subagents'}
                </Button>
                {error && <span className="text-sm text-red-600">{error}</span>}
              </div>
              {result && (
                <div className="mt-4 rounded-md border bg-gray-50 p-3 text-sm whitespace-pre-wrap">
                  {result}
                </div>
              )}
            </div>
          </div>
          
          {autoInsights.length > 0 && (
            <div className="mb-6">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Auto-Generated Sales Insights</h2>
                  <span className="text-sm text-gray-500">{autoInsights.length} insights</span>
                </div>
                <div className="space-y-4">
                  {autoInsights.map((insight, index) => (
                    <div key={index} className="rounded-md border-l-4 border-blue-500 bg-blue-50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-blue-900">{String(insight.trigger)}</h3>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Priority: {String(insight.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">{String(insight.summary)}</p>
                      <div className="mt-2 text-xs text-blue-600">
                        Generated by: {String(insight.agent)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Persisted Insights</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleLoadPersistedInsights}>Load Persisted Insights</Button>
                  <span className="text-sm text-gray-500">{persistedInsights.length} items</span>
                </div>
              </div>
              <div className="space-y-3">
                {persistedInsights.map((i) => (
                  <div key={i.id} className="rounded-md border bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{i.title}</div>
                      <div className="text-xs text-gray-500">{new Date(i.detectedAt).toLocaleString()}</div>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{i.summary}</p>
                    <div className="text-xs text-gray-500 mt-1">Source: {i.source} &middot; Tags: {i.tags?.join(', ')}</div>
                  </div>
                ))}
                {persistedInsights.length === 0 && (
                  <div className="text-sm text-gray-500">No insights yet. Run Auto‑Subagents or load after seeding.</div>
                )}
              </div>
            </div>
          </div>
          <WeeklyDigestComponent 
            digest={digest}
            onPromoteRule={handlePromoteRule}
            onRetireRule={handleRetireRule}
          />
        </main>
      </div>
    </div>
  )
}
