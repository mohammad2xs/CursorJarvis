'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  Calendar, 
  Target, 
  TrendingUp, 
  Building, 
  Settings,
  BarChart3,
  FileText,
  Zap,
  Camera,
  Brain
} from 'lucide-react'

const navigation = [
  { name: 'My Work', href: '/', icon: Home },
  { name: 'Leads Inbox', href: '/leads', icon: Users },
  { name: 'Meeting OS', href: '/meetings', icon: Calendar },
  { name: 'Deal OS', href: '/deals', icon: Target },
  { name: 'Brand Studio', href: '/brand', icon: Building },
  { name: 'Getty Accounts', href: '/getty-accounts', icon: Camera },
  { name: 'Enhanced Jarvis', href: '/enhanced-jarvis', icon: Brain },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Jarvis</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <div className="w-4 h-4 flex flex-col justify-center space-y-1">
            <div className="w-3 h-0.5 bg-gray-600"></div>
            <div className="w-3 h-0.5 bg-gray-600"></div>
            <div className="w-3 h-0.5 bg-gray-600"></div>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            <p>Jarvis CRM v1.0</p>
            <p>AI-powered sales command center</p>
          </div>
        )}
      </div>
    </div>
  )
}
