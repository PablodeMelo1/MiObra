const uniqueStringIds = (ids = []) => [...new Set(ids.filter(Boolean).map((id) => String(id)))];

const normalizeCollaborators = (incomingCollaborators, fallbackUserId) => {
  const base = Array.isArray(incomingCollaborators)
    ? incomingCollaborators
    : incomingCollaborators
      ? [incomingCollaborators]
      : [fallbackUserId];

  return uniqueStringIds(base);
};

const ensureCreatorAsCollaborator = (collaborators, creatorId) => {
  const creator = String(creatorId);
  return collaborators.includes(creator) ? collaborators : [...collaborators, creator];
};

export const buildCreatePendingPayload = ({ body, userId }) => {
  const normalizedCollaborators = ensureCreatorAsCollaborator(
    normalizeCollaborators(body.collaborators, userId),
    userId,
  );

  const assignedTo = body.assignedTo ? String(body.assignedTo) : String(userId);

  return {
    payload: {
      title: body.title,
      description: body.description,
      isDone: Boolean(body.isDone),
      dueDate: body.dueDate || null,
      assignedTo,
      collaborators: normalizedCollaborators,
      createdBy: userId,
    },
    assignedTo,
    collaborators: normalizedCollaborators,
  };
};

export const buildUpdatePendingPayload = ({ currentPending, updateData, userId }) => {
  const sanitized = { ...updateData };
  delete sanitized.createdBy;

  const currentCollaborators = uniqueStringIds(
    (currentPending.collaborators || []).map((collaborator) => collaborator?._id || collaborator),
  );

  const collaborators = sanitized.collaborators
    ? normalizeCollaborators(sanitized.collaborators, userId)
    : currentCollaborators;

  const assignedTo = sanitized.assignedTo
    ? String(sanitized.assignedTo)
    : String(currentPending.assignedTo?._id || currentPending.assignedTo || '');

  return {
    payload: {
      ...sanitized,
      collaborators,
      assignedTo,
    },
    assignedTo,
    collaborators,
  };
};

export const isAssignedWithinCollaborators = ({ assignedTo, collaborators }) =>
  collaborators.includes(String(assignedTo));
