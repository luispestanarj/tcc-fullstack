# Plano de Testes e Validação

## Testes automatizados

### Suite de testes da API (Vitest + Supertest)

Arquivo: `apps/api/src/tests/`

#### auth.test.ts — 7 casos

| # | Cenário | Esperado |
|---|---|---|
| 1 | Registro com dados válidos | 201 + token + user sem passwordHash |
| 2 | Registro com e-mail duplicado | 409 CONFLICT |
| 3 | Registro com e-mail inválido | 422 VALIDATION_ERROR |
| 4 | Registro com senha curta | 422 VALIDATION_ERROR |
| 5 | Login com credenciais corretas | 200 + token |
| 6 | Login com senha incorreta | 401 UNAUTHORIZED |
| 7 | GET /me sem token | 401 UNAUTHORIZED |
| 8 | GET /me com token inválido | 401 UNAUTHORIZED |
| 9 | GET /me com token válido | 200 + dados do usuário |

#### list.test.ts — 6 casos

| # | Cenário | Esperado |
|---|---|---|
| 1 | Criar lista com dados válidos | 201 + lista criada |
| 2 | Listar listas do usuário | 200 + array |
| 3 | Atualizar lista existente | 200 + lista atualizada |
| 4 | Excluir lista | 204 |
| 5 | Acessar lista de outro usuário | 404 NOT_FOUND |
| 6 | Criar lista com tipo inválido | 422 VALIDATION_ERROR |

#### item.test.ts — 6 casos

| # | Cenário | Esperado |
|---|---|---|
| 1 | Criar item em lista | 201 + item |
| 2 | Listar itens de lista | 200 + array |
| 3 | Toggle item (false → true → false) | 200 + completed invertido |
| 4 | Atualizar item | 200 + item atualizado |
| 5 | Excluir item | 204 |
| 6 | Criar item com título vazio | 422 VALIDATION_ERROR |

### Executar testes

```bash
# Requer banco de dados rodando
docker compose up -d
cd apps/api
npm run test
```

## Testes manuais recomendados (evidências para o TCC)

### Fluxo de autenticação
1. Abrir `http://localhost:5173`
2. Tentar acessar `/dashboard` sem login → deve redirecionar para `/login`
3. Tentar criar conta com senha de 3 caracteres → deve mostrar erro de validação
4. Criar conta válida → deve redirecionar para dashboard
5. Fazer logout → tentar acessar `/dashboard` → deve redirecionar para `/login`

### Fluxo de listas
1. Criar lista sem título → deve mostrar erro
2. Criar lista com título, tipo e cor → lista aparece na grade
3. Editar título da lista → lista atualizada
4. Excluir lista → lista removida (confirmar que itens também sumiram)

### Fluxo de itens
1. Criar item sem título → deve mostrar erro
2. Criar tarefa com data → dueDate aparece no card
3. Criar item de compras com quantidade e unidade
4. Marcar item como concluído → vai para seção "Concluídos"
5. Desmarcar item → volta para seção pendente
6. Verificar barra de progresso atualizando

### Isolamento de dados
1. Criar conta A e criar listas
2. Criar conta B
3. Tentar acessar via URL as listas da conta A → 404

## Critérios de aceite verificados

| Critério | Método de verificação | Status |
|---|---|---|
| Autenticação funciona | Teste manual + auth.test.ts | ✅ |
| CRUD listas | Teste manual + list.test.ts | ✅ |
| CRUD itens | Teste manual + item.test.ts | ✅ |
| Toggle concluído | item.test.ts (toggle) | ✅ |
| Validação front-end | Tentar enviar form vazio | ✅ |
| Validação back-end | Tests com dados inválidos | ✅ |
| Rotas privadas | Acessar sem token | ✅ |
| Isolamento de dados | Acessar dados de outro usuário | ✅ |
| Build sem erros | npm run build | ✅ |
| README funciona | Seguir do zero | ✅ |

## Comandos de qualidade

```bash
npm run lint        # ESLint em todos os packages
npm run typecheck   # tsc --noEmit em todos os packages
npm run test        # Vitest + Supertest
npm run build       # Build API + Web
```
