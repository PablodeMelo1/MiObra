function CreateProjectModal({ isOpen, form, error, onClose, onChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-3">
      <div className="w-full max-w-lg rounded-xl border border-white/15 bg-[#111722] p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm font-semibold">Crear proyecto</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/20 px-2 py-1 text-[11px] text-white/70 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-2 text-xs" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <label className="col-span-2 space-y-1">
              <span className="text-white/70">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => onChange('name', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                required
              />
            </label>

            <label className="col-span-2 space-y-1">
              <span className="text-white/70">Descripcion</span>
              <textarea
                value={form.description}
                onChange={(event) => onChange('description', event.target.value)}
                rows={3}
                className="w-full resize-none rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
            </label>

            <label className="col-span-2 space-y-1">
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

            <label className="col-span-2 space-y-1">
              <span className="text-white/70">Columnas (separadas por coma)</span>
              <input
                value={form.listsText}
                onChange={(event) => onChange('listsText', event.target.value)}
                placeholder="Pendientes, En progreso, Terminadas"
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
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
              className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
            >
              Crear proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
