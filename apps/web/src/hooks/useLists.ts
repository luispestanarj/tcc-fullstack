import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as listService from '../services/listService';
import type { ListInput, UpdateListInput } from '@tcc/shared';

export const listKeys = {
  all: ['lists'] as const,
  detail: (id: string) => ['lists', id] as const,
};

export function useLists() {
  return useQuery({ queryKey: listKeys.all, queryFn: listService.getLists });
}

export function useList(id: string) {
  return useQuery({ queryKey: listKeys.detail(id), queryFn: () => listService.getList(id) });
}

export function useCreateList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ListInput) => listService.createList(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: listKeys.all }),
  });
}

export function useUpdateList(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateListInput) => listService.updateList(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKeys.all });
      qc.invalidateQueries({ queryKey: listKeys.detail(id) });
    },
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listService.deleteList(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: listKeys.all }),
  });
}
