import { sql } from "@/app/shared/db"
import { type Book } from "@/app/shared/types"

type GoogleBooksVolume = {
  id: string
  volumeInfo: {
    title?: string
    authors?: string[]
    categories?: string[]
    publishedDate?: string
    pageCount?: number
    description?: string
    imageLinks?: { thumbnail?: string; smallThumbnail?: string }
  }
}

/**
 * Find best matching book or create it.
 * Priority: DB exact match → DB fuzzy match → Google Books upsert → create without cover.
 * Bidirectional ILIKE: catches "Harry Potter - Parte 2" when AI suggests "Harry Potter".
 */
export async function resolveBook(
  suggestedTitle: string,
  suggestedAuthor: string | null
): Promise<Book> {
  const like = "%" + suggestedTitle + "%"

  const dbRows = (await sql`
    SELECT id, title, author, genre, published_date, page_count, description,
           image_url, affiliated_link, foreign_id, is_google_books, active
    FROM books
    WHERE (title ILIKE ${like} OR ${suggestedTitle} ILIKE ('%' || title || '%'))
    AND active = true
    LIMIT 5
  `) as Book[]

  if (dbRows.length > 0) {
    const exact = dbRows.find(
      (r) => r.title.toLowerCase() === suggestedTitle.toLowerCase()
    )
    return exact ?? dbRows[0]
  }

  const apiKey = process.env.GOOGLE_CLOUD_BOOK_API_KEY
  const searchQ = suggestedAuthor
    ? `${suggestedTitle} ${suggestedAuthor}`
    : suggestedTitle

  try {
    const googleRes = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQ)}&maxResults=3&key=${apiKey}`
    )
    if (googleRes.ok) {
      const data = (await googleRes.json()) as { items?: GoogleBooksVolume[] }
      const item = data.items?.[0]
      if (item) {
        const info = item.volumeInfo
        const title = info.title ?? suggestedTitle
        const author = info.authors?.join(", ") ?? suggestedAuthor ?? null
        const genre = info.categories?.[0] ?? null
        const published_date = info.publishedDate ?? null
        const page_count = info.pageCount ?? null
        const description = info.description ?? null
        const image_url =
          info.imageLinks?.thumbnail?.replace("http://", "https://") ??
          info.imageLinks?.smallThumbnail?.replace("http://", "https://") ??
          null

        const rows = (await sql`
          INSERT INTO books (title, author, genre, published_date, page_count, description, image_url, foreign_id, is_google_books, active)
          VALUES (${title}, ${author}, ${genre}, ${published_date}, ${page_count}, ${description}, ${image_url}, ${item.id}, true, true)
          ON CONFLICT (foreign_id) DO UPDATE SET
            title = EXCLUDED.title,
            author = EXCLUDED.author,
            image_url = EXCLUDED.image_url,
            updated_at = now()
          RETURNING id, title, author, genre, published_date, page_count, description, image_url, affiliated_link, foreign_id, is_google_books, active
        `) as Book[]
        if (rows[0]) return rows[0]
      }
    }
  } catch {
    // fall through to manual create
  }

  const rows = (await sql`
    INSERT INTO books (title, author, active, is_google_books)
    VALUES (${suggestedTitle}, ${suggestedAuthor}, true, false)
    RETURNING id, title, author, genre, published_date, page_count, description, image_url, affiliated_link, foreign_id, is_google_books, active
  `) as Book[]
  return rows[0]
}
