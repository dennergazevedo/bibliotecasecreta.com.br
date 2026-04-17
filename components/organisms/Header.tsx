"use client"

import { useEffect, useState } from "react"
import { Logo } from "@/components/atoms/Logo"
import { cn } from "@/lib/utils"

interface HeaderProps {
  isAuthenticated: boolean
}

export function Header({ isAuthenticated }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-coffee-50/90 backdrop-blur-md border-b border-coffee-200 shadow-sm shadow-coffee-300/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />
        <a
          href={isAuthenticated ? "/dashboard" : "/auth"}
          className="inline-flex items-center justify-center rounded-full bg-coffee-800 hover:bg-coffee-900 text-coffee-50 px-5 h-8 text-sm font-medium transition-colors duration-200"
        >
          Área do Leitor
        </a>
      </div>
    </header>
  )
}
