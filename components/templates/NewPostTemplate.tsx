"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { DashboardNav } from "@/components/organisms/DashboardNav"
import { MarkdownEditor } from "@/components/molecules/MarkdownEditor"
import { Footer } from "@/components/organisms/Footer"

interface NewPostTemplateProps {
  userName: string
}

export function NewPostTemplate({ userName }: NewPostTemplateProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError("Título e conteúdo são obrigatórios."); return }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content })
      })
      const data = (await res.json()) as { postId?: string; error?: string }
      if (!res.ok) { setError(data.error ?? "Erro ao publicar."); return }
      router.push(`/comunidade/${data.postId}`)
    } finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col">
      <DashboardNav userName={userName} />
      <main className="flex-1 container mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link href="/comunidade" className="inline-flex items-center gap-1.5 text-sm text-coffee-500 hover:text-coffee-800 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />Voltar
          </Link>
          <h1 className="font-heading text-2xl font-bold text-coffee-900">Novo post</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-semibold text-coffee-600 mb-1.5 tracking-wider uppercase">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Sobre o que você quer falar?"
              className="w-full px-4 py-3 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 text-sm" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-coffee-600 mb-1.5 tracking-wider uppercase">Conteúdo</label>
            <MarkdownEditor value={content} onChange={setContent} placeholder="Escreva seu post aqui. Markdown suportado." minRows={12} />
            <p className="text-xs text-coffee-400 mt-1.5">Imagens não são permitidas neste editor.</p>
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={submitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-coffee-800 text-coffee-50 text-sm font-medium hover:bg-coffee-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Publicar
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
