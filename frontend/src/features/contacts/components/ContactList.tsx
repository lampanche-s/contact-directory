import { Icon } from '../../../shared/components/Icon';
import type { Contact, ContactId } from '../types/contact.types';
import { getContactInitials } from '../utils/contact.utils';

type ContactListPagination = {
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  totalContacts: number;
  startItem: number;
  endItem: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

type ContactListProps = {
  contacts: Contact[];
  selectedId: ContactId | null;
  isAdmin: boolean;
  pagination: ContactListPagination;
  onSelect: (id: ContactId) => void;
  onCreate: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function ContactList({
  contacts,
  selectedId,
  isAdmin,
  pagination,
  onSelect,
  onCreate,
  onPreviousPage,
  onNextPage
}: ContactListProps) {
  const hasContacts = contacts.length > 0;
  const hasActiveFilter = pagination.totalFiltered !== pagination.totalContacts;

  return (
    <>
      <div className="people-section-header">
        <h2>Contacts</h2>

        {isAdmin && (
          <button type="button" className="btn btn-primary new-contact-btn" onClick={onCreate}>
            <Icon name="plus" size={16} />
            New contact
          </button>
        )}
      </div>

      <div className="people-list" aria-live="polite">
        {!hasContacts ? (
          <p className="empty-state">No contacts found.</p>
        ) : (
          contacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              className={contact.id === selectedId ? 'people-list-item is-active' : 'people-list-item'}
              onClick={() => onSelect(contact.id)}
            >
              <span className="people-avatar">
                {contact.photo ? (
                  <img src={contact.photo} alt="" loading="lazy" decoding="async" />
                ) : (
                  getContactInitials(contact.name)
                )}
              </span>

              <span className="people-info">
                <strong>{contact.name}</strong>
                <small>{contact.sector}</small>
              </span>

              <span className="people-ramal">
                <small>Extension</small>
                <strong>{contact.extension}</strong>
              </span>
            </button>
          ))
        )}
      </div>

      <div className="directory-pagination">
        <p>
          {pagination.totalFiltered === 0
            ? 'No contacts found'
            : `Showing ${pagination.startItem}-${pagination.endItem} of ${pagination.totalFiltered} contacts`}

          {hasActiveFilter ? ` (${pagination.totalContacts} total)` : ''}
        </p>

        {pagination.totalPages > 1 ? (
          <div className="pagination-controls" aria-label="Contact pagination">
            <button
              type="button"
              className="pagination-btn"
              onClick={onPreviousPage}
              disabled={!pagination.hasPrevious}
            >
              <Icon name="chevron-left" size={14} />
              Previous
            </button>

            <span className="pagination-current">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              type="button"
              className="pagination-btn"
              onClick={onNextPage}
              disabled={!pagination.hasNext}
            >
              Next
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
