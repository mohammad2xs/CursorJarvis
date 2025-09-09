import { NextRequest, NextResponse } from 'next/server'

const mock = [
  { id: 'w_1', name: 'New Lead → Slack Alert', steps: 3 },
  { id: 'w_2', name: 'Meeting Summary → Notion', steps: 4 },
]

export async function GET() {
  return NextResponse.json({ workflows: mock })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  return NextResponse.json({ created: { ...body, id: `w_${Date.now()}` } })
}

