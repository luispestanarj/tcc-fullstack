import { Modal } from './Modal';
import { Button } from './Button';

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  isLoading?: boolean;
}

export function DeleteConfirm({ open, onClose, onConfirm, title, description, isLoading }: DeleteConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmar exclusão">
      <p className="text-sm text-gray-700">
        Tem certeza que deseja excluir <strong>{title}</strong>?
        {description && <span className="block mt-1 text-gray-500">{description}</span>}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>Excluir</Button>
      </div>
    </Modal>
  );
}
