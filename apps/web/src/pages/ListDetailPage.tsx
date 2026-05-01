import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useList } from '../hooks/useLists';
import { useItems, useCreateItem, useUpdateItem, useToggleItem, useDeleteItem } from '../hooks/useItems';
import type { Item } from '../types';
import type { ItemInput, UpdateItemInput } from '@tcc/shared';
import { Button } from '../components/Button';
import { ItemRow } from '../components/ItemRow';
import { ItemForm } from '../components/ItemForm';
import { DeleteConfirm } from '../components/DeleteConfirm';
import { Spinner } from '../components/Spinner';
import { useToast } from '../components/Toast';

const typeConfig = {
  TASK: { label: 'Tarefas', icon: '✅' },
  SHOPPING: { label: 'Compras', icon: '🛒' },
  REMINDER: { label: 'Lembretes', icon: '🔔' },
};

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const listId = id!;
  const toast = useToast();

  const { data: list, isLoading: listLoading } = useList(listId);
  const { data: items, isLoading: itemsLoading } = useItems(listId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const createItem = useCreateItem(listId);
  const updateItem = useUpdateItem(listId);
  const toggleItem = useToggleItem(listId);
  const deleteItem = useDeleteItem(listId);

  async function handleSubmit(data: ItemInput | UpdateItemInput) {
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, data: data as UpdateItemInput });
        toast.success('Item atualizado!');
      } else {
        await createItem.mutateAsync(data as ItemInput);
        toast.success('Item criado!');
      }
      setFormOpen(false);
      setEditingItem(null);
    } catch {
      toast.error('Erro ao salvar item.');
    }
  }

  async function handleToggle(itemId: string) {
    setTogglingId(itemId);
    try {
      await toggleItem.mutateAsync(itemId);
    } catch {
      toast.error('Erro ao atualizar item.');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;
    try {
      await deleteItem.mutateAsync(deletingItem.id);
      toast.success('Item excluído!');
      setDeletingItem(null);
    } catch {
      toast.error('Erro ao excluir item.');
    }
  }

  function openEdit(item: Item) {
    setEditingItem(item);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingItem(null);
  }

  const isLoading = listLoading || itemsLoading;
  const doneCount = items?.filter((i) => i.completed).length ?? 0;
  const totalCount = items?.length ?? 0;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (!list) return <div className="py-12 text-center text-gray-500">Lista não encontrada.</div>;

  const cfg = typeConfig[list.type];

  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/lists" className="hover:text-gray-600">Listas</Link>
          <span>/</span>
          <span className="text-gray-700">{list.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cfg.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{list.title}</h1>
              <p className="text-sm text-gray-400">{cfg.label} · {doneCount}/{totalCount} concluídos</p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)}>+ Novo item</Button>
        </div>
        {totalCount > 0 && (
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-right text-xs text-gray-400">{progress}%</p>
          </div>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <p className="text-4xl mb-3">{cfg.icon}</p>
          <p className="font-medium text-gray-700">Nenhum item ainda</p>
          <p className="text-sm text-gray-400 mb-4">Adicione o primeiro item a esta lista</p>
          <Button onClick={() => setFormOpen(true)}>Adicionar item</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items?.filter((i) => !i.completed).map((item) => (
            <ItemRow key={item.id} item={item} onToggle={handleToggle} onEdit={openEdit} onDelete={setDeletingItem} isTogglingId={togglingId} />
          ))}
          {doneCount > 0 && (
            <>
              <p className="mt-4 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Concluídos ({doneCount})</p>
              {items?.filter((i) => i.completed).map((item) => (
                <ItemRow key={item.id} item={item} onToggle={handleToggle} onEdit={openEdit} onDelete={setDeletingItem} isTogglingId={togglingId} />
              ))}
            </>
          )}
        </div>
      )}

      <ItemForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        listType={list.type}
        editingItem={editingItem}
        isLoading={createItem.isPending || updateItem.isPending}
      />

      <DeleteConfirm
        open={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        title={deletingItem?.title ?? ''}
        isLoading={deleteItem.isPending}
      />
    </div>
  );
}
