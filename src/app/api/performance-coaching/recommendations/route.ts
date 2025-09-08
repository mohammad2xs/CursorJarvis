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

    // Mock coaching recommendations
    const recommendations = [
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
      },
      {
        id: 'rec-2',
        userId,
        type: 'PERFORMANCE_IMPROVEMENT',
        title: 'Optimize Email Response Time',
        description: 'Your average email response time is 2.5 hours. Reducing this to 1 hour could improve customer satisfaction by 25%',
        reasoning: 'Analysis of your communication patterns shows that faster responses correlate with higher deal closure rates',
        priority: 'MEDIUM',
        estimatedImpact: 0.6,
        effortRequired: 'LOW',
        timeline: 14,
        skills: ['Time Management', 'Communication Efficiency'],
        resources: [
          {
            id: 'res-3',
            title: 'Email Productivity Best Practices',
            type: 'ARTICLE',
            duration: 15,
            difficulty: 'BEGINNER',
            description: 'Quick guide to email productivity and response time optimization',
            tags: ['Productivity', 'Email', 'Communication'],
            rating: 4.2,
            completionStatus: 'NOT_STARTED'
          }
        ],
        successMetrics: [
          {
            metric: 'Average Email Response Time',
            currentValue: 2.5,
            targetValue: 1.0,
            timeframe: '14 days'
          }
        ],
        prerequisites: [],
        alternatives: ['Email templates', 'Auto-responses'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'rec-3',
        userId,
        type: 'CAREER_GROWTH',
        title: 'Develop Leadership Skills',
        description: 'Build leadership capabilities to prepare for senior sales roles and team management opportunities',
        reasoning: 'Your strong individual performance suggests readiness for leadership responsibilities',
        priority: 'MEDIUM',
        estimatedImpact: 0.7,
        effortRequired: 'HIGH',
        timeline: 90,
        skills: ['Leadership', 'Team Management', 'Strategic Thinking'],
        resources: [
          {
            id: 'res-4',
            title: 'Sales Leadership Mastery Program',
            type: 'COURSE',
            duration: 300,
            difficulty: 'ADVANCED',
            description: 'Comprehensive program for developing sales leadership skills',
            tags: ['Leadership', 'Sales', 'Management'],
            rating: 4.9,
            completionStatus: 'NOT_STARTED'
          }
        ],
        successMetrics: [
          {
            metric: 'Leadership Readiness Score',
            currentValue: 6,
            targetValue: 8,
            timeframe: '90 days'
          }
        ],
        prerequisites: ['3+ years sales experience', 'Strong performance record'],
        alternatives: ['Mentoring program', 'Internal leadership training'],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Error fetching coaching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coaching recommendations' },
      { status: 500 }
    )
  }
}
