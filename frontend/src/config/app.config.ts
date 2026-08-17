export const appConfig = {
  appName: 'Contact Directory',
  institutionName: 'Contact Directory',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  storageKeys: {
    contacts: 'contact-directory.contacts.v2',
    adminSession: 'contact-directory.admin-session.v1'
  },
  limits: {
    photoMaxSizeBytes: 5 * 1024 * 1024,
    contactsPerPage: 9
  }
} as const;
