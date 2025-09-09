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
  const re = /(fetch|axios\s*\()\(\s*["'](\/api\/[^"']+)["']/g
  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf8')
    let m
    while ((m = re.exec(txt))) {
      calls.add(m[2].replace(/\/$/, ''))
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
    const href = '/api' + seg.replace(/\/\[$/,'').replace(/index$/,'').replace(/\/$/,'')
    routes.add(href || '/api')
  }
  return Array.from(routes)
}

const calls = collectFrontendCalls()
const routes = collectApiRoutes()
const missing = calls.filter(c => !routes.some(r => c.startsWith(r)))

if (missing.length) {
  console.error('Missing API routes for the following frontend calls:')
  for (const m of missing) console.error(' -', m)
  process.exit(1)
} else {
  console.log('API coverage OK. All frontend calls have matching routes.')
}

