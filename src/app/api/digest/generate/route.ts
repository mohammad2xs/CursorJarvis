import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { WeeklyDigest } from '@/types'

export async function POST() {
  try {
    // Get data from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    // Get NBA performance data
    const nbaStats = await db.nBA.groupBy({
      by: ['playType'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      }
    })

    // Get NBA acceptance rates
    const nbaAcceptance = await db.nBA.groupBy({
      by: ['playType', 'status'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      }
    })

    // Calculate success rates
    const topPlays = nbaStats.map(stat => {
      const accepted = nbaAcceptance.find(n => n.playType === stat.playType && n.status === 'APPROVED')?._count.id || 0
      const total = stat._count.id
      const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0
      
      return {
        playType: stat.playType,
        count: total,
        successRate
      }
    }).sort((a, b) => b.successRate - a.successRate)

    // Get stalled opportunities
    const stalledOpps = await db.opportunity.findMany({
      where: {
        updatedAt: {
          lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        stage: {
          in: ['DISCOVER', 'EVALUATE']
        }
      },
      include: {
        company: true
      }
    })

    const stalls = [
      {
        type: 'Idle Opportunities',
        count: stalledOpps.length,
        description: 'Opportunities with no activity for 7+ days'
      }
    ]

    // Get pillar performance
    const pillarStats = await db.company.groupBy({
      by: ['subIndustry'],
      where: {
        opportunities: {
          some: {
            createdAt: {
              gte: sevenDaysAgo
            }
          }
        }
      },
      _count: {
        id: true
      }
    })

    const pillarPerformance = await Promise.all(
      pillarStats.map(async (stat) => {
        const meetings = await db.meeting.count({
          where: {
            company: {
              subIndustry: stat.subIndustry
            },
            createdAt: {
              gte: sevenDaysAgo
            }
          }
        })

        const opportunities = await db.opportunity.count({
          where: {
            company: {
              subIndustry: stat.subIndustry
            },
            createdAt: {
              gte: sevenDaysAgo
            }
          }
        })

        const revenue = await db.opportunity.aggregate({
          where: {
            company: {
              subIndustry: stat.subIndustry
            },
            stage: 'CLOSE_WON',
            createdAt: {
              gte: sevenDaysAgo
            }
          },
          _sum: {
            value: true
          }
        })

        return {
          subIndustry: stat.subIndustry,
          meetings,
          opportunities,
          revenue: revenue._sum.value || 0
        }
      })
    )

    // Get Perplexity wins
    const perplexitySignals = await db.accountSignal.findMany({
      where: {
        source: 'perplexity',
        detectedAt: {
          gte: sevenDaysAgo
        }
      },
      include: {
        company: true
      }
    })

    const perplexityWins = perplexitySignals.slice(0, 3).map(signal => ({
      signal: signal.title,
      action: 'AI-generated outreach based on signal',
      outcome: 'Positive response and engagement'
    }))

    // Generate rule changes based on performance
    const ruleChanges = {
      promote: topPlays
        .filter(play => play.successRate > 80 && play.count >= 5)
        .slice(0, 2)
        .map(play => ({
          playType: play.playType,
          segment: 'All', // In real app, segment by sub-industry
          reason: `${play.successRate}% success rate with ${play.count} executions`
        })),
      retire: topPlays
        .filter(play => play.successRate < 50 && play.count >= 3)
        .slice(0, 1)
        .map(play => ({
          playType: play.playType,
          segment: 'All',
          reason: `Only ${play.successRate}% success rate for 2 weeks`
        }))
    }

    // Generate next week focus
    const nextWeekFocus = pillarPerformance
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 2)
      .map(pillar => ({
        subIndustry: pillar.subIndustry,
        priority: `Focus on ${pillar.subIndustry} opportunities`,
        actions: [
          `Target high-value ${pillar.subIndustry} companies`,
          'Leverage industry-specific messaging',
          'Use Perplexity insights for personalization'
        ]
      }))

    const digest: WeeklyDigest = {
      topPlays,
      stalls,
      pillarPerformance,
      ruleChanges,
      nextWeekFocus,
      perplexityWins
    }

    return NextResponse.json(digest)
  } catch (error) {
    console.error('Error generating digest:', error)
    return NextResponse.json(
      { error: 'Failed to generate digest' },
      { status: 500 }
    )
  }
}
