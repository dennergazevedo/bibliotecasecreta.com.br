import { Logo } from "@/components/atoms/Logo"
import { BookOpen, Camera, MessageCircle, PlayCircle } from "lucide-react"

const socialLinks = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: MessageCircle, href: "#", label: "Twitter / X" },
  { icon: PlayCircle, href: "#", label: "YouTube" }
]

const supportLinks = [
  { label: "FAQ", href: "#" },
  { label: "Contato", href: "#" },
  { label: "Política de Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" }
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
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-coffee-800 hover:bg-coffee-700 text-coffee-400 hover:text-coffee-200 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
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
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-coffee-400 hover:text-coffee-200 transition-colors duration-200"
                  >
                    {label}
                  </a>
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
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-coffee-gold hover:text-coffee-300 transition-colors duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Criar conta gratuita
            </a>
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
