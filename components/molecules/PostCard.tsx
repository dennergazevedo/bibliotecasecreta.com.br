import Link from "next/link"
import { MessageSquare, User } from "lucide-react"

export interface PostSummaryItem {
  id: string
  title: string
  content: string
  user_name: string
  created_at: string
  comment_count: number
}

function stripMarkdown(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_]{1,2}([^*_\n]+)[*_]{1,2}/g, "$1")
    .replace(/`[^`\n]+`/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^>\s/gm, "")
    .replace(/^-\s/gm, "")
    .trim()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}

export function PostCard({ post }: { post: PostSummaryItem }) {
  const preview = stripMarkdown(post.content).slice(0, 160)

  return (
    <Link
      href={`/comunidade/${post.id}`}
      className="flex flex-col gap-2 rounded-2xl border border-coffee-200 bg-white p-5 hover:border-coffee-400 hover:shadow-sm transition-all duration-150 cursor-pointer"
    >
      <h3 className="font-heading text-base font-bold text-coffee-900 leading-snug line-clamp-2">
        {post.title}
      </h3>
      {preview && (
        <p className="text-sm text-coffee-600 leading-relaxed line-clamp-3">
          {preview}
          {post.content.length > 160 ? "…" : ""}
        </p>
      )}
      <div className="flex items-center gap-4 mt-1 text-xs text-coffee-400">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {post.user_name}
        </span>
        <span>{formatDate(post.created_at)}</span>
        <span className="flex items-center gap-1 ml-auto">
          <MessageSquare className="w-3 h-3" />
          {post.comment_count}
        </span>
      </div>
    </Link>
  )
}
