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

    // Mock coaching dashboard data
    const dashboard = {
      goals: [
        {
          id: 'goal-1',
          userId,
          title: 'Improve Discovery Call Skills',
          description: 'Enhance ability to conduct effective discovery calls and uncover customer pain points',
          category: 'SALES_SKILLS',
          priority: 'HIGH',
          currentLevel: 6,
          targetLevel: 8,
          progress: 45,
          estimatedTimeToComplete: 30,
          skills: ['Discovery Questions', 'Active Listening', 'Pain Point Identification'],
          resources: [
            {
              id: 'res-1',
              title: 'The Art of Discovery Calls',
              type: 'COURSE',
              duration: 120,
              difficulty: 'INTERMEDIATE',
              description: 'Comprehensive course on conducting effective discovery calls',
              tags: ['Sales', 'Discovery', 'Communication'],
              rating: 4.5,
              completionStatus: 'IN_PROGRESS'
            }
          ],
          milestones: [
            {
              id: 'milestone-1',
              title: 'Complete Discovery Call Course',
              description: 'Finish the comprehensive discovery call training',
              targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              completed: false,
              metrics: [
                {
                  name: 'Course Progress',
                  currentValue: 60,
                  targetValue: 100,
                  unit: '%'
                }
              ]
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      insights: [
        {
          id: 'insight-1',
          userId,
          insightType: 'STRENGTH',
          title: 'Strong Closing Skills',
          description: 'Your closing rate has improved by 15% over the last quarter, indicating strong closing abilities',
          category: 'Sales Performance',
          confidence: 0.85,
          impact: 'HIGH',
          actionable: true,
          recommendations: [
            'Leverage this strength in team training sessions',
            'Document your closing techniques for knowledge sharing',
            'Consider mentoring junior team members'
          ],
          dataPoints: [
            {
              metric: 'Closing Rate',
              value: 0.68,
              trend: 'IMPROVING',
              benchmark: 0.55
            }
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 'insight-2',
          userId,
          insightType: 'OPPORTUNITY',
          title: 'Discovery Call Improvement Opportunity',
          description: 'Discovery calls are taking 20% longer than industry average, suggesting room for efficiency improvement',
          category: 'Sales Efficiency',
          confidence: 0.78,
          impact: 'MEDIUM',
          actionable: true,
          recommendations: [
            'Practice time-boxing discovery questions',
            'Use structured discovery frameworks',
            'Record and review discovery calls for improvement'
          ],
          dataPoints: [
            {
              metric: 'Average Discovery Call Duration',
              value: 45,
              trend: 'STABLE',
              benchmark: 35
            }
          ],
          createdAt: new Date().toISOString()
        }
      ],
      recommendations: [
        {
          id: 'rec-1',
          userId,
          type: 'SKILL_DEVELOPMENT',
          title: 'Advanced Objection Handling',
          description: 'Develop advanced techniques for handling complex objections during sales conversations',
          reasoning: 'Your current objection handling skills are at intermediate level, but advanced techniques could increase close rates by 20%',
          priority: 'HIGH',
          estimatedImpact: 0.8,
          effortRequired: 'MEDIUM',
          timeline: 21,
          skills: ['Objection Handling', 'Persuasion', 'Negotiation'],
          resources: [
            {
              id: 'res-2',
              title: 'Advanced Objection Handling Masterclass',
              type: 'COURSE',
              duration: 180,
              difficulty: 'ADVANCED',
              description: 'Comprehensive training on handling complex sales objections',
              tags: ['Sales', 'Objection Handling', 'Advanced'],
              rating: 4.8,
              completionStatus: 'NOT_STARTED'
            }
          ],
          successMetrics: [
            {
              metric: 'Objection Resolution Rate',
              currentValue: 0.65,
              targetValue: 0.85,
              timeframe: '30 days'
            }
          ],
          prerequisites: ['Basic objection handling knowledge'],
          alternatives: ['Peer mentoring', 'Manager coaching'],
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      sessions: [],
      assessments: [
        {
          id: 'assessment-1',
          userId,
          skillName: 'Discovery Call Skills',
          category: 'Sales Skills',
          currentLevel: 6,
          targetLevel: 8,
          lastAssessed: new Date().toISOString(),
          assessmentMethod: 'PERFORMANCE_DATA',
          evidence: [
            {
              type: 'METRIC',
              description: 'Discovery call success rate',
              value: 0.65,
              date: new Date().toISOString()
            },
            {
              type: 'FEEDBACK',
              description: 'Manager feedback on discovery calls',
              value: 7,
              date: new Date().toISOString()
            }
          ],
          developmentPlan: {
            activities: [
              'Complete discovery call training course',
              'Practice with role-playing exercises',
              'Shadow experienced colleagues',
              'Record and review own calls'
            ],
            timeline: 4,
            resources: [
              'Discovery Call Mastery Course',
              'Role-playing practice sessions',
              'Call recording and analysis tools'
            ],
            milestones: [
              'Complete training course',
              'Conduct 10 practice calls',
              'Achieve 80% discovery call success rate'
            ]
          }
        }
      ],
      progress: {
        goalsCompleted: 0,
        totalGoals: 1,
        skillsImproved: 0,
        sessionsCompleted: 0,
        averageRating: 0
      }
    }

    return NextResponse.json(dashboard)
  } catch (error) {
    console.error('Error fetching coaching dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coaching dashboard' },
      { status: 500 }
    )
  }
}
