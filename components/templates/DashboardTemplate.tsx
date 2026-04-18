"use client"

import { DashboardNav } from "@/components/organisms/DashboardNav"
import { MoodSection } from "@/components/organisms/MoodSection"
import { DailySection } from "@/components/organisms/DailySection"
import { TopBooksSection } from "@/components/organisms/TopBooksSection"
import { CuratedSection } from "@/components/organisms/CuratedSection"
import { Footer } from "@/components/organisms/Footer"

interface DashboardTemplateProps {
  userName: string
}

export function DashboardTemplate({ userName }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col">
      <DashboardNav userName={userName} />

      <main className="flex-1 container max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-10">
        <div>
          <h1 className="font-heading text-3xl font-bold text-coffee-900">
            Bem-vindo(a) à Biblioteca Secreta!
          </h1>
          <p className="text-sm text-coffee-500 mt-1">
            Descubra sua próxima leitura favorita
          </p>
        </div>

        <MoodSection />
        <DailySection />
        <TopBooksSection />
        <CuratedSection />
      </main>
      <Footer />
    </div>
  )
}
