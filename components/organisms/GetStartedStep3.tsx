"use client"

import { BookCard, type Book } from "@/components/atoms/BookCard"

interface GetStartedStep3Props {
  books: Book[]
  favoriteIds: string[]
  onFavoritesChange: (ids: string[]) => void
}

const MAX_FAVORITES = 5

export function GetStartedStep3({
  books,
  favoriteIds,
  onFavoritesChange
}: GetStartedStep3Props) {
  const toggle = (id: string) => {
    if (favoriteIds.includes(id)) {
      onFavoritesChange(favoriteIds.filter((f) => f !== id))
    } else if (favoriteIds.length < MAX_FAVORITES) {
      onFavoritesChange([...favoriteIds, id])
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-coffee-900 leading-tight">
          Quais são seus favoritos?
        </h2>
        <p className="mt-2 text-sm text-coffee-500">
          Selecione até {MAX_FAVORITES} livros que você mais amou.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-coffee-800">
          {favoriteIds.length}/{MAX_FAVORITES}
        </span>
        <span className="text-sm text-coffee-500">selecionados</span>
        {favoriteIds.length === MAX_FAVORITES && (
          <span className="text-xs text-coffee-400 ml-1">
            (máximo atingido)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {books.map((book) => {
          const selected = favoriteIds.includes(book.id)
          const disabled =
            !selected && favoriteIds.length >= MAX_FAVORITES
          return (
            <div
              key={book.id}
              className={disabled ? "opacity-40 pointer-events-none" : ""}
            >
              <BookCard
                book={book}
                selected={selected}
                onClick={() => toggle(book.id)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
