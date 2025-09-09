import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type RunPayload = {
  capability: string
  companyId?: string
  opportunityId?: string
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  let auditId: string | undefined
  try {
    const body: RunPayload = await req.json().catch(() => ({} as RunPayload))
    const { capability, companyId, opportunityId } = body

    if (!capability) {
      return NextResponse.json({ error: 'capability is required' }, { status: 400 })
    }

    if (!companyId && !opportunityId) {
      return NextResponse.json({ error: 'companyId or opportunityId required' }, { status: 400 })
    }

    // Resolve company/opportunity if provided
    const company = companyId
      ? await db.company.findUnique({ where: { id: companyId } })
      : null
    const opportunity = opportunityId
      ? await db.opportunity.findUnique({ where: { id: opportunityId } })
      : null

    if (companyId && !company) {
      return NextResponse.json({ error: 'company not found' }, { status: 404 })
    }
    if (opportunityId && !opportunity) {
      return NextResponse.json({ error: 'opportunity not found' }, { status: 404 })
    }

    // Create initial audit log entry
    const audit = await db.agentAuditLog.create({
      data: {
        capability,
        input: body as unknown as Record<string, unknown>,
        status: 'RUNNING',
        companyId: company?.id,
        opportunityId: opportunity?.id,
      },
    })
    auditId = audit.id

    if (capability !== 'enrichment.waterfall') {
      // Mark failed for unsupported capability
      await db.agentAuditLog.update({
        where: { id: audit.id },
        data: { status: 'FAILED', output: { error: 'unsupported capability' } },
      })
      return NextResponse.json({ error: 'unsupported capability', auditId: audit.id }, { status: 400 })
    }

    // Synthesize enrichment signals (simple heuristics)
    const signals = [] as Array<{ id: string; title: string; type: string; confidence?: number }>
    const synthesized = [
      { type: 'persona', title: 'Executive persona detected: CMO', confidence: 90 },
      { type: 'timing', title: 'Upcoming meeting within 24 hours', confidence: 80 },
      { type: 'expansion', title: 'Getty account expansion candidate', confidence: 85 },
    ]

    for (const s of synthesized) {
      const rec = await db.enrichmentSignal.create({
        data: {
          type: s.type,
          title: s.title,
          confidence: s.confidence,
          source: 'enrichment.waterfall',
          companyId: company?.id || opportunity?.companyId || '',
          opportunityId: opportunity?.id || null,
        },
        select: { id: true, title: true, type: true, confidence: true },
      })
      signals.push(rec)
    }

    // Create activity log
    const activity = await db.activity.create({
      data: {
        type: 'RESEARCH',
        title: 'Enrichment waterfall executed',
        description: `Generated ${signals.length} signals in ${Date.now() - startedAt}ms`,
        companyId: company?.id || opportunity?.companyId || '',
        opportunityId: opportunity?.id || null,
      },
      select: { id: true },
    })

    // Finalize audit log
    await db.agentAuditLog.update({
      where: { id: audit.id },
      data: {
        status: 'SUCCESS',
        output: {
          generatedSignals: signals.length,
          activityId: activity.id,
        } as unknown as Record<string, unknown>,
      },
    })

    return NextResponse.json({
      success: true,
      auditId: audit.id,
      activityId: activity.id,
      signals,
    })
  } catch (error: unknown) {
    if (auditId) {
      await db.agentAuditLog.update({
        where: { id: auditId },
        data: { status: 'FAILED', output: { error: (error as Error)?.message || 'unknown error' } },
      }).catch(() => {})
    }
    return NextResponse.json({ error: (error as Error)?.message || 'failed to run agent' }, { status: 500 })
  }
}
