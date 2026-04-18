"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, ExternalLink } from "lucide-react"
import { BookCoverPlaceholder } from "@/components/atoms/BookCoverPlaceholder"
import { type Book } from "@/app/shared/types"

interface BookDetailModalProps {
  book: Book | null
  onClose: () => void
}

export function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  useEffect(() => {
    if (!book) return
    document.body.style.overflow = "hidden"
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handler)
    }
  }, [book, onClose])

  if (!book) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-coffee-100 px-5 py-3.5 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-coffee-500">
            Detalhes do livro
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-coffee-100 text-coffee-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex gap-5">
          <div className="shrink-0 w-24 h-36 rounded-lg overflow-hidden">
            {book.image_url ? (
              <Image
                src={book.image_url}
                alt={book.title}
                width={96}
                height={144}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <BookCoverPlaceholder className="w-24 h-36" />
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            {book.genre && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-coffee-500">
                {book.genre}
              </span>
            )}
            <h2 className="font-heading text-xl font-bold text-coffee-900 leading-snug">
              {book.title}
            </h2>
            {book.author && (
              <p className="text-sm text-coffee-600">{book.author}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-coffee-400">
              {book.published_date && <span>📅 {book.published_date}</span>}
              {book.page_count && <span>📖 {book.page_count} páginas</span>}
            </div>
          </div>
        </div>

        {book.description && (
          <div className="px-5 pb-3">
            <p className="text-sm text-coffee-700 leading-relaxed">{book.description}</p>
          </div>
        )}

        {book.affiliated_link && (
          <div className="px-5 pb-5 pt-2">
            <a
              href={book.affiliated_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-coffee-600 border border-coffee-300 rounded-full px-4 py-1.5 hover:bg-coffee-50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Comprar
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
