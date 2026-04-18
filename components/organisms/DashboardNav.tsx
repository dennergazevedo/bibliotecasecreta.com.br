"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Users, Menu, X } from "lucide-react"
import { Logo } from "@/components/atoms/Logo"

const LINKS = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/minha-biblioteca", label: "Minha Biblioteca", icon: BookOpen },
  { href: "/comunidade", label: "Comunidade", icon: Users }
]

interface DashboardNavProps {
  userName: string
}

export function DashboardNav({ userName }: DashboardNavProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-coffee-200">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden md:flex items-center gap-1">
              {LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-coffee-100 text-coffee-900"
                        : "text-coffee-500 hover:text-coffee-900 hover:bg-coffee-50"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="hidden sm:block text-xs text-coffee-400 hover:text-coffee-700 transition-colors cursor-pointer"
              >
                Sair
              </button>
            </form>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-coffee-600 hover:bg-coffee-100 transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-coffee-200">
            <Logo />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg text-coffee-500 hover:bg-coffee-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-coffee-100">
            <p className="text-sm text-coffee-500">
              Olá,{" "}
              <span className="font-semibold text-coffee-900">{userName}</span>
            </p>
          </div>

          <nav className="flex flex-col p-4 gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-coffee-100 text-coffee-900"
                      : "text-coffee-600 hover:text-coffee-900 hover:bg-coffee-50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto p-4 border-t border-coffee-100">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full text-sm text-coffee-500 hover:text-coffee-800 transition-colors cursor-pointer py-2"
              >
                Sair da conta
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
