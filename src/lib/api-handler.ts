import { NextRequest, NextResponse } from 'next/server'

export interface APIError {
  message: string
  code?: string
  details?: any
}

export class APIHandler {
  /**
   * Handles API requests with standardized error handling and response formatting
   */
  static async handleRequest<T>(
    handler: () => Promise<T>,
    errorMessage: string = 'Request failed'
  ): Promise<NextResponse> {
    try {
      const result = await handler()
      return NextResponse.json(result)
    } catch (error) {
      console.error(errorMessage, error)
      
      const apiError: APIError = {
        message: errorMessage,
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
      
      return NextResponse.json(
        { error: apiError },
        { status: 500 }
      )
    }
  }

  /**
   * Handles API requests with custom error status codes
   */
  static async handleRequestWithStatus<T>(
    handler: () => Promise<T>,
    errorMessage: string = 'Request failed',
    statusCode: number = 500
  ): Promise<NextResponse> {
    try {
      const result = await handler()
      return NextResponse.json(result)
    } catch (error) {
      console.error(errorMessage, error)
      
      const apiError: APIError = {
        message: errorMessage,
        code: this.getErrorCode(statusCode),
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
      
      return NextResponse.json(
        { error: apiError },
        { status: statusCode }
      )
    }
  }

  /**
   * Validates required parameters and returns standardized error response
   */
  static validateRequiredParams(
    params: Record<string, any>,
    requiredFields: string[]
  ): NextResponse | null {
    const missingFields = requiredFields.filter(field => 
      !params[field] || (typeof params[field] === 'string' && params[field].trim() === '')
    )

    if (missingFields.length > 0) {
      const apiError: APIError = {
        message: `Missing required parameters: ${missingFields.join(', ')}`,
        code: 'VALIDATION_ERROR',
        details: { missingFields }
      }
      
      return NextResponse.json(
        { error: apiError },
        { status: 400 }
      )
    }

    return null
  }

  /**
   * Validates request body and returns standardized error response
   */
  static validateRequestBody(
    body: any,
    requiredFields: string[]
  ): NextResponse | null {
    if (!body || typeof body !== 'object') {
      const apiError: APIError = {
        message: 'Request body must be a valid JSON object',
        code: 'VALIDATION_ERROR'
      }
      
      return NextResponse.json(
        { error: apiError },
        { status: 400 }
      )
    }

    return this.validateRequiredParams(body, requiredFields)
  }

  /**
   * Handles database not found errors
   */
  static handleNotFound(resource: string): NextResponse {
    const apiError: APIError = {
      message: `${resource} not found`,
      code: 'NOT_FOUND'
    }
    
    return NextResponse.json(
      { error: apiError },
      { status: 404 }
    )
  }

  /**
   * Handles unauthorized access errors
   */
  static handleUnauthorized(message: string = 'Unauthorized access'): NextResponse {
    const apiError: APIError = {
      message,
      code: 'UNAUTHORIZED'
    }
    
    return NextResponse.json(
      { error: apiError },
      { status: 401 }
    )
  }

  /**
   * Handles forbidden access errors
   */
  static handleForbidden(message: string = 'Forbidden'): NextResponse {
    const apiError: APIError = {
      message,
      code: 'FORBIDDEN'
    }
    
    return NextResponse.json(
      { error: apiError },
      { status: 403 }
    )
  }

  /**
   * Extracts search parameters from request URL
   */
  static getSearchParams(request: NextRequest): URLSearchParams {
    return new URL(request.url).searchParams
  }

  /**
   * Extracts path parameters from dynamic routes
   */
  static getPathParams(params: { [key: string]: string | string[] | undefined }): Record<string, string> {
    const pathParams: Record<string, string> = {}
    
    for (const [key, value] of Object.entries(params)) {
      if (value && typeof value === 'string') {
        pathParams[key] = value
      }
    }
    
    return pathParams
  }

  /**
   * Parses JSON request body with error handling
   */
  static async parseRequestBody(request: NextRequest): Promise<any> {
    try {
      return await request.json()
    } catch (error) {
      throw new Error('Invalid JSON in request body')
    }
  }

  /**
   * Gets error code based on status code
   */
  private static getErrorCode(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'VALIDATION_ERROR'
      case 401:
        return 'UNAUTHORIZED'
      case 403:
        return 'FORBIDDEN'
      case 404:
        return 'NOT_FOUND'
      case 409:
        return 'CONFLICT'
      case 422:
        return 'UNPROCESSABLE_ENTITY'
      case 429:
        return 'RATE_LIMITED'
      case 500:
        return 'INTERNAL_ERROR'
      case 502:
        return 'BAD_GATEWAY'
      case 503:
        return 'SERVICE_UNAVAILABLE'
      default:
        return 'UNKNOWN_ERROR'
    }
  }
}

/**
 * Higher-order function to wrap API route handlers with error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('Unhandled error in API route:', error)
      
      const apiError: APIError = {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
      
      return NextResponse.json(
        { error: apiError },
        { status: 500 }
      )
    }
  }
}
