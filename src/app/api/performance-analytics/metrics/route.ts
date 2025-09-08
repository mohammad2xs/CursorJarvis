import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'WEEKLY'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Mock performance metrics data
    const metrics = [
      {
        userId,
        period,
        startDate: new Date('2024-01-08'),
        endDate: new Date('2024-01-14'),
        sales: {
          revenue: 125000,
          dealsClosed: 3,
          dealsWon: 2,
          dealsLost: 1,
          averageDealSize: 62500,
          salesCycleLength: 45,
          conversionRate: 0.67,
          winRate: 0.67,
          quotaAttainment: 0.83,
          pipelineValue: 350000,
          newOpportunities: 8,
          qualifiedLeads: 12
        },
        activities: {
          callsMade: 25,
          emailsSent: 45,
          meetingsScheduled: 8,
          meetingsAttended: 7,
          demosCompleted: 3,
          proposalsSent: 2,
          followUpsCompleted: 15,
          nbasCompleted: 18,
          tasksCompleted: 32,
          socialMediaPosts: 5,
          socialMediaEngagements: 45
        },
        communication: {
          responseTime: 2.5,
          responseRate: 0.85,
          emailOpenRate: 0.72,
          emailClickRate: 0.18,
          meetingAttendanceRate: 0.88,
          followUpCompletionRate: 0.92,
          socialEngagementRate: 0.12,
          clientSatisfactionScore: 4.6
        },
        productivity: {
          tasksCompleted: 32,
          tasksOverdue: 2,
          focusTime: 18.5,
          interruptions: 12,
          energyLevel: 7.2,
          peakProductivityHours: ['09:00-11:00', '14:00-16:00'],
          timeSpentOnHighValueActivities: 12.5,
          timeSpentOnAdministrativeTasks: 3.2,
          automationUsage: 0.75
        },
        learning: {
          skillsImproved: 2,
          trainingCompleted: 1,
          certificationsEarned: 0,
          knowledgeGapsIdentified: 3,
          behavioralInsightsGenerated: 5,
          coachingSessionsAttended: 2,
          performanceImprovements: 4
        },
        technology: {
          aiInteractions: 156,
          voiceCommandsUsed: 23,
          automationTriggers: 45,
          systemUptime: 0.99,
          errorRate: 0.02,
          featureAdoption: 0.68,
          integrationUsage: 0.82
        },
        goals: {
          totalGoals: 8,
          goalsAchieved: 3,
          goalsInProgress: 4,
          goalsOverdue: 1,
          goalCompletionRate: 0.375,
          averageGoalProgress: 0.65
        },
        trends: {
          revenueGrowth: 0.15,
          activityGrowth: 0.08,
          productivityGrowth: 0.12,
          learningGrowth: 0.25,
          technologyAdoptionGrowth: 0.18
        },
        rankings: {
          teamRank: 2,
          companyRank: 15,
          industryBenchmark: 0.75,
          percentile: 85
        },
        insights: {
          topPerformingActivities: ['Client Meetings', 'Proposal Writing', 'Follow-up Calls'],
          improvementAreas: ['Email Response Time', 'Social Media Engagement', 'Administrative Tasks'],
          recommendations: [
            'Increase social media posting frequency',
            'Automate more administrative tasks',
            'Focus on high-value activities during peak hours'
          ],
          riskFactors: ['Overdue tasks increasing', 'Email response time above target'],
          opportunities: ['New market segment identified', 'Upselling potential in existing accounts'],
          strengths: ['Strong client relationships', 'High meeting attendance rate']
        },
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      }
    ]

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    )
  }
}
