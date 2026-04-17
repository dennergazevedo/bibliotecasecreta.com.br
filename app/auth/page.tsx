import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken, COOKIE_NAME } from "@/app/shared/auth"
import { AuthTemplate } from "@/components/templates/AuthTemplate"

export const metadata = {
  title: "Entrar — Biblioteca Secreta",
  description: "Acesse sua conta ou crie uma nova na Biblioteca Secreta."
}

export default async function AuthPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  if (session) {
    const user = await verifyToken(session)
    if (user) redirect("/dashboard")
  }

  return <AuthTemplate />
}
