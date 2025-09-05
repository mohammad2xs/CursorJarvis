import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { perplexityService } from '@/lib/perplexity'
import { brandStudio } from '@/lib/brand-studio'

export async function POST(request: NextRequest) {
  try {
    const { meetingId, companyId, contactId, opportunityId } = await request.json()

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

    // Generate Perplexity insights
    const companyName = meeting.company.name
    const subIndustry = meeting.company.subIndustry
    const contactTitle = meeting.contact?.title || 'decision maker'

    const [preMeetingBrief, proofPoints, industryTrends] = await Promise.all([
      perplexityService.getPreMeetingBrief(companyName, subIndustry, contactTitle),
      perplexityService.getProofPoints(companyName, subIndustry),
      perplexityService.getIndustryTrends(subIndustry)
    ])

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

    // Compile the brief
    const briefContent = `
# Meeting Brief: ${meeting.title}

## Meeting Details
- **Date & Time:** ${meeting.scheduledAt.toLocaleString()}
- **Duration:** ${meeting.duration || 30} minutes
- **Type:** ${meeting.type}
- **Contact:** ${meeting.contact?.firstName} ${meeting.contact?.lastName} (${meeting.contact?.title})
- **Company:** ${meeting.company.name} (${meeting.company.subIndustry})

## Company Context
${preMeetingBrief.answer}

## Recent Signals
${recentSignals.length > 0 ? recentSignals.map(signal => `- ${signal.title}: ${signal.summary}`).join('\n') : 'No recent signals'}

## Industry Trends
${industryTrends.answer}

## Discovery Questions
${discoveryQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Value Proposition
${valueProposition}

## Proof Points
${proofPoints.answer}

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
    `.trim()

    return NextResponse.json({ content: briefContent })
  } catch (error) {
    console.error('Error generating meeting brief:', error)
    return NextResponse.json(
      { error: 'Failed to generate meeting brief' },
      { status: 500 }
    )
  }
}
