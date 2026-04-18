"use client"

import { motion } from "framer-motion"
import { BookOpen, ExternalLink, Heart } from "lucide-react"

export function AmazonSection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 bg-coffee-900">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-800/70 border border-coffee-700 text-xs text-coffee-300 tracking-wide">
            <Heart className="w-3 h-3 text-coffee-gold" />
            Apoie nossa missão
          </span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-coffee-50 mb-4 leading-tight">
          Compre livros com nosso link e{" "}
          <span className="italic text-coffee-gold">
            ajude-nos a ficar online
          </span>
        </h2>

        <p className="text-coffee-400 max-w-2xl mx-auto text-base leading-relaxed mb-10">
          Quando você compra um livro sugerido pela Biblioteca Secreta através
          dos nossos links de parceiros, uma pequena comissão vai para nós — sem
          nenhum custo extra para você. É a forma mais simples de apoiar o
          projeto e continuar recebendo recomendações incríveis.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-sm text-coffee-500">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-coffee-gold" />
            Mais de 15 milhões de livros disponíveis
          </span>
          <span className="hidden sm:block text-coffee-800">·</span>
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-coffee-gold" />
            Links diretos para cada recomendação
          </span>
        </div>

        <div className="pt-8 border-t border-coffee-800 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://meli.la/12idEqh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-coffee-gold hover:bg-coffee-400 text-coffee-900 px-8 h-12 text-sm font-semibold transition-colors duration-200"
          >
            Acessar link do parceiro
          </a>
        </div>
      </motion.div>
    </section>
  )
}
