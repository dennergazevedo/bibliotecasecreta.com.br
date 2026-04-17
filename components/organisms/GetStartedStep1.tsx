"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { ThemeTag } from "@/components/atoms/ThemeTag"

const PRESET_THEMES = [
  "Ficção Científica",
  "Romance",
  "Fantasia",
  "Terror",
  "Suspense",
  "Drama",
  "Biografia",
  "História",
  "Autoajuda",
  "Filosofia",
  "Poesia",
  "Mangá",
  "HQ",
  "Infantil",
  "Técnico / Programação",
  "Negócios",
  "Psicologia",
  "Espiritualidade"
]

interface GetStartedStep1Props {
  selectedThemes: string[]
  onThemesChange: (themes: string[]) => void
}

export function GetStartedStep1({
  selectedThemes,
  onThemesChange
}: GetStartedStep1Props) {
  const [customInput, setCustomInput] = useState("")

  const toggle = (theme: string) => {
    if (selectedThemes.includes(theme)) {
      onThemesChange(selectedThemes.filter((t) => t !== theme))
    } else {
      onThemesChange([...selectedThemes, theme])
    }
  }

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed || selectedThemes.includes(trimmed)) {
      setCustomInput("")
      return
    }
    onThemesChange([...selectedThemes, trimmed])
    setCustomInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCustom()
    }
  }

  const customThemes = selectedThemes.filter(
    (t) => !PRESET_THEMES.includes(t)
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-coffee-900 leading-tight">
          Quais são seus temas favoritos?
        </h2>
        <p className="mt-2 text-sm text-coffee-500">
          Escolha pelo menos 3 temas. Isso vai nos ajudar a recomendar livros
          certos para você.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_THEMES.map((theme) => (
          <ThemeTag
            key={theme}
            label={theme}
            selected={selectedThemes.includes(theme)}
            onClick={() => toggle(theme)}
          />
        ))}
        {customThemes.map((theme) => (
          <ThemeTag
            key={theme}
            label={theme}
            selected
            onClick={() => toggle(theme)}
          />
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Outro tema... (Enter para adicionar)"
          className="flex-1 px-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-gold/40 focus:border-coffee-400 text-sm transition-colors"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-coffee-800 text-coffee-50 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-coffee-900 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {selectedThemes.length > 0 && selectedThemes.length < 3 && (
        <p className="text-xs text-coffee-500">
          Selecione mais {3 - selectedThemes.length} tema
          {3 - selectedThemes.length > 1 ? "s" : ""} para continuar.
        </p>
      )}
    </div>
  )
}
