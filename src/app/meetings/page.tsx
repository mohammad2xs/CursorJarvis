'use client'

import { useState, useEffect } from 'react'
import { SalesIntelligencePro } from '@/components/dashboard/sales-intelligence-pro'
import { MeetingWithRelations } from '@/types'

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingWithRelations[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - in real app, fetch from API
    const mockMeetings: MeetingWithRelations[] = [
      {
        id: '1',
        title: 'Discovery Call - Acme Corp',
        description: 'Initial discovery call to understand their creative needs',
        type: 'DISCOVERY',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 30,
        meetingUrl: 'https://calendly.com/meeting/123',
        notes: null,
        outcome: null,
        companyId: 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        calendlyEventId: 'cal_123',
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
        contact: {
          id: 'contact_1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@acme.com',
          phone: '+1-555-0123',
          title: 'VP of Marketing',
          role: 'VP',
          linkedinUrl: 'https://linkedin.com/in/johnsmith',
          companyId: 'comp_1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        opportunity: {
          id: 'opp_1',
          name: 'Acme Corp - Creative Platform',
          dealType: 'NEW_LOGO',
          stage: 'DISCOVER',
          value: 50000,
          probability: 25,
          closeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          companyId: 'comp_1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      {
        id: '2',
        title: 'Demo - TechCorp',
        description: 'Product demonstration and Q&A session',
        type: 'DEMO',
        status: 'COMPLETED',
        scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 45,
        meetingUrl: 'https://calendly.com/meeting/124',
        notes: 'Great interest in our platform. Next step: proposal.',
        outcome: 'Positive - moving to proposal stage',
        companyId: 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        calendlyEventId: 'cal_124',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
        contact: {
          id: 'contact_2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@techcorp.com',
          phone: '+1-555-0124',
          title: 'CMO',
          role: 'CMO',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          companyId: 'comp_2',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        opportunity: {
          id: 'opp_2',
          name: 'TechCorp - Creative Suite',
          dealType: 'NEW_LOGO',
          stage: 'EVALUATE',
          value: 75000,
          probability: 40,
          closeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          companyId: 'comp_2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      {
        id: '3',
        title: 'Follow-up - Global Industries',
        description: 'Follow-up on proposal and next steps',
        type: 'FOLLOW_UP',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        duration: 20,
        meetingUrl: 'https://calendly.com/meeting/125',
        notes: null,
        outcome: null,
        companyId: 'comp_3',
        contactId: 'contact_3',
        opportunityId: 'opp_3',
        calendlyEventId: 'cal_125',
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
        contact: {
          id: 'contact_3',
          firstName: 'Mike',
          lastName: 'Chen',
          email: 'mike.chen@globalind.com',
          phone: '+1-555-0125',
          title: 'Director of Creative',
          role: 'Director',
          linkedinUrl: 'https://linkedin.com/in/mikechen',
          companyId: 'comp_3',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        opportunity: {
          id: 'opp_3',
          name: 'Global Industries - Brand Platform',
          dealType: 'NEW_LOGO',
          stage: 'PROPOSE',
          value: 100000,
          probability: 60,
          closeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          companyId: 'comp_3',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    ]

    const mockOpportunities = [
      {
        id: 'opp_1',
        name: 'Acme Corp - Creative Platform',
        dealType: 'NEW_LOGO',
        stage: 'DISCOVER',
        amount: 50000,
        probability: 25,
        closeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        companyId: 'comp_1',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_1',
          name: 'Acme Corporation',
          subIndustry: 'Tech/SaaS',
          priorityLevel: 'STRATEGIC'
        }
      },
      {
        id: 'opp_2',
        name: 'TechCorp - Creative Suite',
        dealType: 'NEW_LOGO',
        stage: 'EVALUATE',
        amount: 75000,
        probability: 40,
        closeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        companyId: 'comp_2',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_2',
          name: 'TechCorp',
          subIndustry: 'Tech/SaaS',
          priorityLevel: 'GROWTH'
        }
      },
      {
        id: 'opp_3',
        name: 'Global Industries - Brand Platform',
        dealType: 'NEW_LOGO',
        stage: 'PROPOSE',
        amount: 100000,
        probability: 60,
        closeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        companyId: 'comp_3',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 'comp_3',
          name: 'Global Industries',
          subIndustry: 'Oil & Gas/Energy',
          priorityLevel: 'GROWTH'
        }
      }
    ]

    const mockCompanies = [
      {
        id: 'comp_1',
        name: 'Acme Corporation',
        subIndustry: 'Tech/SaaS',
        priorityLevel: 'STRATEGIC',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'comp_2',
        name: 'TechCorp',
        subIndustry: 'Tech/SaaS',
        priorityLevel: 'GROWTH',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'comp_3',
        name: 'Global Industries',
        subIndustry: 'Oil & Gas/Energy',
        priorityLevel: 'GROWTH',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    setTimeout(() => {
      setMeetings(mockMeetings)
      setOpportunities(mockOpportunities)
      setCompanies(mockCompanies)
      setLoading(false)
    }, 1000)
  }, [])

  const handleUpdateMeeting = async (meetingId: string, updates: Partial<MeetingWithRelations>) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setMeetings(prev => 
          prev.map(meeting => 
            meeting.id === meetingId 
              ? { ...meeting, ...updates }
              : meeting
          )
        )
      }
    } catch (error) {
      console.error('Error updating meeting:', error)
    }
  }

  const handleGenerateRecap = async (meetingId: string, notes: string) => {
    // This will be handled by the MeetingOS component
    console.log('Generating recap for meeting:', meetingId, 'with notes:', notes)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading meetings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <SalesIntelligencePro 
            meetings={meetings}
            opportunities={opportunities}
            companies={companies}
            onUpdateMeeting={handleUpdateMeeting}
            onUpdateOpportunity={() => {}}
            onGenerateRecap={handleGenerateRecap}
          />
        </div>
      </div>
    </div>
  )
}
