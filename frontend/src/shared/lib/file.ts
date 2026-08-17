import { appConfig } from '../../config/app.config';

export function assertValidImage(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Select a valid image file.';
  }

  if (file.size > appConfig.limits.photoMaxSizeBytes) {
    return 'The image must be no larger than 5 MB.';
  }

  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read the image.'));
    reader.readAsDataURL(file);
  });
}
