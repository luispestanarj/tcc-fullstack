import * as listRepo from '../repositories/listRepository';
import { AppError } from '../middlewares/error';
import type { ListInput, UpdateListInput } from '@tcc/shared';

export async function getLists(ownerId: string) {
  return listRepo.findAllByOwner(ownerId);
}

export async function getList(id: string, ownerId: string) {
  const list = await listRepo.findById(id, ownerId);
  if (!list) throw new AppError('Lista não encontrada', 404, 'NOT_FOUND');
  return list;
}

export async function createList(data: ListInput, ownerId: string) {
  return listRepo.create({ ...data, ownerId });
}

export async function updateList(id: string, ownerId: string, data: UpdateListInput) {
  await getList(id, ownerId);
  await listRepo.update(id, ownerId, data);
  const updated = await listRepo.findById(id, ownerId);
  if (!updated) throw new AppError('Lista não encontrada', 404, 'NOT_FOUND');
  return updated;
}

export async function deleteList(id: string, ownerId: string) {
  await getList(id, ownerId);
  await listRepo.remove(id, ownerId);
}
