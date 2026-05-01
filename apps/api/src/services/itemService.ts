import * as itemRepo from '../repositories/itemRepository';
import * as listRepo from '../repositories/listRepository';
import { AppError } from '../middlewares/error';
import type { ItemInput, UpdateItemInput } from '@tcc/shared';

async function assertListOwnership(listId: string, ownerId: string) {
  const list = await listRepo.findById(listId, ownerId);
  if (!list) throw new AppError('Lista não encontrada', 404, 'NOT_FOUND');
  return list;
}

async function assertItemOwnership(itemId: string, ownerId: string) {
  const item = await itemRepo.findById(itemId);
  if (!item) throw new AppError('Item não encontrado', 404, 'NOT_FOUND');
  await assertListOwnership(item.listId, ownerId);
  return item;
}

export async function getItems(listId: string, ownerId: string) {
  await assertListOwnership(listId, ownerId);
  return itemRepo.findAllByList(listId);
}

export async function createItem(listId: string, ownerId: string, data: ItemInput) {
  await assertListOwnership(listId, ownerId);
  return itemRepo.create(listId, data);
}

export async function updateItem(itemId: string, ownerId: string, data: UpdateItemInput) {
  await assertItemOwnership(itemId, ownerId);
  return itemRepo.update(itemId, data);
}

export async function toggleItem(itemId: string, ownerId: string) {
  await assertItemOwnership(itemId, ownerId);
  return itemRepo.toggle(itemId);
}

export async function deleteItem(itemId: string, ownerId: string) {
  await assertItemOwnership(itemId, ownerId);
  await itemRepo.remove(itemId);
}
