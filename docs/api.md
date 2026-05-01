# Documentação da API

Base URL: `http://localhost:3333/api`

Autenticação: `Authorization: Bearer <token>` (exceto rotas públicas)

Resposta de erro padrão:
```json
{ "error": "CODIGO", "message": "Mensagem legível", "details": {} }
```

---

## Saúde

### GET /health
```
curl http://localhost:3333/api/health
```
Resposta: `{ "status": "ok", "timestamp": "..." }`

---

## Autenticação

### POST /auth/register
Cria uma nova conta.

**Body:**
```json
{ "name": "Luis", "email": "luis@email.com", "password": "senha123" }
```
**Resposta 201:**
```json
{ "user": { "id": "...", "name": "Luis", "email": "luis@email.com", "role": "USER", "createdAt": "...", "updatedAt": "..." }, "token": "eyJ..." }
```
**Erros:** 409 (e-mail duplicado), 422 (validação)

---

### POST /auth/login
```json
{ "email": "luis@email.com", "password": "senha123" }
```
**Resposta 200:** igual ao register.  
**Erros:** 401 (credenciais inválidas), 422 (validação)

---

### GET /auth/me 🔒
Retorna dados do usuário autenticado.  
**Resposta 200:** objeto `User` (sem passwordHash)

---

## Listas 🔒

### GET /lists
Lista todas as listas do usuário autenticado.
```
curl -H "Authorization: Bearer TOKEN" http://localhost:3333/api/lists
```
**Resposta 200:** array de `List` com `_count.items`

---

### POST /lists
```json
{ "title": "Compras da semana", "type": "SHOPPING", "color": "#10B981" }
```
**Resposta 201:** objeto `List`  
**Erros:** 422 (validação — type deve ser TASK|SHOPPING|REMINDER)

---

### GET /lists/:id
**Resposta 200:** objeto `List`  
**Erros:** 404 (não encontrada ou não pertence ao usuário)

---

### PUT /lists/:id
Campos parciais aceitos (qualquer combinação de title, type, color).
```json
{ "title": "Novo título" }
```
**Resposta 200:** objeto `List` atualizado

---

### DELETE /lists/:id
**Resposta 204:** sem corpo. Remove lista e todos os itens em cascata.

---

## Itens 🔒

### GET /lists/:listId/items
Lista todos os itens de uma lista (ordenados por position, depois createdAt).  
**Resposta 200:** array de `Item`

---

### POST /lists/:listId/items
```json
{
  "title": "Comprar leite",
  "description": "Integral",
  "quantity": 6,
  "unit": "un",
  "dueDate": null
}
```
**Resposta 201:** objeto `Item`  
**Erros:** 422, 404 (lista não encontrada)

---

### PUT /items/:id
Campos parciais aceitos.
```json
{ "title": "Título atualizado", "description": "Nova descrição" }
```
**Resposta 200:** objeto `Item` atualizado

---

### PATCH /items/:id/toggle
Inverte o campo `completed` (sem body).  
**Resposta 200:** objeto `Item` com `completed` invertido

---

### DELETE /items/:id
**Resposta 204:** sem corpo.

---

## Tipos

### User
```typescript
{ id: string; name: string; email: string; role: 'USER'|'ADMIN'; createdAt: string; updatedAt: string }
```

### List
```typescript
{ id: string; title: string; type: 'TASK'|'SHOPPING'|'REMINDER'; color: string|null; ownerId: string; createdAt: string; updatedAt: string; _count?: { items: number } }
```

### Item
```typescript
{ id: string; title: string; description: string|null; completed: boolean; quantity: number|null; unit: string|null; dueDate: string|null; position: number; listId: string; createdAt: string; updatedAt: string }
```
