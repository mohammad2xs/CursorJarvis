import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json().catch(() => ({}))
    // Attempt DB update if schema exists; otherwise, ack
    try {
      await db.opportunity.update({ where: { id }, data: body })
    } catch {
      // fall back to no-op for demo mode
    }
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error)?.message || 'Failed to update opportunity' }, { status: 500 })
  }
}

