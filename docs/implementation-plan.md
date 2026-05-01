# Plano de Implementação

## 1. Problema identificado

Pessoas usam cadernos, bloco de notas, mensagens para si mesmas e planilhas improvisadas para lembrar tarefas, compras e pequenos compromissos. Falta uma ferramenta web simples, rápida de abrir, fácil de entender e organizada por categorias.

## 2. Público-alvo

Usuário geral (adulto, com acesso à internet) que deseja organizar sua rotina pessoal sem precisar de ferramentas complexas.

## 3. Escopo do MVP

- Autenticação (cadastro e login)
- Gerenciamento de listas por tipo (tarefas, compras, lembretes)
- Gerenciamento de itens dentro de cada lista
- Marcar itens como concluídos/pendentes
- Interface web responsiva (desktop e mobile)

## 4. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | Usuário pode se cadastrar com nome, e-mail e senha |
| RF02 | Usuário pode fazer login e receber token JWT |
| RF03 | Usuário autenticado pode criar listas com título, tipo e cor |
| RF04 | Usuário pode listar, editar e excluir suas listas |
| RF05 | Usuário pode criar itens em uma lista |
| RF06 | Itens têm título, descrição opcional, data/hora opcional |
| RF07 | Itens de compras têm quantidade e unidade opcionais |
| RF08 | Usuário pode marcar/desmarcar itens como concluídos |
| RF09 | Usuário pode editar e excluir itens |
| RF10 | Usuário vê dashboard com contadores por tipo e listas recentes |

## 5. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | Senhas armazenadas com hash bcrypt (custo 10) |
| RNF02 | Todas as rotas privadas exigem JWT válido |
| RNF03 | Usuário acessa apenas dados de sua propriedade |
| RNF04 | Validações no front-end (Zod) e no back-end (Zod) |
| RNF05 | Erros retornam JSON padronizado `{ error, message, details? }` |
| RNF06 | Interface responsiva para desktop e mobile |
| RNF07 | Tempo de resposta da API < 500ms em ambiente local |

## 6. Regras de negócio

- RN01: E-mail deve ser único. Tentativa de cadastro com e-mail existente retorna 409.
- RN02: Credenciais inválidas retornam 401 com mensagem genérica (sem indicar qual campo está errado).
- RN03: Exclusão de lista remove em cascata todos os seus itens.
- RN04: Usuário só pode visualizar, editar e excluir listas e itens de sua própria propriedade.
- RN05: Título de lista e título de item são obrigatórios.
- RN06: Tipo de lista deve ser TASK, SHOPPING ou REMINDER.

## 7. Entidades e relacionamentos

```
User 1──N List 1──N Item
```

- Um usuário pode ter muitas listas
- Uma lista pertence a um único usuário
- Uma lista pode ter muitos itens
- Um item pertence a uma única lista

## 8. Telas previstas

| Rota | Descrição |
|---|---|
| `/login` | Login com e-mail e senha |
| `/register` | Cadastro de nova conta |
| `/dashboard` | Resumo: contadores por tipo + listas recentes |
| `/lists` | Grade com todas as listas do usuário |
| `/lists/:id` | Itens de uma lista com barra de progresso |
| Modal ListForm | Criar/editar lista |
| Modal ItemForm | Criar/editar item |
| Modal DeleteConfirm | Confirmação de exclusão |

## 9. Endpoints previstos

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/lists
POST   /api/lists
GET    /api/lists/:id
PUT    /api/lists/:id
DELETE /api/lists/:id

GET    /api/lists/:listId/items
POST   /api/lists/:listId/items
PUT    /api/items/:id
PATCH  /api/items/:id/toggle
DELETE /api/items/:id

GET    /api/health
```

## 10. Critérios de aceite

| # | Critério | Como verificar |
|---|---|---|
| CA01 | Usuário se autentica com JWT | Login retorna token; `/api/auth/me` retorna dados do usuário |
| CA02 | CRUD completo de listas funciona | Criar, listar, editar, excluir via API ou interface |
| CA03 | CRUD completo de itens funciona | Criar, listar, editar, excluir itens |
| CA04 | Toggle de item funciona | `PATCH /api/items/:id/toggle` inverte `completed` |
| CA05 | Dados persistem no PostgreSQL | Reiniciar API e verificar dados no banco |
| CA06 | Validação funciona | Campos obrigatórios retornam 422 com detalhes |
| CA07 | Isolamento de dados | Usuário B não consegue acessar dados do Usuário A |
| CA08 | README permite execução do zero | Seguir README em ambiente limpo |
| CA09 | Testes passam | `npm run test` retorna sucesso |
| CA10 | Build compila sem erros | `npm run build` retorna sucesso |
