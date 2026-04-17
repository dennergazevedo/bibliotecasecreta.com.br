import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"

type BookRow = {
  id: string
  title: string
  author: string | null
  genre: string | null
  published_date: string | null
  page_count: number | null
  description: string | null
  image_url: string | null
  affiliated_link: string | null
  foreign_id: string | null
  is_google_books: boolean
  active: boolean
}

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

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const q = request.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ books: [] })
  }

  const dbBooks = (await sql`
    SELECT id, title, author, genre, published_date, page_count, description,
           image_url, affiliated_link, foreign_id, is_google_books, active
    FROM books
    WHERE (title ILIKE ${"%" + q + "%"} OR author ILIKE ${"%" + q + "%"}) AND active = true
    LIMIT 10
  `) as BookRow[]

  if (dbBooks.length >= 3) {
    return NextResponse.json({ books: dbBooks })
  }

  const apiKey = process.env.GOOGLE_CLOUD_BOOK_API_KEY
  const googleRes = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10&key=${apiKey}`
  )

  if (!googleRes.ok) {
    return NextResponse.json({ books: dbBooks })
  }

  const googleData = (await googleRes.json()) as {
    items?: GoogleBooksVolume[]
  }
  const items: GoogleBooksVolume[] = googleData.items ?? []

  const existingForeignIds = new Set(
    dbBooks.map((b) => b.foreign_id).filter(Boolean)
  )

  const upserted: BookRow[] = []
  for (const item of items) {
    if (existingForeignIds.has(item.id)) continue

    const info = item.volumeInfo
    const title = info.title ?? "Sem título"
    const author = info.authors?.join(", ") ?? null
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
    `) as BookRow[]

    if (rows[0]) upserted.push(rows[0])
  }

  const merged = [
    ...dbBooks,
    ...upserted.filter((u) => !dbBooks.some((d) => d.id === u.id))
  ]

  return NextResponse.json({ books: merged })
}
