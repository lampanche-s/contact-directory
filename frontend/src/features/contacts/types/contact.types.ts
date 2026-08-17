export type ContactId = string;

export type Contact = {
  id: ContactId;
  name: string;
  sector: string;
  extension: string;
  email?: string;
  phone?: string;
  photo?: string | null;
  updatedAt?: string;
};

export type ContactFormValues = {
  name: string;
  sector: string;
  extension: string;
  email: string;
  phone: string;
  photo: string;
  photoFile: File | null;
  removePhoto: boolean;
};
