'use client'

import { useState, useEffect } from 'react'
import { LeadsInbox } from '@/components/dashboard/leads-inbox'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

interface Lead {
  id: string
  name: string
  title: string
  company: string
  subIndustry: string
  region: string
  linkedinUrl?: string
  email?: string
  phone?: string
  role: string
  recentActivity?: string
  pillarFit: 'high' | 'medium' | 'low'
  roleFit: 'high' | 'medium' | 'low'
  isDuplicate?: boolean
  duplicateOf?: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - in real app, fetch from API
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'John Smith',
        title: 'VP of Marketing',
        company: 'Acme Corporation',
        subIndustry: 'Tech/SaaS',
        region: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        email: 'john.smith@acme.com',
        phone: '+1-555-0123',
        role: 'VP',
        recentActivity: 'Posted about AI trends',
        pillarFit: 'high',
        roleFit: 'high',
        isDuplicate: false
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        title: 'CMO',
        company: 'TechCorp',
        subIndustry: 'Tech/SaaS',
        region: 'Austin, TX',
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
        email: 'sarah.johnson@techcorp.com',
        role: 'CMO',
        recentActivity: 'Shared company update',
        pillarFit: 'high',
        roleFit: 'high',
        isDuplicate: false
      },
      {
        id: '3',
        name: 'Mike Chen',
        title: 'Director of Creative',
        company: 'Global Industries',
        subIndustry: 'Oil & Gas/Energy',
        region: 'Houston, TX',
        linkedinUrl: 'https://linkedin.com/in/mikechen',
        email: 'mike.chen@globalind.com',
        role: 'Director',
        recentActivity: 'Commented on industry post',
        pillarFit: 'medium',
        roleFit: 'medium',
        isDuplicate: false
      },
      {
        id: '4',
        name: 'John Smith',
        title: 'VP of Marketing',
        company: 'Acme Corp',
        subIndustry: 'Tech/SaaS',
        region: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        email: 'john.smith@acme.com',
        role: 'VP',
        recentActivity: 'Posted about AI trends',
        pillarFit: 'high',
        roleFit: 'high',
        isDuplicate: true,
        duplicateOf: '1'
      },
      {
        id: '5',
        name: 'Lisa Rodriguez',
        title: 'Head of Brand',
        company: 'HealthTech Solutions',
        subIndustry: 'Healthcare/MedSys',
        region: 'Boston, MA',
        linkedinUrl: 'https://linkedin.com/in/lisarodriguez',
        email: 'lisa.rodriguez@healthtech.com',
        role: 'Director',
        recentActivity: 'Shared healthcare innovation post',
        pillarFit: 'high',
        roleFit: 'high',
        isDuplicate: false
      },
      {
        id: '6',
        name: 'David Kim',
        title: 'Creative Director',
        company: 'Consumer Brands Inc',
        subIndustry: 'Consumer/CPG',
        region: 'New York, NY',
        linkedinUrl: 'https://linkedin.com/in/davidkim',
        email: 'david.kim@consumerbrands.com',
        role: 'Director',
        recentActivity: 'Posted about brand strategy',
        pillarFit: 'medium',
        roleFit: 'medium',
        isDuplicate: false
      }
    ]

    setTimeout(() => {
      setLeads(mockLeads)
      setLoading(false)
    }, 1000)
  }, [])

  const handleImportCSV = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Import result:', result)
        // Refresh leads list
        // In real app, refetch from API
      }
    } catch (error) {
      console.error('Error importing CSV:', error)
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/leads/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'leads-export.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }

  const handleProcessLead = async (leadId: string, action: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        console.log(`Lead ${leadId} processed with action: ${action}`)
        // In real app, update local state or refetch
      }
    } catch (error) {
      console.error('Error processing lead:', error)
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
              <p className="text-gray-600">Loading leads...</p>
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
          <LeadsInbox 
            leads={leads} 
            onImportCSV={handleImportCSV}
            onExportCSV={handleExportCSV}
            onProcessLead={handleProcessLead}
          />
        </main>
      </div>
    </div>
  )
}
