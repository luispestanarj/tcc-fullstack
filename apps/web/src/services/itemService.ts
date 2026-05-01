import { api } from '../lib/api';
import type { Item } from '../types';
import type { ItemInput, UpdateItemInput } from '@tcc/shared';

export async function getItems(listId: string): Promise<Item[]> {
  const res = await api.get<Item[]>(`/lists/${listId}/items`);
  return res.data;
}

export async function createItem(listId: string, data: ItemInput): Promise<Item> {
  const res = await api.post<Item>(`/lists/${listId}/items`, data);
  return res.data;
}

export async function updateItem(id: string, data: UpdateItemInput): Promise<Item> {
  const res = await api.put<Item>(`/items/${id}`, data);
  return res.data;
}

export async function toggleItem(id: string): Promise<Item> {
  const res = await api.patch<Item>(`/items/${id}/toggle`);
  return res.data;
}

export async function deleteItem(id: string): Promise<void> {
  await api.delete(`/items/${id}`);
}
