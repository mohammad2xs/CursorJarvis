import { NextRequest, NextResponse } from 'next/server'
import { autoSubagentOrchestrator } from '@/lib/auto-subagents'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { companyId, triggerType } = await req.json()

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    // Get company context
    const company = await db.company.findUnique({
      where: { id: companyId },
      include: {
        contacts: true,
        opportunities: true,
        meetings: {
          where: {
            scheduledAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          },
          orderBy: { scheduledAt: 'desc' },
          take: 1
        },
        accountSignals: {
          where: {
            detectedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          orderBy: { detectedAt: 'desc' },
          take: 10
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const context = {
      company,
      contact: company.contacts[0] || undefined,
      opportunity: company.opportunities[0] || undefined,
      meeting: company.meetings[0] || undefined,
      recentSignals: company.accountSignals
    }

    // Process auto-subagents
    const results = await autoSubagentOrchestrator.processCompanyContext(context)

    // Store results as account signals
    for (const result of results) {
      await db.accountSignal.create({
        data: {
          title: `Auto-Subagent: ${result.trigger}`,
          summary: result.result.substring(0, 500),
          source: 'auto_subagent',
          url: '',
          detectedAt: new Date(),
          tags: [result.trigger.toLowerCase(), 'auto_generated'],
          provenance: JSON.stringify({
            agent: result.agent,
            task: result.task,
            priority: result.priority
          }),
          companyId: company.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      results: results.map(r => ({
        trigger: r.trigger,
        agent: r.agent,
        priority: r.priority,
        summary: r.result.substring(0, 200) + '...'
      }))
    })

  } catch (error: any) {
    console.error('Auto-subagent processing error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Failed to process auto-subagents' 
    }, { status: 500 })
  }
}
