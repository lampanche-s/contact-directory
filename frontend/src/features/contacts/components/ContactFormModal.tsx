import { useEffect, useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Icon } from '../../../shared/components/Icon';
import { Modal } from '../../../shared/components/Modal';
import { formatPhoneNumber } from '../../../shared/lib/phone';
import type { Contact, ContactFormValues } from '../types/contact.types';
import { validateContact } from '../utils/contact.utils';
import { ContactPhotoInput } from './ContactPhotoInput';

type ContactFormModalProps = {
  open: boolean;
  contact?: Contact | null;
  onClose: () => void;
  onSubmit: (values: ContactFormValues) => Promise<void>;
};

const emptyValues: ContactFormValues = {
  name: '',
  sector: '',
  extension: '',
  email: '',
  phone: '',
  photo: '',
  photoFile: null,
  removePhoto: false
};

export function ContactFormModal({ open, contact, onClose, onSubmit }: ContactFormModalProps) {
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  const isEditing = Boolean(contact);

  useEffect(() => {
    if (!open) {
      setIsContentReady(false);
      return;
    }

    setIsContentReady(false);
    setErrors([]);

    setValues(
      contact
        ? {
            name: contact.name,
            sector: contact.sector,
            extension: contact.extension,
            email: contact.email || '',
            phone: formatPhoneNumber(contact.phone || ''),
            photo: contact.photo || '',
            photoFile: null,
            removePhoto: false
          }
        : emptyValues
    );

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsContentReady(true);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [contact, open]);

  function updateField(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateContact(values);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit(values);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} titleId="contact-modal-title" className="contact-form-modal">
      <div className="contact-modal-header">
        <div>
          <p className="label">{isEditing ? 'Edit' : 'Create'}</p>
          <h2 id="contact-modal-title">{isEditing ? 'Edit contact' : 'New contact'}</h2>
          <p className="muted-text">
            {isEditing ? 'Update the selected contact information.' : 'Enter the contact information to add it to the directory.'}
          </p>
        </div>
        <Button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
          <Icon name="close" size={17} />
        </Button>
      </div>

      <form
        className={`contact-form modal-content-reveal ${
          isContentReady ? 'is-ready' : ''
        }`}
        onSubmit={handleSubmit}
      >
        <section className="contact-form-section">
          <p className="contact-form-section-title">Contact information</p>

          {errors.length ? (
            <div className="form-error-list" role="alert">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}

          <div className="contact-form-grid">
            <div className="form-field form-field-wide">
              <label htmlFor="contact-name" className="form-label">Name</label>
              <input id="contact-name" required className="modal-input" value={values.name} onChange={(event) => updateField('name', event.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="contact-sector" className="form-label">Department</label>
              <input id="contact-sector" required className="modal-input" value={values.sector} onChange={(event) => updateField('sector', event.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="contact-extension" className="form-label">Extension</label>
              <input id="contact-extension" required className="modal-input" value={values.extension} onChange={(event) => updateField('extension', event.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email" className="form-label">Email</label>
              <input id="contact-email" type="email" className="modal-input" value={values.email} onChange={(event) => updateField('email', event.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="contact-phone" className="form-label">Phone</label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="(71) 3115-0000"
                className="modal-input"
                value={values.phone}
                maxLength={15}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    phone: formatPhoneNumber(event.target.value)
                  }));
                }}
              />
            </div>
          </div>
        </section>

        <ContactPhotoInput
          value={values.photo}
          onChange={(photoValue) => {
            setValues((current) => ({
              ...current,
              photo: photoValue.photo,
              photoFile: photoValue.photoFile,
              removePhoto: photoValue.removePhoto
            }));
          }}
        />

        <div className="contact-form-actions">
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {!isSaving && <Icon name="check" size={16} />}
            {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
