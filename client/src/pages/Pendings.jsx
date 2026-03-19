import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { useAuth } from '../context/AuthContext';
import PendingHeader from '../components/pendings/PendingHeader';
import PendingList from '../components/pendings/PendingList';
import PendingFormModal from '../components/pendings/PendingFormModal';
import DeletePendingModal from '../components/pendings/DeletePendingModal';
import { getUsers } from '../api/user';
import {
  PENDING_FILTER_STATES,
  PENDING_FORM_DEFAULTS,
  PENDING_UI_MESSAGES,
} from '../constants/pending';
import {
  buildPendingPayload,
  getVisiblePendings,
  toInputDate,
} from '../components/pendings/pending-utils';
import {
  createPending,
  deletePending,
  getPendings,
  updatePending,
} from '../api/pendings';

function Pendings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [pendings, setPendings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingPendings, setLoadingPendings] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState(PENDING_FILTER_STATES[0]);

  const [formModal, setFormModal] = useState({ isOpen: false, mode: 'create', id: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', title: '' });
  const [form, setForm] = useState(PENDING_FORM_DEFAULTS);
  const [formError, setFormError] = useState('');

  const loadPendings = async () => {
    try {
      setLoadingPendings(true);
      setErrorMessage('');
      const [pendingsResponse, usersResponse] = await Promise.all([getPendings(), getUsers()]);
      setPendings(pendingsResponse.data?.pendings || []);
      setUsers(usersResponse.data || []);
    } catch (error) {
      console.error('Error loading pendings:', error);
      setPendings([]);
      setUsers([]);
      setErrorMessage(PENDING_UI_MESSAGES.LOAD_ERROR);
    } finally {
      setLoadingPendings(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadPendings();
  }, [isAuthenticated, isLoading, navigate]);

  const visiblePendings = useMemo(
    () => getVisiblePendings({ pendings, filter, search: searchValue }),
    [filter, pendings, searchValue],
  );

  const handleChange = (field, value) => {
    setFormError('');
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateModal = () => {
    const currentUserId = String(user?._id || user?.id || '');
    setForm({
      ...PENDING_FORM_DEFAULTS,
      assignedTo: currentUserId,
      collaborators: currentUserId ? [currentUserId] : [],
    });
    setFormError('');
    setFormModal({ isOpen: true, mode: 'create', id: '' });
  };

  const openEditModal = (pending) => {
    setForm({
      title: pending.title || '',
      description: pending.description || '',
      dueDate: toInputDate(pending.dueDate),
      isDone: Boolean(pending.isDone),
      assignedTo: String(pending.assignedTo?._id || pending.assignedTo || ''),
      collaborators: (pending.collaborators || []).map((collaborator) =>
        String(collaborator?._id || collaborator),
      ),
    });
    setFormError('');
    setFormModal({ isOpen: true, mode: 'edit', id: pending._id || pending.id });
  };

  const closeFormModal = () => {
    setFormModal({ isOpen: false, mode: 'create', id: '' });
    setFormError('');
  };

  const openDeleteModal = (pending) => {
    setDeleteModal({
      isOpen: true,
      id: pending._id || pending.id,
      title: pending.title,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: '', title: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = buildPendingPayload(form);
    if (!payload.title) {
      setFormError(PENDING_UI_MESSAGES.TITLE_REQUIRED);
      return;
    }

    if (!payload.assignedTo) {
      setFormError(PENDING_UI_MESSAGES.ASSIGNED_REQUIRED);
      return;
    }

    if (!payload.collaborators.length) {
      setFormError(PENDING_UI_MESSAGES.COLLABORATORS_REQUIRED);
      return;
    }

    if (!payload.collaborators.includes(String(payload.assignedTo))) {
      setFormError(PENDING_UI_MESSAGES.ASSIGNED_IN_COLLABORATORS);
      return;
    }

    try {
      if (formModal.mode === 'create') {
        const response = await createPending(payload);
        setPendings((prev) => [response.data, ...prev]);
      } else {
        const response = await updatePending(formModal.id, payload);
        const updated = response.data?.pending || response.data;
        setPendings((prev) =>
          prev.map((pending) => ((pending._id || pending.id) === formModal.id ? updated : pending)),
        );
      }

      closeFormModal();
    } catch (error) {
      console.error('Error saving pending:', error);
      setFormError(PENDING_UI_MESSAGES.SAVE_ERROR);
    }
  };

  const handleToggleDone = async (pending, nextDoneValue) => {
    const id = pending._id || pending.id;
    const previousValue = Boolean(pending.isDone);

    setPendings((prev) =>
      prev.map((item) => ((item._id || item.id) === id ? { ...item, isDone: nextDoneValue } : item)),
    );

    try {
      const response = await updatePending(id, {
        title: pending.title,
        description: pending.description || '',
        dueDate: pending.dueDate || null,
        isDone: nextDoneValue,
      });

      const updated = response.data?.pending || response.data;
      setPendings((prev) => prev.map((item) => ((item._id || item.id) === id ? updated : item)));
    } catch (error) {
      console.error('Error toggling pending state:', error);
      setPendings((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, isDone: previousValue } : item)),
      );
      setErrorMessage(PENDING_UI_MESSAGES.TOGGLE_ERROR);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePending(deleteModal.id);
      setPendings((prev) => prev.filter((pending) => (pending._id || pending.id) !== deleteModal.id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting pending:', error);
      setErrorMessage(PENDING_UI_MESSAGES.DELETE_ERROR);
    }
  };

  if (isLoading || loadingPendings) return null;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <PendingHeader
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filter={filter}
            onFilterChange={setFilter}
            onOpenCreate={openCreateModal}
          />

          {errorMessage ? <p className="mb-2 text-xs text-rose-200">{errorMessage}</p> : null}

          <PendingList
            pendings={visiblePendings}
            onToggleDone={handleToggleDone}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </section>
      </div>

      <PendingFormModal
        isOpen={formModal.isOpen}
        mode={formModal.mode}
        form={form}
        users={users}
        currentUserId={String(user?._id || user?.id || '')}
        error={formError}
        onClose={closeFormModal}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <DeletePendingModal
        isOpen={deleteModal.isOpen}
        pendingTitle={deleteModal.title}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Pendings;
