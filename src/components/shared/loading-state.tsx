'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  progress?: number
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  progress,
  showProgress = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Card className={`flex items-center justify-center p-8 ${className}`}>
      <CardContent className="flex flex-col items-center space-y-4">
        <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
        <p className="text-sm text-muted-foreground">{message}</p>
        {showProgress && progress !== undefined && (
          <div className="w-full max-w-xs">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LoadingState
