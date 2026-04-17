import { SignJWT, jwtVerify } from "jose"

export const COOKIE_NAME = "bs_session"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export interface SessionPayload {
  userId: string
  email: string
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function getSessionUser(
  cookieValue: string | undefined
): Promise<SessionPayload | null> {
  if (!cookieValue) return null
  return verifyToken(cookieValue)
}
