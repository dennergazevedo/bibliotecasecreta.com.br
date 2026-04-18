import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { COOKIE_NAME } from "@/app/shared/auth"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return NextResponse.redirect(new URL("/", request.url))
}
