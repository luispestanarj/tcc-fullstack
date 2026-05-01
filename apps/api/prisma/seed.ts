import { PrismaClient, ListType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.user.count();
  if (exists > 0) {
    console.log('ℹ️  Banco já populado — seed ignorado.');
    return;
  }

  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: { name: 'Administrador', email: 'admin@tcc.dev', passwordHash: adminHash, role: 'ADMIN' },
  });

  const demoHash = await bcrypt.hash('demo123', 10);
  const demo = await prisma.user.create({
    data: { name: 'Usuário Demo', email: 'demo@tcc.dev', passwordHash: demoHash },
  });

  const lists: { title: string; type: ListType; color: string; ownerId: string }[] = [
    { title: 'Tarefas do Dia', type: 'TASK', color: '#3B82F6', ownerId: demo.id },
    { title: 'Compras da Semana', type: 'SHOPPING', color: '#10B981', ownerId: demo.id },
    { title: 'Lembretes Importantes', type: 'REMINDER', color: '#F59E0B', ownerId: demo.id },
    { title: 'Projeto TCC', type: 'TASK', color: '#8B5CF6', ownerId: admin.id },
  ];

  for (const listData of lists) {
    const list = await prisma.list.create({ data: listData });

    if (list.type === 'TASK') {
      await prisma.item.createMany({
        data: [
          { title: 'Revisar documentação da API', completed: true, listId: list.id, position: 0 },
          { title: 'Implementar testes de integração', completed: false, listId: list.id, position: 1, description: 'Usar Vitest + Supertest' },
          { title: 'Configurar Docker Compose', completed: true, listId: list.id, position: 2 },
          { title: 'Criar seed do banco de dados', completed: false, listId: list.id, position: 3 },
          { title: 'Escrever README completo', completed: false, listId: list.id, position: 4, dueDate: new Date('2026-05-15') },
        ],
      });
    } else if (list.type === 'SHOPPING') {
      await prisma.item.createMany({
        data: [
          { title: 'Arroz', completed: false, listId: list.id, position: 0, quantity: 5, unit: 'kg' },
          { title: 'Feijão', completed: false, listId: list.id, position: 1, quantity: 2, unit: 'kg' },
          { title: 'Leite', completed: true, listId: list.id, position: 2, quantity: 6, unit: 'un' },
          { title: 'Pão integral', completed: false, listId: list.id, position: 3, quantity: 1, unit: 'un' },
          { title: 'Ovos', completed: true, listId: list.id, position: 4, quantity: 12, unit: 'un' },
        ],
      });
    } else if (list.type === 'REMINDER') {
      await prisma.item.createMany({
        data: [
          { title: 'Pagar conta de internet', completed: false, listId: list.id, position: 0, dueDate: new Date('2026-05-10') },
          { title: 'Consulta médica', completed: false, listId: list.id, position: 1, dueDate: new Date('2026-05-20'), description: 'Levar exames anteriores' },
          { title: 'Renovar carteira de motorista', completed: true, listId: list.id, position: 2 },
          { title: 'Ligar para banco', completed: false, listId: list.id, position: 3 },
          { title: 'Devolver livro da biblioteca', completed: false, listId: list.id, position: 4, dueDate: new Date('2026-05-05') },
        ],
      });
    }
  }

  console.log('✅ Seed concluído!');
  console.log('   admin@tcc.dev / admin123');
  console.log('   demo@tcc.dev  / demo123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
