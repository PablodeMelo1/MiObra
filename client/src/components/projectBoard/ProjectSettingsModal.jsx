import { PROJECT_ROLE_OPTIONS } from '../../constants/projectBoard';

function ProjectSettingsModal({
  isOpen,
  form,
  members,
  availableUsers,
  newMember,
  onClose,
  onChange,
  onMemberChange,
  onAddMember,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/65 p-3 sm:p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/15 bg-[#111722] p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm font-semibold">Configuracion del proyecto</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/20 px-2 py-1 text-[11px] text-white/70 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-3 text-xs" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="sm:col-span-2 space-y-1">
              <span className="text-white/70">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => onChange('name', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                required
              />
            </label>

            <label className="sm:col-span-2 space-y-1">
              <span className="text-white/70">Descripcion</span>
              <textarea
                value={form.description}
                onChange={(event) => onChange('description', event.target.value)}
                rows={3}
                className="w-full resize-none rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
            </label>

            <label className="sm:col-span-2 space-y-1">
              <span className="text-white/70">Ubicacion</span>
              <input
                value={form.location}
                onChange={(event) => onChange('location', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
            </label>

            <label className="space-y-1">
              <span className="text-white/70">Fecha inicio</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => onChange('startDate', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
            </label>

            <label className="space-y-1">
              <span className="text-white/70">Fecha fin</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => onChange('endDate', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
            </label>
          </div>

          <div className="border-t border-white/10 pt-3">
            <h4 className="mb-2 text-xs font-semibold tracking-wide text-white/80">Miembros del proyecto</h4>

            <div className="mb-2 max-h-28 space-y-1 overflow-y-auto rounded border border-white/10 bg-[#0d1119] p-2">
              {members.length === 0 ? (
                <p className="text-[11px] text-white/50">No hay miembros cargados.</p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.memberId}
                    className="flex items-center justify-between rounded border border-white/10 px-2 py-1"
                  >
                    <span className="truncate text-[11px] text-white/80">
                      {member.name || member.email || member.userId}
                    </span>
                    <span className="text-[10px] text-white/55">{member.role}</span>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-white/70">Usuario</span>
                <select
                  value={newMember.userId}
                  onChange={(event) => onMemberChange('userId', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                >
                  <option value="">Seleccionar usuario</option>
                  {availableUsers.map((user) => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.name || user.email || user._id || user.id}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-white/70">Rol</span>
                <select
                  value={newMember.role}
                  onChange={(event) => onMemberChange('role', event.target.value)}
                  className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                >
                  {PROJECT_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={onAddMember}
                className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
              >
                Agregar miembro
              </button>
            </div>
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
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectSettingsModal;
