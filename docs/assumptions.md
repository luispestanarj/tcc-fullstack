# Suposições do Projeto

Registradas conforme a seção 1 do prompt, para lacunas não cobertas pelo memorial.

| # | Suposição | Justificativa |
|---|---|---|
| 1 | Banco de dados: **PostgreSQL** | Memorial cita "banco de dados" sem especificar. PostgreSQL é o padrão acadêmico, tem suporte robusto com Docker e é pré-requisito do Prisma. |
| 2 | Linguagem: **TypeScript strict** | Memorial cita JavaScript e React. TypeScript adiciona segurança de tipos sem mudar a stack. |
| 3 | Autenticação: **JWT + bcrypt** | Memorial não menciona autenticação. O prompt exige controle de acesso e a combinação JWT + bcrypt é o padrão sem dependência de serviço externo. |
| 4 | ORM: **Prisma** | Memorial não menciona ORM. Prisma fornece migrations versionadas, type safety automática e é amplamente usado no ecossistema Node.js. |
| 5 | Estilo: **Tailwind CSS** | Memorial não menciona CSS framework. Tailwind permite UI responsiva com produtividade, sem depender de componentes de terceiros. |
| 6 | Lembretes sem recorrência | Memorial cita "lembretes simples". Optou-se por `dueDate` simples sem scheduler ou notificações push, mantendo o escopo viável. |
| 7 | Itens de compra: quantidade + unidade opcionais | Memorial cita lista de compras sem especificar campos. `quantity` e `unit` adicionam utilidade sem complexidade. |
| 8 | Sem colaboração entre usuários | Memorial foca em uso individual. Cada lista tem apenas um `ownerId`. |
| 9 | Sem upload de arquivos ou imagens | Fora do escopo do memorial. |
| 10 | Role `ADMIN` sem painel | O campo existe no modelo para extensão futura. No MVP, todos os usuários têm as mesmas funcionalidades. |
