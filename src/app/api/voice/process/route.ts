import { NextRequest, NextResponse } from 'next/server'

interface VoiceCommandRequest {
  transcript: string
  confidence: number
  userId: string
  context?: {
    currentTab?: string
    currentTask?: string
    currentEmail?: string
  }
}

interface VoiceCommandResponse {
  success: boolean
  command?: {
    id: string
    action: string
    description: string
    parameters?: Record<string, unknown>
  }
  message?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: VoiceCommandRequest = await request.json()
    const { transcript, confidence, userId, context } = body

    if (!transcript || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: transcript and userId'
      }, { status: 400 })
    }

    // Process the voice command
    const result = await processVoiceCommand(transcript, confidence, userId, context)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Voice command processing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process voice command'
    }, { status: 500 })
  }
}

async function processVoiceCommand(
  transcript: string, 
  confidence: number, 
  userId: string, 
  context?: VoiceCommandRequest['context']
): Promise<VoiceCommandResponse> {
  const lowerTranscript = transcript.toLowerCase().trim()

  // Navigation commands
  if (lowerTranscript.includes('daily planning') || lowerTranscript.includes('agenda')) {
    return {
      success: true,
      command: {
        id: 'nav-daily-planning',
        action: 'navigate',
        description: 'Navigate to daily planning',
        parameters: { tab: 'daily-planning' }
      },
      message: 'Navigating to daily planning'
    }
  }

  if (lowerTranscript.includes('email') || lowerTranscript.includes('inbox')) {
    return {
      success: true,
      command: {
        id: 'nav-email',
        action: 'navigate',
        description: 'Navigate to email dashboard',
        parameters: { tab: 'email-dashboard' }
      },
      message: 'Navigating to email dashboard'
    }
  }

  if (lowerTranscript.includes('my work') || lowerTranscript.includes('tasks')) {
    return {
      success: true,
      command: {
        id: 'nav-my-work',
        action: 'navigate',
        description: 'Navigate to my work',
        parameters: { tab: 'my-work' }
      },
      message: 'Navigating to my work'
    }
  }

  if (lowerTranscript.includes('analytics') || lowerTranscript.includes('stats')) {
    return {
      success: true,
      command: {
        id: 'nav-analytics',
        action: 'navigate',
        description: 'Navigate to analytics',
        parameters: { tab: 'analytics' }
      },
      message: 'Navigating to analytics'
    }
  }

  // Data commands
  if (lowerTranscript.includes('refresh') || lowerTranscript.includes('reload')) {
    return {
      success: true,
      command: {
        id: 'data-refresh',
        action: 'refresh',
        description: 'Refresh data',
        parameters: {}
      },
      message: 'Refreshing data'
    }
  }

  if (lowerTranscript.includes('search')) {
    const searchQuery = transcript.replace(/search for|find|look for/gi, '').trim()
    return {
      success: true,
      command: {
        id: 'data-search',
        action: 'search',
        description: 'Search for content',
        parameters: { query: searchQuery }
      },
      message: `Searching for: ${searchQuery}`
    }
  }

  // Communication commands
  if (lowerTranscript.includes('compose email') || lowerTranscript.includes('write email')) {
    return {
      success: true,
      command: {
        id: 'comm-compose-email',
        action: 'compose_email',
        description: 'Compose new email',
        parameters: {}
      },
      message: 'Opening email composer'
    }
  }

  if (lowerTranscript.includes('send email')) {
    return {
      success: true,
      command: {
        id: 'comm-send-email',
        action: 'send_email',
        description: 'Send email',
        parameters: {}
      },
      message: 'Sending email'
    }
  }

  if (lowerTranscript.includes('reply') || lowerTranscript.includes('respond')) {
    return {
      success: true,
      command: {
        id: 'comm-reply-email',
        action: 'reply_email',
        description: 'Reply to email',
        parameters: {}
      },
      message: 'Replying to email'
    }
  }

  // Planning commands
  if (lowerTranscript.includes('generate agenda') || lowerTranscript.includes('create agenda')) {
    return {
      success: true,
      command: {
        id: 'plan-generate-agenda',
        action: 'generate_agenda',
        description: 'Generate daily agenda',
        parameters: { userId }
      },
      message: 'Generating daily agenda'
    }
  }

  if (lowerTranscript.includes('complete task') || lowerTranscript.includes('finish task')) {
    return {
      success: true,
      command: {
        id: 'plan-complete-task',
        action: 'complete_task',
        description: 'Complete task',
        parameters: { taskId: context?.currentTask }
      },
      message: 'Completing task'
    }
  }

  if (lowerTranscript.includes('add task') || lowerTranscript.includes('create task')) {
    const taskDescription = transcript.replace(/add task|create task|new task/gi, '').trim()
    return {
      success: true,
      command: {
        id: 'plan-add-task',
        action: 'add_task',
        description: 'Add new task',
        parameters: { description: taskDescription }
      },
      message: `Adding task: ${taskDescription}`
    }
  }

  // General commands
  if (lowerTranscript.includes('help') || lowerTranscript.includes('commands')) {
    return {
      success: true,
      command: {
        id: 'gen-help',
        action: 'help',
        description: 'Show help',
        parameters: {}
      },
      message: 'Showing available commands'
    }
  }

  if (lowerTranscript.includes('stop') || lowerTranscript.includes('quit')) {
    return {
      success: true,
      command: {
        id: 'gen-stop',
        action: 'stop',
        description: 'Stop voice recognition',
        parameters: {}
      },
      message: 'Stopping voice recognition'
    }
  }

  // No command matched
  return {
    success: false,
    error: 'Command not recognized',
    message: 'Sorry, I didn\'t understand that command. Try saying "help" for available commands.'
  }
}
