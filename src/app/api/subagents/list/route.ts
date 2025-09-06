import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const repoRoot = process.cwd()
    const baseDir = path.join(repoRoot, 'external', 'Subagents-collection')
    
    if (!fs.existsSync(baseDir)) {
      // Return default subagents if directory doesn't exist
      return NextResponse.json([
        'sales-executive',
        'marketing-manager',
        'technical-architect',
        'business-analyst',
        'customer-success'
      ])
    }

    const entries = fs.readdirSync(baseDir)
    const subagents = entries
      .filter((f) => f.toLowerCase().endsWith('.md'))
      .map((f) => f.replace(/\.md$/i, ''))
    
    return NextResponse.json(subagents)
  } catch (error) {
    console.error('Error listing subagents:', error)
    
    // Return default subagents on error
    return NextResponse.json([
      'sales-executive',
      'marketing-manager', 
      'technical-architect',
      'business-analyst',
      'customer-success'
    ])
  }
}
