import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { playType, segment } = await request.json()

    // Deactivate Golden Play
    await db.goldenPlay.updateMany({
      where: {
        playType,
        segment,
        isActive: true
      },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Rule ${playType} retired for ${segment}` 
    })
  } catch (error) {
    console.error('Error retiring rule:', error)
    return NextResponse.json(
      { error: 'Failed to retire rule' },
      { status: 500 }
    )
  }
}
