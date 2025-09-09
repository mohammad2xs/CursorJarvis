import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { oppId, dealType } = await request.json().catch(() => ({}))
    const playbook = {
      opportunityId: oppId,
      dealType,
      stages: [
        { name: 'Discover', actions: ['Validate pain', 'Map stakeholders', 'Define success criteria'] },
        { name: 'Evaluate', actions: ['Propose pilot', 'Quantify impact', 'Align timeline'] },
        { name: 'Propose', actions: ['Share proposal', 'Review ROI', 'Address objections'] },
        { name: 'Negotiate', actions: ['Finalize scope', 'Confirm legal', 'Agree close plan'] },
      ],
      nextActions: ['Email recap', 'Schedule pilot kickoff'],
    }
    return NextResponse.json(playbook)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error)?.message || 'Failed to generate playbook' }, { status: 500 })
  }
}

