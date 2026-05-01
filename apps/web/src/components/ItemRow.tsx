import type { Item } from '../types';
import { Button } from './Button';

interface ItemRowProps {
  item: Item;
  onToggle: (id: string) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  isTogglingId?: string | null;
}

export function ItemRow({ item, onToggle, onEdit, onDelete, isTogglingId }: ItemRowProps) {
  const isToggling = isTogglingId === item.id;
  const dueDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString('pt-BR') : null;

  return (
    <div className={`flex items-start gap-3 rounded-lg border bg-white p-3 transition-opacity ${item.completed ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onToggle(item.id)}
        disabled={isToggling}
        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 transition-colors ${item.completed ? 'border-blue-500 bg-blue-500' : 'border-gray-300 hover:border-blue-400'}`}
        aria-label={item.completed ? 'Desmarcar' : 'Marcar como concluído'}
      >
        {item.completed && <span className="flex h-full items-center justify-center text-white text-xs">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.title}</p>
        {item.description && <p className="mt-0.5 text-xs text-gray-500 truncate">{item.description}</p>}
        <div className="mt-1 flex gap-3 text-xs text-gray-400">
          {item.quantity != null && <span>{item.quantity} {item.unit ?? 'un'}</span>}
          {dueDate && <span>📅 {dueDate}</span>}
        </div>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>✏️</Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>🗑️</Button>
      </div>
    </div>
  );
}
