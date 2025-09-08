'use client'

import React, { useState, memo, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building, 
  Target, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Copy,
  RefreshCw,
  Zap,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react'
import { brandStudio } from '@/lib/brand-studio'

const BrandStudio = memo(() => {
  const [selectedSubIndustry, setSelectedSubIndustry] = useState('Tech/SaaS')
  const [selectedDealType, setSelectedDealType] = useState('NEW_LOGO')
  const [companyName, setCompanyName] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const subIndustries = useMemo(() => [
    'Aerospace & Defense',
    'Oil & Gas/Energy', 
    'Healthcare/MedSys',
    'Consumer/CPG',
    'Tech/SaaS'
  ], [])

  const dealTypes = useMemo(() => [
    'NEW_LOGO',
    'RENEWAL',
    'UPSELL',
    'STRATEGIC'
  ], [])

  const generateContent = useCallback(async (type: string) => {
    setIsGenerating(true)
    
    try {
      let content = ''
      
      switch (type) {
        case 'value-proposition':
          content = brandStudio.generateValueProposition(selectedSubIndustry, selectedDealType)
          break
        case 'roi-message':
          content = brandStudio.generateROIMessage(selectedSubIndustry)
          break
        case 'competitive-advantage':
          content = brandStudio.generateCompetitiveAdvantage(selectedSubIndustry)
          break
        case 'case-study-angle':
          content = brandStudio.generateCaseStudyAngle(companyName || 'Company', selectedSubIndustry)
          break
        case 'discovery-questions':
          const questions = brandStudio.generateDiscoveryQuestions(selectedSubIndustry)
          content = questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
          break
        case 'objection-handling':
          const objections = ['budget', 'timing', 'integration', 'security', 'competition']
          content = objections.map(obj => 
            `**${obj.toUpperCase()}:**\n${brandStudio.generateObjectionHandling(obj, selectedSubIndustry)}\n`
          ).join('\n')
          break
        default:
          content = 'Please select a content type to generate.'
      }
      
      setGeneratedContent(content)
    } catch (error) {
      console.error('Error generating content:', error)
      setGeneratedContent('Error generating content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [selectedSubIndustry, selectedDealType, companyName])

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatedContent)
  }, [generatedContent])

  const validateMessage = useCallback((message: string) => {
    return brandStudio.validateMessage(message)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Brand Studio</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-600">
            <Building className="w-3 h-3 mr-1" />
            Getty Approved
          </Badge>
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Brand Safe
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generator">Content Generator</TabsTrigger>
          <TabsTrigger value="messaging">Value Messaging</TabsTrigger>
          <TabsTrigger value="proof-points">Proof Points</TabsTrigger>
          <TabsTrigger value="validator">Message Validator</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate brand-safe content tailored to your audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sub-Industry</label>
                  <Select value={selectedSubIndustry} onValueChange={setSelectedSubIndustry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subIndustries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Deal Type</label>
                  <Select value={selectedDealType} onValueChange={setSelectedDealType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dealTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Company Name</label>
                  <Input
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button
                  onClick={() => generateContent('value-proposition')}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Value Prop
                </Button>
                <Button
                  onClick={() => generateContent('roi-message')}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  ROI Message
                </Button>
                <Button
                  onClick={() => generateContent('competitive-advantage')}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Competitive Edge
                </Button>
                <Button
                  onClick={() => generateContent('case-study-angle')}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Case Study
                </Button>
                <Button
                  onClick={() => generateContent('discovery-questions')}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Questions
                </Button>
                <Button
                  onClick={() => generateContent('objection-handling')}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Objections
                </Button>
              </div>

              {generatedContent && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Generated Content</h3>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setGeneratedContent('')}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[300px]"
                    placeholder="Generated content will appear here..."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Efficiency</CardTitle>
                <CardDescription>Speed and productivity benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {brandStudio.getValueFraming('efficiency').map((point, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Reduced Risk</CardTitle>
                <CardDescription>Compliance and security benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {brandStudio.getValueFraming('reducedRisk').map((point, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Elevated Creativity</CardTitle>
                <CardDescription>Innovation and creative benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {brandStudio.getValueFraming('elevatedCreativity').map((point, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proof-points" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Customer Success</CardTitle>
                <CardDescription>Approved customer metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {brandStudio.getApprovedFigures('customers').map((point, i) => (
                    <li key={i} className="flex items-start">
                      <Users className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Assets & Content</CardTitle>
                <CardDescription>Platform capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {brandStudio.getApprovedFigures('assets').map((point, i) => (
                    <li key={i} className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Partnerships</CardTitle>
                <CardDescription>Strategic relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {brandStudio.getApprovedFigures('partners').map((point, i) => (
                    <li key={i} className="flex items-start">
                      <Building className="w-4 h-4 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Message Validator
              </CardTitle>
              <CardDescription>
                Ensure your messages align with approved Getty messaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your message here to validate against Getty brand guidelines..."
                className="min-h-[200px]"
                onChange={(e) => {
                  const message = e.target.value
                  if (message.trim()) {
                    const validation = validateMessage(message)
                    // In a real app, you'd show validation results
                    console.log('Validation result:', validation)
                  }
                }}
              />
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Operating Principles Checklist</h4>
                <ul className="space-y-1 text-sm">
                  {brandStudio.getOperatingPrinciples().map((principle, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
})

BrandStudio.displayName = 'BrandStudio'

export { BrandStudio }
