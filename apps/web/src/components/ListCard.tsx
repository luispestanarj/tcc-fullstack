import { Link } from 'react-router-dom';
import type { List } from '../types';
import { Button } from './Button';

const typeLabels = { TASK: 'Tarefas', SHOPPING: 'Compras', REMINDER: 'Lembretes' };
const typeIcons = { TASK: '✅', SHOPPING: '🛒', REMINDER: '🔔' };

interface ListCardProps {
  list: List;
  onEdit: (list: List) => void;
  onDelete: (list: List) => void;
}

export function ListCard({ list, onEdit, onDelete }: ListCardProps) {
  const count = list._count?.items ?? 0;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[list.type]}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{list.title}</h3>
            <span className="text-xs text-gray-400">{typeLabels[list.type]}</span>
          </div>
        </div>
        {list.color && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: list.color }} />}
      </div>
      <p className="mb-4 text-sm text-gray-500">{count} {count === 1 ? 'item' : 'itens'}</p>
      <div className="flex gap-2">
        <Link to={`/lists/${list.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">Ver itens</Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => onEdit(list)}>✏️</Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(list)}>🗑️</Button>
      </div>
    </div>
  );
}
