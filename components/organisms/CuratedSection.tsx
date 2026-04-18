import { BookMarked } from "lucide-react"
import { BookSuggestionCard } from "@/components/molecules/BookSuggestionCard"
import { type Book } from "@/app/shared/types"

const CURATED_BOOKS: Omit<Book, "affiliated_link" | "foreign_id" | "is_google_books" | "active">[] = [
  {
    id: "curated-1",
    title: "O Alquimista",
    author: "Paulo Coelho",
    genre: "Ficção",
    published_date: "1988",
    page_count: 208,
    description: "Um jovem pastor andaluz parte em busca de um tesouro e descobre o verdadeiro significado da vida.",
    image_url: "https://res.cloudinary.com/du0gxai9y/image/upload/v1776532314/alquimista_jypkas.jpg"
  },
  {
    id: "curated-2",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    genre: "Realismo Mágico",
    published_date: "1967",
    page_count: 448,
    description: "A saga da família Buendía ao longo de sete gerações na mítica cidade de Macondo.",
    image_url: "https://res.cloudinary.com/du0gxai9y/image/upload/v1776532314/cem_anos_yfgitk.jpg"
  },
  {
    id: "curated-3",
    title: "1984",
    author: "George Orwell",
    genre: "Ficção Científica",
    published_date: "1949",
    page_count: 328,
    description: "Uma distopia sombria sobre vigilância, controle e a resistência do espírito humano.",
    image_url: "https://res.cloudinary.com/du0gxai9y/image/upload/v1776532314/1984_sytt20.jpg"
  },
  {
    id: "curated-4",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Romance",
    published_date: "1899",
    page_count: 256,
    description: "Um dos maiores clássicos da literatura brasileira, sobre amor, ciúme e memória.",
    image_url: "https://res.cloudinary.com/du0gxai9y/image/upload/v1776532313/dom_casmurro_ljxntb.webp"
  },
  {
    id: "curated-5",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    genre: "Fantasia",
    published_date: "1943",
    page_count: 96,
    description: "Um conto poético sobre amizade, amor e o que os olhos não conseguem ver.",
    image_url: "https://res.cloudinary.com/du0gxai9y/image/upload/v1776532314/pequeno_principe_dchd1e.jpg"
  }
]

export function CuratedSection() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BookMarked className="w-4 h-4 text-coffee-600" />
        <h2 className="font-heading text-xl font-bold text-coffee-900">
          Sugestões de leitura
        </h2>
      </div>
      <p className="text-sm text-coffee-500 -mt-2">
        Selecionados pela equipe da Biblioteca Secreta
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CURATED_BOOKS.map((book) => (
          <BookSuggestionCard
            key={book.id}
            book={book as Book}
            description={book.description ?? undefined}
          />
        ))}
      </div>
    </section>
  )
}
