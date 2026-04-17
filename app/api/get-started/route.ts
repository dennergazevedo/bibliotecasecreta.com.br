import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      themes: string[]
      readBookIds: string[]
      favoriteBookIds: string[]
    }

    const { themes = [], readBookIds = [], favoriteBookIds = [] } = body
    const favoriteSet = new Set(favoriteBookIds)

    if (themes.length > 0) {
      for (const theme of themes) {
        await sql`
          INSERT INTO user_themes (user_id, theme)
          VALUES (${user.userId}, ${theme})
          ON CONFLICT (user_id, theme) DO NOTHING
        `
      }
    }

    if (readBookIds.length > 0) {
      for (const bookId of readBookIds) {
        const isFavorite = favoriteSet.has(bookId)
        await sql`
          INSERT INTO user_read_books (user_id, book_id, is_favorite)
          VALUES (${user.userId}, ${bookId}, ${isFavorite})
          ON CONFLICT (user_id, book_id) DO UPDATE SET is_favorite = EXCLUDED.is_favorite
        `
      }
    }

    await sql`
      UPDATE users SET get_started_completed = true, updated_at = now()
      WHERE id = ${user.userId}
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Get-started error:", err)
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    )
  }
}
