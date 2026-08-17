import { useState } from 'react';
import { AdminAccessButton } from './features/auth/components/AdminAccessButton';
import { AdminLoginModal } from './features/auth/components/AdminLoginModal';
import { useAdminSession } from './features/auth/hooks/useAdminSession';
import { ContactDetail } from './features/contacts/components/ContactDetail';
import { ContactFormModal } from './features/contacts/components/ContactFormModal';
import { ContactList } from './features/contacts/components/ContactList';
import { ContactSearch } from './features/contacts/components/ContactSearch';
import { DeleteContactModal } from './features/contacts/components/DeleteContactModal';
import { useContacts } from './features/contacts/hooks/useContacts';
import type { ContactFormValues } from './features/contacts/types/contact.types';
import { Icon } from './shared/components/Icon';

export function App() {
  const contacts = useContacts();
  const admin = useAdminSession();
  const [loginOpen, setLoginOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function handleSubmit(values: ContactFormValues) {
    await contacts.saveContact(values, editing ? contacts.selectedContact?.id : undefined);
  }

  function openCreateForm() {
    setEditing(false);
    setFormOpen(true);
  }

  function openEditForm() {
    setEditing(true);
    setFormOpen(true);
  }

  function openDeleteModal() {
    if (!contacts.selectedContact) return;
    setDeleteModalOpen(true);
  }

  async function confirmDeleteSelectedContact() {
    if (!contacts.selectedContact) return;

    await contacts.deleteContact(contacts.selectedContact.id);
    setDeleteModalOpen(false);
  }

  return (
    <main className="page-shell">
      <header className="app-header">
        <div className="header-actions">
          {admin.isAdmin ? (
            <button type="button" className="header-logout-btn" onClick={admin.logout}>
              <span className="logout-icon" aria-hidden="true">
                <Icon name="logout" size={17} />
              </span>
              <span>Sign out</span>
            </button>
          ) : null}
        </div>
      </header>

      <section className="main-area">
        <div className="directory-shell">
          <section className="directory-card">
            <aside className="directory-sidebar">
              <ContactSearch value={contacts.query} onChange={contacts.setQuery} />

              {contacts.isLoading && contacts.contacts.length === 0 ? (
                <p className="status-message">Loading contacts...</p>
              ) : null}
              {contacts.errorMessage ? <p className="message message-error">{contacts.errorMessage}</p> : null}

              <ContactList
                contacts={contacts.paginatedContacts}
                selectedId={contacts.selectedContact?.id || null}
                isAdmin={admin.isAdmin}
                pagination={contacts.pagination}
                onSelect={contacts.setSelectedId}
                onCreate={openCreateForm}
                onPreviousPage={contacts.goToPreviousPage}
                onNextPage={contacts.goToNextPage}
              />
            </aside>

            <ContactDetail
              contact={contacts.selectedContact}
              isAdmin={admin.isAdmin}
              onEdit={openEditForm}
              onDelete={openDeleteModal}
            />
          </section>
        </div>

      <footer className="app-footer">© Contact Directory</footer>
      </section>

      {!admin.isAdmin ? (
        <div className="admin-access-anchor">
          <AdminAccessButton onClick={() => setLoginOpen(true)} />
        </div>
      ) : null}

      <AdminLoginModal
        open={loginOpen}
        errorMessage={admin.loginError}
        onLogin={admin.login}
        onClose={() => {
          admin.clearLoginError();
          setLoginOpen(false);
        }}
      />

      <ContactFormModal
        open={formOpen}
        contact={editing ? contacts.selectedContact : null}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <DeleteContactModal
        open={deleteModalOpen}
        contact={contacts.selectedContact}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteSelectedContact}
      />
    </main>
  );
}
