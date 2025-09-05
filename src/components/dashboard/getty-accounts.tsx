'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GETTY_ACCOUNTS, getAccountsByTier, getHighPriorityAccounts } from '@/lib/getty-accounts'

interface GettyAccountsProps {
  onAccountSelect?: (accountName: string) => void
}

export function GettyAccountsComponent({ onAccountSelect }: GettyAccountsProps) {
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3 | 'all'>('all')
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  const handleAccountClick = (accountName: string) => {
    setSelectedAccount(accountName)
    onAccountSelect?.(accountName)
  }

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-red-100 text-red-800 border-red-200'
      case 2: return 'bg-orange-100 text-orange-800 border-orange-200'
      case 3: return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority <= 5) return 'text-red-600 font-bold'
    if (priority <= 10) return 'text-orange-600 font-semibold'
    if (priority <= 15) return 'text-yellow-600 font-medium'
    return 'text-gray-600'
  }

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'High': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Low': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredAccounts = selectedTier === 'all' 
    ? GETTY_ACCOUNTS 
    : getAccountsByTier(selectedTier)

  const highPriorityAccounts = getHighPriorityAccounts()

  return (
    <div className="space-y-6">
      {/* High Priority Accounts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">High Priority Accounts (Top 10)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highPriorityAccounts.map((account) => (
            <Card 
              key={account.name}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAccount === account.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleAccountClick(account.name)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{account.name}</h3>
                <Badge className={getTierColor(account.tier)}>
                  Tier {account.tier}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Priority:</span> <span className={getPriorityColor(account.priority)}>#{account.priority}</span></p>
                <p><span className="font-medium">Industry:</span> {account.industry}</p>
                <p><span className="font-medium">Growth:</span> <span className={getGrowthColor(account.growthPotential)}>{account.growthPotential}</span></p>
                <p><span className="font-medium">Departments:</span> {account.keyDepartments.slice(0, 3).join(', ')}{account.keyDepartments.length > 3 && '...'}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tier Filter */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant={selectedTier === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedTier('all')}
          size="sm"
        >
          All Accounts
        </Button>
        <Button
          variant={selectedTier === 1 ? 'default' : 'outline'}
          onClick={() => setSelectedTier(1)}
          size="sm"
        >
          Tier 1
        </Button>
        <Button
          variant={selectedTier === 2 ? 'default' : 'outline'}
          onClick={() => setSelectedTier(2)}
          size="sm"
        >
          Tier 2
        </Button>
        <Button
          variant={selectedTier === 3 ? 'default' : 'outline'}
          onClick={() => setSelectedTier(3)}
          size="sm"
        >
          Tier 3
        </Button>
      </div>

      {/* All Accounts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          {selectedTier === 'all' ? 'All Getty Images Accounts' : `Tier ${selectedTier} Accounts`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => (
            <Card 
              key={account.name}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAccount === account.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleAccountClick(account.name)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{account.name}</h3>
                <Badge className={getTierColor(account.tier)}>
                  Tier {account.tier}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Priority:</span> <span className={getPriorityColor(account.priority)}>#{account.priority}</span></p>
                <p><span className="font-medium">Industry:</span> {account.industry}</p>
                <p><span className="font-medium">Growth:</span> <span className={getGrowthColor(account.growthPotential)}>{account.growthPotential}</span></p>
                <p><span className="font-medium">Departments:</span> {account.keyDepartments.slice(0, 3).join(', ')}{account.keyDepartments.length > 3 && '...'}</p>
                <p><span className="font-medium">Content Needs:</span> {account.visualContentNeeds.slice(0, 2).join(', ')}{account.visualContentNeeds.length > 2 && '...'}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Portfolio Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Accounts</p>
            <p className="font-semibold text-lg">{GETTY_ACCOUNTS.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Tier 1</p>
            <p className="font-semibold text-lg text-red-600">{getAccountsByTier(1).length}</p>
          </div>
          <div>
            <p className="text-gray-600">Tier 2</p>
            <p className="font-semibold text-lg text-orange-600">{getAccountsByTier(2).length}</p>
          </div>
          <div>
            <p className="text-gray-600">Tier 3</p>
            <p className="font-semibold text-lg text-blue-600">{getAccountsByTier(3).length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
