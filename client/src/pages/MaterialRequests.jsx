import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import { useAuth } from '../context/auth-context';
import MaterialRequestHeader from '../components/materialRequests/MaterialRequestHeader';
import MaterialRequestTable from '../components/materialRequests/MaterialRequestTable';
import MaterialRequestFormModal from '../components/materialRequests/MaterialRequestFormModal';
import DeleteMaterialRequestModal from '../components/materialRequests/DeleteMaterialRequestModal';
import {
  createMaterialRequest,
  deleteMaterialRequest,
  getMaterialRequests,
  updateMaterialRequest,
} from '../api/materialRequests';
import { getSuppliers } from '../api/suppliers';
import { getProjectsCatalog } from '../api/projects';
import {
  MATERIAL_REQUEST_FILTER_OPTIONS,
  MATERIAL_REQUEST_FORM_DEFAULTS,
} from '../constants/materialRequest';

const emptyForm = MATERIAL_REQUEST_FORM_DEFAULTS;

function toInputDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function MaterialRequests() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [requests, setRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(MATERIAL_REQUEST_FILTER_OPTIONS[0].value);

  const [formModal, setFormModal] = useState({ isOpen: false, mode: 'create', id: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', materialName: '' });
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const selectedRequest = useMemo(
    () => requests.find((item) => (item._id || item.id) === formModal.id) || null,
    [formModal.id, requests],
  );

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'ALL') return requests;
    return requests.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoadingData(true);
        setErrorMessage('');

        const [requestsResponse, suppliersResponse, projectsResponse] = await Promise.all([
          getMaterialRequests(),
          getSuppliers(),
          getProjectsCatalog(),
        ]);

        setRequests(requestsResponse.data?.materialRequests || []);
        setSuppliers(suppliersResponse.data?.suppliers || []);
        setProjects(projectsResponse.data?.projects || []);
      } catch (error) {
        console.error('Error loading material requests:', error);
        setErrorMessage('No se pudieron cargar las peticiones de materiales.');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (field, value) => {
    setFormError('');
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setFormError('');
    setFormModal({ isOpen: true, mode: 'create', id: '' });
  };

  const openEditModal = (request) => {
    setForm({
      materialName: request.materialName || '',
      description: request.description || '',
      quantity: request.quantity ? String(request.quantity) : '1',
      status: request.status || 'PEDIDO',
      orderDate: toInputDate(request.orderDate),
      supplierId: request.supplierId?._id || request.supplierId || '',
      arrivalDate: toInputDate(request.arrivalDate),
      projectId: request.projectId?._id || request.projectId || '',
      length: request.dimensions?.length ? String(request.dimensions.length) : '',
      width: request.dimensions?.width ? String(request.dimensions.width) : '',
      thickness: request.dimensions?.thickness ? String(request.dimensions.thickness) : '',
    });
    setFormError('');
    setFormModal({ isOpen: true, mode: 'edit', id: request._id || request.id });
  };

  const closeFormModal = () => {
    setFormModal({ isOpen: false, mode: 'create', id: '' });
    setFormError('');
  };

  const openDeleteModal = (request) => {
    setDeleteModal({
      isOpen: true,
      id: request._id || request.id,
      materialName: request.materialName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: '', materialName: '' });
  };

  const buildPayload = () => {
    const quantityValue = Number(form.quantity);
    const dimensions = {
      length: form.length ? Number(form.length) : null,
      width: form.width ? Number(form.width) : null,
      thickness: form.thickness ? Number(form.thickness) : null,
    };

    const basePayload = {
      materialName: form.materialName.trim(),
      description: form.description,
      quantity: Number.isFinite(quantityValue) ? quantityValue : 0,
      orderDate: form.orderDate || null,
      projectId: form.projectId || null,
      dimensions,
    };

    if (formModal.mode === 'edit') {
      return {
        ...basePayload,
        status: form.status || 'PEDIDO',
        supplierId: form.supplierId || null,
        arrivalDate: form.arrivalDate || null,
      };
    }

    return basePayload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = buildPayload();
    if (!payload.materialName || payload.quantity <= 0) {
      setFormError('Material y cantidad valida son obligatorios.');
      return;
    }

    try {
      if (formModal.mode === 'create') {
        await createMaterialRequest(payload);
      } else {
        await updateMaterialRequest(formModal.id, payload);
      }

      const refreshed = await getMaterialRequests();
      setRequests(refreshed.data?.materialRequests || []);
      closeFormModal();
    } catch (error) {
      console.error('Error saving material request:', error);
      setFormError('No se pudo guardar la peticion.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMaterialRequest(deleteModal.id);
      setRequests((prev) => prev.filter((item) => (item._id || item.id) !== deleteModal.id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting material request:', error);
      setErrorMessage('No se pudo eliminar la peticion.');
    }
  };

  if (isLoading || loadingData) return <LoadingScreen message="Cargando peticiones..." />;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <MaterialRequestHeader
            onOpenCreate={openCreateModal}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {errorMessage ? <p className="mb-2 text-xs text-rose-200">{errorMessage}</p> : null}

          <MaterialRequestTable
            requests={filteredRequests}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </section>
      </div>

      <MaterialRequestFormModal
        isOpen={formModal.isOpen}
        mode={formModal.mode}
        form={form}
        suppliers={suppliers}
        projects={projects}
        requesterName={
          formModal.mode === 'edit'
            ? selectedRequest?.createdBy?.name || selectedRequest?.createdBy?.email || user?.name || ''
            : user?.name || user?.email || ''
        }
        error={formError}
        onClose={closeFormModal}
        onChange={handleChange}
        onSubmit={handleSubmit}
        selectedRequest={selectedRequest}
      />

      <DeleteMaterialRequestModal
        isOpen={deleteModal.isOpen}
        materialName={deleteModal.materialName}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default MaterialRequests;
