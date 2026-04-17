"use client"

import { cn } from "@/lib/utils"

interface ThemeTagProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function ThemeTag({ label, selected, onClick }: ThemeTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer",
        selected
          ? "bg-coffee-800 border-coffee-800 text-coffee-50"
          : "bg-white border-coffee-200 text-coffee-700 hover:border-coffee-400 hover:text-coffee-900"
      )}
    >
      {label}
    </button>
  )
}
