import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { sql } from "@/app/shared/db"
import { NewPostTemplate } from "@/components/templates/NewPostTemplate"

export const metadata = { title: "Novo Post — Biblioteca Secreta" }

export default async function NewPostPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) redirect("/auth")

  type UserRow = { name: string }
  const rows = (await sql`SELECT name FROM users WHERE id = ${user.userId} LIMIT 1`) as UserRow[]
  const userName = rows[0]?.name ?? "Leitor"

  return <NewPostTemplate userName={userName} />
}
