import { NextRequest, NextResponse } from 'next/server'
import { perplexityService } from '@/lib/perplexity'

export async function POST(request: NextRequest) {
  try {
    const { query, companyId } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const response = await perplexityService.query(query, companyId)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Perplexity API error:', error)
    return NextResponse.json(
      { error: 'Failed to query Perplexity' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const type = searchParams.get('type')

    if (!companyId || !type) {
      return NextResponse.json(
        { error: 'Company ID and type are required' },
        { status: 400 }
      )
    }

    let response

    switch (type) {
      case 'daily-pulse':
        const subIndustry = searchParams.get('subIndustry') || 'Tech/SaaS'
        response = await perplexityService.getDailyAccountPulse('Company Name', subIndustry)
        break
      case 'leadership-changes':
        response = await perplexityService.getLeadershipChanges('Company Name')
        break
      case 'industry-trends':
        const industry = searchParams.get('subIndustry') || 'Tech/SaaS'
        response = await perplexityService.getIndustryTrends(industry)
        break
      case 'pre-meeting-brief':
        const briefIndustry = searchParams.get('subIndustry') || 'Tech/SaaS'
        const contactTitle = searchParams.get('contactTitle')
        response = await perplexityService.getPreMeetingBrief('Company Name', briefIndustry, contactTitle)
        break
      case 'proof-points':
        const proofIndustry = searchParams.get('subIndustry') || 'Tech/SaaS'
        response = await perplexityService.getProofPoints('Company Name', proofIndustry)
        break
      case 'competitive-intelligence':
        const compIndustry = searchParams.get('subIndustry') || 'Tech/SaaS'
        response = await perplexityService.getCompetitiveIntelligence('Company Name', compIndustry)
        break
      case 'procurement-hurdles':
        const procIndustry = searchParams.get('subIndustry') || 'Tech/SaaS'
        response = await perplexityService.getProcurementHurdles(procIndustry)
        break
      case 'roi-language':
        const roiIndustry = searchParams.get('subIndustry') || 'Tech/SaaS'
        response = await perplexityService.getROILanguage(roiIndustry)
        break
      case 'linkedin-topics':
        const linkedinIndustry = searchParams.get('subIndustry') || 'Tech/SaaS'
        response = await perplexityService.getLinkedInTopics('Company Name', linkedinIndustry)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid query type' },
          { status: 400 }
        )
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Perplexity API error:', error)
    return NextResponse.json(
      { error: 'Failed to query Perplexity' },
      { status: 500 }
    )
  }
}
