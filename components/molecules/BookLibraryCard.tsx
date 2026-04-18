"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ExternalLink } from "lucide-react"
import { BookCoverPlaceholder } from "@/components/atoms/BookCoverPlaceholder"
import { BookDetailModal } from "@/components/atoms/BookDetailModal"
import { type Book } from "@/app/shared/types"

interface BookLibraryCardProps {
  book: Book
  isFavorite: boolean
  onFavoriteToggle: (bookId: string, newValue: boolean) => void
}

export function BookLibraryCard({
  book,
  isFavorite,
  onFavoriteToggle
}: BookLibraryCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [toggling, setToggling] = useState(false)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (toggling) return
    setToggling(true)
    try {
      const res = await fetch(`/api/user/books/${book.id}/favorite`, { method: "PATCH" })
      const data = (await res.json()) as { is_favorite: boolean }
      onFavoriteToggle(book.id, data.is_favorite)
    } finally {
      setToggling(false)
    }
  }

  return (
    <>
      <div
        className="relative flex flex-col rounded-2xl border border-coffee-200 bg-white overflow-hidden cursor-pointer hover:border-coffee-400 hover:shadow-sm transition-all duration-150 group"
        onClick={() => setModalOpen(true)}
      >
        {/* Cover */}
        <div className="relative w-full aspect-[2/3] overflow-hidden bg-coffee-100">
          {book.image_url ? (
            <Image
              src={book.image_url}
              alt={book.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <BookCoverPlaceholder className="w-full h-full" />
          )}

          {/* Heart button */}
          <button
            type="button"
            onClick={handleFavorite}
            disabled={toggling}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-50 cursor-pointer"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-coffee-400"
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1 flex-1">
          <p className="text-sm font-semibold text-coffee-900 line-clamp-2 leading-snug font-heading">
            {book.title}
          </p>
          {book.author && (
            <p className="text-xs text-coffee-500 line-clamp-1">{book.author}</p>
          )}
          {book.affiliated_link && (
            <a
              href={book.affiliated_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-auto inline-flex items-center gap-1 text-[10px] font-medium text-coffee-500 hover:text-coffee-800 transition-colors w-fit"
            >
              <ExternalLink className="w-3 h-3" />
              Comprar
            </a>
          )}
        </div>
      </div>

      <BookDetailModal book={modalOpen ? book : null} onClose={() => setModalOpen(false)} />
    </>
  )
}
