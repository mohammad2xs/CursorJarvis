'use client'

import { useState, useEffect } from 'react'
import { WeeklyDigestComponent } from '@/components/dashboard/weekly-digest'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { WeeklyDigest } from '@/types'

export default function AnalyticsPage() {
  const [digest, setDigest] = useState<WeeklyDigest>({
    topPlays: [
      { playType: 'PRE_MEETING', count: 12, successRate: 85 },
      { playType: 'POST_MEETING', count: 8, successRate: 92 },
      { playType: 'NEW_LEAD', count: 15, successRate: 67 },
      { playType: 'VP_CMO_NO_TOUCH', count: 6, successRate: 78 },
      { playType: 'PERPLEXITY_NEWS', count: 4, successRate: 88 }
    ],
    stalls: [
      { type: 'Idle Opportunities', count: 3, description: 'Opportunities with no activity for 7+ days' },
      { type: 'Stalled Discovery', count: 2, description: 'Discovery stage taking longer than 14 days' },
      { type: 'Low Engagement', count: 5, description: 'Contacts with minimal engagement' }
    ],
    pillarPerformance: [
      { subIndustry: 'Tech/SaaS', meetings: 8, opportunities: 12, revenue: 150000 },
      { subIndustry: 'Oil & Gas/Energy', meetings: 4, opportunities: 6, revenue: 200000 },
      { subIndustry: 'Healthcare/MedSys', meetings: 3, opportunities: 4, revenue: 75000 },
      { subIndustry: 'Consumer/CPG', meetings: 2, opportunities: 3, revenue: 50000 },
      { subIndustry: 'Aerospace & Defense', meetings: 1, opportunities: 2, revenue: 100000 }
    ],
    ruleChanges: {
      promote: [
        { playType: 'PRE_MEETING', segment: 'Tech/SaaS', reason: '85% acceptance rate, 92% meeting success' },
        { playType: 'PERPLEXITY_NEWS', segment: 'Oil & Gas/Energy', reason: '88% acceptance rate, high engagement' }
      ],
      retire: [
        { playType: 'VP_CMO_NO_TOUCH', segment: 'Consumer/CPG', reason: 'Only 45% acceptance rate for 2 weeks' }
      ]
    },
    nextWeekFocus: [
      { 
        subIndustry: 'Tech/SaaS', 
        priority: 'Focus on AI/ML companies with creative needs',
        actions: ['Target AI startups', 'Emphasize automation benefits', 'Leverage Perplexity insights']
      },
      { 
        subIndustry: 'Oil & Gas/Energy', 
        priority: 'ESG-focused messaging and sustainability',
        actions: ['Highlight ESG content library', 'Share sustainability case studies', 'Target ESG initiatives']
      }
    ],
    perplexityWins: [
      { 
        signal: 'TechCorp announced AI initiative', 
        action: 'Sent AI-focused case study', 
        outcome: 'Scheduled demo meeting' 
      },
      { 
        signal: 'Energy Corp hired new CMO', 
        action: 'Congratulatory outreach with ESG content', 
        outcome: 'Positive response and follow-up meeting' 
      },
      { 
        signal: 'Healthcare company regulatory update', 
        action: 'Compliance-focused value proposition', 
        outcome: 'Moved to proposal stage' 
      }
    ]
  })

  const handlePromoteRule = async (playType: string, segment: string) => {
    try {
      const response = await fetch('/api/rules/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playType, segment }),
      })

      if (response.ok) {
        console.log(`Promoted rule: ${playType} for ${segment}`)
        // In real app, update the digest state
      }
    } catch (error) {
      console.error('Error promoting rule:', error)
    }
  }

  const handleRetireRule = async (playType: string, segment: string) => {
    try {
      const response = await fetch('/api/rules/retire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playType, segment }),
      })

      if (response.ok) {
        console.log(`Retired rule: ${playType} for ${segment}`)
        // In real app, update the digest state
      }
    } catch (error) {
      console.error('Error retiring rule:', error)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <WeeklyDigestComponent 
            digest={digest}
            onPromoteRule={handlePromoteRule}
            onRetireRule={handleRetireRule}
          />
        </main>
      </div>
    </div>
  )
}
