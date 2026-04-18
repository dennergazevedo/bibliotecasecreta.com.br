"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, BookOpen } from "lucide-react"
import { Logo } from "@/components/atoms/Logo"
import { cn } from "@/lib/utils"

type Tab = "login" | "register"

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
}

export function AuthTemplate() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  const updateField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (error) setError(null)
    }

  const switchTab = (t: Tab) => {
    setTab(t)
    setError(null)
    setForm(INITIAL_FORM)
    setShowPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (tab === "register" && form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const endpoint =
        tab === "login" ? "/api/auth/login" : "/api/auth/register"
      const body =
        tab === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Erro ao processar. Tente novamente.")
        return
      }

      const dest = data.getStartedCompleted ? "/dashboard" : "/get-started"
      router.push(dest)
      router.refresh()
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 focus:border-coffee-400 transition-colors text-base"

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-coffee-900 flex-col relative overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] text-coffee-200"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 64px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 64px)`
          }}
        />

        {/* Book spines silhouette */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end opacity-[0.07]">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-coffee-200 mx-px rounded-t-sm"
              style={{ height: `${48 + ((i * 7) % 5) * 18}px` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          <Logo variant="light" />

          <div className="flex-1 flex flex-col justify-center gap-6">
            <p className="text-xs font-medium tracking-widest uppercase text-coffee-600">
              Bem-vindo à
            </p>
            <h2 className="font-heading text-4xl xl:text-5xl font-bold text-coffee-50 leading-[1.1]">
              Sua biblioteca
              <br />
              <span className="italic text-coffee-400">literária pessoal</span>
            </h2>
            <p className="text-sm text-coffee-500 leading-relaxed max-w-70">
              Descubra livros que vão te transformar, organize sua estante
              virtual e receba recomendações com inteligência artificial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-coffee-800">
              <BookOpen className="w-4 h-4 text-coffee-gold" />
            </span>
            <p className="text-xs text-coffee-200">
              Comece agora com o plano gratuito
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-coffee-50">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-coffee-200 gap-6 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={cn(
                  "pb-3 text-sm font-medium transition-colors relative cursor-pointer",
                  tab === t
                    ? "text-coffee-900"
                    : "text-coffee-400 hover:text-coffee-600"
                )}
              >
                {t === "login" ? "Entrar" : "Criar conta"}
                {tab === t && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-coffee-900 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Form — key resets fields on tab switch */}
          <form key={tab} onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="block text-[11px] font-semibold text-coffee-600 mb-1.5 tracking-wider uppercase">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="Seu nome"
                  required
                  autoFocus
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-coffee-600 mb-1.5 tracking-wider uppercase">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="seu@email.com"
                required
                autoFocus={tab === "login"}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-coffee-600 mb-1.5 tracking-wider uppercase">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateField("password")}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className={cn(inputClass, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {tab === "register" && (
              <div>
                <label className="block text-[11px] font-semibold text-coffee-600 mb-1.5 tracking-wider uppercase">
                  Confirmar senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  placeholder="Repita sua senha"
                  required
                  className={inputClass}
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-coffee-800 hover:bg-coffee-900 disabled:opacity-60 disabled:cursor-not-allowed text-coffee-50 h-12 text-sm font-medium transition-colors duration-200 mt-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-coffee-50/30 border-t-coffee-50 rounded-full animate-spin" />
              ) : (
                <>
                  {tab === "login" ? "Entrar na biblioteca" : "Criar minha conta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch tab hint */}
          <p className="mt-6 text-center text-sm text-coffee-500">
            {tab === "login" ? (
              <>
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("register")}
                  className="text-coffee-800 font-medium hover:text-coffee-900 underline underline-offset-2 cursor-pointer"
                >
                  Criar conta gratuita
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-coffee-800 font-medium hover:text-coffee-900 underline underline-offset-2 cursor-pointer"
                >
                  Entrar
                </button>
              </>
            )}
          </p>

          <p className="mt-8 text-center">
            <a
              href="/"
              className="text-xs text-coffee-400 hover:text-coffee-600 transition-colors"
            >
              ← Voltar para o início
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
