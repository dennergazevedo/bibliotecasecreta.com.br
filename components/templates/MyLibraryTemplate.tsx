"use client"

import { DashboardNav } from "@/components/organisms/DashboardNav"
import { MyLibrarySection } from "@/components/organisms/MyLibrarySection"
import { SuggestionsHistorySection } from "@/components/organisms/SuggestionsHistorySection"
import { Footer } from "@/components/organisms/Footer"

interface MyLibraryTemplateProps {
  userName: string
}

export function MyLibraryTemplate({ userName }: MyLibraryTemplateProps) {
  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col">
      <DashboardNav userName={userName} />
      <main className="flex-1 max-w-6xl container mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-coffee-900">Minha biblioteca</h1>
          <p className="text-sm text-coffee-500 mt-1">Todos os livros que você já leu</p>
        </div>
        <MyLibrarySection />
        <SuggestionsHistorySection />
      </main>
      <Footer />
    </div>
  )
}
