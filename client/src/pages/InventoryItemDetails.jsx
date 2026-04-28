import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import EditItemModal from '../components/inventory/EditItemModal';
import ItemActivitiesTable from '../components/inventory/ItemActivitiesTable';
import ItemDetailsHeader from '../components/inventory/ItemDetailsHeader';
import ItemSummaryCard from '../components/inventory/ItemSummaryCard';
import MovementFormCard from '../components/inventory/MovementFormCard';
import { DEFAULT_EDIT_FORM } from '../components/inventory/constants';
import { useAuth } from '../context/auth-context';
import {
  checkinItem,
  checkoutItem,
  getItemActivities,
  getItemById,
  updateItem,
} from '../api/items';
import { getUsers } from '../api/user';

function InventoryItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [item, setItem] = useState(null);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [movementMode, setMovementMode] = useState('checkout');
  const [movementQty, setMovementQty] = useState('1');
  const [movementUserId, setMovementUserId] = useState('');
  const [movementError, setMovementError] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const userDropdownRef = useRef(null);
  const [rowReturnQty, setRowReturnQty] = useState({});
  const [rowActionError, setRowActionError] = useState('');
  const [rowActionLoadingId, setRowActionLoadingId] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(DEFAULT_EDIT_FORM);
  const [editError, setEditError] = useState('');

  const canCheckout = useMemo(() => Number(item?.availableQuantity || 0) > 0, [item]);
  const selectedMovementUser = useMemo(
    () => users.find((movementUser) => (movementUser._id || movementUser.id) === movementUserId) || null,
    [movementUserId, users],
  );
  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((movementUser) => {
      const label = `${movementUser?.name || ''} ${movementUser?.email || ''}`.toLowerCase();
      return label.includes(query);
    });
  }, [userSearch, users]);

  const openEditModal = () => {
    if (!item) return;
    const isUnique = item.itemType === 'unique';
    setEditForm({
      name: item.name || '',
      description: item.description || '',
      itemType: item.itemType || 'commodity',
      totalQuantity: isUnique ? '1' : String(item.totalQuantity ?? 1),
      availableQuantity: isUnique ? '1' : String(item.availableQuantity ?? 1),
    });
    setEditError('');
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditError('');
  };

  const onEditChange = (field, value) => {
    setEditError('');
    const next = { ...editForm, [field]: value };
    if (field === 'itemType' && value === 'unique') {
      next.totalQuantity = '1';
      next.availableQuantity = '1';
    }
    setEditForm(next);
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    if (!item) return;

    const payload = {
      name: editForm.name.trim(),
      description: editForm.description,
      itemType: editForm.itemType,
      totalQuantity: editForm.itemType === 'unique' ? 1 : Number(editForm.totalQuantity),
      availableQuantity: editForm.itemType === 'unique' ? 1 : Number(editForm.availableQuantity),
    };

    if (!payload.name) {
      setEditError('El nombre es obligatorio.');
      return;
    }

    if (payload.itemType !== 'unique') {
      if (!Number.isFinite(payload.totalQuantity) || payload.totalQuantity <= 0) {
        setEditError('La cantidad total debe ser mayor a 0.');
        return;
      }
      if (!Number.isFinite(payload.availableQuantity) || payload.availableQuantity < 0) {
        setEditError('La cantidad disponible no puede ser negativa.');
        return;
      }
      if (payload.availableQuantity > payload.totalQuantity) {
        setEditError('Disponible no puede superar el total.');
        return;
      }
    }

    try {
      await updateItem(id, payload);
      await loadData();
      closeEditModal();
    } catch (error) {
      setEditError(error?.response?.data?.message || 'No se pudo editar el item.');
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      setErrorMessage('');

      const [itemResponse, activitiesResponse, usersResponse] = await Promise.all([
        getItemById(id),
        getItemActivities(id),
        getUsers(),
      ]);

      setItem(itemResponse.data || null);
      setActivities(activitiesResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (error) {
      console.error('Error loading item details:', error);
      setErrorMessage('No se pudo cargar el detalle del item.');
    } finally {
      setLoadingData(false);
    }
  }, [id]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      navigate('/inventory');
      return;
    }

    loadData();
  }, [id, isAuthenticated, isLoading, loadData, navigate]);

  useEffect(() => {
    if (!movementUserId && users.length > 0) {
      setMovementUserId(users[0]._id || users[0].id || '');
    }
  }, [movementUserId, users]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitMovement = async (event) => {
    event.preventDefault();

    const qty = Number(movementQty);
    if (!Number.isFinite(qty) || qty <= 0) {
      setMovementError('Cantidad invalida.');
      return;
    }

    if (!movementUserId) {
      setMovementError('Selecciona el usuario del movimiento.');
      return;
    }

    try {
      setMovementError('');
      const payload = {
        userId: movementUserId,
        quantity: qty,
      };

      if (movementMode === 'checkout') {
        await checkoutItem(id, payload);
      } else {
        await checkinItem(id, payload);
      }

      setMovementQty('1');
      await loadData();
    } catch (error) {
      console.error('Error creating movement:', error);
      setMovementError(error?.response?.data?.message || 'No se pudo registrar el movimiento.');
    }
  };

  const getActivityUserId = (activity) => activity?.userId?._id || activity?.userId?.id || activity?.userId;

  const handleReturnAll = async (activity) => {
    const pending = Number(activity?.remainingQuantity || 0);
    const userId = getActivityUserId(activity);
    if (!userId || pending <= 0) return;

    try {
      setRowActionError('');
      setRowActionLoadingId(activity._id);
      const response = await checkinItem(id, { userId, quantity: pending });
      setActivities((prev) => prev.filter((row) => row._id !== activity._id));
      if (response?.data?.item) {
        setItem((prev) => ({ ...prev, ...response.data.item }));
      }
    } catch (error) {
      setRowActionError(error?.response?.data?.message || 'No se pudo devolver todo el pendiente.');
    } finally {
      setRowActionLoadingId('');
    }
  };

  const handleReturnPartial = async (activity) => {
    const pending = Number(activity?.remainingQuantity || 0);
    const userId = getActivityUserId(activity);
    const selectedQty = Number(rowReturnQty[activity._id] || 0);

    if (!userId) {
      setRowActionError('No se encontro el usuario del movimiento.');
      return;
    }
    if (!Number.isFinite(selectedQty) || selectedQty <= 0) {
      setRowActionError('Ingresa una cantidad valida para devolver.');
      return;
    }
    if (selectedQty > pending) {
      setRowActionError('La cantidad a devolver no puede superar el pendiente.');
      return;
    }

    try {
      setRowActionError('');
      setRowActionLoadingId(activity._id);
      const response = await checkinItem(id, { userId, quantity: selectedQty });
      setRowReturnQty((prev) => ({ ...prev, [activity._id]: '' }));
      setActivities((prev) => prev
        .map((row) => {
          if (row._id !== activity._id) return row;
          const nextRemaining = Number(row.remainingQuantity || 0) - selectedQty;
          const nextQuantity = Number(row.quantity || 0) - selectedQty;

          if (nextRemaining <= 0) return null;

          return {
            ...row,
            quantity: nextQuantity,
            remainingQuantity: nextRemaining,
            type: 'CHECK_IN',
            status: 'OPEN',
            updatedAt: new Date().toISOString(),
          };
        })
        .filter(Boolean));
      if (response?.data?.item) {
        setItem((prev) => ({ ...prev, ...response.data.item }));
      }
    } catch (error) {
      setRowActionError(error?.response?.data?.message || 'No se pudo devolver la cantidad indicada.');
    } finally {
      setRowActionLoadingId('');
    }
  };

  if (isLoading || loadingData) return <LoadingScreen message="Cargando item..." />;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen flex-col items-stretch gap-4 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-6 lg:py-5">
        <Sidebar />

        <section className="min-w-0 flex-1 p-0 sm:p-3">
          <div className="mb-4 rounded-2xl border border-white/10 bg-[#111723] p-4">
            <ItemDetailsHeader onEdit={openEditModal} onBack={() => navigate('/inventory')} />

            {errorMessage ? <p className="text-xs text-rose-200">{errorMessage}</p> : null}

            <ItemSummaryCard item={item} />
          </div>

          <MovementFormCard
            users={users}
            movementUserId={movementUserId}
            selectedMovementUser={selectedMovementUser}
            isUserDropdownOpen={isUserDropdownOpen}
            userDropdownRef={userDropdownRef}
            userSearch={userSearch}
            filteredUsers={filteredUsers}
            movementMode={movementMode}
            movementQty={movementQty}
            canCheckout={canCheckout}
            movementError={movementError}
            onToggleDropdown={() => setIsUserDropdownOpen((prev) => !prev)}
            onUserSearch={setUserSearch}
            onSelectUser={(userId) => {
              setMovementError('');
              setMovementUserId(userId);
              setIsUserDropdownOpen(false);
              setUserSearch('');
            }}
            onMovementMode={(value) => {
              setMovementError('');
              setMovementMode(value);
            }}
            onMovementQty={(value) => {
              setMovementError('');
              setMovementQty(value);
            }}
            onSubmit={submitMovement}
          />

          <ItemActivitiesTable
            activities={activities}
            rowActionLoadingId={rowActionLoadingId}
            rowReturnQty={rowReturnQty}
            rowActionError={rowActionError}
            onReturnAll={handleReturnAll}
            onReturnQtyChange={(activityId, value) => {
              setRowActionError('');
              setRowReturnQty((prev) => ({ ...prev, [activityId]: value }));
            }}
            onReturnPartial={handleReturnPartial}
          />

          <EditItemModal
            isOpen={editModalOpen}
            form={editForm}
            error={editError}
            onChange={onEditChange}
            onClose={closeEditModal}
            onSubmit={submitEdit}
          />
        </section>
      </div>
    </div>
  );
}

export default InventoryItemDetails;
