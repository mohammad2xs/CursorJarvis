'use client'

import { useState, useEffect } from 'react'
import { DealOS } from '@/components/dashboard/deal-os'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { OpportunityWithRelations } from '@/types'

export default function DealsPage() {
  const [opportunities, setOpportunities] = useState<OpportunityWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - in real app, fetch from API
    const mockOpportunities: OpportunityWithRelations[] = [
      {
        id: 'opp_1',
        name: 'Acme Corp - Creative Platform',
        dealType: 'NEW_LOGO',
        stage: 'DISCOVER',
        value: 50000,
        probability: 25,
        closeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        companyId: 'comp_1',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_1',
          name: 'Acme Corporation',
          website: 'https://acme.com',
          subIndustry: 'Tech/SaaS',
          region: 'San Francisco, CA',
          tags: ['Innovation/Speed', 'Cost-out'],
          priorityLevel: 'STRATEGIC',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        activities: [],
        meetings: [],
        tasks: []
      },
      {
        id: 'opp_2',
        name: 'TechCorp - Creative Suite',
        dealType: 'NEW_LOGO',
        stage: 'EVALUATE',
        value: 75000,
        probability: 40,
        closeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        companyId: 'comp_2',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_2',
          name: 'TechCorp',
          website: 'https://techcorp.com',
          subIndustry: 'Tech/SaaS',
          region: 'Austin, TX',
          tags: ['Innovation/Speed', 'ESG'],
          priorityLevel: 'GROWTH',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        activities: [],
        meetings: [],
        tasks: []
      },
      {
        id: 'opp_3',
        name: 'Global Industries - Brand Platform',
        dealType: 'NEW_LOGO',
        stage: 'PROPOSE',
        value: 100000,
        probability: 60,
        closeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        companyId: 'comp_3',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_3',
          name: 'Global Industries',
          website: 'https://globalind.com',
          subIndustry: 'Oil & Gas/Energy',
          region: 'Houston, TX',
          tags: ['ESG', 'Safety'],
          priorityLevel: 'GROWTH',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        activities: [],
        meetings: [],
        tasks: []
      },
      {
        id: 'opp_4',
        name: 'HealthTech Solutions - Renewal',
        dealType: 'RENEWAL',
        stage: 'NEGOTIATE',
        value: 30000,
        probability: 80,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        companyId: 'comp_4',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_4',
          name: 'HealthTech Solutions',
          website: 'https://healthtech.com',
          subIndustry: 'Healthcare/MedSys',
          region: 'Boston, MA',
          tags: ['Safety', 'Workforce/DEI'],
          priorityLevel: 'STRATEGIC',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        activities: [],
        meetings: [],
        tasks: []
      },
      {
        id: 'opp_5',
        name: 'Consumer Brands Inc - Expansion',
        dealType: 'UPSELL',
        stage: 'EVALUATE',
        value: 40000,
        probability: 35,
        closeDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        companyId: 'comp_5',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_5',
          name: 'Consumer Brands Inc',
          website: 'https://consumerbrands.com',
          subIndustry: 'Consumer/CPG',
          region: 'New York, NY',
          tags: ['Innovation/Speed', 'Cost-out'],
          priorityLevel: 'GROWTH',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        activities: [],
        meetings: [],
        tasks: []
      },
      {
        id: 'opp_6',
        name: 'Aerospace Corp - Strategic Partnership',
        dealType: 'STRATEGIC',
        stage: 'DISCOVER',
        value: 200000,
        probability: 15,
        closeDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        companyId: 'comp_6',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_6',
          name: 'Aerospace Corp',
          website: 'https://aerospace.com',
          subIndustry: 'Aerospace & Defense',
          region: 'Seattle, WA',
          tags: ['Safety', 'Innovation/Speed'],
          priorityLevel: 'STRATEGIC',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        activities: [],
        meetings: [],
        tasks: []
      }
    ]

    setTimeout(() => {
      setOpportunities(mockOpportunities)
      setLoading(false)
    }, 1000)
  }, [])

  const handleUpdateOpportunity = async (oppId: string, updates: Partial<OpportunityWithRelations>) => {
    try {
      const response = await fetch(`/api/opportunities/${oppId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setOpportunities(prev => 
          prev.map(opp => 
            opp.id === oppId 
              ? { ...opp, ...updates }
              : opp
          )
        )
      }
    } catch (error) {
      console.error('Error updating opportunity:', error)
    }
  }

  const handleGeneratePlaybook = async (oppId: string, dealType: string) => {
    try {
      const response = await fetch('/api/opportunities/playbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oppId, dealType }),
      })

      if (response.ok) {
        const playbook = await response.json()
        console.log('Generated playbook:', playbook)
      }
    } catch (error) {
      console.error('Error generating playbook:', error)
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
              <p className="text-gray-600">Loading opportunities...</p>
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
          <DealOS 
            opportunities={opportunities}
            onUpdateOpportunity={handleUpdateOpportunity}
            onGeneratePlaybook={handleGeneratePlaybook}
          />
        </main>
      </div>
    </div>
  )
}
