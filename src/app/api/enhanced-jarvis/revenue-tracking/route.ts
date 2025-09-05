import { NextRequest, NextResponse } from 'next/server'
import { enhancedCursorJarvisService } from '@/lib/enhanced-cursor-jarvis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      accountId, 
      contactId, 
      opportunityId, 
      revenue, 
      attributionSource, 
      attributionReason, 
      conversationId, 
      callId, 
      gettyImagesProduct, 
      department, 
      useCase 
    } = body

    if (!accountId || !revenue || !attributionSource) {
      return NextResponse.json(
        { error: 'Account ID, revenue, and attribution source are required' },
        { status: 400 }
      )
    }

    const attribution = await enhancedCursorJarvisService.trackRevenueAttribution({
      accountId,
      contactId,
      opportunityId,
      revenue,
      attributionSource,
      attributionReason,
      conversationId,
      callId,
      gettyImagesProduct,
      department,
      useCase
    })

    return NextResponse.json(attribution)
  } catch (error) {
    console.error('Error tracking revenue attribution:', error)
    return NextResponse.json(
      { error: 'Failed to track revenue attribution' },
      { status: 500 }
    )
  }
}
