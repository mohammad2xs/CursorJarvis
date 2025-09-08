'use client'

import React, { useState, useEffect } from 'react'
import { MobileNav } from './mobile-nav'
import { MobileDailyPlanning } from '@/components/dashboard/mobile-daily-planning'
import { MobileEmailDashboard } from '@/components/dashboard/mobile-email-dashboard'
import { MobileMyWork } from '@/components/dashboard/mobile-my-work'
import { PredictiveAnalytics } from '@/components/dashboard/predictive-analytics'
import { ZapierIntegration } from '@/components/dashboard/zapier-integration'
import { SmartNotifications } from '@/components/dashboard/smart-notifications'
import { MeetingIntelligence } from '@/components/dashboard/meeting-intelligence'
import { BehavioralLearning } from '@/components/dashboard/behavioral-learning'
import { PerformanceCoaching } from '@/components/dashboard/performance-coaching'
import { DynamicContent } from '@/components/dashboard/dynamic-content'
import { CompetitiveIntelligence } from '@/components/dashboard/competitive-intelligence'
import { TeamCollaboration } from '@/components/dashboard/team-collaboration'
import { ClientCommunicationHub } from '@/components/dashboard/client-communication-hub'
import { SocialSellingDashboard } from '@/components/dashboard/social-selling-dashboard'
import { PerformanceAnalyticsDashboard } from '@/components/dashboard/performance-analytics-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Mail,
  Target,
  Zap,
  Bell,
  Activity
} from 'lucide-react'
import { NBA, NBAStatus } from '@/types'

interface MobileDashboardProps {
  userId: string
}

export function MobileDashboard({ userId }: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState('daily-planning')
  const [nbas, setNbas] = useState<NBA[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(3)

  // Mock data for mobile dashboard
  useEffect(() => {
    const mockNBAs: NBA[] = [
      {
        id: 'nba-1',
        playType: 'PRE_MEETING',
        title: 'Pre-meeting prep for Acme Corp',
        description: 'Prepare agenda and discovery questions',
        rationale: 'Meeting in 2 hours',
        source: 'Meeting ID: mtg_123',
        status: 'PENDING' as NBAStatus,
        priority: 5,
        companyId: 'comp_1',
        contactId: 'contact_1',
        opportunityId: 'opp_1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-2',
        playType: 'POST_MEETING',
        title: 'Follow up on TechCorp demo',
        description: 'Send recap and next steps',
        rationale: 'Meeting completed yesterday',
        source: 'Meeting ID: mtg_124',
        status: 'PENDING' as NBAStatus,
        priority: 4,
        companyId: 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    setNbas(mockNBAs)
    setLoading(false)
  }, [])

  const handleUpdateNBA = (nbaId: string, updates: Partial<NBA>) => {
    setNbas(prev => prev.map(nba => 
      nba.id === nbaId ? { ...nba, ...updates } : nba
    ))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily-planning':
        return <MobileDailyPlanning userId={userId} />
      case 'email-dashboard':
        return <MobileEmailDashboard userId={userId} />
      case 'my-work':
        return <MobileMyWork nbas={nbas} onUpdateNBA={handleUpdateNBA} />
      case 'analytics':
        return <PredictiveAnalytics userId={userId} />
      case 'zapier':
        return <ZapierIntegration userId={userId} />
      case 'notifications':
        return <SmartNotifications userId={userId} />
      case 'meetings':
        return <MeetingIntelligence userId={userId} />
      case 'behavioral-learning':
        return <BehavioralLearning userId={userId} />
      case 'performance-coaching':
        return <PerformanceCoaching userId={userId} />
      case 'dynamic-content':
        return <DynamicContent userId={userId} />
      case 'competitive-intelligence':
        return <CompetitiveIntelligence userId={userId} />
      case 'team-collaboration':
        return <TeamCollaboration userId={userId} teamId="team-1" />
      case 'client-communication':
        return <ClientCommunicationHub userId={userId} />
      case 'social-selling':
        return <SocialSellingDashboard userId={userId} />
      case 'performance-analytics':
        return <PerformanceAnalyticsDashboard userId={userId} />
      case 'settings':
        return <SettingsView />
      default:
        return <MobileDailyPlanning userId={userId} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        notifications={notifications}
      />

      {/* Main Content */}
      <div className="pt-16 pb-20 lg:pt-0 lg:pb-0">
        {renderTabContent()}
      </div>
    </div>
  )
}

// Analytics View Component
function AnalyticsView() {
  const analyticsData = {
    revenue: { current: 125000, target: 200000, change: 12.5 },
    deals: { current: 8, target: 15, change: 23.1 },
    meetings: { current: 24, target: 40, change: 8.3 },
    nbas: { current: 12, target: 20, change: 15.2 }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Button variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.revenue.current.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.revenue.change}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.deals.current}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.deals.change}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.meetings.current}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.meetings.change}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">NBAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.nbas.current}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.nbas.change}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today&apos;s Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tasks Completed</span>
            <Badge variant="secondary">8/12</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Meetings Attended</span>
            <Badge variant="secondary">3/4</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Emails Sent</span>
            <Badge variant="secondary">15</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings View Component
function SettingsView() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email Notifications</span>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Calendar Sync</span>
            <Button variant="outline" size="sm">Connect</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email Integration</span>
            <Button variant="outline" size="sm">Setup</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Daily Planning Time</span>
            <Button variant="outline" size="sm">8:00 AM</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Working Hours</span>
            <Button variant="outline" size="sm">9 AM - 6 PM</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Timezone</span>
            <Button variant="outline" size="sm">EST</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
