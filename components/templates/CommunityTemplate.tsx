"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Search, X, Loader2, PenLine } from "lucide-react"
import { DashboardNav } from "@/components/organisms/DashboardNav"
import { PostCard, type PostSummaryItem } from "@/components/molecules/PostCard"
import { Footer } from "@/components/organisms/Footer"

interface CommunityTemplateProps {
  userName: string
}

const PAGE_SIZE = 12

export function CommunityTemplate({ userName }: CommunityTemplateProps) {
  const [posts, setPosts] = useState<PostSummaryItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [search, setSearch] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchPosts = useCallback(async (offset: number, q: string, append: boolean) => {
    if (offset === 0) setLoading(true); else setLoadingMore(true)
    try {
      const params = new URLSearchParams({ offset: String(offset), limit: String(PAGE_SIZE) })
      if (q) params.set("search", q)
      const res = await fetch(`/api/community/posts?${params}`)
      const data = (await res.json()) as { posts: PostSummaryItem[]; total: number }
      setPosts((prev) => append ? [...prev, ...(data.posts ?? [])] : (data.posts ?? []))
      setTotal(data.total)
    } finally { setLoading(false); setLoadingMore(false) }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setActiveSearch(search)
      fetchPosts(0, search, false)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, fetchPosts])

  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col">
      <DashboardNav userName={userName} />
      <main className="flex-1 container max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-coffee-900">Comunidade</h1>
            <p className="text-sm text-coffee-500 mt-1">Converse com outros leitores</p>
          </div>
          <Link href="/comunidade/novo"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-coffee-800 text-coffee-50 text-sm font-medium hover:bg-coffee-900 transition-colors cursor-pointer">
            <PenLine className="w-4 h-4" />
            Criar post
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar post por título..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 text-sm" />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-coffee-100 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-coffee-400">
            <p className="text-sm">{activeSearch ? `Nenhum post encontrado para "${activeSearch}".` : "Nenhum post ainda. Seja o primeiro!"}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
            {posts.length < total && (
              <button type="button" onClick={() => fetchPosts(posts.length, activeSearch, true)} disabled={loadingMore}
                className="self-center flex items-center gap-2 px-6 py-2.5 rounded-full border border-coffee-300 text-sm font-medium text-coffee-700 hover:bg-coffee-100 disabled:opacity-50 cursor-pointer">
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}Mostrar mais
              </button>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
