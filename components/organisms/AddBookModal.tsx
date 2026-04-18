"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Upload, Loader2, BookOpen, Plus } from "lucide-react"
import Image from "next/image"
import { BookCoverPlaceholder } from "@/components/atoms/BookCoverPlaceholder"
import { type Book } from "@/app/shared/types"

interface AddBookModalProps {
  onClose: () => void
  onBookAdded: (book: Book) => void
}

interface ManualForm {
  title: string
  author: string
  image: File | null
}

const INITIAL_MANUAL: ManualForm = { title: "", author: "", image: null }

export function AddBookModal({ onClose, onBookAdded }: AddBookModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Book[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [manualForm, setManualForm] = useState<ManualForm>(INITIAL_MANUAL)
  const [submittingManual, setSubmittingManual] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setSearched(false); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(q)}`)
      const data = (await res.json()) as { books: Book[] }
      setResults(data.books ?? [])
      setSearched(true)
    } catch { setResults([]) } finally { setSearching(false) }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  const addBook = async (book: Book) => {
    setAddingId(book.id)
    try {
      await fetch("/api/user/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id })
      })
      onBookAdded(book)
      onClose()
    } finally { setAddingId(null) }
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
        await fetch("/api/user/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId: data.book.id })
        })
        onBookAdded(data.book)
        onClose()
      }
    } finally { setSubmittingManual(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-coffee-100 px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
          <p className="text-sm font-semibold text-coffee-900">Adicionar livro</p>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-coffee-100 text-coffee-500 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 pointer-events-none" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título ou autor..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-coffee-200 bg-coffee-50 text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 focus:bg-white text-sm" />
            {query && <button type="button" onClick={() => { setQuery(""); setResults([]); setSearched(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 cursor-pointer"><X className="w-4 h-4" /></button>}
          </div>

          {searching && <div className="flex items-center gap-2 text-sm text-coffee-500"><Loader2 className="w-4 h-4 animate-spin" />Buscando...</div>}

          {results.length > 0 && (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {results.map((book) => (
                <div key={book.id} className="flex items-center gap-3 p-3 rounded-xl border border-coffee-200 bg-white hover:border-coffee-400 transition-colors">
                  <div className="w-10 h-14 shrink-0 rounded overflow-hidden">
                    {book.image_url ? <Image src={book.image_url} alt={book.title} width={40} height={56} className="object-cover w-full h-full" unoptimized /> : <BookCoverPlaceholder className="w-10 h-14" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-coffee-900 line-clamp-1">{book.title}</p>
                    {book.author && <p className="text-xs text-coffee-500">{book.author}</p>}
                  </div>
                  <button type="button" onClick={() => addBook(book)} disabled={addingId === book.id}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-coffee-800 text-coffee-50 text-xs font-medium hover:bg-coffee-900 disabled:opacity-50 cursor-pointer">
                    {addingId === book.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}

          {!searching && searched && !showManual && (
            <button type="button" onClick={() => setShowManual(true)}
              className="flex items-center gap-2 text-sm font-medium text-coffee-600 hover:text-coffee-900 underline underline-offset-2 cursor-pointer w-fit">
              <BookOpen className="w-4 h-4" />
              Não encontrei meu livro
            </button>
          )}

          {showManual && (
            <div className="border border-coffee-200 rounded-xl p-4 flex flex-col gap-3 bg-coffee-50">
              <p className="text-sm font-semibold text-coffee-800">Adicionar manualmente</p>
              <input type="text" value={manualForm.title} onChange={(e) => setManualForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Título *" className="w-full px-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 text-sm" />
              <input type="text" value={manualForm.author} onChange={(e) => setManualForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Autor (opcional)" className="w-full px-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 text-sm" />
              <label className="flex items-center gap-2 text-sm text-coffee-600 cursor-pointer">
                <Upload className="w-4 h-4" />
                {manualForm.image ? manualForm.image.name : "Capa (opcional)"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setManualForm((f) => ({ ...f, image: e.target.files?.[0] ?? null }))} />
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowManual(false); setManualForm(INITIAL_MANUAL) }}
                  className="flex-1 py-2 rounded-xl border border-coffee-200 text-sm text-coffee-600 hover:bg-coffee-100 cursor-pointer">Cancelar</button>
                <button type="button" onClick={submitManual} disabled={submittingManual || !manualForm.title.trim()}
                  className="flex-1 py-2 rounded-xl bg-coffee-800 text-coffee-50 text-sm font-medium disabled:opacity-40 hover:bg-coffee-900 cursor-pointer flex items-center justify-center gap-2">
                  {submittingManual && <Loader2 className="w-4 h-4 animate-spin" />}Adicionar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
