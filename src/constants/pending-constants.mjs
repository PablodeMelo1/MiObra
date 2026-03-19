export const PENDING_ERRORS = Object.freeze({
  UNAUTHORIZED: 'Usuario no autenticado',
  TITLE_REQUIRED: 'El titulo es obligatorio',
  ASSIGNED_NOT_COLLABORATOR: 'El asignado debe ser colaborador del pendiente',
  MIN_ONE_COLLABORATOR: 'Debe existir al menos un colaborador',
  ASSIGNED_REQUIRED: 'El pendiente debe tener un asignado',
  NOT_FOUND: 'Pendiente no encontrado',
  NOT_FOUND_OR_UPDATE_FAILED: 'Pendiente no encontrado o no se pudo actualizar',
  NOT_FOUND_OR_DELETE_FAILED: 'Pendiente no encontrado o no se pudo eliminar',
  FORBIDDEN_USER_PENDINGS: 'No tienes permisos para ver estos pendientes',
  CREATE_FAILED: 'No pudo crear el pendiente',
  GET_FAILED: 'No pudo obtener el pendiente',
  GET_ALL_FAILED: 'No pudo obtener los pendientes',
  GET_BY_USER_FAILED: 'No pudo obtener los pendientes del usuario',
  UPDATE_FAILED: 'No pudo actualizar el pendiente',
  DELETE_FAILED: 'No pudo eliminar el pendiente',
});

export const PENDING_POPULATE = Object.freeze([
  { path: 'createdBy', select: 'name email' },
  { path: 'assignedTo', select: 'name email' },
  { path: 'collaborators', select: 'name email' },
]);
