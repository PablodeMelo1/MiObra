import { createError } from '../error/create-error.mjs';
import MaterialRequestRepository from '../repositories/materialRequest-repository.mjs';
import ProjectRepository from '../repositories/project-repository.mjs';
import SupplierRepository from '../repositories/supplier-repository.mjs';

const validateTenantReferences = async ({ projectId, supplierId, companyId }) => {
  if (projectId) {
    const projectRepository = new ProjectRepository();
    const project = await projectRepository.getById({ _id: projectId, companyId });
    if (!project) {
      return 'Proyecto no encontrado';
    }
  }

  if (supplierId) {
    const supplierRepository = new SupplierRepository();
    const supplier = await supplierRepository.getById({ _id: supplierId, companyId });
    if (!supplier) {
      return 'Proveedor no encontrado';
    }
  }

  return null;
};

export const createMaterialRequest = async (req, res) => {
  try {
    const materialRequestRepository = new MaterialRequestRepository();
    const {
      materialName,
      description,
      quantity,
      status,
      orderDate,
      supplierId,
      arrivalDate,
      dimensions,
      projectId,
    } = req.body;

    if (!materialName || !quantity) {
      return res.status(400).json({ message: 'Material y cantidad son obligatorios' });
    }

    const createdBy = req.user?.id;
    if (!createdBy) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const referenceError = await validateTenantReferences({ projectId, supplierId, companyId: req.companyId });
    if (referenceError) {
      return res.status(404).json({ message: referenceError });
    }

    const newMaterialRequest = {
      companyId: req.companyId,
      materialName,
      description,
      quantity,
      status: status || 'PEDIDO',
      orderDate,
      supplierId: supplierId || null,
      arrivalDate: arrivalDate || null,
      dimensions: dimensions || {},
      projectId: projectId || null,
      createdBy,
    };

    const createdMaterialRequest = await materialRequestRepository.createOne(newMaterialRequest);
    return res.status(201).json(createdMaterialRequest);
  } catch (error) {
    throw createError('No pudo crear la solicitud de material', 500);
  }
};

export const getMaterialRequestById = async (req, res) => {
  try {
    const materialRequestRepository = new MaterialRequestRepository();
    const { id } = req.params;
    const materialRequest = await materialRequestRepository.getById({ _id: id, companyId: req.companyId });

    if (!materialRequest) {
      return res.status(404).json({ message: 'Solicitud de material no encontrada' });
    }

    return res.status(200).json({ materialRequest });
  } catch (error) {
    throw createError('No pudo obtener la solicitud de material', 500);
  }
};

export const getAllMaterialRequests = async (req, res) => {
  try {
    const materialRequestRepository = new MaterialRequestRepository();
    const materialRequests = await materialRequestRepository.getAll(req.companyId);
    return res.status(200).json({ materialRequests });
  } catch (error) {
    throw createError('No pudo obtener las solicitudes de material', 500);
  }
};

export const updateMaterialRequest = async (req, res) => {
  try {
    const materialRequestRepository = new MaterialRequestRepository();
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.createdBy;
    delete updateData.companyId;

    const referenceError = await validateTenantReferences({
      projectId: updateData.projectId,
      supplierId: updateData.supplierId,
      companyId: req.companyId,
    });
    if (referenceError) {
      return res.status(404).json({ message: referenceError });
    }

    const updatedMaterialRequest = await materialRequestRepository.updateById({ _id: id, companyId: req.companyId }, updateData);
    if (!updatedMaterialRequest) {
      return res.status(404).json({ message: 'Solicitud de material no encontrada o no se pudo actualizar' });
    }

    return res.status(200).json({ materialRequest: updatedMaterialRequest });
  } catch (error) {
    throw createError('No pudo actualizar la solicitud de material', 500);
  }
};

export const updateMaterialRequestStatus = async (req, res) => {
  try {
    const materialRequestRepository = new MaterialRequestRepository();
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status es obligatorio' });
    }

    const updatedMaterialRequest = await materialRequestRepository.updateStatus({ _id: id, status, companyId: req.companyId });
    if (!updatedMaterialRequest) {
      return res.status(404).json({ message: 'Solicitud de material no encontrada o no se pudo actualizar el estado' });
    }

    return res.status(200).json({ materialRequest: updatedMaterialRequest });
  } catch (error) {
    throw createError('No pudo actualizar el estado de la solicitud de material', 500);
  }
};

export const deleteMaterialRequest = async (req, res) => {
  try {
    const materialRequestRepository = new MaterialRequestRepository();
    const { id } = req.params;
    const deletedMaterialRequest = await materialRequestRepository.deleteById({ _id: id, companyId: req.companyId });

    if (!deletedMaterialRequest) {
      return res.status(404).json({ message: 'Solicitud de material no encontrada o no se pudo eliminar' });
    }

    return res.status(200).json({ message: 'Solicitud de material eliminada correctamente' });
  } catch (error) {
    throw createError('No pudo eliminar la solicitud de material', 500);
  }
};
