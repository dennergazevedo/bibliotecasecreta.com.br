"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { BookSuggestionCard } from "@/components/molecules/BookSuggestionCard"
import { type SuggestionWithBook } from "@/app/api/user/suggestions/route"

const PAGE_SIZE = 12

export function SuggestionsHistorySection() {
  const [suggestions, setSuggestions] = useState<SuggestionWithBook[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchSuggestions = useCallback(async (offset: number, append: boolean) => {
    if (offset === 0) setLoading(true); else setLoadingMore(true)
    try {
      const res = await fetch(`/api/user/suggestions?offset=${offset}&limit=${PAGE_SIZE}`)
      const data = (await res.json()) as { suggestions: SuggestionWithBook[]; total: number }
      setSuggestions((prev) => append ? [...prev, ...(data.suggestions ?? [])] : (data.suggestions ?? []))
      setTotal(data.total)
    } finally { setLoading(false); setLoadingMore(false) }
  }, [])

  useEffect(() => { fetchSuggestions(0, false) }, [fetchSuggestions])

  if (!loading && suggestions.length === 0) return null

  const MOOD_LABELS: Record<string, string> = {
    mood: "Mood",
    daily: "Diária"
  }

  return (
    <section className="flex flex-col gap-5 mt-10">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-coffee-gold" />
        <h2 className="font-heading text-xl font-bold text-coffee-900">Sugestões da Biblioteca Secreta</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-coffee-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((s) => (
              <div key={s.id} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-coffee-400 px-1">
                  {MOOD_LABELS[s.type] ?? s.type}{s.mood ? ` · ${s.mood}` : ""}
                </span>
                <BookSuggestionCard book={s.book} />
              </div>
            ))}
          </div>
          {suggestions.length < total && (
            <button type="button" onClick={() => fetchSuggestions(suggestions.length, true)} disabled={loadingMore}
              className="self-center flex items-center gap-2 px-6 py-2.5 rounded-full border border-coffee-300 text-sm font-medium text-coffee-700 hover:bg-coffee-100 disabled:opacity-50 transition-colors cursor-pointer">
              {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
              Mostrar mais
            </button>
          )}
        </>
      )}
    </section>
  )
}
