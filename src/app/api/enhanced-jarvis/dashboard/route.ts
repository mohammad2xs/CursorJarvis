import { NextRequest, NextResponse } from 'next/server'
import { enhancedCursorJarvisService } from '@/lib/enhanced-cursor-jarvis'
import { APIHandler } from '@/lib/api-handler'

export async function GET(request: NextRequest) {
  return APIHandler.handleRequest(async () => {
    const searchParams = APIHandler.getSearchParams(request)
    const accountId = searchParams.get('accountId')

    // Validate required parameters
    const validationError = APIHandler.validateRequiredParams(
      { accountId },
      ['accountId']
    )
    if (validationError) return validationError

    return await enhancedCursorJarvisService.generateEnhancedDashboard(accountId!)
  }, 'Failed to generate enhanced dashboard')
}
