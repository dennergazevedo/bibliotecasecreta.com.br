"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { BookCoverPlaceholder } from "@/components/atoms/BookCoverPlaceholder"
import { BookDetailModal } from "@/components/atoms/BookDetailModal"
import { type Book } from "@/app/shared/types"

interface BookSuggestionCardProps {
  book: Book
  description?: string
  className?: string
}

export function BookSuggestionCard({
  book,
  description,
  className
}: BookSuggestionCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div
        className={`flex gap-4 rounded-2xl border border-coffee-200 bg-white p-4 cursor-pointer hover:border-coffee-400 hover:shadow-sm transition-all duration-150 ${className ?? ""}`}
        onClick={() => setModalOpen(true)}
      >
        <div className="shrink-0 w-16 h-24 rounded-md overflow-hidden">
          {book.image_url ? (
            <Image src={book.image_url} alt={book.title} width={64} height={96} className="object-cover w-full h-full" unoptimized />
          ) : (
            <BookCoverPlaceholder className="w-16 h-24" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          {book.genre && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-coffee-500">{book.genre}</span>
          )}
          <h3 className="font-heading text-base font-bold text-coffee-900 leading-snug line-clamp-2">{book.title}</h3>
          {book.author && <p className="text-xs text-coffee-500">{book.author}</p>}
          {description && <p className="text-xs text-coffee-600 leading-relaxed line-clamp-3 mt-1">{description}</p>}
          {book.affiliated_link && (
            <a href={book.affiliated_link} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-coffee-500 hover:text-coffee-800 transition-colors w-fit">
              <ExternalLink className="w-3 h-3" />Comprar
            </a>
          )}
        </div>
      </div>
      <BookDetailModal book={modalOpen ? book : null} onClose={() => setModalOpen(false)} />
    </>
  )
}

export function BookSuggestionCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-coffee-200 bg-white p-4 animate-pulse">
      <div className="shrink-0 w-16 h-24 rounded-md bg-coffee-100" />
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="h-2 w-16 rounded bg-coffee-100" />
        <div className="h-4 w-4/5 rounded bg-coffee-100" />
        <div className="h-3 w-1/2 rounded bg-coffee-100" />
        <div className="h-3 w-full rounded bg-coffee-100 mt-1" />
        <div className="h-3 w-3/4 rounded bg-coffee-100" />
      </div>
    </div>
  )
}
