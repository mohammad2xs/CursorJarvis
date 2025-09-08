'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  Mail, 
  Target, 
  BarChart3, 
  Settings,
  Bell,
  User,
  Zap
} from 'lucide-react'

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  notifications?: number
}

export function MobileNav({ activeTab, onTabChange, notifications = 0 }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: 'daily-planning', label: 'Daily Planning', icon: Calendar, color: 'bg-blue-500' },
    { id: 'email-dashboard', label: 'Email', icon: Mail, color: 'bg-green-500' },
    { id: 'my-work', label: 'My Work', icon: Target, color: 'bg-purple-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'bg-orange-500' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500' }
  ]

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">Jarvis CRM</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {notifications > 0 && (
            <Badge variant="destructive" className="px-2 py-1 text-xs">
              {notifications}
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Jarvis CRM</h1>
              <p className="text-sm text-gray-500">AI Sales Copilot</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? item.color : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Generate NBA
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
