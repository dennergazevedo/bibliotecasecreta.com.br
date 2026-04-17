import { cn } from "@/lib/utils"

interface BookCoverPlaceholderProps {
  className?: string
}

export function BookCoverPlaceholder({ className }: BookCoverPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-coffee-100 rounded-md border border-coffee-200",
        className
      )}
    >
      <span className="text-[9px] font-bold tracking-widest uppercase text-coffee-400 text-center leading-tight px-1">
        SEM
        <br />
        CAPA
      </span>
    </div>
  )
}
