import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
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

    return NextResponse.json({ insights })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error)?.message || 'Failed to load insights' }, { status: 500 })
  }
}

