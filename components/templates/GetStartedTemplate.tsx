"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"
import { Logo } from "@/components/atoms/Logo"
import { GetStartedStep1 } from "@/components/organisms/GetStartedStep1"
import { GetStartedStep2 } from "@/components/organisms/GetStartedStep2"
import { GetStartedStep3 } from "@/components/organisms/GetStartedStep3"
import { type Book } from "@/components/atoms/BookCard"

type Step = 1 | 2 | 3

export function GetStartedTemplate() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const canAdvanceStep1 = selectedThemes.length >= 3
  const canAdvanceStep2 = true
  const canAdvanceStep3 = true

  const finish = async (
    themes: string[],
    books: Book[],
    favorites: string[]
  ) => {
    setSubmitting(true)
    try {
      await fetch("/api/get-started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themes,
          readBookIds: books.map((b) => b.id),
          favoriteBookIds: favorites
        })
      })
    } finally {
      setSubmitting(false)
      router.push("/dashboard")
    }
  }

  const handleAdvance = async () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (selectedBooks.length > 0) {
        setStep(3)
      } else {
        await finish(selectedThemes, [], [])
      }
    } else {
      await finish(selectedThemes, selectedBooks, favoriteIds)
    }
  }

  const handleSkip = async () => {
    await finish(selectedThemes, selectedBooks, favoriteIds)
  }

  const TOTAL_STEPS = 3
  const visibleSteps = selectedBooks.length > 0 ? TOTAL_STEPS : 2

  const stepLabel: Record<Step, string> = {
    1: "Temas favoritos",
    2: "Livros lidos",
    3: "Livros favoritos"
  }

  const canAdvance =
    step === 1 ? canAdvanceStep1 : step === 2 ? canAdvanceStep2 : canAdvanceStep3

  const advanceLabel =
    step === 2 && selectedBooks.length === 0
      ? "Pular para o dashboard"
      : step === (visibleSteps as Step)
        ? "Concluir"
        : "Avançar"

  return (
    <div className="min-h-screen flex flex-col bg-coffee-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-coffee-200 bg-white">
        <Logo />
        <span className="text-xs text-coffee-500 font-medium">
          {stepLabel[step]}
        </span>
      </header>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-6">
        {Array.from({ length: visibleSteps }).map((_, i) => {
          const s = (i + 1) as Step
          return (
            <div
              key={s}
              className={`rounded-full transition-all duration-300 ${
                s === step
                  ? "w-6 h-2 bg-coffee-800"
                  : s < step
                    ? "w-2 h-2 bg-coffee-400"
                    : "w-2 h-2 bg-coffee-200"
              }`}
            />
          )
        })}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full">
        {step === 1 && (
          <GetStartedStep1
            selectedThemes={selectedThemes}
            onThemesChange={setSelectedThemes}
          />
        )}
        {step === 2 && (
          <GetStartedStep2
            selectedBooks={selectedBooks}
            onBooksChange={setSelectedBooks}
          />
        )}
        {step === 3 && (
          <GetStartedStep3
            books={selectedBooks}
            favoriteIds={favoriteIds}
            onFavoritesChange={setFavoriteIds}
          />
        )}
      </main>

      {/* Bottom bar */}
      <footer className="sticky bottom-0 bg-white border-t border-coffee-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="flex-1 py-3 rounded-full border border-coffee-200 text-sm text-coffee-600 hover:bg-coffee-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Preencher depois
          </button>
          <button
            type="button"
            onClick={handleAdvance}
            disabled={!canAdvance || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-coffee-800 text-coffee-50 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-coffee-900 transition-colors cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {advanceLabel}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}
