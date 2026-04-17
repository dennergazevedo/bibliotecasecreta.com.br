import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { signToken, COOKIE_NAME } from "@/app/shared/auth"
import { comparePassword } from "@/app/shared/password"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      )
    }

    type UserRow = {
      id: string
      email: string
      password_hash: string
      get_started_completed: boolean
    }
    const rows = (await sql`
      SELECT id, email, password_hash, get_started_completed
      FROM users
      WHERE email = ${email.trim().toLowerCase()}
      LIMIT 1
    `) as UserRow[]
    const [user] = rows

    if (!user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      )
    }

    const isValid = await comparePassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      )
    }

    const token = await signToken({ userId: user.id, email: user.email })
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    })

    return NextResponse.json({
      success: true,
      getStartedCompleted: user.get_started_completed
    })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    )
  }
}
