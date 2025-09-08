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

    // Mock performance reports data
    const reports = [
      {
        id: 'report-1',
        userId,
        reportType: 'INDIVIDUAL',
        period: 'WEEKLY',
        startDate: '2024-01-08T00:00:00.000Z',
        endDate: '2024-01-14T00:00:00.000Z',
        metrics: {
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
            meetingsAttended: 7,
            demosCompleted: 3,
            proposalsSent: 2,
            followUpsCompleted: 15
          },
          productivity: {
            focusTime: 18.5,
            tasksCompleted: 32,
            energyLevel: 7.2,
            automationUsage: 0.75
          },
          communication: {
            responseTime: 2.5,
            responseRate: 0.85,
            clientSatisfactionScore: 4.6
          }
        },
        visualizations: {
          charts: [
            {
              id: 'revenue-chart',
              type: 'LINE',
              title: 'Revenue Trend',
              data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                  label: 'Revenue',
                  data: [100000, 110000, 120000, 125000],
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)'
                }]
              },
              config: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                }
              }
            }
          ],
          dashboards: [
            {
              id: 'sales-dashboard',
              title: 'Sales Performance',
              widgets: [
                { type: 'metric', title: 'Revenue', value: 125000, format: 'currency' },
                { type: 'metric', title: 'Deals Closed', value: 3, format: 'number' },
                { type: 'gauge', title: 'Quota Attainment', value: 0.83, max: 1 }
              ]
            }
          ]
        },
        summary: {
          keyAchievements: [
            'Exceeded weekly revenue target by 15%',
            'Maintained high client satisfaction score of 4.6',
            'Completed 32 tasks with 92% completion rate'
          ],
          challenges: [
            'Email response time above target (2.5h vs 2h)',
            'Focus time decreased from previous week',
            'Social media engagement below milestone'
          ],
          nextSteps: [
            'Implement email templates for faster responses',
            'Block focus time in calendar for deep work',
            'Increase social media posting frequency'
          ],
          overallScore: 85,
          performanceGrade: 'A-'
        },
        generatedAt: '2024-01-14T00:00:00.000Z',
        expiresAt: '2024-02-13T00:00:00.000Z'
      },
      {
        id: 'report-2',
        userId,
        reportType: 'MANAGER',
        period: 'MONTHLY',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-31T00:00:00.000Z',
        metrics: {
          sales: {
            revenue: 500000,
            dealsClosed: 12,
            dealsWon: 8,
            dealsLost: 4,
            averageDealSize: 62500,
            salesCycleLength: 45,
            conversionRate: 0.67,
            winRate: 0.67,
            quotaAttainment: 1.0,
            pipelineValue: 1200000,
            newOpportunities: 32,
            qualifiedLeads: 48
          },
          activities: {
            callsMade: 100,
            emailsSent: 180,
            meetingsAttended: 28,
            demosCompleted: 12,
            proposalsSent: 8,
            followUpsCompleted: 60
          },
          productivity: {
            focusTime: 74,
            tasksCompleted: 128,
            energyLevel: 7.2,
            automationUsage: 0.75
          },
          communication: {
            responseTime: 2.5,
            responseRate: 0.85,
            clientSatisfactionScore: 4.6
          }
        },
        visualizations: {
          charts: [
            {
              id: 'monthly-revenue-chart',
              type: 'BAR',
              title: 'Monthly Revenue by Week',
              data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                  label: 'Revenue',
                  data: [100000, 125000, 150000, 125000],
                  backgroundColor: 'rgba(59, 130, 246, 0.8)'
                }]
              },
              config: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            }
          ],
          dashboards: [
            {
              id: 'monthly-dashboard',
              title: 'Monthly Performance',
              widgets: [
                { type: 'metric', title: 'Total Revenue', value: 500000, format: 'currency' },
                { type: 'metric', title: 'Deals Closed', value: 12, format: 'number' },
                { type: 'gauge', title: 'Quota Attainment', value: 1.0, max: 1 }
              ]
            }
          ]
        },
        summary: {
          keyAchievements: [
            'Achieved 100% of monthly quota',
            'Closed 12 deals with 67% win rate',
            'Maintained consistent high performance'
          ],
          challenges: [
            'Email response time needs improvement',
            'Social media engagement below target',
            'Focus time optimization needed'
          ],
          nextSteps: [
            'Focus on communication efficiency',
            'Implement social media strategy',
            'Optimize time management'
          ],
          overallScore: 88,
          performanceGrade: 'A-'
        },
        generatedAt: '2024-01-31T00:00:00.000Z',
        expiresAt: '2024-03-02T00:00:00.000Z'
      },
      {
        id: 'report-3',
        userId,
        reportType: 'EXECUTIVE',
        period: 'QUARTERLY',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-03-31T00:00:00.000Z',
        metrics: {
          sales: {
            revenue: 1500000,
            dealsClosed: 36,
            dealsWon: 24,
            dealsLost: 12,
            averageDealSize: 62500,
            salesCycleLength: 45,
            conversionRate: 0.67,
            winRate: 0.67,
            quotaAttainment: 1.0,
            pipelineValue: 3600000,
            newOpportunities: 96,
            qualifiedLeads: 144
          },
          activities: {
            callsMade: 300,
            emailsSent: 540,
            meetingsAttended: 84,
            demosCompleted: 36,
            proposalsSent: 24,
            followUpsCompleted: 180
          },
          productivity: {
            focusTime: 222,
            tasksCompleted: 384,
            energyLevel: 7.2,
            automationUsage: 0.75
          },
          communication: {
            responseTime: 2.5,
            responseRate: 0.85,
            clientSatisfactionScore: 4.6
          }
        },
        visualizations: {
          charts: [
            {
              id: 'quarterly-revenue-chart',
              type: 'AREA',
              title: 'Quarterly Revenue Trend',
              data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                  label: 'Revenue',
                  data: [500000, 500000, 500000],
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)'
                }]
              },
              config: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                }
              }
            }
          ],
          dashboards: [
            {
              id: 'quarterly-dashboard',
              title: 'Quarterly Performance',
              widgets: [
                { type: 'metric', title: 'Total Revenue', value: 1500000, format: 'currency' },
                { type: 'metric', title: 'Deals Closed', value: 36, format: 'number' },
                { type: 'gauge', title: 'Quota Attainment', value: 1.0, max: 1 }
              ]
            }
          ]
        },
        summary: {
          keyAchievements: [
            'Exceeded quarterly revenue target by 20%',
            'Maintained consistent high performance',
            'Achieved 100% quota attainment'
          ],
          challenges: [
            'Email response time optimization needed',
            'Social media engagement below target',
            'Focus time management improvement required'
          ],
          nextSteps: [
            'Implement communication efficiency improvements',
            'Develop social media strategy',
            'Optimize time management processes'
          ],
          overallScore: 90,
          performanceGrade: 'A'
        },
        generatedAt: '2024-03-31T00:00:00.000Z',
        expiresAt: '2024-04-30T00:00:00.000Z'
      }
    ]

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching performance reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance reports' },
      { status: 500 }
    )
  }
}
