#!/usr/bin/env node
/*
 Simple environment check for local/dev and prod.
 - Reads .env.local if present (without modifying files)
 - Merges with process.env
 - Warns if keys are missing; optionally fails if ENV_CHECK_STRICT=true
*/
const fs = require('fs')
const path = require('path')

const REQUIRED = ['OPENAI_API_KEY', 'PERPLEXITY_API_KEY', 'ELEVENLABS_API_KEY']
const STRICT = process.env.ENV_CHECK_STRICT === 'true'

function parseEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const env = {}
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, '')
      if (key) env[key] = val
    }
    return env
  } catch {
    return {}
  }
}

const root = process.cwd()
const localEnvFile = path.join(root, '.env.local')
const fileVars = fs.existsSync(localEnvFile) ? parseEnvFile(localEnvFile) : {}

let missing = []
for (const key of REQUIRED) {
  const value = process.env[key] || fileVars[key]
  if (!value) missing.push(key)
}

if (missing.length) {
  const msg = `Env check: missing ${missing.join(', ')}. Set them in deployment env or .env.local.`
  if (STRICT) {
    console.error(msg)
    process.exit(1)
  } else {
    console.warn(msg)
  }
}

// Print a short summary lines (non-sensitive)
function summarize(key) {
  const v = process.env[key] || fileVars[key]
  if (!v) return 'absent'
  return `${v.slice(0, 6)}…(${v.length})`
}

console.log(
  `Env summary -> OPENAI_API_KEY:${summarize('OPENAI_API_KEY')} ` +
  `PERPLEXITY_API_KEY:${summarize('PERPLEXITY_API_KEY')} ` +
  `ELEVENLABS_API_KEY:${summarize('ELEVENLABS_API_KEY')}`
)

