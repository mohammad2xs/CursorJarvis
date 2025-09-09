import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Use a known Getty account name to trigger expansion/strategy paths
    const companyName = 'Boeing'

    const now = new Date()
    const upcoming = new Date(now.getTime() + 60 * 60 * 1000) // +1 hour

    const company = await db.company.create({
      data: {
        name: companyName,
        website: 'https://www.example.com',
        subIndustry: 'Aerospace & Defense',
        region: 'North America',
        tags: ['ESG', 'Safety', 'Innovation'],
        contacts: {
          create: [
            {
              firstName: 'Avery',
              lastName: 'Cole',
              email: 'avery.cole@example.com',
              title: 'CMO',
              role: 'Chief Marketing Officer',
              linkedinUrl: 'https://www.linkedin.com/in/example',
            },
          ],
        },
        opportunities: {
          create: [
            {
              name: 'Enterprise Visual Content Program',
              dealType: 'NEW_LOGO',
              stage: 'DISCOVER',
              value: 250000,
              probability: 20,
            },
          ],
        },
        meetings: {
          create: [
            {
              title: 'Discovery with CMO',
              type: 'DISCOVERY',
              status: 'SCHEDULED',
              scheduledAt: upcoming,
              duration: 45,
              meetingUrl: 'https://meet.example.com/abc',
              notes: 'Initial discovery; align on priorities',
            },
          ],
        },
      },
      include: {
        contacts: true,
        opportunities: true,
        meetings: true,
      },
    })

    return NextResponse.json({ success: true, company })
  } catch (error: unknown) {
    console.error('Create test company error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error)?.message || 'Failed to create test company' },
      { status: 500 }
    )
  }
}

