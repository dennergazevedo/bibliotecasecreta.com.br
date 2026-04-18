"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Loader2 } from "lucide-react"
import { BookLibraryCard } from "@/components/molecules/BookLibraryCard"
import { AddBookModal } from "@/components/organisms/AddBookModal"
import { type Book } from "@/app/shared/types"

type LibraryBook = Book & { is_favorite: boolean }

const PAGE_SIZE = 12

export function MyLibrarySection() {
  const [books, setBooks] = useState<LibraryBook[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const fetchBooks = useCallback(async (offset: number, append: boolean) => {
    if (offset === 0) setLoading(true); else setLoadingMore(true)
    try {
      const res = await fetch(`/api/user/books?offset=${offset}&limit=${PAGE_SIZE}`)
      const data = (await res.json()) as { books: LibraryBook[]; total: number }
      setBooks((prev) => append ? [...prev, ...data.books] : data.books)
      setTotal(data.total)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { fetchBooks(0, false) }, [fetchBooks])

  const handleFavoriteToggle = (bookId: string, newValue: boolean) => {
    setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, is_favorite: newValue } : b))
  }

  const handleBookAdded = (book: Book) => {
    setBooks((prev) => [{ ...book, is_favorite: false }, ...prev])
    setTotal((t) => t + 1)
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-coffee-900">Livros lidos</h2>
          {!loading && <p className="text-sm text-coffee-500 mt-0.5">{total} livro{total !== 1 ? "s" : ""} no total</p>}
        </div>
        <button type="button" onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-coffee-800 text-coffee-50 text-sm font-medium hover:bg-coffee-900 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          Adicionar Livro
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-coffee-100 animate-pulse aspect-[2/3]" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-coffee-400">
          <p className="text-sm">Nenhum livro adicionado ainda.</p>
          <button type="button" onClick={() => setAddModalOpen(true)}
            className="mt-3 text-sm text-coffee-700 underline underline-offset-2 cursor-pointer">
            Adicionar meu primeiro livro
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookLibraryCard key={book.id} book={book} isFavorite={book.is_favorite} onFavoriteToggle={handleFavoriteToggle} />
            ))}
          </div>
          {books.length < total && (
            <button type="button" onClick={() => fetchBooks(books.length, true)} disabled={loadingMore}
              className="self-center flex items-center gap-2 px-6 py-2.5 rounded-full border border-coffee-300 text-sm font-medium text-coffee-700 hover:bg-coffee-100 disabled:opacity-50 transition-colors cursor-pointer">
              {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Mostrar mais
            </button>
          )}
        </>
      )}

      {addModalOpen && <AddBookModal onClose={() => setAddModalOpen(false)} onBookAdded={handleBookAdded} />}
    </section>
  )
}
