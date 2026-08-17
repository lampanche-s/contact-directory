export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatPhoneNumber(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (!digits) return '';

  const hasAreaCode = digits.length > 9;

  if (hasAreaCode) {
    const areaCode = digits.slice(0, 2);
    const number = digits.slice(2);

    if (number.length <= 4) {
      return `(${areaCode}) ${number}`;
    }

    if (number.length <= 8) {
      return `(${areaCode}) ${number.slice(0, 4)}-${number.slice(4)}`;
    }

    return `(${areaCode}) ${number.slice(0, 5)}-${number.slice(5, 9)}`;
  }

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
}
