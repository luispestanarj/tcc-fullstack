# Utilitário para Rotina Diária

TCC — Pós-Graduação em Desenvolvimento Full Stack  
**Autor:** Luis Antonio Pestana Junior

Aplicação web para gerenciamento pessoal de **tarefas**, **listas de compras** e **lembretes**, com autenticação JWT, CRUD completo e persistência em PostgreSQL.

---

## Execução com Docker (modo avaliação)

> Único pré-requisito: **Docker Desktop** instalado e em execução.  
> Node.js **não é necessário**.

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd TCC
```

### 2. Subir toda a aplicação com um único comando

```bash
docker compose up --build
```

O Docker irá:
- compilar a API (Node.js + TypeScript)
- compilar o front-end (React + Vite)
- subir o banco de dados (PostgreSQL 16)
- aplicar as migrations automaticamente
- popular o banco com dados de demonstração

Aguarde as três linhas abaixo no terminal (entre 1 e 3 minutos na primeira vez):

```
tcc_postgres  | database system is ready to accept connections
tcc_api       | 🚀 Iniciando API...
tcc_web       | ...
```

### 3. Abrir no navegador

```
http://localhost:8080
```

### Credenciais de demonstração

| E-mail | Senha | Papel |
|---|---|---|
| demo@tcc.dev | demo123 | Usuário comum |
| admin@tcc.dev | admin123 | Administrador |

### Parar a aplicação

```bash
docker compose down
```

Para apagar os dados do banco também:

```bash
docker compose down -v
```

---

## O que a aplicação faz

| Funcionalidade | Detalhes |
|---|---|
| Cadastro e login | Registro com nome + e-mail + senha, autenticação via JWT |
| Listas | CRUD completo, 3 tipos: Tarefa, Compra, Lembrete; cor personalizável |
| Itens | Criar, editar, marcar como concluído, excluir; campos extras por tipo |
| Tarefas | Campo de data de vencimento, descrição livre |
| Compras | Quantidade + unidade (kg, un, L…) |
| Lembretes | Data de vencimento + descrição |
| Dashboard | Contadores por tipo + listas recentes |
| Isolamento | Cada usuário vê apenas suas próprias listas e itens |

---

## Arquitetura

```
Browser (React SPA)
       │  HTTP :8080
       ▼
  nginx (container web)
   ├── /              → arquivos estáticos (React build)
   └── /api/*         → proxy reverso
                            │
                            ▼
              API REST (container api :3333)
                Express + TypeScript + Prisma
                            │
                            ▼
                   PostgreSQL 16 (container postgres :5432)
```

A comunicação entre containers é interna ao Docker — apenas a porta `8080` é exposta para o host.

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Front-end | React 18 + Vite + TypeScript + Tailwind CSS |
| Estado / dados | TanStack Query v5 + React Hook Form + Zod |
| Roteamento | React Router v6 |
| Back-end | Node.js 20 + Express + TypeScript |
| ORM | Prisma 5 (migrations versionadas) |
| Banco de dados | PostgreSQL 16 |
| Autenticação | JWT (jsonwebtoken) + bcrypt |
| Testes | Vitest + Supertest (22 testes) |
| Monorepo | npm workspaces |
| Containerização | Docker + nginx |

---

## Estrutura de pastas

```
TCC/
├── apps/
│   ├── api/                    Back-end Node.js + Express
│   │   ├── Dockerfile
│   │   ├── entrypoint.sh       migrate → seed → start
│   │   ├── prisma/
│   │   │   ├── schema.prisma   Definição do banco (User, List, Item)
│   │   │   ├── seed.ts         Dados de demonstração (idempotente)
│   │   │   └── migrations/     Histórico de migrations SQL
│   │   └── src/
│   │       ├── config/         Variáveis de ambiente e Prisma singleton
│   │       ├── controllers/    Handlers de rota (auth, lists, items)
│   │       ├── middlewares/    Autenticação JWT e handler de erros
│   │       ├── repositories/   Acesso ao banco (queries Prisma)
│   │       ├── routes/         Registro de rotas Express
│   │       ├── services/       Regras de negócio
│   │       ├── validators/     Schemas Zod de validação
│   │       ├── types/          Augmentação do tipo Express.Request
│   │       └── tests/          auth.test.ts, list.test.ts, item.test.ts
│   └── web/                    Front-end React + Vite
│       ├── Dockerfile
│       ├── nginx.conf          Proxy /api/ + fallback SPA
│       └── src/
│           ├── components/     Componentes reutilizáveis de UI
│           ├── hooks/          useAuth, useLists, useItems
│           ├── lib/            Instância axios e QueryClient
│           ├── pages/          Login, Register, Dashboard, Lists, ListDetail
│           ├── routes/         Router e ProtectedRoute
│           └── services/       Chamadas à API REST
├── packages/
│   └── shared/                 Tipos TypeScript e schemas Zod compartilhados
├── docs/                       Documentação acadêmica
├── docker-compose.yml          Orquestra postgres + api + web
├── .dockerignore
└── README.md
```

---

## Endpoints da API

```
POST   /api/auth/register          Criar conta
POST   /api/auth/login             Login → retorna JWT
GET    /api/auth/me                Dados do usuário autenticado 🔒

GET    /api/lists                  Listar listas do usuário 🔒
POST   /api/lists                  Criar lista 🔒
GET    /api/lists/:id              Detalhes de uma lista 🔒
PUT    /api/lists/:id              Editar lista 🔒
DELETE /api/lists/:id              Excluir lista (cascade itens) 🔒

GET    /api/lists/:id/items        Listar itens de uma lista 🔒
POST   /api/lists/:id/items        Criar item 🔒
GET    /api/items/:id              Detalhes de um item 🔒
PUT    /api/items/:id              Editar item 🔒
PATCH  /api/items/:id/toggle       Marcar/desmarcar como concluído 🔒
DELETE /api/items/:id              Excluir item 🔒
```

🔒 Requer cabeçalho `Authorization: Bearer <token>`

---

## Telas

| Rota | Descrição |
|---|---|
| `/login` | Formulário de login |
| `/register` | Cadastro de nova conta |
| `/` → `/dashboard` | Dashboard com contadores e listas recentes |
| `/lists` | Grade com todas as listas do usuário |
| `/lists/:id` | Itens da lista com barra de progresso e ações inline |

---

## Principais decisões técnicas

1. **Monorepo com npm workspaces** — um único `npm install` instala tudo sem overhead de Turborepo ou Lerna.
2. **`packages/shared`** — tipos TypeScript e schemas Zod compartilhados entre API e Web eliminam duplicação de validação.
3. **JWT stateless** — sem sessão no servidor; token armazenado em `localStorage` (adequado para MVP acadêmico).
4. **Prisma ORM** — migrations versionadas em SQL garantem reprodutibilidade do banco em qualquer ambiente.
5. **TanStack Query** — cache automático e invalidação após mutações, eliminando gerenciamento manual de estado assíncrono.
6. **Cascade delete no Prisma** — excluir uma lista remove todos os itens automaticamente.
7. **Isolamento por `ownerId`** — todas as queries filtram por `ownerId`, garantindo que cada usuário veja apenas seus dados.
8. **nginx como proxy reverso** — o browser faz chamadas `/api/...` para o mesmo host; o nginx encaminha internamente para a API, eliminando problemas de CORS em produção.
9. **Seed idempotente** — o seed verifica se o banco já tem dados antes de inserir, permitindo reinicializações seguras do Docker.

---

## Executar os testes (modo desenvolvimento)

Pré-requisitos: Node.js 20+, Docker Desktop.

```bash
# Instalar dependências
npm install

# Subir apenas o banco
docker compose up postgres -d

# Rodar os 22 testes (Vitest + Supertest)
npm run test
```

Saída esperada: **22 passed** em auth.test.ts, list.test.ts e item.test.ts.

---

## Configuração para desenvolvimento local

Útil para quem quer editar o código com hot reload.

```bash
# 1. Instalar dependências
npm install

# 2. Subir apenas o banco de dados
docker compose up postgres -d

# 3. Criar o arquivo de variáveis de ambiente da API
cp apps/api/.env.example apps/api/.env

# 4. Aplicar migrations e popular dados
npm run db:migrate
npm run db:seed

# 5. Iniciar API e Web em paralelo (hot reload)
npm run dev
```

URLs em modo desenvolvimento:
- Web: http://localhost:5173
- API: http://localhost:3333

---

## Comandos de referência

```bash
# Subir tudo em Docker (modo avaliação)
docker compose up --build

# Parar tudo
docker compose down

# Parar e apagar banco de dados
docker compose down -v

# Reconstruir imagens após alterações no código
docker compose up --build --force-recreate

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f api
```

---

## Limitações conhecidas

- Token JWT em `localStorage` (adequado para MVP acadêmico; produção recomendaria cookies httpOnly)
- Sem paginação (adequado para o volume de um usuário individual)
- Sem upload de arquivos ou imagens
- Sem suporte a múltiplos idiomas

---

Desenvolvido como Trabalho de Conclusão de Curso — Pós-Graduação em Desenvolvimento Full Stack, 2026.
