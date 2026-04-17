import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/app/shared/db"
import { getSessionUser, COOKIE_NAME } from "@/app/shared/auth"
import { cloudinary } from "@/app/shared/cloudinary"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const user = session ? await getSessionUser(session) : null
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const title = (formData.get("title") as string | null)?.trim()
    if (!title) {
      return NextResponse.json({ error: "Título obrigatório." }, { status: 400 })
    }

    const author = (formData.get("author") as string | null)?.trim() ?? null
    const genre = (formData.get("genre") as string | null)?.trim() ?? null
    const published_date =
      (formData.get("published_date") as string | null)?.trim() ?? null
    const page_count_raw = formData.get("page_count") as string | null
    const page_count = page_count_raw ? parseInt(page_count_raw, 10) : null
    const description =
      (formData.get("description") as string | null)?.trim() ?? null

    let image_url: string | null = null
    const imageFile = formData.get("image") as File | null
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "bibliotecasecreta/books" }, (err, res) => {
              if (err || !res) reject(err)
              else resolve(res as { secure_url: string })
            })
            .end(buffer)
        }
      )
      image_url = uploadResult.secure_url
    }

    type BookRow = {
      id: string
      title: string
      author: string | null
      genre: string | null
      published_date: string | null
      page_count: number | null
      description: string | null
      image_url: string | null
      active: boolean
    }

    const rows = (await sql`
      INSERT INTO books (title, author, genre, published_date, page_count, description, image_url, active, is_google_books)
      VALUES (${title}, ${author}, ${genre}, ${published_date}, ${page_count}, ${description}, ${image_url}, false, false)
      RETURNING id, title, author, genre, published_date, page_count, description, image_url, active
    `) as BookRow[]

    return NextResponse.json({ book: rows[0] }, { status: 201 })
  } catch (err) {
    console.error("Create book error:", err)
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    )
  }
}
