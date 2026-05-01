import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as itemService from '../services/itemService';
import { listKeys } from './useLists';
import type { ItemInput, UpdateItemInput } from '@tcc/shared';

export const itemKeys = {
  byList: (listId: string) => ['items', listId] as const,
};

export function useItems(listId: string) {
  return useQuery({ queryKey: itemKeys.byList(listId), queryFn: () => itemService.getItems(listId) });
}

export function useCreateItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemInput) => itemService.createItem(listId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: itemKeys.byList(listId) }),
  });
}

export function useUpdateItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemInput }) => itemService.updateItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: itemKeys.byList(listId) }),
  });
}

export function useToggleItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemService.toggleItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: itemKeys.byList(listId) });
      qc.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

export function useDeleteItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemService.deleteItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: itemKeys.byList(listId) });
      qc.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}
