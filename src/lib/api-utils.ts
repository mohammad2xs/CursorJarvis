import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

export function ok<T>(data: T, init?: number | ResponseInit) {
  const resInit = typeof init === 'number' ? { status: init } : init
  return NextResponse.json({ ok: true, data }, resInit)
}

export function fail(message: string, status = 500, extras?: Record<string, unknown>) {
  const correlationId = crypto.randomUUID()
  const error = { message, correlationId, ...extras }
  return NextResponse.json({ ok: false, error }, { status })
}

export function withApi(
  handler: (req: NextRequest, ctx?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx?: any) => {
    try {
      return await handler(req, ctx)
    } catch (e: unknown) {
      const message = (e as Error)?.message || 'Unexpected error'
      console.error('API error:', message, e)
      return fail(message, 500)
    }
  }
}

