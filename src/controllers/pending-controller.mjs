import { createError } from '../error/create-error.mjs';
import PendingRepository from '../repositories/pending-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import { PENDING_ERRORS } from '../constants/pending-constants.mjs';
import {
  buildCreatePendingPayload,
  buildUpdatePendingPayload,
  isAssignedWithinCollaborators,
} from '../services/pending-service.mjs';

const getAuthenticatedUserId = (req) => req.user?.id;

const validateAuthenticated = (res, userId) => {
  if (userId) return false;
  res.status(401).json({ message: PENDING_ERRORS.UNAUTHORIZED });
  return true;
};

const areUsersInCompany = async (userIds = [], companyId) => {
  const memberRepo = new CompanyMemberRepository();
  const memberIds = await memberRepo.findActiveUserIdsByCompanyId(companyId);
  const memberIdSet = new Set(memberIds.map((memberId) => String(memberId)));
  return userIds.every((userId) => memberIdSet.has(String(userId)));
};

export const createPending = async (req, res) => {
  try {
    const pendingRepository = new PendingRepository();
    const userId = getAuthenticatedUserId(req);

    if (validateAuthenticated(res, userId)) return;

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: PENDING_ERRORS.TITLE_REQUIRED });
    }

    const { payload, assignedTo, collaborators } = buildCreatePendingPayload({
      body: req.body,
      userId,
    });
    payload.companyId = req.companyId;

    if (!isAssignedWithinCollaborators({ assignedTo, collaborators })) {
      return res.status(400).json({ message: PENDING_ERRORS.ASSIGNED_NOT_COLLABORATOR });
    }

    if (!(await areUsersInCompany(collaborators, req.companyId))) {
      return res.status(403).json({ message: 'Todos los colaboradores deben pertenecer a la empresa activa' });
    }

    const createdPending = await pendingRepository.createOne(payload);

    return res.status(201).json(createdPending);
  } catch (error) {
    throw createError(PENDING_ERRORS.CREATE_FAILED, 500);
  }
};

export const getPendingById = async (req, res) => {
  try {
    const pendingRepository = new PendingRepository();
    const userId = getAuthenticatedUserId(req);
    const { id } = req.params;

    if (validateAuthenticated(res, userId)) return;

    const pending = await pendingRepository.getByIdForUser(id, userId, req.companyId);
    if (!pending) {
      return res.status(404).json({ message: PENDING_ERRORS.NOT_FOUND });
    }

    return res.status(200).json({ pending });
  } catch (error) {
    throw createError(PENDING_ERRORS.GET_FAILED, 500);
  }
};

export const getAllPending = async (req, res) => {
  try {
    const pendingRepository = new PendingRepository();
    const userId = getAuthenticatedUserId(req);

    if (validateAuthenticated(res, userId)) return;

    const pendings = await pendingRepository.getAllByUser(userId, req.companyId);
    return res.status(200).json({ pendings });
  } catch (error) {
    throw createError(PENDING_ERRORS.GET_ALL_FAILED, 500);
  }
};

export const getPendingsByUser = async (req, res) => {
  try {
    const pendingRepository = new PendingRepository();
    const authUserId = getAuthenticatedUserId(req);
    const { userId } = req.params;

    if (validateAuthenticated(res, authUserId)) return;

    if (String(authUserId) !== String(userId)) {
      return res.status(403).json({ message: PENDING_ERRORS.FORBIDDEN_USER_PENDINGS });
    }

    const pendings = await pendingRepository.getAllByUser(authUserId, req.companyId);
    return res.status(200).json({ pendings });
  } catch (error) {
    throw createError(PENDING_ERRORS.GET_BY_USER_FAILED, 500);
  }
};

export const updatePending = async (req, res) => {
  try {
    const pendingRepository = new PendingRepository();
    const userId = getAuthenticatedUserId(req);
    const { id } = req.params;
    const updateData = req.body || {};

    if (validateAuthenticated(res, userId)) return;

    const currentPending = await pendingRepository.getByIdForUser(id, userId, req.companyId);
    if (!currentPending) {
      return res.status(404).json({ message: PENDING_ERRORS.NOT_FOUND_OR_UPDATE_FAILED });
    }

    const { payload, assignedTo, collaborators } = buildUpdatePendingPayload({
      currentPending,
      updateData,
      userId,
    });

    if (!collaborators.length) {
      return res.status(400).json({ message: PENDING_ERRORS.MIN_ONE_COLLABORATOR });
    }

    if (!assignedTo) {
      return res.status(400).json({ message: PENDING_ERRORS.ASSIGNED_REQUIRED });
    }

    if (!isAssignedWithinCollaborators({ assignedTo, collaborators })) {
      return res.status(400).json({ message: PENDING_ERRORS.ASSIGNED_NOT_COLLABORATOR });
    }

    if (!(await areUsersInCompany(collaborators, req.companyId))) {
      return res.status(403).json({ message: 'Todos los colaboradores deben pertenecer a la empresa activa' });
    }

    const updatedPending = await pendingRepository.updateByIdForUser(id, userId, req.companyId, payload);
    if (!updatedPending) {
      return res.status(404).json({ message: PENDING_ERRORS.NOT_FOUND_OR_UPDATE_FAILED });
    }

    return res.status(200).json({ pending: updatedPending });
  } catch (error) {
    throw createError(PENDING_ERRORS.UPDATE_FAILED, 500);
  }
};

export const deletePending = async (req, res) => {
  try {
    const pendingRepository = new PendingRepository();
    const userId = getAuthenticatedUserId(req);
    const { id } = req.params;

    if (validateAuthenticated(res, userId)) return;

    const deletedPending = await pendingRepository.deleteByIdForUser(id, userId, req.companyId);
    if (!deletedPending) {
      return res.status(404).json({ message: PENDING_ERRORS.NOT_FOUND_OR_DELETE_FAILED });
    }

    return res.status(200).json({ message: 'Pendiente eliminado correctamente' });
  } catch (error) {
    throw createError(PENDING_ERRORS.DELETE_FAILED, 500);
  }
};
