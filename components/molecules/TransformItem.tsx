import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransformItemProps {
  text: string
  type: "before" | "after"
}

export function TransformItem({ text, type }: TransformItemProps) {
  const isBefore = type === "before"
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full mt-0.5",
          isBefore
            ? "bg-coffee-200/70 text-coffee-500"
            : "bg-coffee-800 text-coffee-50"
        )}
      >
        {isBefore ? (
          <X className="w-2.5 h-2.5" />
        ) : (
          <Check className="w-2.5 h-2.5" />
        )}
      </span>
      <span
        className={cn(
          "text-sm leading-relaxed",
          isBefore ? "text-coffee-500" : "text-coffee-800"
        )}
      >
        {text}
      </span>
    </li>
  )
}
