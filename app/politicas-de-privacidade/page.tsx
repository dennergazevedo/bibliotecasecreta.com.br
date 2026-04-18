import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/organisms/Footer"

export default function PrivacyPolicies() {
  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col mt-8">
      <Header isAuthenticated={false} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl font-bold text-coffee-900 mb-4">Política de Privacidade</h1>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">1. Introdução</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Bem-vindo à <strong className="text-coffee-900">Biblioteca Secreta</strong>! Sua privacidade é uma
            prioridade para nós. Esta Política de Privacidade explica como
            coletamos, usamos e protegemos suas informações ao utilizar nossos
            serviços.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">2. Coleta de Dados</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Coletamos informações para oferecer a melhor experiência possível aos
            nossos usuários. Isso pode incluir:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-coffee-600">
            <li>
              <strong className="text-coffee-800">Informações fornecidas pelo usuário</strong>: Nome, e-mail,
              preferências literárias.
            </li>
            <li>
              <strong className="text-coffee-800">Informações coletadas automaticamente</strong>: Endereço IP,
              tipo de navegador, histórico de navegação na plataforma e interações
              com sugestões de leitura.
            </li>
            <li>
              <strong className="text-coffee-800">Cookies e tecnologias similares</strong>: Utilizamos cookies
              para personalizar sua experiência e melhorar nossos serviços.
            </li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">3. Uso das Informações</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">Utilizamos suas informações para:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-coffee-600">
            <li>Personalizar recomendações de livros e conteúdo.</li>
            <li>Melhorar a experiência do usuário na plataforma.</li>
            <li>Enviar comunicações sobre novidades, promoções e atualizações.</li>
            <li>Processar pagamentos e gerenciar assinaturas.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">4. Compartilhamento de Dados</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Não vendemos nem compartilhamos suas informações pessoais com terceiros,
            exceto:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-coffee-600">
            <li>
              <strong className="text-coffee-800">Fornecedores de serviços</strong>: Empresas parceiras que
              auxiliam na hospedagem, processamento de pagamentos e análise de
              dados.
            </li>
            <li>
              <strong className="text-coffee-800">Requisitos legais</strong>: Se formos obrigados a compartilhar
              informações por razões legais ou regulatórias.
            </li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">5. Armazenamento e Segurança</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Adotamos medidas de segurança para proteger suas informações contra
            acessos não autorizados, uso indevido ou alteração.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">6. Seus Direitos</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">Você tem o direito de:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-coffee-600">
            <li>Acessar, corrigir ou excluir suas informações pessoais.</li>
            <li>Revogar consentimentos dados para coleta e processamento de dados.</li>
            <li>Solicitar a portabilidade dos seus dados.</li>
            <li>Optar por não receber comunicações de marketing.</li>
          </ul>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Para exercer qualquer um desses direitos, entre em contato conosco pelo
            e-mail{" "}
            <a
              href="mailto:me@dnnr.dev"
              className="text-coffee-700 underline hover:text-coffee-900"
            >
              me@dnnr.dev
            </a>
            .
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">7. Cookies e Tecnologias Semelhantes</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">Utilizamos cookies para:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-coffee-600">
            <li>Melhorar a usabilidade e experiência do site.</li>
            <li>Personalizar conteúdo e sugestões de leitura.</li>
            <li>Analisar interações com a plataforma e otimizar serviços.</li>
          </ul>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">8. Alterações nesta Política</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Podemos atualizar esta Política de Privacidade periodicamente. Se houver
            mudanças significativas, informaremos por e-mail ou aviso na plataforma.
          </p>

          <h2 className="font-heading text-xl font-semibold text-coffee-900 mt-8">9. Contato</h2>
          <p className="text-coffee-600 mt-2 leading-relaxed">
            Caso tenha dúvidas sobre esta Política de Privacidade, entre em contato
            pelo e-mail{" "}
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
