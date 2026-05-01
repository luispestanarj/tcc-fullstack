import { prisma } from '../config/database';
import type { ListInput, UpdateListInput } from '@tcc/shared';

export async function findAllByOwner(ownerId: string) {
  return prisma.list.findMany({
    where: { ownerId },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: string, ownerId: string) {
  return prisma.list.findFirst({
    where: { id, ownerId },
    include: { _count: { select: { items: true } } },
  });
}

export async function create(data: ListInput & { ownerId: string }) {
  return prisma.list.create({
    data: { title: data.title, type: data.type, color: data.color ?? null, ownerId: data.ownerId },
    include: { _count: { select: { items: true } } },
  });
}

export async function update(id: string, ownerId: string, data: UpdateListInput) {
  return prisma.list.updateMany({
    where: { id, ownerId },
    data: { title: data.title, type: data.type, color: data.color },
  });
}

export async function remove(id: string, ownerId: string) {
  return prisma.list.deleteMany({ where: { id, ownerId } });
}
