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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
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
                  <div className="flex items-center gap-2">
                    <Input value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="company id" />
                    <Button type="button" variant="outline" onClick={handleCreateTestCompany}>Create Test Company</Button>
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
