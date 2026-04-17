import { cn } from "@/lib/utils"

interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
}

export function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "text-xs font-medium tracking-widest uppercase",
        "bg-coffee-100 text-coffee-700 border border-coffee-200",
        className
      )}
    >
      {children}
    </span>
  )
}
