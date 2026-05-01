# Arquitetura do Sistema

## Visão geral

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│   apps/web      │  HTTP   │   apps/api       │  TCP    │  PostgreSQL  │
│  React + Vite   │────────▶│  Express + TS    │────────▶│  via Docker  │
│  Tailwind CSS   │         │  Prisma ORM      │         │              │
└─────────────────┘         └─────────────────┘         └──────────────┘
         │                           │
         │                  packages/shared
         └───────────────────────────┘
              (tipos e schemas Zod)
```

## Estrutura de camadas — Back-end

```
Requisição HTTP
    ↓
routes/          (roteamento Express)
    ↓
middlewares/     (autenticação JWT, validação)
    ↓
controllers/     (extrai dados, chama serviço, formata resposta)
    ↓
services/        (regras de negócio, orquestra repositórios)
    ↓
repositories/    (acesso ao banco via Prisma)
    ↓
PostgreSQL
```

## Estrutura de camadas — Front-end

```
Páginas (pages/)
    ↓
Componentes (components/)
    ↓
Hooks (hooks/) ← TanStack Query, AuthContext
    ↓
Serviços (services/) ← chamadas HTTP via axios
    ↓
API REST (apps/api)
```

## Fluxo de autenticação

```
1. Usuário envia {email, password} → POST /api/auth/login
2. API verifica bcrypt hash no banco
3. API gera JWT com {sub: userId, email, role}
4. Cliente armazena token em localStorage
5. Cada requisição subsequente inclui: Authorization: Bearer <token>
6. Middleware authenticate() verifica e decodifica o token
7. req.user é populado com o payload JWT
```

## Pacote shared

`packages/shared` centraliza:
- **Tipos TypeScript**: `User`, `List`, `Item`, enums (`Role`, `ListType`)
- **Schemas Zod**: `registerSchema`, `loginSchema`, `listSchema`, `itemSchema` e variantes parciais

Isso garante que front-end e back-end compartilham as mesmas regras de validação sem duplicação.

## Gerenciamento de estado — Front-end

- **TanStack Query**: cache de dados do servidor, invalidação automática após mutações
- **AuthContext**: estado do usuário autenticado (via React Context)
- **React Hook Form + Zod**: estado de formulários com validação cliente

## Decisões técnicas

| Decisão | Alternativa considerada | Razão da escolha |
|---|---|---|
| Prisma ORM | TypeORM, Sequelize | Type safety gerada automaticamente, migrations simples |
| JWT stateless | Sessions/cookies | Sem necessidade de armazenamento de sessão no servidor |
| npm workspaces | Turborepo, Nx | Suficiente para o escopo, sem overhead de configuração |
| Tailwind CSS | Material UI, Ant Design | Controle total do CSS, sem dependência de componentes pesados |
| TanStack Query | SWR, Redux | API simples, invalidação automática de cache |
