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

  type TodayRow = { book_id: string; mood: string }
  const rows = (await sql`
    SELECT book_id, mood FROM user_suggestions
    WHERE user_id = ${user.userId}
      AND type = 'mood'
      AND created_at >= date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE 'America/Sao_Paulo'
      AND created_at < (date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo') + INTERVAL '1 day') AT TIME ZONE 'America/Sao_Paulo'
    ORDER BY created_at DESC
    LIMIT 1
  `) as TodayRow[]

  if (!rows[0]) return NextResponse.json({ book: null, mood: null })

  const books = (await sql`
    SELECT id, title, author, genre, published_date, page_count, description,
           image_url, affiliated_link, foreign_id, is_google_books, active
    FROM books WHERE id = ${rows[0].book_id} LIMIT 1
  `) as Book[]

  return NextResponse.json({ book: books[0] ?? null, mood: rows[0].mood })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const { mood } = (await request.json()) as { mood: string }
  if (!mood?.trim()) {
    return NextResponse.json({ error: "Mood obrigatório." }, { status: 400 })
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
    WHERE s.user_id = ${user.userId} AND s.type = 'mood'
    ORDER BY s.created_at DESC
    LIMIT 20
  `) as PrevRow[]

  // Purge oldest if >= 7
  type CountRow = { count: string }
  const countRes = (await sql`
    SELECT COUNT(*)::text as count FROM user_suggestions
    WHERE user_id = ${user.userId} AND type = 'mood'
  `) as CountRow[]
  const total = parseInt(countRes[0]?.count ?? "0", 10)
  if (total >= 7) {
    await sql`
      DELETE FROM user_suggestions
      WHERE id IN (
        SELECT id FROM user_suggestions
        WHERE user_id = ${user.userId} AND type = 'mood'
        ORDER BY created_at ASC
        LIMIT 1
      )
    `
  }

  const favList = favBooks.map((b) => `${b.title}${b.author ? ` - ${b.author}` : ""}`).join(", ") || "Nenhum"
  const genreList = themes.map((t) => t.theme).join(", ") || "Nenhum"
  const prevList = prevSuggestions.map((p) => p.title).join(", ") || "Nenhum"

  const prompt = `Você é um sistema de recomendação literária. Sugira 1 livro para o usuário com base no mood dele.

Mood do usuário: ${mood}
Livros favoritos do usuário: ${favList}
Gêneros favoritos: ${genreList}
Sugestões anteriores (NÃO repita): ${prevList}

Retorne APENAS um objeto JSON, sem texto adicional:
{
  "title": "Título do Livro",
  "author": "Nome do Autor",
  "genre": "Gênero",
  "description": "Breve descrição em português que conecta o livro com o mood",
  "published_date": "AAAA"
}`

  let suggestion: AISuggestion | null = null
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 400
    })
    const raw = completion.choices[0]?.message?.content ?? "{}"
    suggestion = JSON.parse(raw) as AISuggestion
  } catch {
    return NextResponse.json({ error: "Erro ao gerar sugestão." }, { status: 500 })
  }

  if (!suggestion?.title) {
    return NextResponse.json({ error: "Sugestão inválida." }, { status: 500 })
  }

  const book = await resolveBook(suggestion.title, suggestion.author ?? null, {
    genre: suggestion.genre,
    description: suggestion.description,
    published_date: suggestion.published_date,
  })
  await sql`
    INSERT INTO user_suggestions (user_id, book_id, type, mood)
    VALUES (${user.userId}, ${book.id}, 'mood', ${mood})
  `

  return NextResponse.json({ book })
}
