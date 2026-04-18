import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"

export type PostDetail = {
  id: string
  title: string
  content: string
  user_id: string
  user_name: string
  created_at: string
  updated_at: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })

  const { id } = await params

  const rows = (await sql`
    SELECT p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at,
           u.name as user_name
    FROM community_posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.id = ${id}
    LIMIT 1
  `) as PostDetail[]

  if (!rows[0]) return NextResponse.json({ error: "Post não encontrado." }, { status: 404 })
  return NextResponse.json({ post: rows[0] })
}
