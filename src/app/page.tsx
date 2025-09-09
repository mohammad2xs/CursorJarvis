'use client'

import { Suspense } from 'react'
import { ResponsiveWrapper } from '@/components/layout/responsive-wrapper'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <ResponsiveWrapper userId="user-1" />
    </Suspense>
  )
}
