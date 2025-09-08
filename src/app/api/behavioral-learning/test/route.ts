import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ message: 'Behavioral learning API is working' })
  } catch (error) {
    console.error('Error in test endpoint:', error)
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    )
  }
}
