import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { sql } from "@/app/shared/db"
import { DashboardTemplate } from "@/components/templates/DashboardTemplate"

export const metadata = {
  title: "Minha Biblioteca — Biblioteca Secreta"
}

export default async function Dashboard() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) redirect("/auth")

  type UserRow = { name: string }
  const rows = (await sql`
    SELECT name FROM users WHERE id = ${user.userId} LIMIT 1
  `) as UserRow[]
  const userName = rows[0]?.name ?? "Leitor"

  return <DashboardTemplate userName={userName} />
}
