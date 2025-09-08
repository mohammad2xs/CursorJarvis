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

    // Mock data for testing
    const mockData = {
      patterns: [
        {
          id: `pattern-${userId}-work-schedule`,
          userId,
          patternType: 'WORK_SCHEDULE',
          pattern: {
            preferredStartTime: '08:00',
            preferredEndTime: '17:00',
            breakFrequency: 90,
            peakProductivityHours: ['09:00-11:00', '14:00-16:00'],
            lowEnergyHours: ['12:00-13:00', '16:00-17:00']
          },
          confidence: 0.85,
          lastUpdated: new Date().toISOString(),
          sampleSize: 45,
          accuracy: 0.82
        }
      ],
      insights: [
        {
          id: `insight-${userId}-energy-optimization`,
          userId,
          insightType: 'OPTIMIZATION',
          title: 'Energy Optimization Opportunity',
          description: 'Your peak productivity hours are 9-11 AM and 2-4 PM. Consider scheduling high-priority tasks during these windows.',
          confidence: 0.85,
          impact: 'HIGH',
          actionable: true,
          suggestedActions: [
            'Block 9-11 AM for deep work',
            'Schedule meetings in 2-4 PM slot',
            'Use 12-1 PM for low-energy tasks'
          ],
          createdAt: new Date().toISOString()
        }
      ],
      recommendations: [
        {
          id: `rec-${userId}-smart-scheduling`,
          userId,
          category: 'SCHEDULING',
          title: 'Smart Scheduling System',
          description: 'Automatically schedule tasks based on your energy patterns and productivity peaks',
          reasoning: 'Your energy patterns show clear peaks at 9-11 AM and 2-4 PM. This system will optimize your calendar accordingly.',
          confidence: 0.85,
          expectedImpact: 0.25,
          implementation: {
            steps: [
              'Enable automatic task scheduling',
              'Set energy-based time blocks',
              'Configure break reminders',
              'Test and adjust preferences'
            ],
            estimatedTime: 15,
            difficulty: 'EASY'
          },
          metrics: {
            successRate: 0.82,
            userSatisfaction: 0.88,
            timeSaved: 45
          },
          createdAt: new Date().toISOString()
        }
      ],
      metrics: {
        userId,
        period: 'WEEKLY',
        metrics: {
          productivity: {
            tasksCompleted: 40,
            averageTaskTime: 45,
            focusTime: 22.5,
            interruptions: 60
          },
          communication: {
            emailsSent: 75,
            callsMade: 15,
            meetingsAttended: 10,
            responseTime: 2.5
          },
          energy: {
            peakHours: ['09:00-11:00', '14:00-16:00'],
            lowEnergyHours: ['12:00-13:00', '16:00-17:00'],
            averageEnergy: 7.2,
            energyConsistency: 0.75
          },
          learning: {
            newSkills: 1,
            knowledgeGaps: ['Advanced Analytics', 'AI Tools', 'Sales Psychology'],
            improvementAreas: ['Time Management', 'Communication', 'Technical Skills'],
            successPatterns: ['Morning Deep Work', 'Afternoon Meetings', 'Evening Planning']
          }
        },
        trends: {
          productivity: 'IMPROVING',
          communication: 'STABLE',
          energy: 'IMPROVING',
          learning: 'IMPROVING'
        },
        lastUpdated: new Date().toISOString()
      }
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error in simple endpoint:', error)
    return NextResponse.json(
      { error: 'Simple test failed' },
      { status: 500 }
    )
  }
}
