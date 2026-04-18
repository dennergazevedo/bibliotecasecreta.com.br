import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"

export type PostSummary = {
  id: string
  title: string
  content: string
  user_name: string
  created_at: string
  comment_count: number
}

function stripImages(content: string): string {
  return content.replace(/!\[([^\]]*)\]\([^)]*\)/g, "").trim()
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const offset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10)
  const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "12", 10)
  const search = request.nextUrl.searchParams.get("search")?.trim() ?? ""

  const posts = (await sql`
    SELECT p.id, p.title, p.content, p.created_at,
           u.name as user_name,
           COUNT(c.id)::int as comment_count
    FROM community_posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN community_comments c ON c.post_id = p.id
    WHERE ${search ? sql`p.title ILIKE ${"%" + search + "%"}` : sql`true`}
    GROUP BY p.id, u.name
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `) as PostSummary[]

  type CountRow = { count: string }
  const countRes = (await sql`
    SELECT COUNT(*)::text as count FROM community_posts
    WHERE ${search ? sql`title ILIKE ${"%" + search + "%"}` : sql`true`}
  `) as CountRow[]
  const total = parseInt(countRes[0]?.count ?? "0", 10)

  return NextResponse.json({ posts, total })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { title, content } = (await request.json()) as { title: string; content: string }
  if (!title?.trim()) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 })
  if (!content?.trim()) return NextResponse.json({ error: "Conteúdo obrigatório." }, { status: 400 })

  const cleanContent = stripImages(content)

  type PostRow = { id: string }
  const rows = (await sql`
    INSERT INTO community_posts (user_id, title, content)
    VALUES (${user.userId}, ${title.trim()}, ${cleanContent})
    RETURNING id
  `) as PostRow[]

  return NextResponse.json({ postId: rows[0]?.id }, { status: 201 })
}
