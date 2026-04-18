import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { bookId } = await params

  type Row = { is_favorite: boolean }
  const rows = (await sql`
    UPDATE user_read_books
    SET is_favorite = NOT is_favorite
    WHERE user_id = ${user.userId} AND book_id = ${bookId}
    RETURNING is_favorite
  `) as Row[]

  return NextResponse.json({ is_favorite: rows[0]?.is_favorite ?? false })
}
