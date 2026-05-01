import { api } from '../lib/api';
import type { List } from '../types';
import type { ListInput, UpdateListInput } from '@tcc/shared';

export async function getLists(): Promise<List[]> {
  const res = await api.get<List[]>('/lists');
  return res.data;
}

export async function getList(id: string): Promise<List> {
  const res = await api.get<List>(`/lists/${id}`);
  return res.data;
}

export async function createList(data: ListInput): Promise<List> {
  const res = await api.post<List>('/lists', data);
  return res.data;
}

export async function updateList(id: string, data: UpdateListInput): Promise<List> {
  const res = await api.put<List>(`/lists/${id}`, data);
  return res.data;
}

export async function deleteList(id: string): Promise<void> {
  await api.delete(`/lists/${id}`);
}
