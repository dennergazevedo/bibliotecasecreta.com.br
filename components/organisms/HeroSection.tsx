import { ChevronDown, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-coffee-50 pt-16">
      {/* Animated CSS orbs */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full bg-coffee-300/20 blur-3xl pointer-events-none hero-orb-1"
        style={{ top: "-20%", left: "-12%" }}
      />
      <div
        className="absolute w-[450px] h-[450px] rounded-full bg-coffee-400/15 blur-3xl pointer-events-none hero-orb-2"
        style={{ top: "0%", right: "-10%" }}
      />
      <div
        className="absolute w-[550px] h-[550px] rounded-full bg-coffee-200/30 blur-3xl pointer-events-none hero-orb-3"
        style={{ bottom: "0%", left: "25%" }}
      />
      <div
        className="absolute w-[280px] h-[280px] rounded-full bg-coffee-gold/10 blur-3xl pointer-events-none hero-orb-4"
        style={{ top: "38%", right: "12%" }}
      />

      {/* Floating book particles */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute pointer-events-none hero-book-particle opacity-0"
          style={{
            left: `${10 + i * 16}%`,
            bottom: "8%",
            animationDelay: `${i * 2.2}s`
          }}
        >
          <svg
            width="18"
            height="24"
            viewBox="0 0 18 24"
            fill="currentColor"
            className="text-coffee-700"
          >
            <rect x="2" y="0" width="14" height="24" rx="2" />
            <rect x="0" y="2" width="4" height="20" rx="1" opacity="0.45" />
          </svg>
        </div>
      ))}

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px"
        }}
      />

      {/* Hero content — rendered statically, no CLS */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-coffee-100 text-coffee-700 border border-coffee-200">
            <Sparkles className="w-3 h-3" />
            Recomendações com Inteligência Artificial
          </span>
        </div>

        <p className="font-heading italic text-base sm:text-lg text-coffee-500 mb-5">
          &ldquo;Uma leitura sempre te deixa diferente do que você era antes.&rdquo;
        </p>

        <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] text-coffee-900 leading-[1.08] tracking-tight mb-6">
          Sua próxima história
          <br />
          <span className="italic text-coffee-600">favorita</span> está te
          <br />
          esperando
        </h1>

        <p className="text-base sm:text-lg text-coffee-600 leading-relaxed max-w-xl mx-auto mb-10">
          A Biblioteca Secreta usa inteligência artificial para entender seus
          gostos literários e sugerir os livros certos, no momento certo. Para
          quem vive pelos livros.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/auth"
            className="inline-flex items-center justify-center rounded-full bg-coffee-800 hover:bg-coffee-900 text-coffee-50 px-8 h-12 text-sm font-medium transition-colors duration-200"
          >
            Comece sua jornada
          </a>
          <a
            href="#o-que-e"
            className="inline-flex items-center justify-center rounded-full border border-coffee-300 text-coffee-700 hover:bg-coffee-100 hover:border-coffee-400 px-8 h-12 text-sm font-medium transition-colors duration-200"
          >
            Saiba mais
          </a>
        </div>

        <div className="mt-14 flex items-center justify-center gap-6 text-xs text-coffee-400">
          {["Ficção", "Romance", "Fantasia", "Não-ficção", "Clássicos"].map(
            (genre) => (
              <span
                key={genre}
                className="hidden sm:block px-3 py-1 rounded-full border border-coffee-200 bg-white/60"
              >
                {genre}
              </span>
            )
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="text-[10px] text-coffee-400 tracking-widest uppercase">
          Explorar
        </span>
        <div className="hero-bounce">
          <ChevronDown className="w-4 h-4 text-coffee-400" />
        </div>
      </div>
    </section>
  )
}
