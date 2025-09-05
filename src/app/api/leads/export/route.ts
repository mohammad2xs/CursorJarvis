import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const contacts = await db.contact.findMany({
      include: {
        company: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const csvHeaders = [
      'Name',
      'Title',
      'Company',
      'Email',
      'Phone',
      'LinkedIn URL',
      'Sub Industry',
      'Region',
      'Role',
      'Created At'
    ]

    const csvRows = contacts.map(contact => [
      `${contact.firstName} ${contact.lastName}`,
      contact.title || '',
      contact.company.name,
      contact.email || '',
      contact.phone || '',
      contact.linkedinUrl || '',
      contact.company.subIndustry,
      contact.company.region,
      contact.role || '',
      contact.createdAt.toISOString()
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads-export.csv"'
      }
    })
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    )
  }
}
