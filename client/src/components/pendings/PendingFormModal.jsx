import { useMemo } from 'react';
import CollaboratorsSelector from './CollaboratorsSelector';

function PendingFormModal({
  isOpen,
  mode,
  form,
  users,
  currentUserId,
  error,
  onClose,
  onChange,
  onSubmit,
}) {
  const collaboratorUsers = useMemo(
    () => users.filter((user) => (form.collaborators ?? []).includes(String(user._id || user.id))),
    [form.collaborators, users],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-3">
      <div className="w-full max-w-lg rounded-xl border border-cyan-300/20 bg-[#0f1724] p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm font-semibold">{mode === 'create' ? 'Crear pendiente' : 'Editar pendiente'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/20 px-2 py-1 text-[11px] text-white/70 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-2 text-xs" onSubmit={onSubmit}>
          <label className="space-y-1">
            <span className="text-white/70">Titulo</span>
            <input
              value={form.title}
              onChange={(event) => onChange('title', event.target.value)}
              className="w-full rounded border border-white/15 bg-[#0b1019] px-2 py-1.5 text-white outline-none focus:border-cyan-300/40"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="text-white/70">Descripcion</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => onChange('description', event.target.value)}
              className="w-full resize-none rounded border border-white/15 bg-[#0b1019] px-2 py-1.5 text-white outline-none focus:border-cyan-300/40"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-white/70">Fecha limite</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => onChange('dueDate', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0b1019] px-2 py-1.5 text-white outline-none focus:border-cyan-300/40"
              />
            </label>

            <label className="mt-5 inline-flex items-center gap-2 rounded border border-white/15 bg-white/5 px-2 py-1.5 text-white/80">
              <input
                type="checkbox"
                checked={Boolean(form.isDone)}
                onChange={(event) => onChange('isDone', event.target.checked)}
                className="h-4 w-4 rounded border-white/25 bg-[#0b1019] accent-emerald-400"
              />
              Marcar como completado
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-white/70">Colaboradores</span>
              <CollaboratorsSelector
                users={users}
                collaborators={form.collaborators}
                assignedTo={form.assignedTo}
                currentUserId={currentUserId}
                onChange={({ collaborators, assignedTo }) => {
                  onChange('collaborators', collaborators);
                  onChange('assignedTo', assignedTo);
                }}
              />
            </label>

            <label className="space-y-1">
              <span className="text-white/70">Assigned to</span>
              <select
                value={form.assignedTo}
                onChange={(event) => onChange('assignedTo', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0b1019] px-2 py-1.5 text-white outline-none focus:border-cyan-300/40"
              >
                {collaboratorUsers.map((user) => {
                  const id = String(user._id || user.id);
                  return (
                    <option key={id} value={id}>
                      {user.name || user.email || id}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          {error ? <p className="text-[11px] text-rose-200">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded border border-cyan-300/35 bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-500/30"
            >
              {mode === 'create' ? 'Crear' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PendingFormModal;
