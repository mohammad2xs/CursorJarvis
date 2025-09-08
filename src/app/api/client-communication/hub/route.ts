import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Mock communication hub data
    const hub = {
      clients: [
        {
          id: 'client-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@acmecorp.com',
          phone: '+1-555-0123',
          company: 'Acme Corp',
          title: 'VP of Sales',
          industry: 'Technology',
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA'
          },
          status: 'CUSTOMER',
          priority: 'HIGH',
          tags: ['enterprise', 'decision-maker', 'hot-lead'],
          notes: 'Interested in enterprise solution. Budget approved for Q4.',
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          nextFollowUp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: userId,
          source: 'LINKEDIN',
          dealValue: 150000,
          dealStage: 'NEGOTIATION',
          communicationPreferences: {
            preferredChannel: 'EMAIL',
            bestTimeToContact: '10:00-16:00',
            timezone: 'America/Los_Angeles',
            language: 'en'
          },
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            twitter: 'https://twitter.com/sarahjohnson'
          },
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: new Date().toISOString()
        },
        {
          id: 'client-2',
          name: 'Mike Chen',
          email: 'mike.chen@techstartup.io',
          phone: '+1-555-0456',
          company: 'TechStartup Inc',
          title: 'CTO',
          industry: 'Technology',
          location: {
            city: 'Austin',
            state: 'TX',
            country: 'USA'
          },
          status: 'LEAD',
          priority: 'MEDIUM',
          tags: ['startup', 'technical', 'budget-conscious'],
          notes: 'Technical evaluation in progress. Needs to see ROI data.',
          lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: userId,
          source: 'WEBSITE',
          dealValue: 75000,
          dealStage: 'PROPOSAL',
          communicationPreferences: {
            preferredChannel: 'PHONE',
            bestTimeToContact: '14:00-18:00',
            timezone: 'America/Chicago',
            language: 'en'
          },
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/mikechen'
          },
          createdAt: '2024-02-20T00:00:00.000Z',
          updatedAt: new Date().toISOString()
        }
      ],
      communications: [
        {
          id: 'comm-1',
          clientId: 'client-1',
          channel: 'email',
          type: 'OUTBOUND',
          direction: 'SENT',
          subject: 'Follow-up on Enterprise Proposal',
          content: 'Hi Sarah,\n\nThank you for the productive meeting yesterday. I\'ve attached the detailed proposal for the enterprise solution we discussed.\n\nKey highlights:\n- 30% increase in sales efficiency\n- ROI within 6 months\n- 24/7 support included\n\nI\'d love to schedule a follow-up call to discuss any questions you might have.\n\nBest regards,\nJohn',
          status: 'READ',
          priority: 'HIGH',
          tags: ['proposal', 'follow-up', 'enterprise'],
          attachments: [
            {
              id: 'att-1',
              name: 'Enterprise_Proposal_Q4_2024.pdf',
              type: 'application/pdf',
              size: 2048576,
              url: '/attachments/enterprise-proposal.pdf'
            }
          ],
          metadata: {
            messageId: 'msg-123456',
            threadId: 'thread-789',
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          aiInsights: {
            sentiment: 'POSITIVE',
            intent: 'FOLLOW_UP',
            urgency: 'MEDIUM',
            suggestedResponse: 'Thank you for the proposal. I\'ll review it and get back to you by Friday.',
            suggestedActions: [
              'Schedule follow-up call',
              'Send additional case studies',
              'Prepare ROI calculator'
            ],
            confidence: 0.85
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'comm-2',
          clientId: 'client-1',
          channel: 'email',
          type: 'INBOUND',
          direction: 'RECEIVED',
          subject: 'Re: Follow-up on Enterprise Proposal',
          content: 'Hi John,\n\nThanks for the detailed proposal. I\'ve shared it with our team and we\'re very interested.\n\nA few questions:\n1. Can we customize the reporting dashboard?\n2. What\'s the implementation timeline?\n3. Do you offer training for our team?\n\nLet\'s schedule a call for Friday at 2 PM to discuss these points.\n\nBest,\nSarah',
          status: 'REPLIED',
          priority: 'HIGH',
          tags: ['response', 'questions', 'meeting-request'],
          attachments: [],
          metadata: {
            messageId: 'msg-123457',
            threadId: 'thread-789',
            replyTo: 'msg-123456',
            sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            repliedAt: new Date().toISOString()
          },
          aiInsights: {
            sentiment: 'POSITIVE',
            intent: 'INQUIRY',
            urgency: 'HIGH',
            suggestedResponse: 'Great questions! I\'ll prepare detailed answers and send you a calendar invite for Friday at 2 PM.',
            suggestedActions: [
              'Prepare customization options',
              'Create implementation timeline',
              'Schedule meeting for Friday 2 PM',
              'Prepare training materials'
            ],
            confidence: 0.92
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      threads: [],
      templates: [
        {
          id: 'template-1',
          name: 'Initial Outreach',
          description: 'Professional first contact email',
          category: 'GREETING',
          channel: 'email',
          subject: 'Introduction from {{company_name}}',
          content: 'Hi {{client_name}},\n\nI hope this email finds you well. I\'m {{sender_name}} from {{company_name}}, and I wanted to reach out because I noticed {{company_name}} is in the {{industry}} space.\n\nWe\'ve helped similar companies like {{similar_company}} achieve {{benefit}}.\n\nWould you be interested in a brief 15-minute call to discuss how we might be able to help {{company_name}}?\n\nBest regards,\n{{sender_name}}',
          variables: [
            { name: 'client_name', type: 'TEXT', required: true },
            { name: 'company_name', type: 'TEXT', required: true },
            { name: 'sender_name', type: 'TEXT', required: true },
            { name: 'industry', type: 'TEXT', required: true },
            { name: 'similar_company', type: 'TEXT', required: false },
            { name: 'benefit', type: 'TEXT', required: true }
          ],
          isActive: true,
          usageCount: 45,
          successRate: 0.78,
          createdBy: userId,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString()
        }
      ],
      campaigns: [
        {
          id: 'campaign-1',
          name: 'Q4 Enterprise Outreach',
          description: 'Targeted outreach to enterprise prospects for Q4',
          type: 'EMAIL',
          status: 'RUNNING',
          targetAudience: {
            criteria: {
              industry: ['Technology', 'Finance'],
              companySize: ['Enterprise'],
              tags: ['enterprise', 'decision-maker']
            },
            clientIds: ['client-1']
          },
          content: {
            subject: 'Transform Your Sales Process with AI',
            message: 'Hi {{client_name}},\n\nI wanted to share how {{company_name}} can help you achieve 30% higher sales efficiency...',
            templateId: 'template-1'
          },
          schedule: {
            startDate: '2024-10-01T00:00:00.000Z',
            endDate: '2024-12-31T00:00:00.000Z',
            timezone: 'America/New_York',
            frequency: 'WEEKLY'
          },
          metrics: {
            sent: 150,
            delivered: 147,
            opened: 89,
            clicked: 23,
            replied: 12,
            unsubscribed: 2,
            bounceRate: 0.02,
            openRate: 0.61,
            clickRate: 0.16,
            replyRate: 0.08
          },
          createdAt: '2024-09-15T00:00:00.000Z',
          updatedAt: new Date().toISOString()
        }
      ],
      channels: [
        {
          id: 'email',
          name: 'Email',
          type: 'EMAIL',
          icon: 'Mail',
          color: '#3B82F6',
          isActive: true,
          settings: {
            autoSync: true,
            notifications: true,
            archiveAfter: 365
          }
        },
        {
          id: 'phone',
          name: 'Phone',
          type: 'PHONE',
          icon: 'Phone',
          color: '#10B981',
          isActive: true,
          settings: {
            autoSync: false,
            notifications: true,
            archiveAfter: 90
          }
        },
        {
          id: 'linkedin',
          name: 'LinkedIn',
          type: 'LINKEDIN',
          icon: 'Linkedin',
          color: '#0077B5',
          isActive: true,
          settings: {
            autoSync: true,
            notifications: true,
            archiveAfter: 180
          }
        },
        {
          id: 'sms',
          name: 'SMS',
          type: 'SMS',
          icon: 'MessageSquare',
          color: '#8B5CF6',
          isActive: true,
          settings: {
            autoSync: true,
            notifications: true,
            archiveAfter: 30
          }
        }
      ],
      summary: {
        totalClients: 2,
        activeClients: 2,
        totalCommunications: 2,
        unreadCommunications: 0,
        pendingFollowUps: 1,
        activeCampaigns: 1,
        responseRate: 0.5,
        averageResponseTime: 24.5
      }
    }

    return NextResponse.json(hub)
  } catch (error) {
    console.error('Error fetching communication hub:', error)
    return NextResponse.json(
      { error: 'Failed to fetch communication hub' },
      { status: 500 }
    )
  }
}
