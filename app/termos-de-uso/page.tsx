import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/organisms/Footer"

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col mt-8">
      <Header isAuthenticated={false} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl font-bold text-coffee-900 mb-4">Termos de Uso</h1>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">1. Introdução</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Bem-vindo à <strong className="text-coffee-900">Biblioteca Secreta</strong>. Ao acessar ou
            utilizar nossos serviços, você concorda com os seguintes Termos de
            Uso.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">2. Uso da Plataforma</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">O usuário se compromete a:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-coffee-600">
            <li>Utilizar os serviços conforme as leis vigentes.</li>
            <li>Fornecer informações precisas e atualizadas ao se cadastrar.</li>
            <li>Não compartilhar sua conta ou credenciais com terceiros.</li>
            <li>
              Não realizar atividades fraudulentas, abusivas ou que possam
              prejudicar a plataforma.
            </li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">3. Planos e Pagamentos</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Oferecemos diferentes planos de assinatura. Ao assinar um plano pago,
            você concorda com as condições de cobrança e renovação.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">4. Cancelamento e Reembolso</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Como a Biblioteca Secreta oferece pacotes de acesso e não assinaturas
            recorrentes, todas as compras são definitivas e não reembolsáveis. O
            usuário deve avaliar as condições antes de concluir a aquisição.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">5. Propriedade Intelectual</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Todo o conteúdo da plataforma, incluindo textos, imagens e algoritmos,
            é protegido por direitos autorais e não pode ser reproduzido sem
            autorização.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">6. Alterações nos Termos</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Podemos atualizar estes Termos de Uso a qualquer momento. Os usuários
            serão notificados sobre mudanças significativas.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">7. Contato</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Para dúvidas, entre em contato pelo e-mail{" "}
            <a
              href="mailto:me@dnnr.dev"
              className="text-coffee-700 underline hover:text-coffee-900"
            >
              me@dnnr.dev
            </a>
            .
          </p>

          <p className="mt-8 text-sm text-coffee-400">
            Última atualização: 10 de Março de 2025
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
