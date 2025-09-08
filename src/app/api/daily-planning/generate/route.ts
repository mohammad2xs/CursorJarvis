import { NextRequest, NextResponse } from 'next/server'
import { dailyPlanningService } from '@/lib/daily-planning'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const dateParam = searchParams.get('date')
    
    console.log('Daily planning API called with:', { userId, dateParam })
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const date = dateParam ? new Date(dateParam) : new Date()
    
    console.log('Generating daily plan for:', { userId, date })
    
    const dailyPlan = await dailyPlanningService.generateDailyPlan(userId, date)
    
    console.log('Daily plan generated successfully')
    
    return NextResponse.json(dailyPlan)
  } catch (error) {
    console.error('Error generating daily plan:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to generate daily plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, date } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const planDate = date ? new Date(date) : new Date()
    const dailyPlan = await dailyPlanningService.generateDailyPlan(userId, planDate)
    
    return NextResponse.json(dailyPlan)
  } catch (error) {
    console.error('Error generating daily plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate daily plan' },
      { status: 500 }
    )
  }
}
