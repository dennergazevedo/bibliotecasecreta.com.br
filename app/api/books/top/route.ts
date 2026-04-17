import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { type Book } from "@/app/shared/types"

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const books = (await sql`
    SELECT b.id, b.title, b.author, b.genre, b.published_date, b.page_count,
           b.description, b.image_url, b.affiliated_link, b.foreign_id,
           b.is_google_books, b.active,
           COUNT(urb.id) as read_count
    FROM books b
    JOIN user_read_books urb ON urb.book_id = b.id
    WHERE b.active = true
    GROUP BY b.id
    ORDER BY read_count DESC, b.created_at ASC
    LIMIT 5
  `) as (Book & { read_count: string })[]

  return NextResponse.json({ books })
}
