import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { appConfig } from '../../../config/app.config';
import { apiContactRepository } from '../services/contactRepository';
import type { Contact, ContactFormValues, ContactId } from '../types/contact.types';

type LoadOverrides = {
  page?: number;
  search?: string;
};

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState<ContactId | null>(null);
  const [query, setQueryState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const latestRequestRef = useRef(0);
  const activeRequestRef = useRef<AbortController | null>(null);
  const skipNextAutomaticLoadRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const pageSize = appConfig.limits.contactsPerPage;

  useEffect(() => {
    const normalizedQuery = query.trim();
    const timeout = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(normalizedQuery);
    }, normalizedQuery ? 120 : 0);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const loadContacts = useCallback(
    async (preferredSelectedId?: ContactId | null, overrides?: LoadOverrides) => {
      const pageToLoad = overrides?.page ?? currentPage;
      const searchToUse = overrides?.search ?? searchQuery;
      const requestId = ++latestRequestRef.current;
      activeRequestRef.current?.abort();

      const controller = new AbortController();
      activeRequestRef.current = controller;

      try {
        setErrorMessage('');

        const page = await apiContactRepository.listPage({
          page: Math.max(pageToLoad - 1, 0),
          size: pageSize,
          search: searchToUse,
          signal: controller.signal
        });

        if (requestId !== latestRequestRef.current) {
          return;
        }

        const safeTotalPages = Math.max(1, page.totalPages);

        if (page.items.length === 0 && page.totalItems > 0 && pageToLoad > safeTotalPages) {
          setCurrentPage(safeTotalPages);
          return;
        }

        setContacts(page.items);
        setTotalItems(page.totalItems);
        setTotalPages(safeTotalPages);
        setHasPrevious(page.hasPrevious);
        setHasNext(page.hasNext);

        setSelectedId((currentId) => {
          const candidateId = preferredSelectedId ?? currentId;
          const candidateStillVisible = candidateId
            ? page.items.some((contact) => contact.id === candidateId)
            : false;

          return candidateStillVisible ? candidateId : page.items[0]?.id || null;
        });
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        if (requestId === latestRequestRef.current) {
          setErrorMessage('Unable to load contacts.');
        }
      } finally {
        if (activeRequestRef.current === controller) {
          activeRequestRef.current = null;
        }

        if (requestId === latestRequestRef.current) {
          setIsLoading(false);
        }
      }
    },
    [currentPage, pageSize, searchQuery]
  );

  useEffect(() => {
    if (skipNextAutomaticLoadRef.current) {
      skipNextAutomaticLoadRef.current = false;
      return;
    }

    void loadContacts();
  }, [loadContacts]);

  useEffect(
    () => () => {
      latestRequestRef.current += 1;
      activeRequestRef.current?.abort();
    },
    []
  );

  const setQuery = useCallback(
    (value: string) => {
      if (value.trim() !== searchQuery) {
        latestRequestRef.current += 1;
        activeRequestRef.current?.abort();
      }

      setQueryState(value);
    },
    [searchQuery]
  );

  const selectedContact = useMemo(() => {
    if (!selectedId) return null;

    return contacts.find((contact) => contact.id === selectedId) || null;
  }, [contacts, selectedId]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((page) => Math.max(1, page - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }, [totalPages]);

  const saveContact = useCallback(
    async (values: ContactFormValues, id?: ContactId) => {
      if (id) {
        const updatedContact = await apiContactRepository.update(id, values);

        if (values.photoFile) {
          const contactWithPhoto = await apiContactRepository.uploadPhoto(updatedContact.id, values.photoFile);
          await loadContacts(contactWithPhoto.id);
          return;
        }

        if (values.removePhoto) {
          const contactWithoutPhoto = await apiContactRepository.removePhoto(updatedContact.id);
          await loadContacts(contactWithoutPhoto.id);
          return;
        }

        await loadContacts(updatedContact.id);
        return;
      }

      const createdContact = await apiContactRepository.create(values);

      let selectedContactId = createdContact.id;

      if (values.photoFile) {
        const contactWithPhoto = await apiContactRepository.uploadPhoto(createdContact.id, values.photoFile);
        selectedContactId = contactWithPhoto.id;
      }

      if (currentPage !== 1 || searchQuery !== '') {
        skipNextAutomaticLoadRef.current = true;
      }

      setQueryState('');
      setSearchQuery('');
      setCurrentPage(1);
      await loadContacts(selectedContactId, { page: 1, search: '' });
    },
    [currentPage, loadContacts, searchQuery]
  );

  const deleteContact = useCallback(
    async (id: ContactId) => {
      await apiContactRepository.remove(id);
      await loadContacts(null);
    },
    [loadContacts]
  );

  const pagination = {
    currentPage,
    totalPages,
    pageSize,
    totalFiltered: totalItems,
    totalContacts: totalItems,
    startItem: totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, totalItems),
    hasPrevious,
    hasNext
  };

  return {
    contacts,
    filteredContacts: contacts,
    paginatedContacts: contacts,
    selectedContact,
    selectedId,
    query,
    pagination,
    isLoading,
    errorMessage,
    setQuery,
    setSelectedId,
    goToPreviousPage,
    goToNextPage,
    saveContact,
    deleteContact,
    reloadContacts: loadContacts
  };
}
