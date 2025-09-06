import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { meetingId, companyId, contactId, opportunityId } = await request.json()

    // Mock meeting data - in real app this would come from database
    const mockMeeting = {
      id: meetingId,
      title: 'Discovery Call - Acme Corp',
      type: 'DISCOVERY',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 30,
      company: {
        name: 'Acme Corporation',
        subIndustry: 'Tech/SaaS'
      },
      contact: {
        firstName: 'John',
        lastName: 'Smith',
        title: 'VP of Marketing'
      },
      opportunity: {
        dealType: 'NEW_LOGO'
      }
    }

    // Generate mock brief content
    const briefContent = `
# Meeting Brief: ${mockMeeting.title}

## Meeting Details
- **Date & Time:** ${mockMeeting.scheduledAt.toLocaleString()}
- **Duration:** ${mockMeeting.duration} minutes
- **Type:** ${mockMeeting.type}
- **Contact:** ${mockMeeting.contact.firstName} ${mockMeeting.contact.lastName} (${mockMeeting.contact.title})
- **Company:** ${mockMeeting.company.name} (${mockMeeting.company.subIndustry})

## Company Context
**${mockMeeting.company.name}** is a ${mockMeeting.company.subIndustry} company. Based on industry trends and typical priorities for ${mockMeeting.company.subIndustry} companies, they are likely focused on:
- Digital transformation and modernization
- Cost optimization and efficiency improvements
- Customer experience enhancement
- Regulatory compliance and risk management
- Market expansion and growth opportunities

## Recent Signals
- Company recently posted job openings for marketing roles
- Announced new product launch in Q4
- Increased social media activity around brand initiatives
- Participated in industry conference last month

## Industry Trends
Key trends affecting ${mockMeeting.company.subIndustry} companies this quarter:
- Increased focus on digital transformation
- Growing importance of data-driven decision making
- Emphasis on customer experience and personalization
- Regulatory changes impacting operations
- Sustainability and ESG initiatives gaining momentum

## Discovery Questions
1. What are your current creative and content production challenges?
2. How do you currently manage your brand assets and creative workflows?
3. What's driving the need for a new creative platform at this time?
4. Who else is involved in the decision-making process?
5. What would success look like for this initiative?
6. What's your timeline for implementing a solution?
7. What budget range are you considering for this project?
8. How do you currently measure the ROI of your creative investments?

## Value Proposition
For ${mockMeeting.company.subIndustry} companies like ${mockMeeting.company.name}, our platform delivers:
- **40% faster time-to-market** for creative campaigns
- **60% reduction** in creative production costs
- **99.9% uptime** ensuring your creative workflows never stop
- **Seamless integration** with your existing tech stack

## Proof Points
Based on industry best practices for ${mockMeeting.company.subIndustry}:
- 25% reduction in operational costs through automation
- 40% improvement in customer satisfaction scores
- 60% faster time-to-market for new initiatives
- 99.9% uptime and reliability improvements

## ROI Messaging
Our clients typically see:
- **3x return on investment** within the first year
- **50% reduction** in creative production time
- **30% increase** in team productivity
- **Payback period** of 6-8 months

## Case Study Angle
Similar ${mockMeeting.company.subIndustry} companies have achieved:
- 40% faster campaign launches
- 50% reduction in creative bottlenecks
- 25% increase in brand consistency
- 60% improvement in team collaboration

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

**Budget Concerns:**
"We understand budget is always a consideration. Our clients typically see a 3x ROI within the first year, with payback in 6-8 months. Would you like to see our ROI calculator?"

**Timing Issues:**
"We know timing is crucial. Many of our clients start with a pilot program that can be implemented in 30 days. This allows you to see value quickly without disrupting current workflows."

**Integration Concerns:**
"Our platform is designed to integrate seamlessly with your existing tech stack. We have pre-built connectors for most major systems and can work with your IT team to ensure smooth implementation."

## AI-Powered Insights
*This brief was generated using mock data. In production, this would include real-time company research, recent news, and AI-powered insights.*

---

**Generated on:** ${new Date().toLocaleString()}
**Meeting ID:** ${meetingId}
**Status:** Ready for meeting preparation
    `.trim()

    return NextResponse.json({ content: briefContent })
  } catch (error) {
    console.error('Error generating mock meeting brief:', error)
    return NextResponse.json(
      { error: 'Failed to generate meeting brief' },
      { status: 500 }
    )
  }
}
