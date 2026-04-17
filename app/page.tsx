import { cookies } from "next/headers"
import { verifyToken, COOKIE_NAME } from "@/app/shared/auth"
import { HomeTemplate } from "@/components/templates/HomeTemplate"

export default async function Home() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const isAuthenticated = session ? !!(await verifyToken(session)) : false

  return <HomeTemplate isAuthenticated={isAuthenticated} />
}
