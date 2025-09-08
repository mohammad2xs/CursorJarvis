'use client'

// Speech Recognition API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: (() => void) | null
  onend: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

type SpeechRecognitionConstructor = new () => SpeechRecognition

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}

export interface VoiceCommand {
  id: string
  command: string
  action: string
  description: string
  keywords: string[]
  category: 'navigation' | 'data' | 'communication' | 'planning' | 'general'
}

export interface VoiceRecognitionResult {
  transcript: string
  confidence: number
  command?: VoiceCommand
  intent?: string
  entities?: Record<string, string>
}

export class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private commands: VoiceCommand[] = []
  private onResult?: (result: VoiceRecognitionResult) => void
  private onError?: (error: string) => void
  private onStart?: () => void
  private onEnd?: () => void

  constructor() {
    this.initializeCommands()
    this.initializeRecognition()
  }

  private initializeCommands(): void {
    this.commands = [
      // Navigation Commands
      {
        id: 'nav-daily-planning',
        command: 'go to daily planning',
        action: 'navigate',
        description: 'Navigate to daily planning dashboard',
        keywords: ['daily', 'planning', 'agenda', 'schedule'],
        category: 'navigation'
      },
      {
        id: 'nav-email',
        command: 'open email',
        action: 'navigate',
        description: 'Navigate to email dashboard',
        keywords: ['email', 'inbox', 'messages', 'mail'],
        category: 'navigation'
      },
      {
        id: 'nav-my-work',
        command: 'show my work',
        action: 'navigate',
        description: 'Navigate to my work dashboard',
        keywords: ['work', 'tasks', 'nbas', 'activities'],
        category: 'navigation'
      },
      {
        id: 'nav-analytics',
        command: 'show analytics',
        action: 'navigate',
        description: 'Navigate to analytics dashboard',
        keywords: ['analytics', 'stats', 'performance', 'metrics'],
        category: 'navigation'
      },

      // Data Commands
      {
        id: 'data-refresh',
        command: 'refresh data',
        action: 'refresh',
        description: 'Refresh current data',
        keywords: ['refresh', 'reload', 'update', 'sync'],
        category: 'data'
      },
      {
        id: 'data-search',
        command: 'search for',
        action: 'search',
        description: 'Search for specific content',
        keywords: ['search', 'find', 'look for'],
        category: 'data'
      },

      // Communication Commands
      {
        id: 'comm-compose-email',
        command: 'compose email',
        action: 'compose_email',
        description: 'Start composing a new email',
        keywords: ['compose', 'write', 'create', 'email'],
        category: 'communication'
      },
      {
        id: 'comm-send-email',
        command: 'send email',
        action: 'send_email',
        description: 'Send the current email',
        keywords: ['send', 'deliver', 'email'],
        category: 'communication'
      },
      {
        id: 'comm-reply-email',
        command: 'reply to email',
        action: 'reply_email',
        description: 'Reply to the current email',
        keywords: ['reply', 'respond', 'answer'],
        category: 'communication'
      },

      // Planning Commands
      {
        id: 'plan-generate-agenda',
        command: 'generate daily agenda',
        action: 'generate_agenda',
        description: 'Generate AI-powered daily agenda',
        keywords: ['generate', 'create', 'agenda', 'daily', 'plan'],
        category: 'planning'
      },
      {
        id: 'plan-complete-task',
        command: 'complete task',
        action: 'complete_task',
        description: 'Mark current task as complete',
        keywords: ['complete', 'finish', 'done', 'task'],
        category: 'planning'
      },
      {
        id: 'plan-add-task',
        command: 'add task',
        action: 'add_task',
        description: 'Add a new task',
        keywords: ['add', 'create', 'new', 'task'],
        category: 'planning'
      },

      // General Commands
      {
        id: 'gen-help',
        command: 'help',
        action: 'help',
        description: 'Show available voice commands',
        keywords: ['help', 'commands', 'what can you do'],
        category: 'general'
      },
      {
        id: 'gen-stop',
        command: 'stop listening',
        action: 'stop',
        description: 'Stop voice recognition',
        keywords: ['stop', 'quit', 'exit', 'done'],
        category: 'general'
      }
    ]
  }

  private initializeRecognition(): void {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser')
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'

    this.recognition.onstart = () => {
      this.isListening = true
      this.onStart?.()
    }

    this.recognition.onend = () => {
      this.isListening = false
      this.onEnd?.()
    }

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
        .toLowerCase()
        .trim()

      const confidence = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.confidence)
        .reduce((acc, conf) => acc + conf, 0) / event.results.length

      const result: VoiceRecognitionResult = {
        transcript,
        confidence,
        command: this.matchCommand(transcript),
        intent: this.extractIntent(transcript),
        entities: this.extractEntities(transcript)
      }

      this.onResult?.(result)
    }

    this.recognition.onerror = (event) => {
      this.isListening = false
      this.onError?.(event.error)
    }
  }

  private matchCommand(transcript: string): VoiceCommand | undefined {
    const words = transcript.split(' ')
    
    for (const command of this.commands) {
      const commandWords = command.command.toLowerCase().split(' ')
      const keywordMatches = command.keywords.filter(keyword => 
        transcript.includes(keyword.toLowerCase())
      ).length

      // Check for exact command match
      if (commandWords.every(word => words.includes(word))) {
        return command
      }

      // Check for keyword-based match with high confidence
      if (keywordMatches >= 2) {
        return command
      }
    }

    return undefined
  }

  private extractIntent(transcript: string): string {
    const words = transcript.split(' ')
    
    if (words.includes('navigate') || words.includes('go') || words.includes('open') || words.includes('show')) {
      return 'navigation'
    }
    if (words.includes('search') || words.includes('find') || words.includes('look')) {
      return 'search'
    }
    if (words.includes('compose') || words.includes('write') || words.includes('send')) {
      return 'communication'
    }
    if (words.includes('generate') || words.includes('create') || words.includes('add')) {
      return 'planning'
    }
    if (words.includes('help') || words.includes('what')) {
      return 'help'
    }

    return 'unknown'
  }

  private extractEntities(transcript: string): Record<string, string> {
    const entities: Record<string, string> = {}
    
    // Extract email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const emails = transcript.match(emailRegex)
    if (emails) {
      entities.emails = emails.join(', ')
    }

    // Extract numbers
    const numberRegex = /\b\d+\b/g
    const numbers = transcript.match(numberRegex)
    if (numbers) {
      entities.numbers = numbers.join(', ')
    }

    // Extract dates
    const dateRegex = /\b(today|tomorrow|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/g
    const dates = transcript.match(dateRegex)
    if (dates) {
      entities.dates = dates.join(', ')
    }

    return entities
  }

  public startListening(): void {
    if (!this.recognition || this.isListening) return
    
    try {
      this.recognition.start()
    } catch (error) {
      console.error('Error starting voice recognition:', error)
      this.onError?.('Failed to start voice recognition')
    }
  }

  public stopListening(): void {
    if (!this.recognition || !this.isListening) return
    
    this.recognition.stop()
  }

  public isActive(): boolean {
    return this.isListening
  }

  public getCommands(): VoiceCommand[] {
    return this.commands
  }

  public getCommandsByCategory(category: string): VoiceCommand[] {
    return this.commands.filter(cmd => cmd.category === category)
  }

  public onResultCallback(callback: (result: VoiceRecognitionResult) => void): void {
    this.onResult = callback
  }

  public onErrorCallback(callback: (error: string) => void): void {
    this.onError = callback
  }

  public onStartCallback(callback: () => void): void {
    this.onStart = callback
  }

  public onEndCallback(callback: () => void): void {
    this.onEnd = callback
  }

  public destroy(): void {
    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }
  }
}

// Global voice recognition instance
let voiceService: VoiceRecognitionService | null = null

export const getVoiceService = (): VoiceRecognitionService => {
  if (!voiceService) {
    voiceService = new VoiceRecognitionService()
  }
  return voiceService
}

export const destroyVoiceService = (): void => {
  if (voiceService) {
    voiceService.destroy()
    voiceService = null
  }
}
