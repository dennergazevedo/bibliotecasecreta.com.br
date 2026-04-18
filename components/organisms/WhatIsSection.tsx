"use client"

import { motion } from "framer-motion"
import { Brain, BookMarked, Sparkles, MessageSquare } from "lucide-react"
import { SectionBadge } from "@/components/atoms/SectionBadge"
import { FeatureCard } from "@/components/molecules/FeatureCard"

const features = [
  {
    icon: Brain,
    title: "Recomendações Inteligentes",
    description:
      "Nossa IA aprende com cada livro que você adiciona e cada interação, tornando as sugestões cada vez mais precisas e pessoais."
  },
  {
    icon: BookMarked,
    title: "Sua Estante Virtual",
    description:
      "Organize todos os seus livros lidos, favoritos e lista de desejos em um só lugar. Seu histórico literário sempre à mão."
  },
  {
    icon: Sparkles,
    title: "Descobertas Únicas",
    description:
      "Saia do óbvio e explore novos gêneros, autores e universos literários que combinam perfeitamente com seu perfil de leitor."
  },
  {
    icon: MessageSquare,
    title: "Consultoria Literária",
    description:
      "Converse com nossa IA especializada em literatura e receba orientações personalizadas baseadas no seu gosto e humor do momento."
  }
]

export function WhatIsSection() {
  return (
    <section id="o-que-e" className="py-24 sm:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionBadge className="mb-4">O que é</SectionBadge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-coffee-900 leading-tight mb-4">
            A Biblioteca Secreta
          </h2>
          <p className="text-coffee-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Um aplicativo que combina o amor pelos livros com o poder da
            inteligência artificial para criar uma experiência literária
            verdadeiramente personalizada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
