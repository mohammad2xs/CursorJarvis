import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const where = {
      OR: [
        { tags: { has: 'TEST_SEED' } },
        { website: { contains: 'example.com', mode: 'insensitive' as const } },
      ],
    }

    const result = await db.company.deleteMany({ where })

    return NextResponse.json({ success: true, deletedCount: result.count })
  } catch (error: unknown) {
    console.error('Clean test data error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error)?.message || 'Failed to clean test data' },
      { status: 500 }
    )
  }
}

