# 📚 Biblioteca Secreta

> Recomendações literárias personalizadas com inteligência artificial — feitas para quem vive pelos livros.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00e599?logo=postgresql)](https://neon.tech)

---

## Sumário

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Banco de Dados](#banco-de-dados)
- [API Routes](#api-routes)
- [Configuração](#configuração)
- [Desenvolvimento](#desenvolvimento)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura de Arquivos](#estrutura-de-arquivos)

---

## Sobre

Biblioteca Secreta é uma plataforma de recomendação de livros impulsionada por IA. O sistema aprende com os gostos literários do usuário — gêneros favoritos, livros já lidos e humor do momento — e sugere leituras personalizadas via GPT-4o-mini.

O projeto é **100% serverless**: Next.js App Router com Route Handlers, Neon Postgres como banco de dados e Cloudinary para upload de imagens.

---

## Funcionalidades

### Onboarding
- Wizard de 3 etapas ao primeiro login
  - **Step 1** — seleção de gêneros/temas (mín. 3, com adição de temas customizados)
  - **Step 2** — busca de livros já lidos (Google Books + busca no banco próprio)
  - **Step 3** — marcação de favoritos (máx. 5)
- Usuários que completaram o onboarding pulam direto para o `/dashboard`

### Dashboard
- **Sugestão por mood** — escolha seu humor e receba 1 livro indicado por IA; sugestão do dia é pré-carregada na próxima visita (sem nova chamada à API)
- **Sugestões diárias** — 3 livros gerados por IA por dia, cacheados até a virada do dia no fuso de São Paulo
- **Mais lidos da plataforma** — ranking dos 5 livros com mais registros de leitura
- **Curadoria** — seleção manual de livros em destaque

### Minha Biblioteca
- Grade de livros lidos com toggle de favoritos
- Grid responsivo: 2 colunas mobile → 6 colunas desktop
- Histórico completo de sugestões recebidas
- Modal de adição: busca por título/autor (Google Books + DB) ou cadastro manual com upload de capa

### Comunidade
- Fórum de posts com suporte a Markdown
- Busca por título em tempo real (debounce 300ms)
- Comentários paginados por post
- Imagens bloqueadas no editor por segurança

### Livros
- Busca híbrida: banco próprio + Google Books API com upsert automático
- Modal de detalhes com capa, gênero, data de publicação, nº de páginas, descrição e link de compra
- Links de parceiros afiliados por livro

### Autenticação
- Registro e login com senha hasheada via `bcryptjs`
- JWT armazenado em cookie `httpOnly` / `secure` / `sameSite: lax` com validade de 7 dias

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Linguagem | TypeScript 5 (strict) |
| Estilo | Tailwind CSS v4 (config via CSS, sem `tailwind.config.js`) |
| Componentes UI | Shadcn UI + Base UI |
| Animações | Framer Motion |
| Banco de dados | Neon Postgres (`@neondatabase/serverless`) |
| Autenticação | JWT via `jose` + cookies HTTP-only |
| IA | OpenAI GPT-4o-mini (JSON mode) |
| Busca de livros | Google Books API |
| Upload de imagens | Cloudinary |
| Markdown | `react-markdown` + `remark-gfm` |
| Package manager | pnpm |

---

## Arquitetura

```
bibliotecasecreta.com.br/
├── app/
│   ├── api/               # Route Handlers (serverless)
│   │   ├── auth/          # login, register, logout
│   │   ├── books/         # search, top, route (manual create)
│   │   ├── community/     # posts e comments
│   │   ├── get-started/   # onboarding POST
│   │   ├── suggestions/   # mood (GET+POST) e daily (GET)
│   │   └── user/          # books, favorites, suggestions history
│   ├── db/                # Schemas SQL (rastreabilidade)
│   ├── shared/            # Utilitários: db, auth, openai, cloudinary, resolveBook
│   ├── (pages)/           # auth, dashboard, get-started, minha-biblioteca, comunidade
│   └── globals.css        # Design tokens Tailwind v4 (paleta coffee + gold)
├── components/
│   ├── atoms/             # BookCard, BookCoverPlaceholder, BookDetailModal, Logo, ThemeTag…
│   ├── molecules/         # BookLibraryCard, BookSuggestionCard, MarkdownEditor, PostCard…
│   ├── organisms/         # DashboardNav, Footer, Header, MoodSection, DailySection…
│   └── templates/         # DashboardTemplate, MyLibraryTemplate, CommunityTemplate…
└── public/
```

Componentes seguem **Atomic Design**: `atoms → molecules → organisms → templates`.

O alias `@/` aponta para a raiz do projeto (`./`).

---

## Banco de Dados

Schemas em `app/db/*.sql`. Todas as tabelas usam UUID como PK e `TIMESTAMPTZ` para datas.

```
users
├── id, name, email, password_hash
└── get_started_completed

books
├── id, title, author, genre, published_date, page_count
├── description, image_url, affiliated_link
├── foreign_id (Google Books ID), is_google_books
└── active

user_themes          → gêneros favoritos por usuário
user_read_books      → livros lidos + is_favorite
user_suggestions     → histórico de sugestões (type: 'mood' | 'daily', mood nullable)

community_posts      → id, user_id, title, content
community_comments   → id, post_id, user_id, content
```

### resolveBook

Utilitário central em `app/shared/resolveBook.ts`. Resolve um título sugerido pela IA para um registro no banco:

1. Busca fuzzy bidirecional no DB (`ILIKE` nos dois sentidos)
2. Se não encontrar → chama Google Books API e faz upsert (preserva campos existentes com `COALESCE`)
3. Fallback → cria registro com metadados da IA (gênero, descrição, data, páginas)

---

## API Routes

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cria conta, retorna JWT |
| `POST` | `/api/auth/login` | Login, retorna JWT + `getStartedCompleted` |
| `POST` | `/api/auth/logout` | Limpa cookie de sessão |
| `GET` | `/api/books/search?q=` | Busca livros (DB + Google Books) |
| `POST` | `/api/books` | Cria livro manualmente (`active: false`) |
| `GET` | `/api/books/top` | Top 5 livros mais lidos |
| `GET` | `/api/suggestions/mood` | Retorna sugestão de mood do dia (fuso SP) |
| `POST` | `/api/suggestions/mood` | Gera nova sugestão por mood via IA |
| `GET` | `/api/suggestions/daily` | Retorna (ou gera) 3 sugestões diárias |
| `POST` | `/api/get-started` | Salva temas, livros lidos e favoritos |
| `GET` | `/api/user/books` | Lista livros lidos do usuário (paginado) |
| `POST` | `/api/user/books` | Adiciona livro à biblioteca |
| `PATCH` | `/api/user/books/:id/favorite` | Toggle favorito |
| `GET` | `/api/user/suggestions` | Histórico de sugestões do usuário |
| `GET` | `/api/community/posts` | Lista posts (busca + paginação) |
| `POST` | `/api/community/posts` | Cria post |
| `GET` | `/api/community/posts/:id` | Post por ID |
| `GET` | `/api/community/posts/:id/comments` | Lista comentários (paginado) |
| `POST` | `/api/community/posts/:id/comments` | Cria comentário |

---

## Configuração

### Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9
- Conta no [Neon](https://neon.tech) (Postgres serverless)
- Chave de API [OpenAI](https://platform.openai.com)
- Conta no [Cloudinary](https://cloudinary.com)
- Chave de API [Google Books](https://developers.google.com/books)

### Banco de dados

Execute os schemas na ordem abaixo no seu banco Neon:

```bash
app/db/users.sql
app/db/books.sql
app/db/user_themes.sql
app/db/user_read_books.sql
app/db/user_suggestions.sql
app/db/community_posts.sql
app/db/community_comments.sql
```

---

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp env.example .env.local

# Preencher .env.local com suas credenciais

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Variáveis de Ambiente

```env
# Banco de dados (Neon)
NEON_DB_STRING_CONNECTION=postgresql://...

# IA
OPEN_AI_API_KEY=sk-...

# Autenticação JWT
JWT_SECRET=seu_segredo_aqui

# Google Books API
GOOGLE_CLOUD_BOOK_API_KEY=AIza...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Estrutura de Arquivos

```
app/
├── api/
│   ├── auth/login/route.ts
│   ├── auth/register/route.ts
│   ├── auth/logout/route.ts
│   ├── books/route.ts
│   ├── books/search/route.ts
│   ├── books/top/route.ts
│   ├── community/posts/route.ts
│   ├── community/posts/[id]/route.ts
│   ├── community/posts/[id]/comments/route.ts
│   ├── get-started/route.ts
│   ├── suggestions/mood/route.ts
│   ├── suggestions/daily/route.ts
│   ├── user/books/route.ts
│   ├── user/books/[bookId]/favorite/route.ts
│   └── user/suggestions/route.ts
├── db/                        # Schemas SQL
├── shared/
│   ├── auth.ts                # signToken, verifyToken, getSessionUser
│   ├── cloudinary.ts          # cliente Cloudinary
│   ├── db.ts                  # cliente Neon (sql)
│   ├── openai.ts              # cliente OpenAI
│   ├── password.ts            # hash + compare bcrypt
│   ├── resolveBook.ts         # busca/cria livro por título
│   └── types.ts               # Book interface compartilhada
├── auth/page.tsx
├── dashboard/page.tsx
├── get-started/page.tsx
├── minha-biblioteca/page.tsx
├── comunidade/page.tsx
├── comunidade/novo/page.tsx
├── comunidade/[id]/page.tsx
├── politicas-de-privacidade/page.tsx
└── termos-de-uso/page.tsx

components/
├── atoms/
│   ├── BookCard.tsx
│   ├── BookCoverPlaceholder.tsx
│   ├── BookDetailModal.tsx
│   ├── Logo.tsx
│   ├── SectionBadge.tsx
│   └── ThemeTag.tsx
├── molecules/
│   ├── BookLibraryCard.tsx
│   ├── BookSuggestionCard.tsx
│   ├── FeatureCard.tsx
│   ├── MarkdownEditor.tsx
│   └── PostCard.tsx
├── organisms/
│   ├── AddBookModal.tsx
│   ├── AmazonSection.tsx
│   ├── CuratedSection.tsx
│   ├── DailySection.tsx
│   ├── DashboardNav.tsx
│   ├── FAQSection.tsx
│   ├── Footer.tsx
│   ├── GetStartedStep1.tsx
│   ├── GetStartedStep2.tsx
│   ├── GetStartedStep3.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── MoodSection.tsx
│   ├── MyLibrarySection.tsx
│   ├── SuggestionsHistorySection.tsx
│   ├── TopBooksSection.tsx
│   └── WhatIsSection.tsx
└── templates/
    ├── AuthTemplate.tsx
    ├── CommunityTemplate.tsx
    ├── DashboardTemplate.tsx
    ├── GetStartedTemplate.tsx
    ├── MyLibraryTemplate.tsx
    ├── NewPostTemplate.tsx
    └── PostDetailTemplate.tsx
```

---

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.
