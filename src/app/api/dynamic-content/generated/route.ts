import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Mock generated content
    const content = [
      {
        id: 'gen-1',
        content: `Hi Sarah,

Thank you for taking the time to speak with me about Acme Corp's lead generation challenges. I found our conversation about your current marketing automation setup particularly insightful.

Based on what we discussed, I believe our AI-powered lead scoring system could help Acme Corp increase qualified leads by 40%. Here are the next steps I'd recommend:

1. Technical assessment of your current system
2. Custom integration planning
3. Pilot program with 100 leads

I'd love to schedule a technical demo to dive deeper into how we can help Acme Corp achieve your Q4 revenue goals. Would next Tuesday at 2 PM work for you?

Best regards,
John`,
        subject: 'Follow-up: Acme Corp Lead Generation Discussion',
        preview: 'Thank you for taking the time to speak with me about Acme Corp\'s lead generation challenges...',
        personalizationApplied: {
          rules: ['Add urgency for high-value deals'],
          variables: {
            recipient_name: 'Sarah',
            company_name: 'Acme Corp',
            pain_point: 'lead generation challenges'
          },
          tone: 'PROFESSIONAL',
          length: 'MEDIUM'
        },
        performance: {
          estimatedEngagement: 0.85,
          confidence: 0.92,
          suggestions: [
            'Consider adding a specific ROI example',
            'Include a case study link',
            'Add a calendar booking link'
          ]
        },
        alternatives: [
          {
            id: 'alt-1',
            content: 'Shorter, more direct version...',
            variation: 'CONCISE',
            confidence: 0.88
          }
        ],
        metadata: {
          wordCount: 156,
          readingTime: 1.2,
          complexity: 'MEDIUM',
          sentiment: 'POSITIVE'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'gen-2',
        content: `Hi Mike,

I hope this message finds you well. I came across your recent LinkedIn post about digital transformation in manufacturing, and it really resonated with me.

At TechSolutions, we've been helping manufacturing companies like yours streamline their operations through AI-driven process optimization. I noticed that {{company_name}} has been expanding rapidly, and I believe there might be some interesting opportunities for us to explore together.

Would you be open to a brief 15-minute call to discuss how other manufacturers in your space are leveraging technology to drive efficiency? I'd be happy to share some relevant case studies.

Best regards,
John`,
        subject: 'LinkedIn Connection: Digital Transformation in Manufacturing',
        preview: 'I hope this message finds you well. I came across your recent LinkedIn post about digital transformation...',
        personalizationApplied: {
          rules: [],
          variables: {
            recipient_name: 'Mike',
            company_name: 'TechSolutions',
            topic: 'digital transformation in manufacturing'
          },
          tone: 'FRIENDLY',
          length: 'SHORT'
        },
        performance: {
          estimatedEngagement: 0.72,
          confidence: 0.88,
          suggestions: [
            'Add a specific case study link',
            'Include a relevant industry statistic',
            'Mention a mutual connection if available'
          ]
        },
        alternatives: [
          {
            id: 'alt-2',
            content: 'More formal version...',
            variation: 'FORMAL',
            confidence: 0.85
          }
        ],
        metadata: {
          wordCount: 98,
          readingTime: 0.8,
          complexity: 'LOW',
          sentiment: 'POSITIVE'
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    const limitedContent = limit ? content.slice(0, parseInt(limit)) : content

    return NextResponse.json({ content: limitedContent })
  } catch (error) {
    console.error('Error fetching generated content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch generated content' },
      { status: 500 }
    )
  }
}
