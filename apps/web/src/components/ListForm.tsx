import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listSchema, type ListInput, type UpdateListInput } from '@tcc/shared';
import type { List } from '../types';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface ListFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ListInput | UpdateListInput) => void;
  editingList?: List | null;
  isLoading?: boolean;
}

const LIST_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

export function ListForm({ open, onClose, onSubmit, editingList, isLoading }: ListFormProps) {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<ListInput>({
    resolver: zodResolver(listSchema),
    defaultValues: { title: '', type: 'TASK', color: LIST_COLORS[0] },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (editingList) {
      reset({ title: editingList.title, type: editingList.type, color: editingList.color ?? LIST_COLORS[0] });
    } else {
      reset({ title: '', type: 'TASK', color: LIST_COLORS[0] });
    }
  }, [editingList, reset]);

  return (
    <Modal open={open} onClose={onClose} title={editingList ? 'Editar lista' : 'Nova lista'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Título" placeholder="Ex: Compras da semana" error={errors.title?.message} {...register('title')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tipo</label>
          <select {...register('type')} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="TASK">✅ Tarefas</option>
            <option value="SHOPPING">🛒 Compras</option>
            <option value="REMINDER">🔔 Lembretes</option>
          </select>
          {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Cor</label>
          <div className="flex gap-2">
            {LIST_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setValue('color', c)}
                className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>{editingList ? 'Salvar' : 'Criar lista'}</Button>
        </div>
      </form>
    </Modal>
  );
}
