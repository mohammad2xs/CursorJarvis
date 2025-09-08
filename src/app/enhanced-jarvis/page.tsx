'use client'

import React, { useState } from 'react'
import { EnhancedJarvisDashboard } from '@/components/dashboard/enhanced-jarvis-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Eye, Mic, Brain, Zap, CheckCircle, TrendingUp, Target } from 'lucide-react'

const mockAccounts = [
  { id: 'boeing', name: 'Boeing', tier: 1, revenue: 150000, growth: 0.15 },
  { id: 'caterpillar', name: 'Caterpillar', tier: 1, revenue: 120000, growth: 0.12 },
  { id: 'chevron', name: 'Chevron', tier: 1, revenue: 95000, growth: 0.08 },
  { id: 'exxonmobil', name: 'ExxonMobil', tier: 2, revenue: 75000, growth: 0.18 },
  { id: 'lockheed', name: 'Lockheed Martin', tier: 2, revenue: 65000, growth: 0.22 }
]

export default function EnhancedJarvisPage() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  const features = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: 'Voice Recording & AI Analysis',
      description: 'Record calls and get AI-powered analysis with sentiment, engagement, and coaching insights',
      benefits: ['Real-time call analysis', 'Post-call insights', 'Performance coaching', 'Revenue opportunity identification']
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Revenue Intelligence',
      description: 'Track all revenue attribution and get AI-powered forecasting and optimization',
      benefits: ['Revenue tracking', 'Forecasting', 'Optimization strategies', 'ROI analysis']
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'Conversation Intelligence',
      description: 'Get real-time coaching and objection handling during calls',
      benefits: ['Real-time coaching', 'Objection handling', 'Closing strategies', 'Performance insights']
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Visual Content Strategy AI',
      description: 'Getty Images-specific AI for visual content strategy and competitive displacement',
      benefits: ['Content strategy', 'Competitive analysis', 'Account expansion', 'Brand alignment']
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Proactive Insights',
      description: 'AI generates proactive insights for revenue growth and customer satisfaction',
      benefits: ['Revenue opportunities', 'Risk alerts', 'Expansion opportunities', 'Satisfaction insights']
    }
  ]

  if (selectedAccount) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedAccount(null)}
            className="mb-4"
          >
            ← Back to Account Selection
          </Button>
        </div>
        <EnhancedJarvisDashboard accountId={selectedAccount} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Enhanced CursorJarvis</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI-powered strategic account management system for Getty Images Strategic Key Account Executives
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            10x Revenue Growth
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            AI-Powered Coaching
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Getty Images Optimized
          </Badge>
        </div>
      </div>

      {/* Features Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Account Selection */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Select an Account to View Enhanced Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAccounts.map((account) => (
            <Card 
              key={account.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAccount(account.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <Badge variant={account.tier === 1 ? 'destructive' : account.tier === 2 ? 'default' : 'secondary'}>
                    Tier {account.tier}
                  </Badge>
                </div>
                <CardDescription>
                  Current Revenue: ${account.revenue.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Growth Rate</span>
                    <span className="text-green-600">+{(account.growth * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revenue Potential</span>
                    <span className="text-blue-600">High</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Enhanced Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Why Enhanced CursorJarvis?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">10x Revenue Growth</h3>
            <p className="text-gray-600">
              AI-powered insights and coaching to maximize revenue from your strategic accounts
            </p>
          </div>
          <div className="text-center space-y-2">
            <Brain className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="text-lg font-semibold">AI Sales Partner</h3>
            <p className="text-gray-600">
              Real-time coaching and insights to help you close more deals and grow accounts
            </p>
          </div>
          <div className="text-center space-y-2">
            <Target className="h-12 w-12 text-purple-500 mx-auto" />
            <h3 className="text-lg font-semibold">Getty Images Optimized</h3>
            <p className="text-gray-600">
              Specifically designed for Getty Images strategic account management and visual content strategy
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Transform Your Sales Performance?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select an account above to see the enhanced CursorJarvis dashboard in action. 
          Experience AI-powered sales coaching, revenue intelligence, and proactive insights 
          designed specifically for Getty Images Strategic Key Account Executives.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Using Enhanced CursorJarvis
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}
