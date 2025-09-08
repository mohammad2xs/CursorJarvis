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

    // Mock content analytics
    const analytics = {
      userId,
      period,
      metrics: {
        totalGenerated: 156,
        templatesUsed: 12,
        avgEngagement: 0.78,
        topPerformingTemplates: [
          {
            templateId: 'template-1',
            name: 'Discovery Call Follow-up',
            usageCount: 45,
            successRate: 0.78
          },
          {
            templateId: 'template-2',
            name: 'LinkedIn Connection Request',
            usageCount: 32,
            successRate: 0.65
          },
          {
            templateId: 'template-3',
            name: 'Proposal Follow-up',
            usageCount: 28,
            successRate: 0.72
          }
        ],
        categoryBreakdown: [
          { category: 'FOLLOW_UP', count: 45, avgPerformance: 0.78 },
          { category: 'EMAIL', count: 32, avgPerformance: 0.72 },
          { category: 'LINKEDIN', count: 28, avgPerformance: 0.65 },
          { category: 'PROPOSAL', count: 25, avgPerformance: 0.68 },
          { category: 'PRESENTATION', count: 18, avgPerformance: 0.75 },
          { category: 'THANK_YOU', count: 8, avgPerformance: 0.82 }
        ],
        personalizationImpact: {
          basic: 0.65,
          advanced: 0.78,
          maximum: 0.85
        },
        tonePerformance: [
          { tone: 'PROFESSIONAL', avgEngagement: 0.78, usageCount: 45 },
          { tone: 'FRIENDLY', avgEngagement: 0.72, usageCount: 32 },
          { tone: 'URGENT', avgEngagement: 0.68, usageCount: 28 },
          { tone: 'CONVERSATIONAL', avgEngagement: 0.75, usageCount: 25 },
          { tone: 'FORMAL', avgEngagement: 0.70, usageCount: 26 }
        ]
      },
      trends: {
        generationTrend: 'INCREASING',
        performanceTrend: 'IMPROVING',
        popularCategories: ['FOLLOW_UP', 'EMAIL', 'LINKEDIN'],
        emergingPatterns: [
          'Shorter content performs better on LinkedIn',
          'Personalization increases engagement by 25%',
          'Follow-up emails sent within 24 hours have 40% higher response rates',
          'Templates with 2-3 variables perform best'
        ]
      },
      recommendations: [
        {
          type: 'TEMPLATE_OPTIMIZATION',
          title: 'Optimize Discovery Follow-up Template',
          description: 'Your discovery follow-up template has high usage but could benefit from more personalization based on meeting insights',
          impact: 'HIGH',
          action: 'Add 2-3 more dynamic variables based on meeting insights and pain points identified'
        },
        {
          type: 'PERSONALIZATION_IMPROVEMENT',
          title: 'Increase Personalization Level',
          description: 'Content with maximum personalization shows 20% higher engagement rates',
          impact: 'MEDIUM',
          action: 'Upgrade 60% of your content generation to use maximum personalization level'
        },
        {
          type: 'TONE_ADJUSTMENT',
          title: 'Experiment with Conversational Tone',
          description: 'Conversational tone shows 3% higher engagement than professional tone in your industry',
          impact: 'LOW',
          action: 'Test conversational tone in 25% of your follow-up emails'
        },
        {
          type: 'CONTENT_STRATEGY',
          title: 'Create LinkedIn-Specific Templates',
          description: 'LinkedIn content performs better when optimized for the platform',
          impact: 'MEDIUM',
          action: 'Create 3-4 LinkedIn-specific templates with shorter, more engaging content'
        }
      ]
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching content analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content analytics' },
      { status: 500 }
    )
  }
}
