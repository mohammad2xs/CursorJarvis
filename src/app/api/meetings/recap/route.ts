import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { perplexityService } from '@/lib/perplexity'
import { TaskType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { meetingId, notes } = await request.json()

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

    // Generate AI-powered recap using the notes
    const recapPrompt = `
Based on the following meeting notes, generate a structured recap for ${meeting.company.name}:

Meeting: ${meeting.title}
Contact: ${meeting.contact?.firstName} ${meeting.contact?.lastName}
Notes: ${notes}

Please provide:
1. Key discussion points
2. Decisions made
3. Next steps with owners and timelines
4. Follow-up actions required
5. Overall sentiment and engagement level
6. Any concerns or objections raised
7. Opportunities identified

Format as a professional meeting recap.
    `

    const aiRecap = await perplexityService.query(recapPrompt)

    // Create structured recap
    const recapContent = `
# Meeting Recap: ${meeting.title}

**Date:** ${meeting.scheduledAt.toLocaleDateString()}
**Duration:** ${meeting.duration || 30} minutes
**Attendees:** ${meeting.contact?.firstName} ${meeting.contact?.lastName} (${meeting.contact?.title})

## Meeting Notes
${notes}

## AI-Generated Analysis
${aiRecap.answer}

## Next Steps
- [ ] Follow up on [specific action item]
- [ ] Send [specific materials/documents]
- [ ] Schedule [next meeting/demo]
- [ ] Connect with [additional stakeholders]

## Follow-up Timeline
- **Immediate (24-48 hours):** [urgent actions]
- **Short-term (1 week):** [quick wins]
- **Medium-term (2-4 weeks):** [ongoing activities]

## Opportunity Status
- **Interest Level:** [High/Medium/Low]
- **Decision Timeline:** [specific timeframe]
- **Key Stakeholders:** [list additional contacts needed]
- **Budget Confirmed:** [Yes/No/Unknown]

## Risk Factors
- [Any concerns or potential blockers]
- [Competitive threats]
- [Timing issues]

## Success Metrics
- [How will we measure success in this opportunity]
- [Key milestones to track]
    `.trim()

    // Create activity record for the meeting recap
    await db.activity.create({
      data: {
        type: 'MEETING',
        title: `Meeting recap: ${meeting.title}`,
        description: recapContent,
        companyId: meeting.companyId,
        contactId: meeting.contactId,
        opportunityId: meeting.opportunityId
      }
    })

    // Create follow-up tasks based on the recap
    const followUpTasks = [
      {
        title: `Follow up with ${meeting.contact?.firstName} ${meeting.contact?.lastName}`,
        description: 'Send meeting recap and next steps',
        type: TaskType.EMAIL,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        companyId: meeting.companyId,
        contactId: meeting.contactId,
        opportunityId: meeting.opportunityId
      }
    ]

    for (const task of followUpTasks) {
      await db.task.create({
        data: task
      })
    }

    return NextResponse.json({ content: recapContent })
  } catch (error) {
    console.error('Error generating meeting recap:', error)
    return NextResponse.json(
      { error: 'Failed to generate meeting recap' },
      { status: 500 }
    )
  }
}
