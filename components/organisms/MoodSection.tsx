"use client"

import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { BookSuggestionCard, BookSuggestionCardSkeleton } from "@/components/molecules/BookSuggestionCard"
import { type Book } from "@/app/shared/types"

const MOODS = [
  { label: "Feliz", emoji: "😊" },
  { label: "Triste", emoji: "😢" },
  { label: "Bravo", emoji: "😤" },
  { label: "Calmo", emoji: "😌" },
  { label: "Ansioso", emoji: "😰" },
  { label: "Animado", emoji: "🤩" },
  { label: "Entediado", emoji: "😐" },
  { label: "Nostálgico", emoji: "🥹" },
]

export function MoodSection() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(false)

  const pickMood = async (mood: string) => {
    setSelectedMood(mood)
    setBook(null)
    setLoading(true)
    try {
      const res = await fetch("/api/suggestions/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood })
      })
      const data = (await res.json()) as { book?: Book }
      setBook(data.book ?? null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-coffee-600" />
        <h2 className="font-heading text-xl font-bold text-coffee-900">
          Como você está hoje?
        </h2>
      </div>
      <p className="text-sm text-coffee-500 -mt-2">
        Escolha seu mood e receba uma sugestão personalizada
      </p>

      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <button
            key={m.label}
            type="button"
            onClick={() => pickMood(m.label)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 ${
              selectedMood === m.label
                ? "bg-coffee-800 border-coffee-800 text-coffee-50"
                : "bg-white border-coffee-200 text-coffee-700 hover:border-coffee-400"
            }`}
          >
            <span>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      {loading && <BookSuggestionCardSkeleton />}

      {!loading && book && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-coffee-500 font-medium">
            Para quem está {selectedMood?.toLowerCase()}:
          </p>
          <BookSuggestionCard book={book} />
        </div>
      )}

      {!loading && selectedMood && !book && (
        <div className="flex items-center gap-2 text-sm text-coffee-500 py-2">
          <Loader2 className="w-4 h-4" />
          Nenhuma sugestão disponível. Tente outro mood.
        </div>
      )}
    </section>
  )
}
