"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/atoms/Logo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-8 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-coffee-50/90 border-coffee-200 shadow-coffee-300/20 border-b shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <a
          href={isAuthenticated ? "/dashboard" : "/auth"}
          className="bg-coffee-800 hover:bg-coffee-900 text-coffee-50 inline-flex h-8 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors duration-200"
        >
          Área do Leitor
        </a>
      </div>
    </header>
  );
}
