"use client"

import Image from "next/image"
import { Check, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Book } from "@/app/shared/types"

export type { Book }

interface BookCardProps {
  book: Book
  selected?: boolean
  onClick?: () => void
  compact?: boolean
}

export function BookCard({
  book,
  selected = false,
  onClick,
  compact = false
}: BookCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex gap-3 rounded-xl border p-3 text-left transition-all duration-150 w-full cursor-pointer",
        selected
          ? "border-coffee-800 bg-coffee-50 ring-2 ring-coffee-800/20"
          : "border-coffee-200 bg-white hover:border-coffee-400"
      )}
    >
      <div className="shrink-0 w-12 h-16 rounded-md overflow-hidden bg-coffee-100 flex items-center justify-center">
        {book.image_url ? (
          <Image
            src={book.image_url}
            alt={book.title}
            width={48}
            height={64}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <BookOpen className="w-5 h-5 text-coffee-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-coffee-900 line-clamp-2 leading-snug">
          {book.title}
        </p>
        {book.author && (
          <p className="text-xs text-coffee-500 mt-0.5 line-clamp-1">
            {book.author}
          </p>
        )}
        {!compact && book.genre && (
          <p className="text-xs text-coffee-400 mt-1">{book.genre}</p>
        )}
      </div>

      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-coffee-800 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
    </button>
  )
}
