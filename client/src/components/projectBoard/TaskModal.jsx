import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS, getTaskStatusLabel } from './boardUtils';

function TaskModal({
  isOpen,
  mode,
  form,
  users,
  lists,
  onClose,
  onChange,
  onSubmit,
  referenceTask,
  userLabelById,
}) {
  if (!isOpen) return null;

  const isDelete = mode === 'delete';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-3">
      <div className="w-full max-w-lg rounded-xl border border-white/15 bg-[#111722] p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm font-semibold">
            {mode === 'create' ? 'Crear tarea' : mode === 'edit' ? 'Editar tarea' : 'Eliminar tarea'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/20 px-2 py-1 text-[11px] text-white/70 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        {isDelete ? (
          <div className="space-y-3 text-xs">
            <p className="text-white/80">
              Seguro que queres eliminar la tarea <strong>{referenceTask?.title}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="rounded border border-rose-300/30 bg-rose-500/20 px-3 py-1.5 text-xs text-rose-100 hover:bg-rose-500/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-2 text-xs" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-2">
              <label className="col-span-2 space-y-1">
                <span className="text-white/70">Titulo</span>
                <input
                  value={form.title}
                  onChange={(event) => onChange('title', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                  required
                />
              </label>

              <label className="col-span-2 space-y-1">
                <span className="text-white/70">Descripcion</span>
                <textarea
                  value={form.description}
                  onChange={(event) => onChange('description', event.taraddget.value)}
                  rows={3}
                  className="w-full resize-none rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                />
              </label>

              <label className="space-y-1">
                <span className="text-white/70">Columna</span>
                <select
                  value={form.list}
                  onChange={(event) => onChange('list', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                >
                  {lists.map((listName) => (
                    <option key={listName} value={listName}>
                      {listName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-white/70">Asignado a</span>
                <select
                  value={form.assignedTo}
                  onChange={(event) => onChange('assignedTo', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                >
                  <option value="">Sin asignar</option>
                  {users.map((user) => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.name || user.email || user._id || user.id}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-white/70">Estado</span>
                <select
                  value={form.status}
                  onChange={(event) => onChange('status', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                >
                  {TASK_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {getTaskStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-white/70">Prioridad</span>
                <select
                  value={form.priority}
                  onChange={(event) => onChange('priority', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                >
                  {TASK_PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>

              <label className="col-span-2 space-y-1">
                <span className="text-white/70">Fecha limite</span>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => onChange('dueDate', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                />
              </label>

              {mode !== 'create' ? (
                <>
                  <label className="space-y-1">
                    <span className="text-white/50">ProjectId</span>
                    <input
                      value={form.projectId}
                      readOnly
                      className="w-full rounded border border-white/10 bg-[#090d14] px-2 py-1.5 text-white/50"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-white/50">CreatedAt</span>
                    <input
                      value={form.createdAt || 'Se asigna automaticamente'}
                      readOnly
                      className="w-full rounded border border-white/10 bg-[#090d14] px-2 py-1.5 text-white/50"
                    />
                  </label>
                </>
              ) : null}

              {referenceTask ? (
                <label className="col-span-2 space-y-1">
                  <span className="text-white/50">Asignado actual</span>
                  <input
                    value={
                      referenceTask.assignedTo ? userLabelById(referenceTask.assignedTo) : 'Sin asignar'
                    }
                    readOnly
                    className="w-full rounded border border-white/10 bg-[#090d14] px-2 py-1.5 text-white/50"
                  />
                </label>
              ) : null}
            </div>

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
                className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
              >
                {mode === 'create' ? 'Crear' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TaskModal;
