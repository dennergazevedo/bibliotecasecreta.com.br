"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import {
  BookSuggestionCard,
  BookSuggestionCardSkeleton
} from "@/components/molecules/BookSuggestionCard"
import { type Book } from "@/app/shared/types"

export function DailySection() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/suggestions/daily")
      .then((r) => r.json())
      .then((d: { books?: Book[] }) => setBooks(d.books ?? []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-coffee-gold" />
        <h2 className="font-heading text-xl font-bold text-coffee-900">
          Suas sugestões de hoje
        </h2>
      </div>
      <p className="text-sm text-coffee-500 -mt-2">
        Baseadas nos seus gostos e histórico de leitura
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <BookSuggestionCardSkeleton key={i} />
            ))
          : books.map((book) => (
              <BookSuggestionCard key={book.id} book={book} />
            ))}
      </div>
    </section>
  )
}
