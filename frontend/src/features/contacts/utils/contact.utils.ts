import type { Contact, ContactFormValues } from '../types/contact.types';
import type { ValidationResult } from '../../../shared/lib/validation';
import { isValidEmail } from '../../../shared/lib/validation';

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function getContactInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase() || 'CD';
}

export function filterContacts(contacts: Contact[], query: string): Contact[] {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return contacts;

  return contacts.filter((contact) => {
    return [contact.name, contact.sector, contact.extension]
      .map(normalizeText)
      .some((field) => field.includes(normalizedQuery));
  });
}

export function validateContact(values: ContactFormValues): ValidationResult {
  const errors: string[] = [];

  if (!values.name.trim()) errors.push('Name is required.');
  if (!values.sector.trim()) errors.push('Department is required.');
  if (!values.extension.trim()) errors.push('Extension is required.');
  if (!isValidEmail(values.email.trim())) errors.push('Enter a valid email address.');

  return {
    valid: errors.length === 0,
    errors
  };
}

export function createContactId(name: string, extension: string): string {
  const base = normalizeText(`${name}-${extension}`)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${base}-${Date.now()}`;
}
