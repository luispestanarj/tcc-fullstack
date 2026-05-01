# Jornada do Usuário

## Caso de uso 1 — Primeiro acesso

1. Usuário acessa `http://localhost:5173`
2. É redirecionado para `/login`
3. Clica em "Cadastre-se"
4. Preenche nome, e-mail e senha
5. É redirecionado para `/dashboard`
6. Vê dashboard com contadores zerados

## Caso de uso 2 — Criar uma lista de tarefas

1. Usuário clica em "Minhas Listas" na barra lateral
2. Clica em "+ Nova lista"
3. Preenche título "Tarefas do dia", seleciona tipo "Tarefas", escolhe cor azul
4. Clica em "Criar lista"
5. A lista aparece na grade
6. Clica em "Ver itens"

## Caso de uso 3 — Gerenciar itens de uma lista

1. Na tela de detalhe, clica em "+ Novo item"
2. Preenche "Estudar para a prova"
3. Adiciona data/hora opcional
4. Clica em "Criar item"
5. O item aparece na lista com checkbox desmarcado
6. Clica no checkbox → item fica marcado como concluído e vai para a seção "Concluídos"
7. A barra de progresso atualiza

## Caso de uso 4 — Lista de compras

1. Cria lista do tipo "Compras"
2. Adiciona item "Arroz", quantidade 5, unidade "kg"
3. No mercado, marca os itens conforme compra
4. Barra de progresso avança

## Caso de uso 5 — Editar e excluir

1. Clica no ícone ✏️ de uma lista → abre modal com dados pré-preenchidos
2. Altera o título → clica em "Salvar"
3. Clica no ícone 🗑️ → confirmação aparece
4. Confirma exclusão → lista é removida

## Caso de uso 6 — Novo acesso (sessão persistida)

1. Usuário fecha o navegador e reabre
2. Token ainda está em localStorage
3. Acessa `/dashboard` diretamente sem precisar fazer login
4. `/api/auth/me` valida o token e retorna os dados

## Caso de uso 7 — Logout

1. Clica em "Sair" na barra lateral
2. Token é removido do localStorage
3. É redirecionado para `/login`
4. Tentar acessar `/dashboard` redireciona para `/login`

## Restrições de acesso verificadas

- Rota sem token → redirect `/login`
- Token expirado → redirect `/login` (interceptor axios)
- Tentativa de acessar lista de outro usuário via URL → 404
