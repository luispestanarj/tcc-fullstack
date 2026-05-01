import { prisma } from '../config/database';
import type { ItemInput, UpdateItemInput } from '@tcc/shared';

export async function findAllByList(listId: string) {
  return prisma.item.findMany({
    where: { listId },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function findById(id: string) {
  return prisma.item.findUnique({ where: { id } });
}

export async function create(listId: string, data: ItemInput) {
  const count = await prisma.item.count({ where: { listId } });
  return prisma.item.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      quantity: data.quantity ?? null,
      unit: data.unit ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      position: data.position ?? count,
      listId,
    },
  });
}

export async function update(id: string, data: UpdateItemInput) {
  return prisma.item.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      quantity: data.quantity,
      unit: data.unit,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      position: data.position,
    },
  });
}

export async function toggle(id: string) {
  const item = await prisma.item.findUnique({ where: { id }, select: { completed: true } });
  if (!item) return null;
  return prisma.item.update({
    where: { id },
    data: { completed: !item.completed },
  });
}

export async function remove(id: string) {
  return prisma.item.delete({ where: { id } });
}
