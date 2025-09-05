'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Users, 
  Building, 
  MapPin, 
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Company, Contact } from '@/types'
import { formatDate, getSubIndustryColor, getInitials } from '@/lib/utils'

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

interface LeadsInboxProps {
  leads: Lead[]
  onImportCSV: (file: File) => void
  onExportCSV: () => void
  onProcessLead: (leadId: string, action: string) => void
}

export function LeadsInbox({ leads, onImportCSV, onExportCSV, onProcessLead }: LeadsInboxProps) {
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedFit, setSelectedFit] = useState('all')
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  useEffect(() => {
    let filtered = leads

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(lead => lead.subIndustry === selectedIndustry)
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(lead => lead.role === selectedRole)
    }

    // Fit filter
    if (selectedFit !== 'all') {
      filtered = filtered.filter(lead => lead.pillarFit === selectedFit)
    }

    // Duplicates filter
    if (showDuplicates) {
      filtered = filtered.filter(lead => lead.isDuplicate)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, selectedIndustry, selectedRole, selectedFit, showDuplicates])

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id))
    }
  }

  const handleBulkAction = (action: string) => {
    selectedLeads.forEach(leadId => {
      onProcessLead(leadId, action)
    })
    setSelectedLeads([])
  }

  const industries = ['Aerospace & Defense', 'Oil & Gas/Energy', 'Healthcare/MedSys', 'Consumer/CPG', 'Tech/SaaS']
  const roles = ['VP', 'CMO', 'CRO', 'CEO', 'Director', 'Manager', 'Other']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads Inbox</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFit} onValueChange={setSelectedFit}>
              <SelectTrigger>
                <SelectValue placeholder="Fit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fit Levels</SelectItem>
                <SelectItem value="high">High Fit</SelectItem>
                <SelectItem value="medium">Medium Fit</SelectItem>
                <SelectItem value="low">Low Fit</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplicates"
                checked={showDuplicates}
                onCheckedChange={(checked) => setShowDuplicates(checked as boolean)}
              />
              <label htmlFor="duplicates" className="text-sm font-medium">
                Show Duplicates
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('connect')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Connect All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('comment')}
                >
                  Comment All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('dm')}
                >
                  DM All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Leads ({filteredLeads.length})
            </span>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </CardTitle>
          <CardDescription>
            Ranked by role fit, recent activity, and pillar alignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className={`flex items-center justify-between p-4 border rounded-lg ${lead.isDuplicate ? 'bg-yellow-50 border-yellow-200' : ''}`}>
              <div className="flex items-center space-x-4 flex-1">
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={() => handleSelectLead(lead.id)}
                />
                
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {getInitials(lead.name)}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{lead.name}</h3>
                    {lead.isDuplicate && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Duplicate
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{lead.title}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{lead.company}</span>
                    </div>
                    <Badge className={getSubIndustryColor(lead.subIndustry)}>
                      {lead.subIndustry}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{lead.region}</span>
                    </div>
                  </div>
                  {lead.recentActivity && (
                    <p className="text-xs text-gray-500 mt-1">
                      Recent activity: {lead.recentActivity}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={lead.roleFit === 'high' ? 'default' : 'secondary'}>
                    <Briefcase className="w-3 h-3 mr-1" />
                    {lead.roleFit} role fit
                  </Badge>
                  <Badge variant={lead.pillarFit === 'high' ? 'default' : 'secondary'}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {lead.pillarFit} pillar fit
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => onProcessLead(lead.id, 'connect')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Connect
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onProcessLead(lead.id, 'comment')}
                >
                  Comment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onProcessLead(lead.id, 'dm')}
                >
                  DM
                </Button>
                {lead.isDuplicate && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onProcessLead(lead.id, 'merge')}
                    className="text-yellow-600 border-yellow-300"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Merge
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No leads found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
