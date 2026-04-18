"use client"

import { useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Bold, Italic, Heading2, Code, Quote, List } from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minRows?: number
}

type ToolbarAction = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  before: string
  after: string
  placeholder: string
}

const TOOLBAR: ToolbarAction[] = [
  { icon: Bold, label: "Negrito", before: "**", after: "**", placeholder: "texto em negrito" },
  { icon: Italic, label: "Itálico", before: "_", after: "_", placeholder: "texto em itálico" },
  { icon: Heading2, label: "Título", before: "## ", after: "", placeholder: "título" },
  { icon: Code, label: "Código", before: "`", after: "`", placeholder: "código" },
  { icon: Quote, label: "Citação", before: "> ", after: "", placeholder: "citação" },
  { icon: List, label: "Lista", before: "- ", after: "", placeholder: "item" }
]

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Escreva aqui...",
  minRows = 10
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (action: ToolbarAction) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end) || action.placeholder
    const insert = action.before + selected + action.after
    const next = value.slice(0, start) + insert + value.slice(end)
    onChange(next)
    setTimeout(() => {
      el.focus()
      const newCursor = start + insert.length
      el.setSelectionRange(newCursor, newCursor)
    }, 0)
  }

  return (
    <div className="flex flex-col border border-coffee-200 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-coffee-200 bg-coffee-50">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              tab === t
                ? "bg-white text-coffee-900 border-b-2 border-coffee-800 -mb-px"
                : "text-coffee-500 hover:text-coffee-800"
            }`}
          >
            {t === "write" ? "Escrever" : "Pré-visualizar"}
          </button>
        ))}
      </div>

      {tab === "write" && (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-3 py-2 border-b border-coffee-100 bg-white flex-wrap">
            {TOOLBAR.map((action) => (
              <button
                key={action.label}
                type="button"
                title={action.label}
                onClick={() => insertMarkdown(action)}
                className="p-1.5 rounded text-coffee-500 hover:bg-coffee-100 hover:text-coffee-800 transition-colors cursor-pointer"
              >
                <action.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
            className="w-full px-4 py-3 text-sm text-coffee-900 placeholder:text-coffee-400 resize-y focus:outline-none bg-white leading-relaxed"
          />
        </>
      )}

      {tab === "preview" && (
        <div className="px-4 py-3 min-h-40 bg-white">
          {value.trim() ? (
            <div className="prose prose-sm max-w-none text-coffee-900 prose-headings:font-heading prose-a:text-coffee-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ img: () => null }}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-coffee-400 text-sm italic">
              Nada para pré-visualizar.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
