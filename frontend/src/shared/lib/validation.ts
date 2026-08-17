export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function isValidEmail(value: string): boolean {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
