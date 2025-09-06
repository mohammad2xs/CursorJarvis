import { NextRequest, NextResponse } from 'next/server'
import { nbaBrain } from '@/lib/nba-brain'

export async function POST(request: NextRequest) {
  try {
    const { companyIds } = await request.json()
    
    if (!companyIds || !Array.isArray(companyIds)) {
      return NextResponse.json(
        { error: 'companyIds array is required' },
        { status: 400 }
      )
    }

    const allNBAs = []
    
    // Generate NBAs for each company (limit to first 5 to avoid performance issues)
    for (const companyId of companyIds.slice(0, 5)) {
      try {
        const companyNBAs = await nbaBrain.generateNBAs(companyId)
        allNBAs.push(...companyNBAs)
      } catch (error) {
        console.error(`Error generating NBAs for company ${companyId}:`, error)
        // Continue with other companies even if one fails
      }
    }

    // Sort by priority
    const sortedNBAs = allNBAs.sort((a, b) => b.priority - a.priority)

    return NextResponse.json({ nbas: sortedNBAs })
  } catch (error) {
    console.error('Error generating NBAs:', error)
    return NextResponse.json(
      { error: 'Failed to generate NBAs' },
      { status: 500 }
    )
  }
}
