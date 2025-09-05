'use client'

import { useState, useEffect } from 'react'
import { MyWork } from '@/components/dashboard/my-work'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { NBA, NBAStatus } from '@/types'

export default function HomePage() {
  const [nbas, setNbas] = useState<NBA[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - in real app, fetch from API
    const mockNBAs: NBA[] = [
      {
        id: '1',
        playType: 'PRE_MEETING',
        title: 'Pre-meeting prep for Acme Corp discovery call',
        description: 'Prepare agenda, discovery questions, and relevant case study for John Smith',
        rationale: 'Meeting scheduled in 2 hours',
        source: 'Meeting ID: mtg_123',
        status: 'PENDING',
        priority: 5,
        companyId: 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        playType: 'POST_MEETING',
        title: 'Follow up on TechCorp demo',
        description: 'Send recap, next steps, and relevant assets to Sarah Johnson',
        rationale: 'Meeting completed 1 day ago',
        source: 'Meeting ID: mtg_124',
        status: 'PENDING',
        priority: 4,
        companyId: 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        playType: 'NEW_LEAD',
        title: 'Connect with Global Industries CMO',
        description: 'Send LinkedIn connection request and comment on recent activity',
        rationale: 'New contact added 3 days ago',
        source: 'Contact ID: contact_3',
        status: 'PENDING',
        priority: 3,
        companyId: 'comp_3',
        contactId: 'contact_3',
        opportunityId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        playType: 'VP_CMO_NO_TOUCH',
        title: 'Executive outreach to Energy Corp VP',
        description: 'Share executive POV aligned to Oil & Gas pillar',
        rationale: 'No touch for 15 days',
        source: 'Contact ID: contact_4',
        status: 'PENDING',
        priority: 4,
        companyId: 'comp_4',
        contactId: 'contact_4',
        opportunityId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        playType: 'PERPLEXITY_NEWS',
        title: 'ESG opportunity: Energy Corp sustainability initiative',
        description: 'Share sustainability POV + case study',
        rationale: 'ESG news detected: Energy Corp announces new sustainability goals',
        source: 'Signal ID: signal_1',
        status: 'PENDING',
        priority: 3,
        companyId: 'comp_4',
        contactId: null,
        opportunityId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    setTimeout(() => {
      setNbas(mockNBAs)
      setLoading(false)
    }, 1000)
  }, [])

  const handleUpdateNBA = async (nbaId: string, status: NBAStatus, outcome?: string) => {
    try {
      // In real app, make API call to update NBA
      const response = await fetch(`/api/nbas/${nbaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, outcome }),
      })

      if (response.ok) {
        setNbas(prev => prev.filter(nba => nba.id !== nbaId))
      }
    } catch (error) {
      console.error('Error updating NBA:', error)
      // For now, just remove from local state
      setNbas(prev => prev.filter(nba => nba.id !== nbaId))
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your work...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <MyWork nbas={nbas} onUpdateNBA={handleUpdateNBA} />
        </main>
      </div>
    </div>
  )
}