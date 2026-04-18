import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { sql } from "@/app/shared/db"
import { CommunityTemplate } from "@/components/templates/CommunityTemplate"

export const metadata = { title: "Comunidade — Biblioteca Secreta" }

export default async function CommunityPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) redirect("/auth")

  type UserRow = { name: string }
  const rows = (await sql`SELECT name FROM users WHERE id = ${user.userId} LIMIT 1`) as UserRow[]
  const userName = rows[0]?.name ?? "Leitor"

  return <CommunityTemplate userName={userName} />
}
