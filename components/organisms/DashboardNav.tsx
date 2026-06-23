"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, Menu, X } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";

const LINKS = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/minha-biblioteca", label: "Minha Biblioteca", icon: BookOpen },
  { href: "/comunidade", label: "Comunidade", icon: Users }
];

interface DashboardNavProps {
  userName: string;
}

export function DashboardNav({ userName }: DashboardNavProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="border-coffee-200 sticky top-8 z-30 border-b bg-white">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-1 md:flex">
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-coffee-100 text-coffee-900"
                        : "text-coffee-500 hover:text-coffee-900 hover:bg-coffee-50"
                    }`}
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-coffee-400 hover:text-coffee-700 hidden cursor-pointer text-xs transition-colors sm:block"
              >
                Sair
              </button>
            </form>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="text-coffee-600 hover:bg-coffee-100 cursor-pointer rounded-lg p-1.5 transition-colors md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          drawerOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="border-coffee-200 flex items-center justify-between border-b px-5 py-4">
            <Logo />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="text-coffee-500 hover:bg-coffee-100 cursor-pointer rounded-lg p-1.5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-coffee-100 border-b px-4 py-3">
            <p className="text-coffee-500 text-sm">
              Olá,{" "}
              <span className="text-coffee-900 font-semibold">{userName}</span>
            </p>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-coffee-100 text-coffee-900"
                      : "text-coffee-600 hover:text-coffee-900 hover:bg-coffee-50"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-coffee-100 mt-auto border-t p-4">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-coffee-500 hover:text-coffee-800 w-full cursor-pointer py-2 text-sm transition-colors"
              >
                Sair da conta
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
