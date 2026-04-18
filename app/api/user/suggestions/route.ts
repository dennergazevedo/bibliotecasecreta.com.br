import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { type Book } from "@/app/shared/types"

export type SuggestionWithBook = {
  id: string
  type: string
  mood: string | null
  created_at: string
  book: Book
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const offset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10)
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "12", 10)

  type Row = {
    sugg_id: string
    type: string
    mood: string | null
    sugg_created_at: string
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

  const rows = (await sql`
    SELECT s.id as sugg_id, s.type, s.mood, s.created_at as sugg_created_at,
           b.id, b.title, b.author, b.genre, b.published_date, b.page_count,
           b.description, b.image_url, b.affiliated_link, b.foreign_id,
           b.is_google_books, b.active
    FROM user_suggestions s
    JOIN books b ON b.id = s.book_id
    WHERE s.user_id = ${user.userId}
    ORDER BY s.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `) as Row[]

  type CountRow = { count: string }
  const countRes = (await sql`
    SELECT COUNT(*)::text as count FROM user_suggestions WHERE user_id = ${user.userId}
  `) as CountRow[]
  const total = parseInt(countRes[0]?.count ?? "0", 10)

  const suggestions: SuggestionWithBook[] = rows.map((r) => ({
    id: r.sugg_id,
    type: r.type,
    mood: r.mood,
    created_at: r.sugg_created_at,
    book: {
      id: r.id,
      title: r.title,
      author: r.author,
      genre: r.genre,
      published_date: r.published_date,
      page_count: r.page_count,
      description: r.description,
      image_url: r.image_url,
      affiliated_link: r.affiliated_link,
      foreign_id: r.foreign_id,
      is_google_books: r.is_google_books,
      active: r.active
    }
  }))

  return NextResponse.json({ suggestions, total })
}
