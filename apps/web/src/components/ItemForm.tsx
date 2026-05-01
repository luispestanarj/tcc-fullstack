import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, type ItemInput } from '@tcc/shared';
import type { Item, ListType } from '../types';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ItemInput) => void;
  listType: ListType;
  editingItem?: Item | null;
  isLoading?: boolean;
}

export function ItemForm({ open, onClose, onSubmit, listType, editingItem, isLoading }: ItemFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: { title: '', description: '', quantity: undefined, unit: '', dueDate: undefined },
  });

  useEffect(() => {
    if (editingItem) {
      reset({
        title: editingItem.title,
        description: editingItem.description ?? '',
        quantity: editingItem.quantity ?? undefined,
        unit: editingItem.unit ?? '',
        dueDate: editingItem.dueDate ? new Date(editingItem.dueDate).toISOString().slice(0, 16) : undefined,
      });
    } else {
      reset({ title: '', description: '', quantity: undefined, unit: '', dueDate: undefined });
    }
  }, [editingItem, reset]);

  const title = editingItem ? 'Editar item' : 'Novo item';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Título *" placeholder="Ex: Comprar leite" error={errors.title?.message} {...register('title')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <textarea {...register('description')} rows={2} placeholder="Detalhes opcionais..."
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
        </div>
        {listType === 'SHOPPING' && (
          <div className="flex gap-3">
            <div className="flex-1">
              <Input label="Quantidade" type="number" min={1} error={errors.quantity?.message} {...register('quantity', { valueAsNumber: true })} />
            </div>
            <div className="flex-1">
              <Input label="Unidade" placeholder="kg, un, L..." {...register('unit')} />
            </div>
          </div>
        )}
        {(listType === 'TASK' || listType === 'REMINDER') && (
          <Input label="Data/Hora (opcional)" type="datetime-local" {...register('dueDate')} />
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>{editingItem ? 'Salvar' : 'Criar item'}</Button>
        </div>
      </form>
    </Modal>
  );
}
