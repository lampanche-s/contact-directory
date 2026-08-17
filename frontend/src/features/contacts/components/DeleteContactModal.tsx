import { Icon } from '../../../shared/components/Icon';
import { Modal } from '../../../shared/components/Modal';
import type { Contact } from '../types/contact.types';

type DeleteContactModalProps = {
  open: boolean;
  contact: Contact | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteContactModal({ open, contact, onCancel, onConfirm }: DeleteContactModalProps) {
  return (
    <Modal open={open} titleId="delete-contact-title" className="delete-contact-modal" onClose={onCancel}>
      <div className="delete-modal-icon" aria-hidden="true">
        <Icon name="trash" size={21} />
      </div>

      <div className="delete-modal-content">
        <p className="delete-modal-kicker">Confirmation</p>

        <h2 id="delete-contact-title">Delete contact?</h2>

        <p>
          You are about to remove{' '}
          <strong>{contact?.name || 'this contact'}</strong> from the directory.
        </p>

        <p className="delete-modal-warning">
          This action removes the contact and cannot be undone from this screen.
        </p>
      </div>

      <div className="delete-modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="btn btn-danger delete-confirm-btn" onClick={onConfirm}>
          <Icon name="trash" size={15} />
          Delete contact
        </button>
      </div>
    </Modal>
  );
}
