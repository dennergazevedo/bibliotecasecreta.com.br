import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { signToken, COOKIE_NAME } from "@/app/shared/auth"
import { hashPassword } from "@/app/shared/password"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      )
    }

    const existing =
      await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Este e-mail já está em uso." },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    type UserRow = { id: string; email: string }
    const inserted = (await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${passwordHash})
      RETURNING id, email
    `) as UserRow[]
    const [user] = inserted

    const token = await signToken({ userId: user.id, email: user.email })
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    })

    return NextResponse.json({ success: true, getStartedCompleted: false })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    )
  }
}
