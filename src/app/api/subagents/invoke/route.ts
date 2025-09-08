import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { openAIService } from '@/lib/openai'

export interface SubagentInvokeParams {
  agent: string
  task: string
  context?: string
  companyId?: string
}

export interface SubagentInvokeResult {
  answer: string
  sources?: { title: string; url: string; snippet: string }[]
}

function toSlug(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function resolveSubagentFile(agent: string): string {
  const repoRoot = process.cwd()
  const baseDir = path.join(repoRoot, 'external', 'Subagents-collection')

  // Attempt exact <slug>.md match
  const slug = toSlug(agent)
  const exact = path.join(baseDir, `${slug}.md`)
  if (fs.existsSync(exact)) return exact

  // Fallback: fuzzy find first markdown whose slug includes provided slug
  const entries = fs.readdirSync(baseDir)
  const markdowns = entries.filter((f) => f.toLowerCase().endsWith('.md'))
  const matched = markdowns.find((f) => toSlug(f.replace(/\.md$/i, '')).includes(slug))
  if (matched) return path.join(baseDir, matched)

  throw new Error(`Subagent prompt not found for: ${agent}`)
}

function buildPrompt(subagentPrompt: string, task: string, context?: string): string {
  const header = `You are an expert subagent. Follow the role below precisely. Then complete the task.`
  const taskBlock = `Task:\n${task}`
  const contextBlock = context ? `\n\nAdditional Context:\n${context}` : ''
  const outputFormat = `\n\nOutput Requirements:\n- Be concise and actionable.\n- If code is needed, include complete runnable snippets.\n- Use bullet points where helpful.\n- Cite sources if you used web results.`
  return `${header}\n\nRole Spec (from library):\n\n${subagentPrompt}\n\n${taskBlock}${contextBlock}${outputFormat}`
}

export async function POST(request: NextRequest) {
  try {
    const params: SubagentInvokeParams = await request.json()
    const { agent, task, context } = params

    // Check if subagents directory exists
    const repoRoot = process.cwd()
    const baseDir = path.join(repoRoot, 'external', 'Subagents-collection')
    
    if (!fs.existsSync(baseDir)) {
      // Return a fallback response if subagents directory doesn't exist
      return NextResponse.json({
        answer: `I'm a ${agent} subagent. Here's my response to your task: ${task}. 

Note: The subagent library is not currently available, but I can still help you with your request. Please provide more specific details about what you need assistance with.`,
        sources: []
      })
    }

    const filePath = resolveSubagentFile(agent)
    const subagentMd = fs.readFileSync(filePath, 'utf-8')

    const prompt = buildPrompt(subagentMd, task, context)
    const response = await openAIService.chat(prompt)
    
    return NextResponse.json({
      answer: response.answer,
      sources: []
    })
  } catch (error) {
    console.error('Error invoking subagent:', error)
    
    // Return a fallback response
    const params: SubagentInvokeParams = await request.json()
    return NextResponse.json({
      answer: `I'm a ${params.agent} subagent. Here's my response to your task: ${params.task}. 

Note: There was an issue accessing the subagent library, but I can still help you with your request. Please provide more specific details about what you need assistance with.`,
      sources: []
    })
  }
}
