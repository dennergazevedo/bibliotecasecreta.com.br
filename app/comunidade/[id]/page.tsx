import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { sql } from "@/app/shared/db"
import { PostDetailTemplate } from "@/components/templates/PostDetailTemplate"
import { type PostDetail } from "@/app/api/community/posts/[id]/route"
import { type Comment } from "@/app/api/community/posts/[id]/comments/route"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) redirect("/auth")

  const { id } = await params

  type UserRow = { name: string }
  const userRows = (await sql`SELECT name FROM users WHERE id = ${user.userId} LIMIT 1`) as UserRow[]
  const postRows = (await sql`
    SELECT p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at, u.name as user_name
    FROM community_posts p JOIN users u ON u.id = p.user_id
    WHERE p.id = ${id} LIMIT 1
  `) as PostDetail[]

  if (!postRows[0]) notFound()

  const commentRows = (await sql`
    SELECT c.id, c.content, c.created_at, u.name as user_name
    FROM community_comments c JOIN users u ON u.id = c.user_id
    WHERE c.post_id = ${id} ORDER BY c.created_at ASC LIMIT 5
  `) as Comment[]

  type CountRow = { count: string }
  const countRows = (await sql`
    SELECT COUNT(*)::text as count FROM community_comments WHERE post_id = ${id}
  `) as CountRow[]

  const userName = userRows[0]?.name ?? "Leitor"
  const total = parseInt(countRows[0]?.count ?? "0", 10)

  return (
    <PostDetailTemplate
      userName={userName}
      post={postRows[0]}
      initialComments={commentRows}
      initialTotal={total}
    />
  )
}
