"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { SectionBadge } from "@/components/atoms/SectionBadge"

const faqs = [
  {
    id: "q1",
    question: "Como funciona a sugestão de livros?",
    answer:
      "Nosso algoritmo usa inteligência artificial para entender suas preferências literárias, oferecendo sugestões personalizadas com base no seu histórico de leituras e interesses. Quanto mais você interagir, mais precisas serão as sugestões."
  },
  {
    id: "q2",
    question: "Quais são as vantagens do plano Premium em relação ao plano Grátis?",
    answer:
      "O plano Premium oferece sugestões ilimitadas, recursos exclusivos como resumos inteligentes e consultoria literária personalizada. Já o plano Grátis permite apenas uma sugestão por semana, ideal para quem está começando a explorar o serviço."
  },
  {
    id: "q3",
    question: "Posso cancelar a assinatura a qualquer momento?",
    answer:
      "No Biblioteca Secreta, trabalhamos com planos pré-pagos, ou seja, não há assinaturas recorrentes. Você pode optar por assinar por um único mês ou aproveitar nossas promoções e comprar pacotes de meses, com a flexibilidade de não ter cobranças automáticas no futuro. Caso opte por um pacote, você terá acesso ao serviço até o fim do período contratado."
  },
  {
    id: "q4",
    question: "Como os descontos em livros recomendados funcionam?",
    answer:
      "Quando uma sugestão de livro for feita, você terá acesso a descontos exclusivos através de links afiliados. Nem todos os livros recomendados terão descontos especiais, pois isso depende das promoções disponíveis. Mesmo assim, você sempre terá acesso a ofertas vantajosas para as obras sugeridas."
  },
  {
    id: "q5",
    question: "Posso obter resumos de livros antes de comprá-los?",
    answer:
      "Sim! Para os assinantes do plano Premium, oferecemos resumos inteligentes de livros recomendados, ajudando você a decidir se aquele livro vale a pena antes de fazer a compra."
  },
  {
    id: "q6",
    question: "Como posso fazer upgrade do meu plano?",
    answer:
      "Você pode alterar seu plano a qualquer momento diretamente na sua conta. O Plano Premium oferece as vantagens mais completas, incluindo consultoria literária via IA, listas personalizadas baseadas no seu humor e sugestões ilimitadas."
  },
  {
    id: "q7",
    question: "É necessário criar uma conta para usar o serviço?",
    answer:
      "Sim, é necessário criar uma conta para construir seu perfil literário e receber sugestões personalizadas. No entanto, você pode começar com o Plano Gratuito para conhecer as funcionalidades sem necessidade de pagamento, testando o serviço antes de decidir por um plano pago."
  }
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <SectionBadge className="mb-4">Dúvidas</SectionBadge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-coffee-900 leading-tight">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-coffee-600 max-w-lg mx-auto leading-relaxed">
            Tudo que você precisa saber antes de começar sua jornada literária.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Accordion className="space-y-2">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-coffee-200 rounded-xl overflow-hidden bg-coffee-50/50"
              >
                <AccordionTrigger className="px-5 py-4 text-left font-heading font-semibold text-coffee-900 hover:text-coffee-700 text-sm sm:text-base cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-coffee-600 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
