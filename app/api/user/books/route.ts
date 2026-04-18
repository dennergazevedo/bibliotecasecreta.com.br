import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { type Book } from "@/app/shared/types"

export type UserBook = Book & { is_favorite: boolean }

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const offset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10)
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "12", 10)

  const books = (await sql`
    SELECT b.id, b.title, b.author, b.genre, b.published_date, b.page_count,
           b.description, b.image_url, b.affiliated_link, b.foreign_id,
           b.is_google_books, b.active, urb.is_favorite
    FROM user_read_books urb
    JOIN books b ON b.id = urb.book_id
    WHERE urb.user_id = ${user.userId}
    ORDER BY urb.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `) as UserBook[]

  type CountRow = { count: string }
  const countRes = (await sql`
    SELECT COUNT(*)::text as count FROM user_read_books WHERE user_id = ${user.userId}
  `) as CountRow[]
  const total = parseInt(countRes[0]?.count ?? "0", 10)

  return NextResponse.json({ books, total })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { bookId } = (await request.json()) as { bookId: string }
  if (!bookId) return NextResponse.json({ error: "bookId obrigatório." }, { status: 400 })

  await sql`
    INSERT INTO user_read_books (user_id, book_id)
    VALUES (${user.userId}, ${bookId})
    ON CONFLICT (user_id, book_id) DO NOTHING
  `
  return NextResponse.json({ success: true })
}
