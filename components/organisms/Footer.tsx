import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Logo } from "@/components/atoms/Logo"

const socialLinks = [
  {
    href: "https://github.com/dennergazevedo",
    label: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/dnnr",
    label: "LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://dnnr.dev",
    label: "Website",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@devdenegociosmg",
    label: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

const supportLinks = [
  { label: "FAQ", href: "/#faq", external: true },
  { label: "Política de Privacidade", href: "/politicas-de-privacidade", external: false },
  { label: "Termos de Uso", href: "/termos-de-uso", external: false },
]

export function Footer() {
  return (
    <footer className="bg-coffee-900 text-coffee-300 pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-16 pb-12 border-b border-coffee-800">
          {/* Brand */}
          <div>
            <Logo variant="light" className="mb-4" />
            <p className="text-sm text-coffee-500 leading-relaxed max-w-xs">
              Recomendações literárias personalizadas com inteligência
              artificial, feitas para quem vive pelos livros.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socialLinks.map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-coffee-800 hover:bg-coffee-700 text-coffee-400 hover:text-coffee-200 transition-colors duration-200"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-coffee-500 mb-5">
              Suporte
            </h3>
            <ul className="space-y-3">
              {supportLinks.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      className="text-sm text-coffee-400 hover:text-coffee-200 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-coffee-400 hover:text-coffee-200 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-coffee-500 mb-5">
              Comece agora
            </h3>
            <p className="text-sm text-coffee-500 leading-relaxed mb-5">
              Seu próximo livro favorito está a um clique. Crie sua conta
              gratuita e descubra um novo universo literário.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-sm font-medium text-coffee-gold hover:text-coffee-300 transition-colors duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Criar conta gratuita
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-coffee-600">
            © {new Date().getFullYear()} Biblioteca Secreta. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-coffee-700">
            Feito com ☕ para leitores apaixonados
          </p>
        </div>
      </div>
    </footer>
  )
}
