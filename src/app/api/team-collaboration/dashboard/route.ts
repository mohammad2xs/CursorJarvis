import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const managerId = searchParams.get('managerId')

    if (!teamId || !managerId) {
      return NextResponse.json(
        { error: 'Team ID and Manager ID are required' },
        { status: 400 }
      )
    }

    // Mock team dashboard data
    const dashboard = {
      team: {
        id: teamId,
        name: 'Enterprise Sales Team',
        description: 'High-performing team focused on enterprise clients',
        managerId,
        department: 'Sales',
        members: [
          {
            id: 'member-1',
            userId: 'user-1',
            name: 'John Smith',
            email: 'john.smith@company.com',
            role: 'MANAGER',
            department: 'Sales',
            teamId,
            status: 'ACTIVE',
            joinDate: '2023-01-15T00:00:00.000Z',
            lastActive: new Date().toISOString(),
            timezone: 'America/New_York',
            workingHours: {
              start: '09:00',
              end: '17:00',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            skills: ['Enterprise Sales', 'CRM Management', 'Team Leadership'],
            certifications: ['Salesforce Certified', 'HubSpot Certified'],
            performance: {
              currentQuota: 1000000,
              quotaAttainment: 0.85,
              dealsClosed: 12,
              revenue: 850000,
              activities: 245,
              lastUpdated: new Date().toISOString()
            },
            preferences: {
              communicationStyle: 'MIXED',
              preferredChannels: ['email', 'slack'],
              notificationSettings: {
                email: true,
                push: true,
                sms: false
              }
            }
          },
          {
            id: 'member-2',
            userId: 'user-2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            role: 'SENIOR_AE',
            department: 'Sales',
            managerId: 'user-1',
            teamId,
            status: 'ACTIVE',
            joinDate: '2023-03-20T00:00:00.000Z',
            lastActive: new Date().toISOString(),
            timezone: 'America/New_York',
            workingHours: {
              start: '08:30',
              end: '17:30',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            skills: ['Enterprise Sales', 'Account Management', 'Negotiation'],
            certifications: ['Salesforce Certified'],
            performance: {
              currentQuota: 750000,
              quotaAttainment: 0.92,
              dealsClosed: 8,
              revenue: 690000,
              activities: 198,
              lastUpdated: new Date().toISOString()
            },
            preferences: {
              communicationStyle: 'FORMAL',
              preferredChannels: ['email', 'phone'],
              notificationSettings: {
                email: true,
                push: false,
                sms: true
              }
            }
          },
          {
            id: 'member-3',
            userId: 'user-3',
            name: 'Mike Chen',
            email: 'mike.chen@company.com',
            role: 'AE',
            department: 'Sales',
            managerId: 'user-1',
            teamId,
            status: 'ACTIVE',
            joinDate: '2023-06-10T00:00:00.000Z',
            lastActive: new Date().toISOString(),
            timezone: 'America/Los_Angeles',
            workingHours: {
              start: '09:00',
              end: '18:00',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            },
            skills: ['SMB Sales', 'Lead Qualification', 'CRM Management'],
            certifications: ['HubSpot Certified'],
            performance: {
              currentQuota: 500000,
              quotaAttainment: 0.78,
              dealsClosed: 6,
              revenue: 390000,
              activities: 156,
              lastUpdated: new Date().toISOString()
            },
            preferences: {
              communicationStyle: 'CASUAL',
              preferredChannels: ['slack', 'phone'],
              notificationSettings: {
                email: false,
                push: true,
                sms: false
              }
            }
          }
        ],
        goals: [
          {
            id: 'goal-1',
            teamId,
            title: 'Q4 Revenue Target',
            description: 'Achieve $2M in Q4 revenue',
            type: 'REVENUE',
            target: 2000000,
            current: 1930000,
            unit: 'USD',
            startDate: '2024-10-01T00:00:00.000Z',
            endDate: '2024-12-31T00:00:00.000Z',
            status: 'IN_PROGRESS',
            priority: 'CRITICAL',
            progress: 96.5,
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'goal-2',
            teamId,
            title: 'Team Training Completion',
            description: 'Complete advanced sales training for all team members',
            type: 'SKILL_DEVELOPMENT',
            target: 100,
            current: 75,
            unit: '%',
            startDate: '2024-09-01T00:00:00.000Z',
            endDate: '2024-12-31T00:00:00.000Z',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            progress: 75,
            lastUpdated: new Date().toISOString()
          }
        ],
        metrics: {
          teamId,
          period: 'MONTHLY',
          revenue: {
            target: 2000000,
            actual: 1930000,
            percentage: 96.5,
            trend: 'UP'
          },
          activities: {
            calls: 245,
            emails: 892,
            meetings: 156,
            demos: 34,
            proposals: 18
          },
          deals: {
            pipeline: 45,
            closed: 26,
            averageDealSize: 85000,
            winRate: 0.68,
            cycleTime: 45
          },
          performance: {
            quotaAttainment: 0.85,
            topPerformers: ['user-2'],
            underPerformers: ['user-3'],
            improvementAreas: ['Lead Qualification', 'Follow-up Process']
          },
          collaboration: {
            teamMeetings: 12,
            sharedDeals: 8,
            knowledgeSharing: 15,
            crossSelling: 3
          },
          lastUpdated: new Date().toISOString()
        },
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      metrics: {
        teamId,
        period: 'MONTHLY',
        revenue: {
          target: 2000000,
          actual: 1930000,
          percentage: 96.5,
          trend: 'UP'
        },
        activities: {
          calls: 245,
          emails: 892,
          meetings: 156,
          demos: 34,
          proposals: 18
        },
        deals: {
          pipeline: 45,
          closed: 26,
          averageDealSize: 85000,
          winRate: 0.68,
          cycleTime: 45
        },
        performance: {
          quotaAttainment: 0.85,
          topPerformers: ['user-2'],
          underPerformers: ['user-3'],
          improvementAreas: ['Lead Qualification', 'Follow-up Process']
        },
        collaboration: {
          teamMeetings: 12,
          sharedDeals: 8,
          knowledgeSharing: 15,
          crossSelling: 3
        },
        lastUpdated: new Date().toISOString()
      },
      insights: [
        {
          id: 'insight-1',
          managerId,
          teamId,
          type: 'PERFORMANCE',
          title: 'Sarah Johnson Exceeding Quota',
          description: 'Sarah has consistently exceeded her quota for 3 consecutive months',
          priority: 'HIGH',
          status: 'NEW',
          data: {
            metric: 'Quota Attainment',
            value: 0.92,
            target: 0.8,
            trend: 'UP',
            comparison: 0.15
          },
          recommendations: [
            'Consider promoting Sarah to Senior AE role',
            'Use Sarah as mentor for other team members',
            'Increase quota target for next quarter'
          ],
          actionItems: [
            {
              id: 'action-1',
              title: 'Schedule promotion discussion with HR',
              assignedTo: 'user-1',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'PENDING'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'insight-2',
          managerId,
          teamId,
          type: 'COACHING',
          title: 'Mike Chen Needs Support',
          description: 'Mike is struggling with lead qualification and needs additional training',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          data: {
            metric: 'Quota Attainment',
            value: 0.78,
            target: 0.8,
            trend: 'DOWN',
            comparison: -0.02
          },
          recommendations: [
            'Schedule weekly 1:1 coaching sessions',
            'Pair Mike with Sarah for mentoring',
            'Provide additional lead qualification training'
          ],
          actionItems: [
            {
              id: 'action-2',
              title: 'Schedule weekly coaching with Mike',
              assignedTo: 'user-1',
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'PENDING'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      collaborations: [
        {
          id: 'collab-1',
          teamId,
          type: 'MEETING',
          title: 'Weekly Team Standup',
          description: 'Weekly team sync to review progress and blockers',
          participants: ['user-1', 'user-2', 'user-3'],
          initiator: 'user-1',
          status: 'SCHEDULED',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          followUpActions: [],
          resources: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'collab-2',
          teamId,
          type: 'MENTORING',
          title: 'Sarah Mentoring Mike',
          description: 'Sarah will mentor Mike on enterprise sales techniques',
          participants: ['user-2', 'user-3'],
          initiator: 'user-1',
          status: 'IN_PROGRESS',
          followUpActions: [
            {
              id: 'followup-1',
              title: 'Complete sales technique assessment',
              assignedTo: 'user-3',
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'PENDING'
            }
          ],
          resources: [
            {
              id: 'resource-1',
              name: 'Enterprise Sales Playbook',
              type: 'DOCUMENT',
              url: '/resources/enterprise-sales-playbook.pdf'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      recentActivity: [
        {
          id: 'activity-1',
          type: 'DEAL_CLOSED',
          title: 'Deal Closed',
          description: 'Sarah closed $150K deal with Acme Corp',
          userId: 'user-2',
          userName: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-2',
          type: 'MEETING_SCHEDULED',
          title: 'Meeting Scheduled',
          description: 'Team standup scheduled for tomorrow',
          userId: 'user-1',
          userName: 'John Smith',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ],
      summary: {
        totalMembers: 3,
        activeMembers: 3,
        quotaAttainment: 0.85,
        revenueTarget: 2000000,
        revenueActual: 1930000,
        dealsClosed: 26,
        averageDealSize: 85000,
        winRate: 0.68,
        topPerformer: 'user-2',
        improvementNeeded: ['Lead Qualification', 'Follow-up Process']
      }
    }

    return NextResponse.json(dashboard)
  } catch (error) {
    console.error('Error fetching team dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team dashboard' },
      { status: 500 }
    )
  }
}
