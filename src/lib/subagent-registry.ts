import fs from 'fs'
import path from 'path'

function toSlug(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function listAvailableSubagentSlugs(): string[] {
  const fallback = [
    'sales-executive',
    'getty-images-executive',
    'ui-ux-designer',
    'api-documentor',
    'python-pro',
    'typescript-expert',
  ]

  try {
    const repoRoot = process.cwd()
    const baseDir = path.join(repoRoot, 'external', 'Subagents-collection')
    if (!fs.existsSync(baseDir)) return fallback

    const entries = fs.readdirSync(baseDir)
    const markdowns = entries.filter((f) => f.toLowerCase().endsWith('.md'))
    const slugs = markdowns.map((f) => toSlug(f.replace(/\.md$/i, '')))
    return slugs.length ? slugs : fallback
  } catch (e) {
    console.warn('listAvailableSubagentSlugs warning:', e)
    return fallback
  }
}

