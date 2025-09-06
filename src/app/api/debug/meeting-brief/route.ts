import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { meetingId } = await request.json()

    // Check if meeting exists
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        company: true,
        contact: true,
        opportunity: true
      }
    })

    if (!meeting) {
      return NextResponse.json({
        error: 'Meeting not found',
        meetingId,
        debug: 'Meeting does not exist in database'
      })
    }

    // Check environment variables
    const envCheck = {
      PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY ? 'Set' : 'Missing',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }

    // Check database connectivity
    let dbConnected = false
    try {
      await db.$queryRaw`SELECT 1`
      dbConnected = true
    } catch (error) {
      console.error('Database connection error:', error)
    }

    // Check if company has required fields
    const companyCheck = {
      hasName: !!meeting.company.name,
      hasSubIndustry: !!meeting.company.subIndustry,
      companyName: meeting.company.name,
      subIndustry: meeting.company.subIndustry
    }

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        title: meeting.title,
        companyId: meeting.companyId,
        contactId: meeting.contactId,
        opportunityId: meeting.opportunityId
      },
      company: companyCheck,
      environment: envCheck,
      database: {
        connected: dbConnected
      },
      debug: 'All checks completed'
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
