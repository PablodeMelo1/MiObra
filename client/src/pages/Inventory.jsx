import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import InventoryHeader from '../components/inventory/InventoryHeader';
import InventoryTable from '../components/inventory/InventoryTable';
import ItemFormModal from '../components/inventory/ItemFormModal';
import { EMPTY_ITEM_FORM, ITEM_TYPE_LABELS } from '../components/inventory/constants';
import { useAuth } from '../context/auth-context';
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from '../api/items';

const getItemTypeLabel = (value) => ITEM_TYPE_LABELS[value] || value || '-';

function Inventory() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [itemModal, setItemModal] = useState({ isOpen: false, mode: 'create', id: '' });
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);
  const [itemFormError, setItemFormError] = useState('');

  const selectedItem = useMemo(
    () => items.find((item) => (item._id || item.id) === itemModal.id) || null,
    [itemModal.id, items],
  );

  const filteredItems = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter((item) => {
      const byType = typeFilter === 'ALL' ? true : item.itemType === typeFilter;
      if (!byType) return false;
      if (!text) return true;
      return [item.name, item.description, item.itemType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text));
    });
  }, [items, query, typeFilter]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setErrorMessage('');

      const itemsResponse = await getItems();
      setItems(itemsResponse.data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      setErrorMessage('No se pudo cargar el inventario.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, isLoading, navigate]);

  const openCreateItem = () => {
    setItemForm(EMPTY_ITEM_FORM);
    setItemFormError('');
    setItemModal({ isOpen: true, mode: 'create', id: '' });
  };

  const openEditItem = (item) => {
    const isUnique = item.itemType === 'unique';
    setItemForm({
      name: item.name || '',
      description: item.description || '',
      itemType: item.itemType || 'commodity',
      totalQuantity: isUnique ? '1' : String(item.totalQuantity ?? 1),
      availableQuantity: isUnique ? '1' : String(item.availableQuantity ?? 1),
    });
    setItemFormError('');
    setItemModal({ isOpen: true, mode: 'edit', id: item._id || item.id });
  };

  const closeItemModal = () => {
    setItemModal({ isOpen: false, mode: 'create', id: '' });
    setItemFormError('');
  };

  const handleItemChange = (field, value) => {
    setItemFormError('');
    const next = { ...itemForm, [field]: value };

    if (field === 'itemType' && value === 'unique') {
      next.totalQuantity = '1';
      next.availableQuantity = '1';
    }

    setItemForm(next);
  };

  const buildItemPayload = () => {
    const isUnique = itemForm.itemType === 'unique';
    return {
      name: itemForm.name.trim(),
      description: itemForm.description,
      itemType: itemForm.itemType,
      totalQuantity: isUnique ? 1 : Number(itemForm.totalQuantity),
      availableQuantity: isUnique ? 1 : Number(itemForm.availableQuantity),
    };
  };

  const submitItem = async (event) => {
    event.preventDefault();

    const payload = buildItemPayload();
    if (!payload.name || !payload.itemType) {
      setItemFormError('Nombre y tipo son obligatorios.');
      return;
    }

    if (payload.itemType !== 'unique') {
      if (!Number.isFinite(payload.totalQuantity) || payload.totalQuantity <= 0) {
        setItemFormError('La cantidad total debe ser mayor a 0.');
        return;
      }
      if (!Number.isFinite(payload.availableQuantity) || payload.availableQuantity < 0) {
        setItemFormError('La cantidad disponible no puede ser negativa.');
        return;
      }
      if (payload.availableQuantity > payload.totalQuantity) {
        setItemFormError('Disponible no puede superar el total.');
        return;
      }
    }

    try {
      if (itemModal.mode === 'create') {
        await createItem(payload);
      } else {
        await updateItem(itemModal.id, payload);
      }
      await loadData();
      closeItemModal();
    } catch (error) {
      console.error('Error saving item:', error);
      setItemFormError(error?.response?.data?.message || 'No se pudo guardar el item.');
    }
  };

  const onDeleteItem = async (item) => {
    const ok = window.confirm(`Eliminar ${item.name}?`);
    if (!ok) return;

    try {
      await deleteItem(item._id || item.id);
      await loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
      setErrorMessage('No se pudo eliminar el item.');
    }
  };

  if (isLoading || loadingData) return <LoadingScreen message="Cargando inventario..." />;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <InventoryHeader
            query={query}
            onQueryChange={setQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onOpenHistory={() => navigate('/inventory/history')}
            onOpenCreate={openCreateItem}
          />

          {errorMessage ? <p className="mb-3 text-xs text-rose-200">{errorMessage}</p> : null}

          <InventoryTable
            items={filteredItems}
            getItemTypeLabel={getItemTypeLabel}
            onOpenDetails={(item) => navigate(`/inventory/${item._id || item.id}`)}
            onOpenEdit={openEditItem}
            onDelete={onDeleteItem}
          />

        </section>
      </div>

      <ItemFormModal
        isOpen={itemModal.isOpen}
        mode={itemModal.mode}
        selectedItem={selectedItem}
        form={itemForm}
        error={itemFormError}
        onChange={handleItemChange}
        onClose={closeItemModal}
        onSubmit={submitItem}
      />
    </div>
  );
}

export default Inventory;
