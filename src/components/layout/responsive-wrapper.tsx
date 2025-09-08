'use client'

import React, { useState, useEffect } from 'react'
import { MobileDashboard } from './mobile-dashboard'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { MyWork } from '@/components/dashboard/my-work'
import { DailyPlanning } from '@/components/dashboard/daily-planning'
import { EmailDashboard } from '@/components/dashboard/email-dashboard'
import { PredictiveAnalytics } from '@/components/dashboard/predictive-analytics'
import { ZapierIntegration } from '@/components/dashboard/zapier-integration'
import { SmartNotifications } from '@/components/dashboard/smart-notifications'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { MeetingIntelligence } from '@/components/dashboard/meeting-intelligence'
import { BehavioralLearning } from '@/components/dashboard/behavioral-learning'
import { PerformanceCoaching } from '@/components/dashboard/performance-coaching'
import { DynamicContent } from '@/components/dashboard/dynamic-content'
import { CompetitiveIntelligence } from '@/components/dashboard/competitive-intelligence'
import { TeamCollaboration } from '@/components/dashboard/team-collaboration'
import { ClientCommunicationHub } from '@/components/dashboard/client-communication-hub'
import { SocialSellingDashboard } from '@/components/dashboard/social-selling-dashboard'
import { PerformanceAnalyticsDashboard } from '@/components/dashboard/performance-analytics-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoiceFloatingButton } from '@/components/voice/voice-floating-button'
import { ElevenLabsVoiceCommands } from '@/components/voice/elevenlabs-voice-commands'
import { VoiceNotifications } from '@/components/voice/voice-notifications'
import { NBA, NBAStatus } from '@/types'
import { VoiceNotification } from '@/components/voice/voice-notifications'

interface ResponsiveWrapperProps {
  userId: string
}

export function ResponsiveWrapper({ userId }: ResponsiveWrapperProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [nbas, setNbas] = useState<NBA[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<VoiceNotification[]>([])
  const [activeTab, setActiveTab] = useState('daily-planning')

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Load mock NBAs
  useEffect(() => {
    const mockNBAs: NBA[] = [
      {
        id: 'nba-1',
        playType: 'PRE_MEETING',
        title: 'Pre-meeting prep for Acme Corp discovery call',
        description: 'Prepare agenda, discovery questions, and relevant case study for John Smith',
        rationale: 'Meeting scheduled in 2 hours',
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
        description: 'Send recap, next steps, and relevant assets to Sarah Johnson',
        rationale: 'Meeting completed 1 day ago',
        source: 'Meeting ID: mtg_124',
        status: 'PENDING' as NBAStatus,
        priority: 4,
        companyId: 'comp_2',
        contactId: 'contact_2',
        opportunityId: 'opp_2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nba-3',
        playType: 'NEW_LEAD',
        title: 'Connect with Global Industries CMO',
        description: 'Send LinkedIn connection request and comment on recent activity',
        rationale: 'New contact added 3 days ago',
        source: 'Contact ID: contact_3',
        status: 'PENDING' as NBAStatus,
        priority: 3,
        companyId: 'comp_3',
        contactId: 'contact_3',
        opportunityId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    setNbas(mockNBAs)
    setLoading(false)
  }, [])

  const handleUpdateNBA = (nbaId: string, status: NBAStatus, outcome?: string) => {
    setNbas(prev => prev.map(nba => 
      nba.id === nbaId ? { ...nba, status } : nba
    ))
  }

  // Voice command handlers
  const handleVoiceNavigate = (tab: string) => {
    setActiveTab(tab)
  }

  const handleVoiceRefresh = () => {
    // Refresh data logic here
    window.location.reload()
  }

  const handleVoiceSearch = (query: string) => {
    // Search logic here
    console.log('Searching for:', query)
  }

  const handleVoiceComposeEmail = () => {
    setActiveTab('email-dashboard')
    // Additional email compose logic
  }

  const handleVoiceGenerateAgenda = () => {
    setActiveTab('daily-planning')
    // Additional agenda generation logic
  }

  const handleVoiceCompleteTask = (taskId?: string) => {
    // Task completion logic here
    console.log('Completing task:', taskId)
  }

  const handleVoiceAddTask = (description: string) => {
    // Add task logic here
    console.log('Adding task:', description)
  }

  // Voice notification handlers
  const handleNotificationPlayed = (notificationId: string) => {
    console.log('Notification played:', notificationId)
  }

  const handleNotificationDismissed = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  // Mobile layout
  if (isMobile) {
    return (
      <>
        <MobileDashboard userId={userId} />
        <VoiceFloatingButton
          onNavigate={handleVoiceNavigate}
          onRefresh={handleVoiceRefresh}
          onSearch={handleVoiceSearch}
          onComposeEmail={handleVoiceComposeEmail}
          onGenerateAgenda={handleVoiceGenerateAgenda}
          onCompleteTask={handleVoiceCompleteTask}
          onAddTask={handleVoiceAddTask}
        />
        <VoiceNotifications
          notifications={notifications}
          onNotificationPlayed={handleNotificationPlayed}
          onNotificationDismissed={handleNotificationDismissed}
          className="fixed top-4 right-4 z-40 max-w-sm"
        />
      </>
    )
  }

  // Desktop layout
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header userId={userId} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                     <TabsList className="grid w-full grid-cols-15">
                       <TabsTrigger value="daily-planning">Daily Planning</TabsTrigger>
                       <TabsTrigger value="email-dashboard">Email Dashboard</TabsTrigger>
                       <TabsTrigger value="my-work">My Work</TabsTrigger>
                       <TabsTrigger value="analytics">Analytics</TabsTrigger>
                       <TabsTrigger value="zapier">Automation</TabsTrigger>
                       <TabsTrigger value="notifications">Notifications</TabsTrigger>
                       <TabsTrigger value="meetings">Meetings</TabsTrigger>
                       <TabsTrigger value="behavioral-learning">AI Learning</TabsTrigger>
                       <TabsTrigger value="performance-coaching">Coaching</TabsTrigger>
                       <TabsTrigger value="dynamic-content">Content</TabsTrigger>
                       <TabsTrigger value="competitive-intelligence">Intel</TabsTrigger>
                       <TabsTrigger value="team-collaboration">Team</TabsTrigger>
                       <TabsTrigger value="client-communication">Clients</TabsTrigger>
                       <TabsTrigger value="social-selling">Social</TabsTrigger>
                       <TabsTrigger value="performance-analytics">Performance</TabsTrigger>
                     </TabsList>

              <TabsContent value="daily-planning">
                <DailyPlanning userId={userId} />
              </TabsContent>

              <TabsContent value="email-dashboard">
                <EmailDashboard userId={userId} />
              </TabsContent>

                     <TabsContent value="my-work">
                       <MyWork nbas={nbas} onUpdateNBA={handleUpdateNBA} />
                     </TabsContent>

                     <TabsContent value="analytics">
                       <PredictiveAnalytics userId={userId} />
                     </TabsContent>

                     <TabsContent value="zapier">
                       <ZapierIntegration userId={userId} />
                     </TabsContent>

                     <TabsContent value="notifications">
                       <SmartNotifications userId={userId} />
                     </TabsContent>

                     <TabsContent value="meetings">
                       <MeetingIntelligence userId={userId} />
                     </TabsContent>

                     <TabsContent value="behavioral-learning">
                       <BehavioralLearning userId={userId} />
                     </TabsContent>

                     <TabsContent value="performance-coaching">
                       <PerformanceCoaching userId={userId} />
                     </TabsContent>

                     <TabsContent value="dynamic-content">
                       <DynamicContent userId={userId} />
                     </TabsContent>

                     <TabsContent value="competitive-intelligence">
                       <CompetitiveIntelligence userId={userId} />
                     </TabsContent>

                     <TabsContent value="team-collaboration">
                       <TeamCollaboration userId={userId} teamId="team-1" />
                     </TabsContent>

                     <TabsContent value="client-communication">
                       <ClientCommunicationHub userId={userId} />
                     </TabsContent>

                     <TabsContent value="social-selling">
                       <SocialSellingDashboard userId={userId} />
                     </TabsContent>

                     <TabsContent value="performance-analytics">
                       <PerformanceAnalyticsDashboard userId={userId} />
                     </TabsContent>
                   </Tabs>
          </main>
        </div>
      </div>
      <VoiceFloatingButton
        onNavigate={handleVoiceNavigate}
        onRefresh={handleVoiceRefresh}
        onSearch={handleVoiceSearch}
        onComposeEmail={handleVoiceComposeEmail}
        onGenerateAgenda={handleVoiceGenerateAgenda}
        onCompleteTask={handleVoiceCompleteTask}
        onAddTask={handleVoiceAddTask}
      />
      <VoiceNotifications
        notifications={notifications}
        onNotificationPlayed={handleNotificationPlayed}
        onNotificationDismissed={handleNotificationDismissed}
        className="fixed top-4 right-4 z-40 max-w-sm"
      />
    </>
  )
}
