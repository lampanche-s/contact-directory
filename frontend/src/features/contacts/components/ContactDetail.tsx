import { Button } from '../../../shared/components/Button';
import { Icon } from '../../../shared/components/Icon';
import type { Contact } from '../types/contact.types';
import { getContactInitials } from '../utils/contact.utils';

type ContactDetailProps = {
  contact: Contact | null;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function ContactDetail({ contact, isAdmin, onEdit, onDelete }: ContactDetailProps) {
  if (!contact) {
    return (
      <article className="contact-detail">
        <p className="detail-section-title">Contact details</p>
        <p className="empty-state">No contact selected.</p>
      </article>
    );
  }

  return (
    <article className="contact-detail">
      {isAdmin && (
        <div className="detail-actions">
          <Button className="detail-edit-btn" onClick={onEdit}>
            <Icon name="edit" size={15} />
            Edit
          </Button>
          <Button variant="danger" className="detail-delete-btn" onClick={onDelete}>
            <Icon name="trash" size={15} />
            Delete
          </Button>
        </div>
      )}

      <p className="detail-section-title">Contact details</p>

      <section className="detail-main">
        <div className="detail-photo-frame">
          {contact.photo ? (
            <img src={contact.photo} alt={`Photo of ${contact.name}`} decoding="async" />
          ) : (
            <div className="detail-photo-fallback">
              <span>{getContactInitials(contact.name)}</span>
            </div>
          )}
        </div>

        <div className="detail-identity">
          <h2>{contact.name}</h2>

          <div className="detail-info-list">
            <div className="detail-info-item">
              <span className="detail-icon">
                <Icon name="building" size={18} />
              </span>
              <div>
                <small>Department</small>
                <strong>{contact.sector}</strong>
              </div>
            </div>

            <div className="detail-info-item">
              <span className="detail-icon">
                <Icon name="phone" size={18} />
              </span>
              <div>
                <small>Extension</small>
                <strong>{contact.extension}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="additional-info">
        <h3>Additional information</h3>
        <div className="additional-grid">
          <div className="additional-item">
            <span className="additional-item-icon">
              <Icon name="mail" size={18} />
            </span>

            <div>
              <small>Email</small>
              <strong>{contact.email || '—'}</strong>
            </div>
          </div>
          <div className="additional-item">
            <span className="additional-item-icon">
              <Icon name="phone" size={18} />
            </span>

            <div>
              <small>Phone</small>
              <strong>{contact.phone || '—'}</strong>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
