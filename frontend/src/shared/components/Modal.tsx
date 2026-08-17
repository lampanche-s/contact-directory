import type { ReactNode } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';

type ModalProps = {
  open: boolean;
  titleId: string;
  className?: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, titleId, className = '', children, onClose }: ModalProps) {
  useEscapeKey(onClose, open);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={onClose}>
      <div className={`modal-card ${className}`.trim()} onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
