@AGENTS.md

# Biblioteca Secreta — Regras do Projeto

## Ferramentas e Tecnologias

- **Package manager:** pnpm (nunca npm ou yarn)
- **Framework:** Next.js (leia `node_modules/next/dist/docs/` antes de escrever código)
- **Estilos:** Tailwind CSS v4 — configuração via CSS (`globals.css`), sem `tailwind.config.js`
- **Formatação:** Prettier com `prettier-plugin-tailwindcss` (config em `.prettierrc`)
- **Linguagem:** TypeScript strict em todos os arquivos (sem `.js` ou `any` desnecessário)
- **Componentes UI:** Shadcn UI — sempre preferir componentes Shadcn quando disponíveis
- **Banco de dados:** Neon Postgres via `@neondatabase/serverless`
- **Auth:** JWT + cookies HTTP-only com a biblioteca `jose`
- **LLM:** OpenAI SDK (`openai`)

## Estrutura de Arquivos

- **Atomic Design:** componentes em `components/{atoms,molecules,organisms,templates}` (raiz do projeto, ao lado de `components/ui/` do Shadcn). O alias `@/` aponta para `./` (raiz), logo `@/components/atoms/Foo` funciona diretamente.
- **Código reutilizável:** funções e utilitários em `app/shared/`
- **API Routes:** usar `route.ts` do Next.js (nunca criar um servidor separado)
- **Schemas SQL:** criar/atualizar em `app/db/{{fileName}}.sql` sempre que alterar tabelas

## Utilitários Compartilhados

| Arquivo | Exporta |
|---|---|
| `app/shared/db.ts` | `sql` — cliente Neon |
| `app/shared/openai.ts` | `openai` — cliente OpenAI |
| `app/shared/auth.ts` | `signToken`, `verifyToken`, `getSessionUser`, `COOKIE_NAME` |

## Variáveis de Ambiente

- `NEON_DB_STRING_CONNECTION` — string de conexão Neon Postgres
- `OPEN_AI_API_KEY` — chave da API OpenAI
- `JWT_SECRET` — segredo para assinar tokens JWT

## Autenticação

- Tokens JWT armazenados em cookie `bs_session` com flags `httpOnly`, `secure`, `sameSite: lax`
- Expiração padrão de 7 dias
- Verificar token em cada route handler protegido via `getSessionUser`

## Convenções

- Reutilizar código existente antes de criar funções novas
- Schemas SQL sempre em `app/db/` para rastreabilidade
- Sem comentários óbvios — apenas quando o "porquê" não é evidente pelo código
- Sem `any` — use tipos precisos ou `unknown`
