import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/routing/LoadingScreen';
import { useAuth } from '../context/auth-context';
import { getUsers } from '../api/user';
import {
  createEmployee,
  createEmployeeInvitation,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../api/employees';
import { getApiErrorMessage } from '../utils/apiError';

const emptyForm = {
  fullName: '',
  documentType: '',
  documentNumber: '',
  position: '',
  department: '',
  phone: '',
  workEmail: '',
  status: 'active',
  hireDate: '',
  leaveDate: '',
  notes: '',
  userId: '',
};

const statusLabels = {
  active: 'Activo',
  inactive: 'Inactivo',
  on_leave: 'En licencia',
  left: 'Egresado',
};

function Employees() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyForm);

  const linkedUserIds = useMemo(
    () => new Set(employees.map((employee) => employee.userId?._id || employee.userId).filter(Boolean).map(String)),
    [employees],
  );

  const availableUsers = useMemo(
    () => users.filter((user) => {
      const userId = String(user._id || user.id);
      const currentEmployee = employees.find((employee) => String(employee._id || employee.id) === String(editingId));
      const currentUserId = currentEmployee?.userId?._id || currentEmployee?.userId;
      return !linkedUserIds.has(userId) || String(currentUserId) === userId;
    }),
    [editingId, employees, linkedUserIds, users],
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [employeesResponse, usersResponse] = await Promise.all([getEmployees(), getUsers()]);
      setEmployees(employeesResponse.data?.employees || []);
      setUsers(usersResponse.data || []);
    } catch (loadError) {
      console.error('Error loading employees:', loadError);
      setError('No se pudo cargar empleados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isLoading, loadData, navigate]);

  const handleChange = (field, value) => {
    setMessage('');
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingId('');
    setForm(emptyForm);
  };

  const openEdit = (employee) => {
    setEditingId(employee._id || employee.id);
    setForm({
      fullName: employee.fullName || '',
      documentType: employee.documentType || '',
      documentNumber: employee.documentNumber || '',
      position: employee.position || '',
      department: employee.department || '',
      phone: employee.phone || '',
      workEmail: employee.workEmail || '',
      status: employee.status || 'active',
      hireDate: employee.hireDate ? employee.hireDate.slice(0, 10) : '',
      leaveDate: employee.leaveDate ? employee.leaveDate.slice(0, 10) : '',
      notes: employee.notes || '',
      userId: employee.userId?._id || employee.userId || '',
    });
  };

  const buildPayload = () => ({
    fullName: form.fullName.trim(),
    documentType: form.documentType.trim(),
    documentNumber: form.documentNumber.trim(),
    position: form.position.trim(),
    department: form.department.trim(),
    phone: form.phone.trim(),
    workEmail: form.workEmail.trim() || null,
    status: form.status,
    hireDate: form.hireDate || null,
    leaveDate: form.leaveDate || null,
    notes: form.notes.trim(),
    userId: form.userId || null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload.fullName) {
      setError('El nombre completo es obligatorio.');
      return;
    }

    try {
      setError('');
      setMessage('');
      if (editingId) {
        const response = await updateEmployee(editingId, payload);
        const updated = response.data?.employee;
        setEmployees((current) => current.map((employee) => (
          String(employee._id || employee.id) === String(editingId) ? updated : employee
        )));
        setMessage('Empleado actualizado.');
      } else {
        const response = await createEmployee(payload);
        setEmployees((current) => [response.data?.employee, ...current]);
        setMessage('Empleado creado.');
      }
      resetForm();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'No se pudo guardar el empleado.'));
    }
  };

  const handleDelete = async (employee) => {
    try {
      setError('');
      await deleteEmployee(employee._id || employee.id);
      setEmployees((current) => current.filter((item) => String(item._id || item.id) !== String(employee._id || employee.id)));
      setMessage('Empleado eliminado.');
      if (editingId === (employee._id || employee.id)) resetForm();
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, 'No se pudo eliminar el empleado.'));
    }
  };

  const handleInvite = async (employee) => {
    try {
      setError('');
      setMessage('');
      const response = await createEmployeeInvitation(employee._id || employee.id, {});
      setMessage(response.data?.acceptUrl ? `Invitacion enviada. Link local: ${response.data.acceptUrl}` : 'Invitacion enviada.');
    } catch (inviteError) {
      setError(getApiErrorMessage(inviteError, 'No se pudo enviar la invitacion.'));
    }
  };

  if (isLoading || loading) return <LoadingScreen message="Cargando empleados..." />;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen flex-col items-stretch gap-4 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-6 lg:py-5">
        <Sidebar />
        <main className="min-w-0 flex-1 p-0 sm:p-3">
          <div className="mb-4">
            <h1 className="text-lg font-semibold">Empleados</h1>
            <p className="text-xs text-white/60">Gestion operativa del personal y vinculacion con cuentas de acceso.</p>
          </div>

          {(message || error) && (
            <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${error ? 'border-rose-300/25 bg-rose-500/10 text-rose-100' : 'border-cyan-300/25 bg-cyan-500/10 text-cyan-50'}`}>
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-5 rounded-lg border border-white/10 bg-[#111722] p-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs text-white/70">Nombre completo</span>
                <input value={form.fullName} onChange={(event) => handleChange('fullName', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Documento</span>
                <input value={form.documentType} onChange={(event) => handleChange('documentType', event.target.value)} placeholder="Tipo" className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Numero</span>
                <input value={form.documentNumber} onChange={(event) => handleChange('documentNumber', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Cargo</span>
                <input value={form.position} onChange={(event) => handleChange('position', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Departamento</span>
                <input value={form.department} onChange={(event) => handleChange('department', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Telefono</span>
                <input value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Email laboral</span>
                <input type="email" value={form.workEmail} onChange={(event) => handleChange('workEmail', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Estado</span>
                <select value={form.status} onChange={(event) => handleChange('status', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60">
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Fecha ingreso</span>
                <input type="date" value={form.hireDate} onChange={(event) => handleChange('hireDate', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-white/70">Fecha egreso</span>
                <input type="date" value={form.leaveDate} onChange={(event) => handleChange('leaveDate', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs text-white/70">Cuenta vinculada</span>
                <select value={form.userId} onChange={(event) => handleChange('userId', event.target.value)} className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60">
                  <option value="">Sin cuenta</option>
                  {availableUsers.map((user) => <option key={user._id || user.id} value={user._id || user.id}>{user.name || user.email}</option>)}
                </select>
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs text-white/70">Notas</span>
                <textarea value={form.notes} onChange={(event) => handleChange('notes', event.target.value)} rows={2} className="w-full resize-none rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm outline-none focus:border-cyan-300/60" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {editingId && <button type="button" onClick={resetForm} className="rounded border border-white/15 px-3 py-2 text-sm text-white/75 hover:bg-white/10">Cancelar</button>}
              <button type="submit" className="rounded bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#071017] hover:bg-cyan-200">{editingId ? 'Guardar cambios' : 'Crear empleado'}</button>
            </div>
          </form>

          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-white/5 text-xs text-white/60">
                <tr>
                  <th className="px-3 py-2">Empleado</th>
                  <th className="px-3 py-2">Cargo</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Cuenta</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#111722]">
                {employees.map((employee) => (
                  <tr key={employee._id || employee.id} className="align-top">
                    <td className="px-3 py-2 font-medium">{employee.fullName}</td>
                    <td className="px-3 py-2 text-white/70">{employee.position || '-'}</td>
                    <td className="px-3 py-2 text-white/70">{statusLabels[employee.status] || employee.status}</td>
                    <td className="px-3 py-2 text-white/70">{employee.workEmail || '-'}</td>
                    <td className="px-3 py-2 text-white/70">{employee.userId?.name || employee.userId?.email || 'Sin cuenta'}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openEdit(employee)} className="rounded border border-white/15 px-2 py-1 text-xs text-white/75 hover:bg-white/10">Editar</button>
                        <button type="button" onClick={() => handleInvite(employee)} disabled={!employee.workEmail || employee.userId} className="rounded border border-cyan-200/25 px-2 py-1 text-xs text-cyan-100 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30">Invitar</button>
                        <button type="button" onClick={() => handleDelete(employee)} className="rounded border border-rose-300/25 px-2 py-1 text-xs text-rose-100 hover:bg-rose-500/10">Borrar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-3 py-8 text-center text-white/50">No hay empleados cargados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Employees;
