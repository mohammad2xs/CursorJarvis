import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brandStudio } from '@/lib/brand-studio'

export async function POST(request: NextRequest) {
  try {
    const { meetingId } = await request.json()

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        company: true,
        contact: true,
        opportunity: true
      }
    })

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Get recent account signals for context
    const recentSignals = await db.accountSignal.findMany({
      where: {
        companyId: meeting.companyId,
        detectedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { detectedAt: 'desc' },
      take: 5
    })

    // Generate static content without Perplexity API
    const companyName = meeting.company.name
    const subIndustry = meeting.company.subIndustry

    // Generate discovery questions
    const discoveryQuestions = brandStudio.generateDiscoveryQuestions(subIndustry)

    // Generate value proposition
    const valueProposition = brandStudio.generateValueProposition(
      subIndustry, 
      meeting.opportunity?.dealType || 'NEW_LOGO'
    )

    // Generate ROI message
    const roiMessage = brandStudio.generateROIMessage(subIndustry)

    // Generate case study angle
    const caseStudyAngle = brandStudio.generateCaseStudyAngle(companyName, subIndustry)

    // Compile the brief with static content
    const briefContent = `
# Meeting Brief: ${meeting.title}

## Meeting Details
- **Date & Time:** ${meeting.scheduledAt.toLocaleString()}
- **Duration:** ${meeting.duration || 30} minutes
- **Type:** ${meeting.type}
- **Contact:** ${meeting.contact?.firstName} ${meeting.contact?.lastName} (${meeting.contact?.title})
- **Company:** ${meeting.company.name} (${meeting.company.subIndustry})

## Company Context
**${companyName}** is a ${subIndustry} company. Based on industry trends and typical priorities for ${subIndustry} companies, they are likely focused on:
- Digital transformation and modernization
- Cost optimization and efficiency improvements
- Customer experience enhancement
- Regulatory compliance and risk management
- Market expansion and growth opportunities

## Recent Signals
${recentSignals.length > 0 ? recentSignals.map(signal => `- ${signal.title}: ${signal.summary}`).join('\n') : 'No recent signals detected'}

## Industry Trends
Key trends affecting ${subIndustry} companies this quarter:
- Increased focus on digital transformation
- Growing importance of data-driven decision making
- Emphasis on customer experience and personalization
- Regulatory changes impacting operations
- Sustainability and ESG initiatives gaining momentum

## Discovery Questions
${discoveryQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Value Proposition
${valueProposition}

## Proof Points
Based on industry best practices for ${subIndustry}:
- 25% reduction in operational costs through automation
- 40% improvement in customer satisfaction scores
- 60% faster time-to-market for new initiatives
- 99.9% uptime and reliability improvements

## ROI Messaging
${roiMessage}

## Case Study Angle
${caseStudyAngle}

## Meeting Agenda
1. **Opening (5 min)**
   - Introductions and rapport building
   - Confirm agenda and objectives

2. **Discovery (15 min)**
   - Ask discovery questions above
   - Understand current challenges and priorities

3. **Value Demonstration (10 min)**
   - Present relevant proof points
   - Share case study angle

4. **Next Steps (5 min)**
   - Confirm interest level
   - Schedule follow-up or demo

## Preparation Checklist
- [ ] Review company website and recent news
- [ ] Prepare specific questions based on their industry
- [ ] Have relevant case studies ready
- [ ] Prepare demo environment if needed
- [ ] Review contact's LinkedIn for conversation starters

## Potential Objections & Responses
${brandStudio.generateObjectionHandling('budget', subIndustry)}
${brandStudio.generateObjectionHandling('timing', subIndustry)}
${brandStudio.generateObjectionHandling('integration', subIndustry)}

## AI-Powered Insights
*Note: This brief was generated using static templates. For real-time insights and company-specific research, ensure the Perplexity API is properly configured.*
    `.trim()

    return NextResponse.json({ content: briefContent })
  } catch (error) {
    console.error('Error generating meeting brief (fallback):', error)
    return NextResponse.json(
      { error: 'Failed to generate meeting brief' },
      { status: 500 }
    )
  }
}
