export interface Book {
  id: string
  title: string
  author: string | null
  genre: string | null
  published_date: string | null
  page_count: number | null
  description: string | null
  image_url: string | null
  affiliated_link: string | null
  foreign_id: string | null
  is_google_books: boolean
  active: boolean
}
