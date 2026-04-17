"use client"

import { motion } from "framer-motion"
import { SectionBadge } from "@/components/atoms/SectionBadge"
import { TransformItem } from "@/components/molecules/TransformItem"

const beforeItems = [
  "Dificuldade em encontrar novos livros interessantes",
  "Tempo perdido com livros que não te cativam",
  "Falta de motivação para ler regularmente",
  "Sensação de isolamento na sua jornada literária",
  "Não saber por onde começar em novos gêneros"
]

const afterItems = [
  "Descobertas emocionantes a cada nova recomendação",
  "Leituras que combinam perfeitamente com seu gosto",
  "Hábito de leitura consistente e genuinamente prazeroso",
  "Conexão com uma comunidade vibrante de leitores",
  "Guia personalizado para explorar novos universos literários"
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  })
}

export function TransformSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-coffee-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionBadge className="mb-4">Transformação</SectionBadge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-coffee-900 leading-tight">
            A experiência de leitura{" "}
            <span className="italic text-coffee-600">que você merece</span>
          </h2>
          <p className="mt-4 text-coffee-600 max-w-xl mx-auto text-base leading-relaxed">
            Veja como a Biblioteca Secreta transforma a relação de cada leitor
            com os livros.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Antes */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-coffee-100/60 border border-coffee-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-coffee-500">
                Antes
              </span>
              <div className="flex-1 h-px bg-coffee-200" />
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item) => (
                <TransformItem key={item} text={item} type="before" />
              ))}
            </ul>
          </motion.div>

          {/* Depois */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-white border border-coffee-200 p-8 shadow-sm shadow-coffee-200/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-coffee-700">
                Depois
              </span>
              <div className="flex-1 h-px bg-coffee-300" />
              <span className="text-xs text-coffee-500 italic">
                com Biblioteca Secreta
              </span>
            </div>
            <ul className="space-y-4">
              {afterItems.map((item) => (
                <TransformItem key={item} text={item} type="after" />
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
