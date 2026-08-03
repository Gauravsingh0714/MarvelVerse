export const formatDateToISO = (date: Date = new Date()): string =>
  date.toISOString();

export const isValidISODate = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  const date = new Date(str);
  return !isNaN(date.getTime()) && str.includes('T');
};
