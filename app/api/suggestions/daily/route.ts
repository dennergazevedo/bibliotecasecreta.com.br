import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { openai } from "@/app/shared/openai"
import { resolveBook } from "@/app/shared/resolveBook"
import { type Book } from "@/app/shared/types"

type AISuggestion = {
  title: string
  author: string
  genre?: string
  description?: string
  published_date?: string
}

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  type SuggRow = { book_id: string; created_at: string }

  // Return today's suggestions if they already exist
  const todaySugg = (await sql`
    SELECT s.book_id, s.created_at
    FROM user_suggestions s
    WHERE s.user_id = ${user.userId}
      AND s.type = 'daily'
      AND s.created_at >= CURRENT_DATE
      AND s.created_at < CURRENT_DATE + INTERVAL '1 day'
    ORDER BY s.created_at ASC
    LIMIT 3
  `) as SuggRow[]

  if (todaySugg.length >= 3) {
    const ids = todaySugg.map((r) => r.book_id)
    const books = (await sql`
      SELECT id, title, author, genre, published_date, page_count, description,
             image_url, affiliated_link, foreign_id, is_google_books, active
      FROM books WHERE id = ANY(${ids}::uuid[])
    `) as Book[]
    const ordered = ids.map((id) => books.find((b) => b.id === id)).filter(Boolean) as Book[]
    return NextResponse.json({ books: ordered })
  }

  // Get user context
  type FavRow = { title: string; author: string | null }
  const favBooks = (await sql`
    SELECT b.title, b.author
    FROM user_read_books urb
    JOIN books b ON b.id = urb.book_id
    WHERE urb.user_id = ${user.userId} AND urb.is_favorite = true
    LIMIT 20
  `) as FavRow[]

  type ThemeRow = { theme: string }
  const themes = (await sql`
    SELECT theme FROM user_themes WHERE user_id = ${user.userId}
  `) as ThemeRow[]

  type PrevRow = { title: string }
  const prevSuggestions = (await sql`
    SELECT b.title
    FROM user_suggestions s
    JOIN books b ON b.id = s.book_id
    WHERE s.user_id = ${user.userId} AND s.type = 'daily'
    ORDER BY s.created_at DESC
    LIMIT 60
  `) as PrevRow[]

  // Purge oldest if >= 21
  type CountRow = { count: string }
  const countRes = (await sql`
    SELECT COUNT(*)::text as count FROM user_suggestions
    WHERE user_id = ${user.userId} AND type = 'daily'
  `) as CountRow[]
  const total = parseInt(countRes[0]?.count ?? "0", 10)
  if (total >= 21) {
    await sql`
      DELETE FROM user_suggestions
      WHERE id IN (
        SELECT id FROM user_suggestions
        WHERE user_id = ${user.userId} AND type = 'daily'
        ORDER BY created_at ASC
        LIMIT 3
      )
    `
  }

  const favList = favBooks.map((b) => `${b.title}${b.author ? ` - ${b.author}` : ""}`).join(", ") || "Nenhum"
  const genreList = themes.map((t) => t.theme).join(", ") || "Nenhum"
  const prevList = prevSuggestions.map((p) => p.title).join(", ") || "Nenhum"

  const prompt = `Você é um sistema de recomendação literária. Sugira 3 livros para o usuário.

Livros favoritos do usuário: ${favList}
Gêneros favoritos: ${genreList}
Sugestões anteriores (NÃO repita): ${prevList}

Retorne APENAS um array JSON com exatamente 3 objetos, sem texto adicional:
[
  {
    "title": "Título do Livro",
    "author": "Nome do Autor",
    "genre": "Gênero",
    "description": "Breve descrição em português",
    "published_date": "AAAA"
  }
]`

  let suggestions: AISuggestion[] = []
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 800
    })
    const raw = completion.choices[0]?.message?.content ?? "{}"
    const parsed = JSON.parse(raw) as { books?: AISuggestion[] } | AISuggestion[]
    suggestions = Array.isArray(parsed) ? parsed : (parsed as { books?: AISuggestion[] }).books ?? []
  } catch {
    return NextResponse.json({ books: [] })
  }

  const books: Book[] = []
  for (const s of suggestions.slice(0, 3)) {
    if (!s.title) continue
    const book = await resolveBook(s.title, s.author ?? null)
    await sql`
      INSERT INTO user_suggestions (user_id, book_id, type)
      VALUES (${user.userId}, ${book.id}, 'daily')
    `
    books.push(book)
  }

  return NextResponse.json({ books })
}
