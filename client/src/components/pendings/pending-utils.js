import { PENDING_FILTER_STATES } from '../../constants/pending';

export const toInputDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export const buildPendingPayload = (form) => ({
  title: form.title.trim(),
  description: form.description.trim(),
  dueDate: form.dueDate || null,
  isDone: Boolean(form.isDone),
  assignedTo: form.assignedTo || null,
  collaborators: form.collaborators,
});

export const getVisiblePendings = ({ pendings, filter, search }) => {
  const normalizedSearch = search.trim().toLowerCase();

  return pendings.filter((pending) => {
    const title = (pending.title || '').toLowerCase();
    const description = (pending.description || '').toLowerCase();
    const matchesSearch =
      !normalizedSearch || title.includes(normalizedSearch) || description.includes(normalizedSearch);

    if (!matchesSearch) return false;
    if (filter === PENDING_FILTER_STATES[2]) return Boolean(pending.isDone);
    if (filter === PENDING_FILTER_STATES[1]) return !pending.isDone;
    return true;
  });
};
