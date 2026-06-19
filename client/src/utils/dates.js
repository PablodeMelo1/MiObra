export const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const toInputDate = (value) => {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : '';
};

export const formatDate = (value, fallback = '-') => {
  const date = toDate(value);
  return date ? date.toLocaleDateString('es-UY') : fallback;
};

export const formatDateTime = (value, fallback = '-') => {
  const date = toDate(value);
  return date ? date.toLocaleString('es-UY') : fallback;
};

export const isPastDate = (value) => {
  const date = toDate(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

export const isWithinDays = (value, days) => {
  const date = toDate(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(today);
  limit.setDate(limit.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date >= today && date <= limit;
};

export const compareDatesAsc = (a, b) => {
  const dateA = toDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const dateB = toDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return dateA - dateB;
};
