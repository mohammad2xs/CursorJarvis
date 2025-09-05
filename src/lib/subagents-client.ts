export async function callSubagent(agent: string, task: string, options?: { context?: string; companyId?: string }) {
  const res = await fetch(`/api/subagents/${encodeURIComponent(agent)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, context: options?.context, companyId: options?.companyId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Failed to call subagent')
  }
  return res.json()
}

export async function listSubagents(): Promise<string[]> {
  const res = await fetch(`/api/subagents/list`, { method: 'GET' })
  if (res.ok) {
    const data = await res.json()
    if (Array.isArray(data?.agents)) return data.agents
  }
  // Fallback: hit any agent slug for listing
  const any = await fetch(`/api/subagents/_/`, { method: 'GET' })
  const data = await any.json().catch(() => ({}))
  return Array.isArray(data?.agents) ? data.agents : []
}


