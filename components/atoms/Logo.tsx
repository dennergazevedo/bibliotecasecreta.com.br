import Link from "next/link"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  variant?: "default" | "light"
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const isLight = variant === "light"
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg",
          isLight ? "bg-white/15" : "bg-coffee-900"
        )}
      >
        <BookOpen className="w-4 h-4 text-coffee-50" />
      </div>
      <span
        className={cn(
          "font-heading text-base tracking-tight leading-none",
          isLight ? "text-coffee-50" : "text-coffee-900"
        )}
      >
        Biblioteca{" "}
        <span
          className={cn(
            "italic font-normal",
            isLight ? "text-coffee-300" : "text-coffee-600"
          )}
        >
          Secreta
        </span>
      </span>
    </Link>
  )
}
