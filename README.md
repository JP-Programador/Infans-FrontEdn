# Infans – Seu Agente (Frontend)

Prontuário Pedagógico Digital para Educação Infantil. Next.js (App Router) +
TypeScript + TailwindCSS + shadcn/ui + React Hook Form + TanStack Query.

> Este projeto usa Next.js 16 (Turbopack por padrão). Há diferenças relevantes
> em relação a versões anteriores — ver `AGENTS.md` e `node_modules/next/dist/docs/`.

## Setup local

```bash
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_API_URL se necessário
npm run dev
```

Abra `http://localhost:3000`.

## Estrutura

```
src/
├── app/            # rotas (App Router)
├── modules/        # 1 pasta por domínio (auth, escolas, turmas, criancas, ...)
├── components/
│   ├── ui/         # shadcn/ui
│   └── shared/     # componentes reutilizáveis entre módulos
├── providers/       # QueryProvider (TanStack Query), AuthProvider (JWT em localStorage)
└── lib/              # api-client (fetch com Bearer token), auth-storage, types, utils
```

## Autenticação

O token JWT é armazenado no `localStorage` (`infans:access_token`) e enviado via
header `Authorization: Bearer <token>` em toda chamada autenticada de
`lib/api-client.ts`. O `AuthProvider` carrega o perfil (`/auth/me`) ao iniciar
e expõe `professora`, `carregando`, `autenticar` e `sair` via `useAuth()`.

## Tema

Paleta clara: azul claro + verde suave + branco + cinza claro, definida em
`src/app/globals.css` (CSS variables consumidas pelo shadcn/ui via Tailwind v4).

## Páginas

- `(auth)`: `/login`, `/cadastro`, `/trocar-senha`
- `(app)` (autenticado, com sidebar): `/dashboard`, `/escolas`, `/escolas/[id]`,
  `/escolas/[id]/turmas/[id]`, `/criancas/[id]` (histórico + registro), `/relatorios`
  (fluxo completo com IA), `/configuracoes`

## Nota sobre o shadcn/ui nesta versão

Os componentes `ui/` usam **Base UI** (não Radix). Diferenças relevantes ao adicionar
novos componentes: trigger customizado usa `render={<Componente />}` em vez de
`asChild`; `Select.Value` não resolve o rótulo automaticamente — use a render-prop
`children` para mapear valor → rótulo (ver `modules/relatorios/components/seletor-crianca.tsx`).

## Docker

```bash
docker compose up --build   # a partir da raiz do projeto (Code/)
```

## Status

Frontend completo: autenticação, CRUDs (escolas/turmas/crianças, incluindo edição e
toggle de "ativa"), histórico com filtros, fluxo de relatórios com IA, dashboard e
configurações. Testado manualmente no navegador contra o backend real em todas as
fases.
