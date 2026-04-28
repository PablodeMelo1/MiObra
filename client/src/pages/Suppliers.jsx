import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import SupplierHeader from '../components/suppliers/SupplierHeader';
import SupplierTable from '../components/suppliers/SupplierTable';
import SupplierFormModal from '../components/suppliers/SupplierFormModal';
import DeleteSupplierModal from '../components/suppliers/DeleteSupplierModal';
import { useAuth } from '../context/auth-context';
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  searchSuppliersByName,
  updateSupplier,
} from '../api/suppliers';

const emptySupplierForm = {
  name: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
};

function Suppliers() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formModal, setFormModal] = useState({
    isOpen: false,
    mode: 'create',
    supplierId: '',
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    supplierId: '',
    supplierName: '',
  });
  const [formError, setFormError] = useState('');
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm);

  const selectedSupplier = useMemo(
    () => suppliers.find((supplier) => (supplier._id || supplier.id) === formModal.supplierId) || null,
    [formModal.supplierId, suppliers],
  );

  const loadSuppliers = useCallback(async (searchTerm = '') => {
    try {
      setLoadingSuppliers(true);
      setErrorMessage('');

      const response = searchTerm.trim()
        ? await searchSuppliersByName(searchTerm.trim())
        : await getSuppliers();

      setSuppliers(response.data?.suppliers || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setSuppliers([]);
      setErrorMessage('No se pudieron cargar los proveedores.');
    } finally {
      setLoadingSuppliers(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadSuppliers();
  }, [isAuthenticated, isLoading, loadSuppliers, navigate]);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const timeout = setTimeout(() => {
      loadSuppliers(searchValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading, loadSuppliers, searchValue]);

  const handleSupplierFormChange = (field, value) => {
    setFormError('');
    setSupplierForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateModal = () => {
    setSupplierForm(emptySupplierForm);
    setFormError('');
    setFormModal({ isOpen: true, mode: 'create', supplierId: '' });
  };

  const openEditModal = (supplier) => {
    setSupplierForm({
      name: supplier.name || '',
      contactEmail: supplier.contactEmail || '',
      contactPhone: supplier.contactPhone || '',
      address: supplier.address || '',
    });
    setFormError('');
    setFormModal({ isOpen: true, mode: 'edit', supplierId: supplier._id || supplier.id });
  };

  const closeFormModal = () => {
    setFormModal({ isOpen: false, mode: 'create', supplierId: '' });
    setFormError('');
  };

  const openDeleteModal = (supplier) => {
    setDeleteModal({
      isOpen: true,
      supplierId: supplier._id || supplier.id,
      supplierName: supplier.name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, supplierId: '', supplierName: '' });
  };

  const handleSaveSupplier = async (event) => {
    event.preventDefault();

    const payload = {
      name: supplierForm.name.trim(),
      contactEmail: supplierForm.contactEmail.trim(),
      contactPhone: supplierForm.contactPhone.trim(),
      address: supplierForm.address.trim(),
    };

    if (!payload.name || !payload.contactEmail) {
      setFormError('Nombre y email son obligatorios.');
      return;
    }

    try {
      if (formModal.mode === 'create') {
        const response = await createSupplier(payload);
        setSuppliers((prev) => [response.data, ...prev]);
      } else {
        const response = await updateSupplier(formModal.supplierId, payload);
        const updated = response.data?.supplier || response.data;
        setSuppliers((prev) =>
          prev.map((supplier) =>
            (supplier._id || supplier.id) === formModal.supplierId ? updated : supplier,
          ),
        );
      }

      closeFormModal();
    } catch (error) {
      console.error('Error saving supplier:', error);
      setFormError('No se pudo guardar el proveedor.');
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      await deleteSupplier(deleteModal.supplierId);
      setSuppliers((prev) =>
        prev.filter((supplier) => (supplier._id || supplier.id) !== deleteModal.supplierId),
      );
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setErrorMessage('No se pudo eliminar el proveedor.');
    }
  };

  if (isLoading || loadingSuppliers) return <LoadingScreen message="Cargando proveedores..." />;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <SupplierHeader
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onOpenCreate={openCreateModal}
          />

          {errorMessage ? <p className="mb-2 text-xs text-rose-200">{errorMessage}</p> : null}

          <SupplierTable suppliers={suppliers} onEdit={openEditModal} onDelete={openDeleteModal} />
        </section>
      </div>

      <SupplierFormModal
        isOpen={formModal.isOpen}
        mode={formModal.mode}
        form={supplierForm}
        error={formError}
        onClose={closeFormModal}
        onChange={handleSupplierFormChange}
        onSubmit={handleSaveSupplier}
        supplier={selectedSupplier}
      />

      <DeleteSupplierModal
        isOpen={deleteModal.isOpen}
        supplierName={deleteModal.supplierName}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSupplier}
      />
    </div>
  );
}

export default Suppliers;
