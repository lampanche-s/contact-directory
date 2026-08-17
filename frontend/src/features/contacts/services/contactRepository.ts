import { appConfig } from '../../../config/app.config';
import { apiRequest } from '../../../services/http/apiClient';
import type { Contact, ContactFormValues, ContactId } from '../types/contact.types';

export type ContactPage = {
  items: Contact[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type ContactListParams = {
  page?: number;
  size?: number;
  search?: string;
  signal?: AbortSignal;
};

export type ContactRepository = {
  list(params?: ContactListParams): Promise<Contact[]>;
  listPage(params?: ContactListParams): Promise<ContactPage>;
  create(contact: Contact | ContactFormValues): Promise<Contact>;
  update(id: ContactId, contact: Contact | ContactFormValues): Promise<Contact>;
  remove(id: ContactId): Promise<void>;
  uploadPhoto(id: ContactId, file: File): Promise<Contact>;
  removePhoto(id: ContactId): Promise<Contact>;
};

function buildContactsQuery(params?: ContactListParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set('page', String(params?.page ?? 0));
  searchParams.set('size', String(params?.size ?? 50));

  if (params?.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  return `/contacts?${searchParams.toString()}`;
}

function toContactPayload(contact: Contact | ContactFormValues) {
  return {
    name: contact.name,
    sector: contact.sector,
    extension: contact.extension,
    email: contact.email || null,
    phone: contact.phone || null
  };
}

function normalizeContact(contact: Contact): Contact {
  return {
    ...contact,
    photo: normalizePhotoUrl(contact.photo)
  };
}

function normalizeContactPage(page: ContactPage): ContactPage {
  return {
    ...page,
    items: page.items.map(normalizeContact)
  };
}

function normalizePhotoUrl(photo?: string | null): string | null {
  if (!photo) {
    return null;
  }

  if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:')) {
    return photo;
  }

  if (!photo.startsWith('/')) {
    return photo;
  }

  try {
    const apiUrl = new URL(appConfig.apiBaseUrl);
    return `${apiUrl.origin}${photo}`;
  } catch {
    return photo;
  }
}

export const apiContactRepository: ContactRepository = {
  async list(params) {
    const page = await this.listPage(params);
    return page.items;
  },

  async listPage(params) {
    const response = await apiRequest<ContactPage>(buildContactsQuery(params), {
      signal: params?.signal
    });
    return normalizeContactPage(response.data);
  },

  async create(contact) {
    const response = await apiRequest<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(toContactPayload(contact))
    });

    return normalizeContact(response.data);
  },

  async update(id, contact) {
    const response = await apiRequest<Contact>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toContactPayload(contact))
    });

    return normalizeContact(response.data);
  },

  async remove(id) {
    await apiRequest<void>(`/contacts/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadPhoto(id, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiRequest<Contact>(`/contacts/${id}/photo`, {
      method: 'POST',
      body: formData
    });

    return normalizeContact(response.data);
  },

  async removePhoto(id) {
    const response = await apiRequest<Contact>(`/contacts/${id}/photo`, {
      method: 'DELETE'
    });

    return normalizeContact(response.data);
  }
};
