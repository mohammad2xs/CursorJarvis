import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NBAStatus } from '@/types'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, outcome } = await request.json()
    const { id } = params

    if (!status || !Object.values(NBAStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedNBA = await db.nBA.update({
      where: { id },
      data: {
        status,
        ...(outcome && { 
          description: `${await db.nBA.findUnique({ where: { id } }).then(nba => nba?.description || '')}\n\nOutcome: ${outcome}` 
        })
      }
    })

    return NextResponse.json(updatedNBA)
  } catch (error) {
    console.error('Error updating NBA:', error)
    return NextResponse.json(
      { error: 'Failed to update NBA' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const nba = await db.nBA.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        opportunity: true
      }
    })

    if (!nba) {
      return NextResponse.json(
        { error: 'NBA not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(nba)
  } catch (error) {
    console.error('Error fetching NBA:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NBA' },
      { status: 500 }
    )
  }
}
