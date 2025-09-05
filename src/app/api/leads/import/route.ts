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
        const rowData: any = {}
        
        headers.forEach((header, index) => {
          rowData[header.toLowerCase()] = values[index] || ''
        })

        // Check for duplicates
        const existingContact = await db.contact.findFirst({
          where: {
            email: rowData.email || undefined,
            linkedinUrl: rowData.linkedinurl || undefined
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
              contains: rowData.company,
              mode: 'insensitive'
            }
          }
        })

        if (!company) {
          company = await db.company.create({
            data: {
              name: rowData.company,
              website: rowData.website || '',
              subIndustry: rowData.subindustry || 'Tech/SaaS',
              region: rowData.region || 'Unknown',
              tags: rowData.tags ? rowData.tags.split(',').map((t: string) => t.trim()) : [],
              priorityLevel: 'GROWTH'
            }
          })
        }

        // Create contact
        await db.contact.create({
          data: {
            firstName: rowData.firstname || rowData.name?.split(' ')[0] || '',
            lastName: rowData.lastname || rowData.name?.split(' ').slice(1).join(' ') || '',
            email: rowData.email || null,
            phone: rowData.phone || null,
            title: rowData.title || '',
            role: rowData.role || '',
            linkedinUrl: rowData.linkedinurl || null,
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
