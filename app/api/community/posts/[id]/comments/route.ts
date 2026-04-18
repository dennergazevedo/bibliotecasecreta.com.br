import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"

export type Comment = {
  id: string
  content: string
  user_name: string
  created_at: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  const offset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10)
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "5", 10)

  const comments = (await sql`
    SELECT c.id, c.content, c.created_at, u.name as user_name
    FROM community_comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = ${id}
    ORDER BY c.created_at ASC
    LIMIT ${limit} OFFSET ${offset}
  `) as Comment[]

  type CountRow = { count: string }
  const countRes = (await sql`
    SELECT COUNT(*)::text as count FROM community_comments WHERE post_id = ${id}
  `) as CountRow[]
  const total = parseInt(countRes[0]?.count ?? "0", 10)

  return NextResponse.json({ comments, total })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params
  const { content } = (await request.json()) as { content: string }
  if (!content?.trim()) return NextResponse.json({ error: "Comentário vazio." }, { status: 400 })

  type CommentRow = { id: string; content: string; created_at: string }
  const rows = (await sql`
    INSERT INTO community_comments (post_id, user_id, content)
    VALUES (${id}, ${user.userId}, ${content.trim()})
    RETURNING id, content, created_at
  `) as CommentRow[]

  type UserRow = { name: string }
  const uRows = (await sql`SELECT name FROM users WHERE id = ${user.userId} LIMIT 1`) as UserRow[]

  const comment: Comment = {
    id: rows[0].id,
    content: rows[0].content,
    created_at: rows[0].created_at,
    user_name: uRows[0]?.name ?? "Usuário"
  }

  return NextResponse.json({ comment }, { status: 201 })
}
