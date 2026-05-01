import { useState } from 'react';
import { useLists, useCreateList, useUpdateList, useDeleteList } from '../hooks/useLists';
import type { List } from '../types';
import type { ListInput, UpdateListInput } from '@tcc/shared';
import { Button } from '../components/Button';
import { ListCard } from '../components/ListCard';
import { ListForm } from '../components/ListForm';
import { DeleteConfirm } from '../components/DeleteConfirm';
import { Spinner } from '../components/Spinner';
import { useToast } from '../components/Toast';

export function ListsPage() {
  const { data: lists, isLoading } = useLists();
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [deletingList, setDeletingList] = useState<List | null>(null);

  const createList = useCreateList();
  const updateList = useUpdateList(editingList?.id ?? '');
  const deleteList = useDeleteList();

  async function handleSubmit(data: ListInput | UpdateListInput) {
    try {
      if (editingList) {
        await updateList.mutateAsync(data as UpdateListInput);
        toast.success('Lista atualizada!');
      } else {
        await createList.mutateAsync(data as ListInput);
        toast.success('Lista criada!');
      }
      setFormOpen(false);
      setEditingList(null);
    } catch {
      toast.error('Erro ao salvar lista. Tente novamente.');
    }
  }

  async function handleDelete() {
    if (!deletingList) return;
    try {
      await deleteList.mutateAsync(deletingList.id);
      toast.success('Lista excluída!');
      setDeletingList(null);
    } catch {
      toast.error('Erro ao excluir lista. Tente novamente.');
    }
  }

  function openEdit(list: List) {
    setEditingList(list);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingList(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Listas</h1>
          <p className="text-sm text-gray-500">{lists?.length ?? 0} {lists?.length === 1 ? 'lista' : 'listas'}</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>+ Nova lista</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : lists?.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium text-gray-700">Nenhuma lista ainda</p>
          <p className="text-sm text-gray-400 mb-4">Crie sua primeira lista para começar a organizar</p>
          <Button onClick={() => setFormOpen(true)}>Criar lista</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists?.map((list) => (
            <ListCard key={list.id} list={list} onEdit={openEdit} onDelete={setDeletingList} />
          ))}
        </div>
      )}

      <ListForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        editingList={editingList}
        isLoading={createList.isPending || updateList.isPending}
      />

      <DeleteConfirm
        open={!!deletingList}
        onClose={() => setDeletingList(null)}
        onConfirm={handleDelete}
        title={deletingList?.title ?? ''}
        description="Todos os itens dentro dessa lista também serão excluídos."
        isLoading={deleteList.isPending}
      />
    </div>
  );
}
