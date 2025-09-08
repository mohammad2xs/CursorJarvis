'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Users, 
  Building,
  Calendar,
  ChevronRight,
  Play,
  Pause,
  MoreHorizontal,
  Filter,
  Search
} from 'lucide-react'
import { NBA, NBAStatus } from '@/types'

interface MobileMyWorkProps {
  nbas: NBA[]
  onUpdateNBA: (nbaId: string, updates: Partial<NBA>) => void
}

export function MobileMyWork({ nbas, onUpdateNBA }: MobileMyWorkProps) {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('priority')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNBA, setSelectedNBA] = useState<NBA | null>(null)

  const getPriorityColor = (priority: number) => {
    if (priority >= 5) return 'bg-red-500'
    if (priority >= 4) return 'bg-orange-500'
    if (priority >= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusColor = (status: NBAStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'SNOOZED': return 'bg-gray-100 text-gray-800'
      case 'DECLINED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlayTypeIcon = (playType: string) => {
    switch (playType) {
      case 'PRE_MEETING': return Calendar
      case 'POST_MEETING': return CheckCircle
      case 'NEW_LEAD': return Users
      case 'VP_CMO_NO_TOUCH': return Building
      case 'OPP_IDLE': return AlertCircle
      case 'ENGAGEMENT_DETECTED': return Star
      case 'PERPLEXITY_NEWS': return Target
      case 'PERPLEXITY_HIRE': return Users
      default: return Target
    }
  }

  const filteredNBAs = nbas.filter(nba => {
    const matchesFilter = filter === 'all' || nba.status === filter
    const matchesSearch = nba.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nba.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const sortedNBAs = [...filteredNBAs].sort((a, b) => {
    if (sortBy === 'priority') return b.priority - a.priority
    if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return 0
  })

  const handleStatusUpdate = (nbaId: string, status: NBAStatus) => {
    onUpdateNBA(nbaId, { status })
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Work</h1>
          <p className="text-sm text-gray-600">{nbas.length} tasks pending</p>
        </div>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="priority">Priority</option>
            <option value="created">Created Date</option>
          </select>
        </div>
      </div>

      {/* NBA List */}
      <div className="space-y-3">
        {sortedNBAs.map((nba) => {
          const Icon = getPlayTypeIcon(nba.playType)
          
          return (
            <Card 
              key={nba.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedNBA(nba)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(nba.priority)}`} />
                      <Icon className="h-4 w-4 text-gray-600" />
                      <h3 className="font-medium text-sm truncate">{nba.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{nba.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(nba.status)}`}
                      >
                        {nba.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Priority {nba.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {nba.playType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {nba.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusUpdate(nba.id, 'APPROVED')
                      }}
                      className="p-1"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {sortedNBAs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'You\'re all caught up!'}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* NBA Detail Modal */}
      {selectedNBA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedNBA.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNBA(null)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedNBA.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Rationale</h4>
                <p className="text-gray-600">{selectedNBA.rationale}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
                  <Badge variant="secondary">Priority {selectedNBA.priority}</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(selectedNBA.status)}
                  >
                    {selectedNBA.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Source</h4>
                <p className="text-gray-600 text-sm">{selectedNBA.source}</p>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    handleStatusUpdate(selectedNBA.id, 'APPROVED')
                    setSelectedNBA(null)
                  }}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleStatusUpdate(selectedNBA.id, 'COMPLETED')
                    setSelectedNBA(null)
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
