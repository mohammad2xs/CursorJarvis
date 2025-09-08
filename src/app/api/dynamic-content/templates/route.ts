import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Mock content templates
    const templates = [
      {
        id: 'template-1',
        userId,
        name: 'Discovery Call Follow-up',
        description: 'Professional follow-up after discovery call with next steps',
        category: 'FOLLOW_UP',
        type: 'DYNAMIC',
        content: `Hi {{recipient_name}},

Thank you for taking the time to speak with me about {{company_name}}'s {{pain_point}} challenges. I found our conversation about {{discussion_topic}} particularly insightful.

Based on what we discussed, I believe our {{solution_name}} could help {{company_name}} {{expected_outcome}}. Here are the next steps I'd recommend:

1. {{next_step_1}}
2. {{next_step_2}}
3. {{next_step_3}}

I'd love to schedule a {{meeting_type}} to dive deeper into how we can help {{company_name}} achieve {{goal}}. Would {{preferred_time}} work for you?

Best regards,
{{sender_name}}`,
        variables: [
          {
            id: 'var-1',
            name: 'recipient_name',
            type: 'TEXT',
            description: 'Recipient\'s first name',
            required: true,
            dynamicSource: {
              type: 'CRM_FIELD',
              field: 'contact.firstName',
              fallback: 'there'
            }
          },
          {
            id: 'var-2',
            name: 'company_name',
            type: 'TEXT',
            description: 'Company name',
            required: true,
            dynamicSource: {
              type: 'CRM_FIELD',
              field: 'account.name',
              fallback: 'your company'
            }
          },
          {
            id: 'var-3',
            name: 'pain_point',
            type: 'TEXT',
            description: 'Identified pain point',
            required: true,
            dynamicSource: {
              type: 'CONTEXT_DATA',
              field: 'meeting.insights.painPoints[0]',
              fallback: 'current challenges'
            }
          }
        ],
        personalizationRules: [
          {
            id: 'rule-1',
            name: 'Add urgency for high-value deals',
            condition: {
              field: 'deal.value',
              operator: 'GREATER_THAN',
              value: 50000
            },
            action: {
              type: 'ADD_SECTION',
              content: '\n\nGiven the significant impact this could have on your business, I\'d recommend moving quickly to capitalize on this opportunity.',
              position: 3
            },
            priority: 1,
            isActive: true
          }
        ],
        performance: {
          usageCount: 45,
          successRate: 0.78,
          avgResponseTime: 2.5,
          lastUsed: new Date().toISOString()
        },
        tags: ['discovery', 'follow-up', 'professional'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'template-2',
        userId,
        name: 'LinkedIn Connection Request',
        description: 'Personalized LinkedIn connection request for prospects',
        category: 'LINKEDIN',
        type: 'TEMPLATE',
        content: `Hi {{recipient_name}},

I noticed your recent post about {{topic}} and found it really insightful. I work with {{company_type}} companies like {{company_name}} to help them {{value_proposition}}.

I'd love to connect and share some ideas that might be relevant to your work at {{company_name}}.

Best regards,
{{sender_name}}`,
        variables: [
          {
            id: 'var-4',
            name: 'recipient_name',
            type: 'TEXT',
            description: 'Recipient\'s first name',
            required: true,
            dynamicSource: {
              type: 'CRM_FIELD',
              field: 'contact.firstName',
              fallback: 'there'
            }
          },
          {
            id: 'var-5',
            name: 'topic',
            type: 'TEXT',
            description: 'Recent post topic',
            required: true,
            dynamicSource: {
              type: 'BEHAVIORAL_DATA',
              field: 'linkedin.recentPosts[0].topic',
              fallback: 'industry trends'
            }
          }
        ],
        personalizationRules: [],
        performance: {
          usageCount: 32,
          successRate: 0.65,
          avgResponseTime: 1.8,
          lastUsed: new Date().toISOString()
        },
        tags: ['linkedin', 'connection', 'networking'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const filteredTemplates = category ? templates.filter(t => t.category === category) : templates

    return NextResponse.json({ templates: filteredTemplates })
  } catch (error) {
    console.error('Error fetching content templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, template } = body

    if (!userId || !template) {
      return NextResponse.json(
        { error: 'User ID and template data are required' },
        { status: 400 }
      )
    }

    // Create new template
    const newTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      userId,
      performance: {
        usageCount: 0,
        successRate: 0,
        avgResponseTime: 0,
        lastUsed: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ template: newTemplate })
  } catch (error) {
    console.error('Error creating content template:', error)
    return NextResponse.json(
      { error: 'Failed to create content template' },
      { status: 500 }
    )
  }
}
