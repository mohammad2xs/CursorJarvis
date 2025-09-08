'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { GettyAccountsComponent } from '@/components/dashboard/getty-accounts'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { callSubagent } from '@/lib/subagents-client'

export default function GettyAccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [task, setTask] = useState<string>('')
  const [context, setContext] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleAccountSelect = (accountName: string) => {
    setSelectedAccount(accountName)
    setTask('')
    setContext('')
    setResult('')
    setError('')
  }

  const handleRunGettyAgent = async () => {
    if (!selectedAccount || !task) {
      setError('Please select an account and enter a task')
      return
    }

    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const res = await callSubagent('getty-images-executive', task, { 
        context: `Account: ${selectedAccount}. ${context}`,
        companyId: selectedAccount.toLowerCase().replace(/\s+/g, '-')
      })
      setResult(res?.answer || '')
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Failed to execute Getty Images agent')
    } finally {
      setLoading(false)
    }
  }

  const quickTasks = [
    'Analyze account expansion opportunities',
    'Create visual content strategy',
    'Identify cross-selling opportunities',
    'Develop competitive displacement strategy',
    'Generate pre-meeting brief',
    'Create executive engagement plan'
  ]

  const handleQuickTask = (quickTask: string) => {
    setTask(quickTask)
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Getty Images Strategic Accounts</h1>
              <p className="text-gray-600">Manage your Fortune 1000 account portfolio and drive revenue growth</p>
            </div>

            {/* Getty Agent Interface */}
            {selectedAccount && (
              <div className="mb-6">
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Getty Images Agent - {selectedAccount}</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedAccount('')}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  
                  {/* Quick Tasks */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Quick Tasks</label>
                    <div className="flex flex-wrap gap-2">
                      {quickTasks.map((quickTask, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickTask(quickTask)}
                          className="text-xs"
                        >
                          {quickTask}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Task</label>
                      <Textarea 
                        value={task} 
                        onChange={(e) => setTask(e.target.value)} 
                        rows={3} 
                        placeholder="Describe what you want the Getty Images agent to do for this account"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Additional Context (optional)</label>
                      <Textarea 
                        value={context} 
                        onChange={(e) => setContext(e.target.value)} 
                        rows={2} 
                        placeholder="Add any specific context, meeting notes, or requirements"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Button 
                      onClick={handleRunGettyAgent} 
                      disabled={loading || !task}
                    >
                      {loading ? 'Running Getty Agent...' : 'Run Getty Images Agent'}
                    </Button>
                    {error && <span className="text-sm text-red-600">{error}</span>}
                  </div>

                  {result && (
                    <div className="mt-4 rounded-md border bg-gray-50 p-3 text-sm whitespace-pre-wrap">
                      {result}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Portfolio */}
            <GettyAccountsComponent onAccountSelect={handleAccountSelect} />
          </div>
        </main>
      </div>
    </div>
  )
}
