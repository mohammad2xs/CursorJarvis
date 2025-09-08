import { NextRequest, NextResponse } from 'next/server'
import { dailyPlanningService } from '@/lib/daily-planning'

export async function POST(request: NextRequest) {
  try {
    const { planId, itemId, outcome } = await request.json()
    
    if (!planId || !itemId || !outcome) {
      return NextResponse.json(
        { error: 'Plan ID, item ID, and outcome are required' },
        { status: 400 }
      )
    }
    
    await dailyPlanningService.completeAgendaItem(planId, itemId, outcome)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing agenda item:', error)
    return NextResponse.json(
      { error: 'Failed to complete agenda item' },
      { status: 500 }
    )
  }
}
