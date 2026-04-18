"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, User, MessageSquare, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { DashboardNav } from "@/components/organisms/DashboardNav"
import { Footer } from "@/components/organisms/Footer"
import { type PostDetail } from "@/app/api/community/posts/[id]/route"
import { type Comment } from "@/app/api/community/posts/[id]/comments/route"

interface PostDetailTemplateProps {
  userName: string
  post: PostDetail
  initialComments: Comment[]
  initialTotal: number
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric"
  })
}

const COMMENT_PAGE_SIZE = 5

export function PostDetailTemplate({
  userName, post, initialComments, initialTotal
}: PostDetailTemplateProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [total, setTotal] = useState(initialTotal)
  const [loadingMore, setLoadingMore] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const loadMore = useCallback(async () => {
    setLoadingMore(true)
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments?offset=${comments.length}&limit=${COMMENT_PAGE_SIZE}`)
      const data = (await res.json()) as { comments: Comment[]; total: number }
      setComments((prev) => [...prev, ...(data.comments ?? [])])
      setTotal(data.total)
    } finally { setLoadingMore(false) }
  }, [post.id, comments.length])

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() })
      })
      const data = (await res.json()) as { comment: Comment }
      if (res.ok && data.comment) {
        setComments((prev) => [...prev, data.comment])
        setTotal((t) => t + 1)
        setNewComment("")
      }
    } finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col">
      <DashboardNav userName={userName} />
      <main className="flex-1 container mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div>
          <Link href="/comunidade" className="inline-flex items-center gap-1.5 text-sm text-coffee-500 hover:text-coffee-800 transition-colors mb-5">
            <ArrowLeft className="w-4 h-4" />Voltar para a comunidade
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-coffee-900 leading-snug">{post.title}</h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-coffee-500">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{post.user_name}</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Post content */}
        <div className="rounded-2xl bg-white border border-coffee-200 p-6">
          <div className="prose prose-sm max-w-none text-coffee-800 prose-headings:font-heading prose-headings:text-coffee-900 prose-a:text-coffee-700 prose-strong:text-coffee-900 prose-code:bg-coffee-100 prose-code:px-1 prose-code:rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ img: () => null }}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Comments */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-coffee-600" />
            <h2 className="font-heading text-lg font-bold text-coffee-900">
              {total} comentário{total !== 1 ? "s" : ""}
            </h2>
          </div>

          {comments.map((c) => (
            <div key={c.id} className="flex flex-col gap-2 rounded-xl bg-white border border-coffee-200 px-5 py-4">
              <div className="flex items-center gap-2 text-xs text-coffee-500">
                <span className="font-semibold text-coffee-800">{c.user_name}</span>
                <span>·</span>
                <span>{formatDate(c.created_at)}</span>
              </div>
              <p className="text-sm text-coffee-800 leading-relaxed">{c.content}</p>
            </div>
          ))}

          {comments.length < total && (
            <button type="button" onClick={loadMore} disabled={loadingMore}
              className="self-start flex items-center gap-2 text-sm text-coffee-600 font-medium hover:text-coffee-900 underline underline-offset-2 disabled:opacity-50 cursor-pointer">
              {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
              Mostrar mais comentários
            </button>
          )}

          {/* Add comment */}
          <form onSubmit={submitComment} className="flex flex-col gap-3 mt-2">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 text-sm resize-none" />
            <div className="flex justify-end">
              <button type="submit" disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-coffee-800 text-coffee-50 text-sm font-medium hover:bg-coffee-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Comentar
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}
