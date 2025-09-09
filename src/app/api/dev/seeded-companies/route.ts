import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const companies = await db.company.findMany({
      where: {
        OR: [
          { tags: { has: 'TEST_SEED' } },
          { website: { contains: 'example.com', mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, createdAt: true },
    })

    return NextResponse.json({ companies })
  } catch (error: unknown) {
    console.error('List seeded companies error:', error)
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to list seeded companies' },
      { status: 500 }
    )
  }
}

