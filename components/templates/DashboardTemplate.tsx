"use client"

import { Logo } from "@/components/atoms/Logo"
import { MoodSection } from "@/components/organisms/MoodSection"
import { DailySection } from "@/components/organisms/DailySection"
import { TopBooksSection } from "@/components/organisms/TopBooksSection"
import { CuratedSection } from "@/components/organisms/CuratedSection"

interface DashboardTemplateProps {
  userName: string
}

export function DashboardTemplate({ userName }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-coffee-200 px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-sm text-coffee-600 hidden sm:block">
            Olá, <span className="font-semibold text-coffee-900">{userName}</span>
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-coffee-400 hover:text-coffee-700 transition-colors cursor-pointer"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-10">
        <div>
          <h1 className="font-heading text-3xl font-bold text-coffee-900">
            Minha biblioteca
          </h1>
          <p className="text-sm text-coffee-500 mt-1">
            Descubra sua próxima leitura favorita
          </p>
        </div>

        <MoodSection />
        <DailySection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <TopBooksSection />
          <CuratedSection />
        </div>
      </main>
    </div>
  )
}
