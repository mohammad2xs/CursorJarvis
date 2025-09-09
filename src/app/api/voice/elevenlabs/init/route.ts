import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY
  const ready = Boolean(key)
  return NextResponse.json({ ready, reason: ready ? undefined : 'ELEVENLABS_API_KEY missing' })
}

