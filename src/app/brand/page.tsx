'use client'

import { BrandStudio } from '@/components/dashboard/brand-studio'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function BrandPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <BrandStudio />
        </main>
      </div>
    </div>
  )
}
