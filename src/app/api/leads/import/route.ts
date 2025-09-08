import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CSVImportResult } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    const result: CSVImportResult = {
      success: true,
      imported: 0,
      duplicates: 0,
      errors: []
    }

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim())
        const rowData: Record<string, unknown> = {}
        
        headers.forEach((header, index) => {
          rowData[header.toLowerCase()] = values[index] || ''
        })

        // Check for duplicates
        const existingContact = await db.contact.findFirst({
          where: {
            email: String(rowData.email || '') || undefined,
            linkedinUrl: String(rowData.linkedinurl || '') || undefined
          }
        })

        if (existingContact) {
          result.duplicates++
          continue
        }

        // Find or create company
        let company = await db.company.findFirst({
          where: {
            name: {
              contains: String(rowData.company),
              mode: 'insensitive'
            }
          }
        })

        if (!company) {
          company = await db.company.create({
            data: {
              name: String(rowData.company),
              website: String(rowData.website || ''),
              subIndustry: String(rowData.subindustry || 'Tech/SaaS'),
              region: String(rowData.region || 'Unknown'),
              tags: rowData.tags ? String(rowData.tags).split(',').map((t: string) => t.trim()) : [],
              priorityLevel: 'GROWTH'
            }
          })
        }

        // Create contact
        await db.contact.create({
          data: {
            firstName: String(rowData.firstname || rowData.name?.toString().split(' ')[0] || ''),
            lastName: String(rowData.lastname || rowData.name?.toString().split(' ').slice(1).join(' ') || ''),
            email: String(rowData.email || '') || null,
            phone: String(rowData.phone || '') || null,
            title: String(rowData.title || ''),
            role: String(rowData.role || ''),
            linkedinUrl: String(rowData.linkedinurl || '') || null,
            companyId: company.id
          }
        })

        result.imported++
      } catch (error) {
        result.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error importing CSV:', error)
    return NextResponse.json(
      { error: 'Failed to import CSV' },
      { status: 500 }
    )
  }
}
