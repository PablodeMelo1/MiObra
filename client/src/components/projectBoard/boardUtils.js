export const TASK_STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'BLOCKED', 'PAUSED', 'COMPLETED'];
export const TASK_PRIORITY_OPTIONS = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

export function groupTasksByList(tasks, lists) {
  const grouped = {};

  lists.forEach((listName) => {
    grouped[listName] = [];
  });

  tasks.forEach((task) => {
    if (!grouped[task.list]) {
      grouped[task.list] = [];
    }
    grouped[task.list].push(task);
  });

  return grouped;
}

export function toInputDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}
