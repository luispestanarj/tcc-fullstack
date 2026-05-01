# Checklist de Evidências para o TCC

Use esta lista para capturar prints, logs e saídas de comandos que devem compor o documento acadêmico.

## Evidências de instalação e configuração

- [ ] **E01** — Print do terminal com `docker compose up -d` e status do container `tcc_postgres` como "healthy"
- [ ] **E02** — Print do terminal com `npm install` concluído sem erros (packages instalados)
- [ ] **E03** — Print do terminal com `npm run db:migrate` executado com sucesso (migration aplicada)
- [ ] **E04** — Print do terminal com `npm run db:seed` e saída "✅ Seed concluído!"
- [ ] **E05** — Print do arquivo `.env` configurado (ocultar o JWT_SECRET)

## Evidências da API

- [ ] **E06** — Print do terminal com `npm run dev` mostrando "🚀 API rodando em http://localhost:3333"
- [ ] **E07** — Print do resultado de `curl http://localhost:3333/api/health` retornando `{"status":"ok"}`
- [ ] **E08** — Print do resultado de `POST /api/auth/login` com demo@tcc.dev retornando token JWT
- [ ] **E09** — Print do resultado de `GET /api/lists` com `Authorization: Bearer <token>` retornando as listas
- [ ] **E10** — Print do resultado de `POST /api/lists` criando uma nova lista
- [ ] **E11** — Print de resposta 401 ao tentar acessar `/api/auth/me` sem token
- [ ] **E12** — Print de resposta 422 com erros de validação ao criar item sem título

## Evidências do banco de dados

- [ ] **E13** — Print de `docker exec tcc_postgres psql -U tcc_user -d tcc_db -c "SELECT * FROM users"` mostrando registros
- [ ] **E14** — Print de `SELECT * FROM lists` mostrando listas do seed
- [ ] **E15** — Print de `SELECT * FROM items` mostrando itens com status variado

## Evidências dos testes

- [ ] **E16** — Print do terminal com `npm run test` mostrando todos os testes passando (auth, list, item)
- [ ] **E17** — Print do relatório de testes com número de casos: passou/falhou/ignorado

## Evidências do front-end

- [ ] **E18** — Print da tela de login (`/login`)
- [ ] **E19** — Print da tela de cadastro (`/register`)
- [ ] **E20** — Print do dashboard com os três contadores (tarefas, compras, lembretes)
- [ ] **E21** — Print da tela de listas com cards visíveis
- [ ] **E22** — Print da tela de detalhe de uma lista com itens e barra de progresso
- [ ] **E23** — Print do modal de criação de lista aberto
- [ ] **E24** — Print do modal de criação de item aberto (lista de compras, mostrando quantidade/unidade)
- [ ] **E25** — Print de um item marcado como concluído (com checkbox marcado e texto riscado)
- [ ] **E26** — Print de mensagem de erro de validação no formulário de login (campo vazio)
- [ ] **E27** — Print de toast de sucesso após criar ou editar um item
- [ ] **E28** — Print do modal de confirmação de exclusão
- [ ] **E29** — Print da tela em resolução mobile (DevTools → toggle device toolbar)

## Evidências de qualidade

- [ ] **E30** — Print do terminal com `npm run lint` sem erros
- [ ] **E31** — Print do terminal com `npm run typecheck` sem erros
- [ ] **E32** — Print do terminal com `npm run build` concluído com sucesso (API e Web)

## Estrutura do projeto

- [ ] **E33** — Print da estrutura de pastas do projeto (usar `tree /F /A` no Windows ou extensão VSCode)
- [ ] **E34** — Print do `package.json` raiz mostrando workspaces
- [ ] **E35** — Print do `schema.prisma` completo

## Como capturar as evidências do banco

```bash
# Conectar ao PostgreSQL no container
docker exec -it tcc_postgres psql -U tcc_user -d tcc_db

# Dentro do psql:
\dt                          -- lista tabelas
SELECT * FROM users;         -- usuários criados
SELECT id, title, type FROM lists;   -- listas
SELECT id, title, completed, "listId" FROM items;  -- itens
\q                           -- sair
```

## Como capturar as evidências da API com curl

```bash
# Login e capturar token
TOKEN=$(curl -s -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@tcc.dev","password":"demo123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Usar token
curl -H "Authorization: Bearer $TOKEN" http://localhost:3333/api/lists
```
