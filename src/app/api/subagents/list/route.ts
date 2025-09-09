import { NextResponse } from 'next/server'
import { listAvailableSubagentSlugs } from '@/lib/subagent-registry'

export async function GET() {
  const agents = listAvailableSubagentSlugs()
  return NextResponse.json({ agents })
}
