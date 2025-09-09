#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const repo = process.cwd()
const srcDir = path.join(repo, 'src')
const apiDir = path.join(srcDir, 'app', 'api')

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name)))
    else out.push(path.join(dir, e.name))
  }
  return out
}

function collectFrontendCalls() {
  const files = walk(srcDir).filter(f => /\.(tsx?|jsx?)$/.test(f))
  const calls = new Set()
  const reLiteral = /\b(fetch|axios)\s*\(\s*['"](\/api\/[^'"\)]+)['"]/g
  const reTemplate = /\b(fetch|axios)\s*\(\s*`([^`]+)`/g
  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf8')
    let m
    while ((m = reLiteral.exec(txt))) {
      calls.add(m[2].replace(/\/$/, ''))
    }
    while ((m = reTemplate.exec(txt))) {
      const body = m[2]
      // Heuristic: extract any '/api/...' segments before template exprs or query strings
      const segRe = /\/api\/[A-Za-z0-9_\/\-]+/g
      const matches = body.match(segRe) || []
      for (const s of matches) {
        calls.add(s.replace(/\/$/, ''))
      }
    }
  }
  return Array.from(calls).sort()
}

function collectApiRoutes() {
  if (!fs.existsSync(apiDir)) return []
  const files = walk(apiDir)
  const routes = new Set()
  for (const f of files) {
    if (!/route\.(t|j)s$/.test(f)) continue
    const rel = f.split(path.join('src','app','api'))[1]
    const seg = rel.replace(/\/route\.(t|j)s$/, '')
    const hrefRaw = '/api' + seg.replace(/index$/,'').replace(/\/$/,'')
    // Normalize dynamic segments: /[id] -> /
    const href = hrefRaw.replace(/\/[\[][^/]+[\]]/g, '/')
    routes.add(href || '/api')
  }
  return Array.from(routes)
}

const calls = collectFrontendCalls()
const routes = collectApiRoutes()
const missing = calls.filter(c => !routes.some(r => c.startsWith(r)))
const strict = process.env.API_COVERAGE_STRICT === '1'

if (missing.length) {
  console.warn('Missing API routes for the following frontend calls:')
  for (const m of missing) console.warn(' -', m)
  if (strict) process.exit(1)
} else {
  console.log('API coverage OK. All frontend calls have matching routes.')
}
