"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { TrendingUp } from "lucide-react"
import { BookCoverPlaceholder } from "@/components/atoms/BookCoverPlaceholder"
import { type Book } from "@/app/shared/types"

function TopBookItem({ book, rank }: { book: Book; rank: number }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-coffee-100 last:border-0">
      <span className="text-2xl font-heading font-bold text-coffee-200 w-7 shrink-0 text-right">
        {rank}
      </span>
      <div className="w-10 h-14 shrink-0 rounded overflow-hidden">
        {book.image_url ? (
          <Image
            src={book.image_url}
            alt={book.title}
            width={40}
            height={56}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <BookCoverPlaceholder className="w-10 h-14" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-coffee-900 line-clamp-2 leading-snug">
          {book.title}
        </p>
        {book.author && (
          <p className="text-xs text-coffee-500 mt-0.5">{book.author}</p>
        )}
      </div>
    </div>
  )
}

function TopBookItemSkeleton({ rank }: { rank: number }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-coffee-100 last:border-0 animate-pulse">
      <span className="text-2xl font-heading font-bold text-coffee-200 w-7 shrink-0 text-right">
        {rank}
      </span>
      <div className="w-10 h-14 rounded bg-coffee-100 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-coffee-100" />
        <div className="h-3 w-1/2 rounded bg-coffee-100" />
      </div>
    </div>
  )
}

export function TopBooksSection() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/books/top")
      .then((r) => r.json())
      .then((d: { books?: Book[] }) => setBooks(d.books ?? []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-coffee-600" />
        <h2 className="font-heading text-xl font-bold text-coffee-900">
          Mais lidos da plataforma
        </h2>
      </div>

      <div className="rounded-2xl border border-coffee-200 bg-white px-4 divide-y-0">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TopBookItemSkeleton key={i} rank={i + 1} />
            ))
          : books.length === 0
            ? <p className="py-6 text-sm text-coffee-400 text-center">Nenhum livro registrado ainda.</p>
            : books.map((book, i) => (
                <TopBookItem key={book.id} book={book} rank={i + 1} />
              ))}
      </div>
    </section>
  )
}
