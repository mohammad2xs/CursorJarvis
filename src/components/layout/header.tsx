'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { 
  Search, 
  Bell, 
  User, 
  Settings,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface HeaderProps {
  userId?: string
}

export function Header({ userId = 'user-1' }: HeaderProps) {

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies, contacts, deals..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Center - Quick Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">5 NBAs</p>
              <p className="text-gray-500">Pending</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">12</p>
              <p className="text-gray-500">Meetings</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">3</p>
              <p className="text-gray-500">Overdue</p>
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          {/* Smart Notifications */}
          <NotificationBell userId={userId} />

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Sales Rep</p>
              <p className="text-gray-500">AE</p>
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
