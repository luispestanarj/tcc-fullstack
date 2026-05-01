# Modelo de Banco de Dados

## Diagrama de entidades (texto)

```
users
  id           UUID PK
  name         VARCHAR
  email        VARCHAR UNIQUE
  passwordHash VARCHAR
  role         ENUM(USER, ADMIN)
  createdAt    TIMESTAMP
  updatedAt    TIMESTAMP

lists
  id           UUID PK
  title        VARCHAR
  type         ENUM(TASK, SHOPPING, REMINDER)
  color        VARCHAR NULL
  ownerId      UUID FK → users.id
  createdAt    TIMESTAMP
  updatedAt    TIMESTAMP

items
  id           UUID PK
  title        VARCHAR
  description  TEXT NULL
  completed    BOOLEAN DEFAULT false
  quantity     INTEGER NULL
  unit         VARCHAR NULL
  dueDate      TIMESTAMP NULL
  position     INTEGER DEFAULT 0
  listId       UUID FK → lists.id
  createdAt    TIMESTAMP
  updatedAt    TIMESTAMP
```

## Relacionamentos

- `users` 1:N `lists` (via `lists.ownerId`)
  - `ON DELETE CASCADE`: excluir usuário remove todas as listas
- `lists` 1:N `items` (via `items.listId`)
  - `ON DELETE CASCADE`: excluir lista remove todos os itens

## Campos por tipo de lista

| Campo | TASK | SHOPPING | REMINDER |
|---|---|---|---|
| title | ✅ obrigatório | ✅ obrigatório | ✅ obrigatório |
| description | ✅ opcional | ✅ opcional | ✅ opcional |
| completed | ✅ | ✅ | ✅ |
| quantity | — | ✅ opcional | — |
| unit | — | ✅ opcional | — |
| dueDate | ✅ opcional | — | ✅ opcional |

## Enums

```sql
-- Role
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- ListType
CREATE TYPE "ListType" AS ENUM ('TASK', 'SHOPPING', 'REMINDER');
```

## Índices implícitos

- `users.email` — UNIQUE (Prisma cria automaticamente)
- `lists.ownerId` — FK index
- `items.listId` — FK index
