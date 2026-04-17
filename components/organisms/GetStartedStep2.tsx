"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Upload, Loader2, BookOpen } from "lucide-react"
import { BookCard, type Book } from "@/components/atoms/BookCard"

interface GetStartedStep2Props {
  selectedBooks: Book[]
  onBooksChange: (books: Book[]) => void
}

interface ManualForm {
  title: string
  author: string
  image: File | null
}

const INITIAL_MANUAL: ManualForm = { title: "", author: "", image: null }

export function GetStartedStep2({
  selectedBooks,
  onBooksChange
}: GetStartedStep2Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Book[]>([])
  const [searching, setSearching] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [manualForm, setManualForm] = useState<ManualForm>(INITIAL_MANUAL)
  const [submittingManual, setSubmittingManual] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    setSearching(true)
    try {
      const res = await fetch(
        `/api/books/search?q=${encodeURIComponent(q)}`
      )
      const data = (await res.json()) as { books: Book[] }
      setResults(data.books ?? [])
      setSearched(true)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      search(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  const toggleBook = (book: Book) => {
    if (selectedBooks.some((b) => b.id === book.id)) {
      onBooksChange(selectedBooks.filter((b) => b.id !== book.id))
    } else {
      onBooksChange([...selectedBooks, book])
    }
  }

  const removeSelected = (id: string) => {
    onBooksChange(selectedBooks.filter((b) => b.id !== id))
  }

  const submitManual = async () => {
    if (!manualForm.title.trim()) return
    setSubmittingManual(true)
    try {
      const fd = new FormData()
      fd.append("title", manualForm.title.trim())
      if (manualForm.author.trim()) fd.append("author", manualForm.author.trim())
      if (manualForm.image) fd.append("image", manualForm.image)

      const res = await fetch("/api/books", { method: "POST", body: fd })
      const data = (await res.json()) as { book: Book }
      if (res.ok && data.book) {
        onBooksChange([...selectedBooks, data.book])
        setManualForm(INITIAL_MANUAL)
        setShowManual(false)
      }
    } finally {
      setSubmittingManual(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-coffee-900 leading-tight">
          Quais livros você já leu?
        </h2>
        <p className="mt-2 text-sm text-coffee-500">
          Adicione os livros que já faz parte da sua jornada literária.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título ou autor..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 focus:border-coffee-400 text-sm transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setResults([])
              setSearched(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {searching && (
        <div className="flex items-center gap-2 text-sm text-coffee-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Buscando...
        </div>
      )}

      {!searching && searched && results.length === 0 && (
        <p className="text-sm text-coffee-500">
          Nenhum livro encontrado para &ldquo;{query}&rdquo;.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {results.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              selected={selectedBooks.some((b) => b.id === book.id)}
              onClick={() => toggleBook(book)}
            />
          ))}
        </div>
      )}

      {!searching && searched && !showManual && (
        <button
          type="button"
          onClick={() => setShowManual(true)}
          className="flex items-center gap-2 text-sm font-medium text-coffee-600 hover:text-coffee-900 underline underline-offset-2 cursor-pointer w-fit"
        >
          <BookOpen className="w-4 h-4" />
          Não encontrei meu livro
        </button>
      )}

      {/* Manual form */}
      {showManual && (
        <div className="border border-coffee-200 rounded-xl p-4 flex flex-col gap-3 bg-coffee-50">
          <p className="text-sm font-semibold text-coffee-800">
            Adicionar livro manualmente
          </p>
          <input
            type="text"
            value={manualForm.title}
            onChange={(e) =>
              setManualForm((f) => ({ ...f, title: e.target.value }))
            }
            placeholder="Título *"
            className="w-full px-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 text-sm"
          />
          <input
            type="text"
            value={manualForm.author}
            onChange={(e) =>
              setManualForm((f) => ({ ...f, author: e.target.value }))
            }
            placeholder="Autor (opcional)"
            className="w-full px-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-coffee-600 cursor-pointer">
            <Upload className="w-4 h-4" />
            {manualForm.image
              ? manualForm.image.name
              : "Capa do livro (opcional)"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setManualForm((f) => ({
                  ...f,
                  image: e.target.files?.[0] ?? null
                }))
              }
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowManual(false)
                setManualForm(INITIAL_MANUAL)
              }}
              className="flex-1 py-2 rounded-xl border border-coffee-200 text-sm text-coffee-600 hover:bg-coffee-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={submitManual}
              disabled={submittingManual || !manualForm.title.trim()}
              className="flex-1 py-2 rounded-xl bg-coffee-800 text-coffee-50 text-sm font-medium disabled:opacity-40 hover:bg-coffee-900 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {submittingManual && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Selected chips */}
      {selectedBooks.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-coffee-600 uppercase tracking-wider">
            Livros selecionados ({selectedBooks.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedBooks.map((book) => (
              <span
                key={book.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coffee-800 text-coffee-50 text-xs font-medium"
              >
                {book.title}
                <button
                  type="button"
                  onClick={() => removeSelected(book.id)}
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
