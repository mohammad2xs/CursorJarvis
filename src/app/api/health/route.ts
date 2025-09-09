import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import pkgJson from '@/../package.json'

export async function GET() {
  let dbOk = false
  try {
    // simple connectivity check
    await db.$queryRaw`SELECT 1`
    dbOk = true
  } catch {
    dbOk = false
  }

  const envs = {
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
    PERPLEXITY_API_KEY: Boolean(process.env.PERPLEXITY_API_KEY),
    ELEVENLABS_API_KEY: Boolean(process.env.ELEVENLABS_API_KEY),
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
  }

  const { version } = pkgJson as { version: string }

  const status = {
    ok: dbOk,
    version,
    db: dbOk,
    envs,
  }
  return NextResponse.json(status)
}
