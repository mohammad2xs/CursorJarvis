import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withApi, fail } from '@/lib/api-utils'

export const GET = withApi(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId') || undefined
    const take = Number(searchParams.get('take') || 10)

    const where = companyId ? { companyId } : {}

    const insights = await db.accountSignal.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
      take,
      select: {
        id: true,
        title: true,
        summary: true,
        source: true,
        detectedAt: true,
        tags: true,
      }
    })

    return NextResponse.json({ ok: true, data: { insights } })
  } catch (e: unknown) {
    return fail((e as Error)?.message || 'Failed to load insights', 500)
  }
})
