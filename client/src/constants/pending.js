export const PENDING_FILTER_STATES = Object.freeze(['all', 'open', 'done']);

export const PENDING_FILTER_OPTIONS = Object.freeze([
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Activos' },
  { value: 'done', label: 'Completados' },
]);

export const PENDING_FORM_DEFAULTS = Object.freeze({
  title: '',
  description: '',
  dueDate: '',
  isDone: false,
  assignedTo: '',
  collaborators: [],
});

export const PENDING_UI_MESSAGES = Object.freeze({
  LOAD_ERROR: 'No se pudieron cargar los pendientes.',
  SAVE_ERROR: 'No se pudo guardar el pendiente.',
  DELETE_ERROR: 'No se pudo eliminar el pendiente.',
  TOGGLE_ERROR: 'No se pudo actualizar el estado del pendiente.',
  TITLE_REQUIRED: 'El titulo es obligatorio.',
  ASSIGNED_REQUIRED: 'El campo assigned to es obligatorio.',
  COLLABORATORS_REQUIRED: 'Debe haber al menos un colaborador.',
  ASSIGNED_IN_COLLABORATORS: 'El asignado debe estar en la lista de colaboradores.',
});
