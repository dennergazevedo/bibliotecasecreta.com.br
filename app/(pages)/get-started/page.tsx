import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { sql } from "@/app/shared/db"
import { GetStartedTemplate } from "@/components/templates/GetStartedTemplate"

export const metadata = { title: "Primeiros passos — Biblioteca Secreta" }

export default async function GetStartedPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null

  if (!user) redirect("/auth")

  type Row = { get_started_completed: boolean }
  const rows = (await sql`
    SELECT get_started_completed FROM users WHERE id = ${user.userId} LIMIT 1
  `) as Row[]

  if (rows[0]?.get_started_completed) redirect("/dashboard")

  return <GetStartedTemplate />
}
