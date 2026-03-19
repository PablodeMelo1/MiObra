function SupplierFormModal({ isOpen, mode, form, error, onClose, onChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-3">
      <div className="w-full max-w-lg rounded-xl border border-white/15 bg-[#111722] p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm font-semibold">{mode === 'create' ? 'Crear proveedor' : 'Editar proveedor'}</h3>
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
            <span className="text-white/70">Nombre</span>
            <input
              value={form.name}
              onChange={(event) => onChange('name', event.target.value)}
              className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="text-white/70">Email de contacto</span>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(event) => onChange('contactEmail', event.target.value)}
              className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="text-white/70">Telefono</span>
            <input
              value={form.contactPhone}
              onChange={(event) => onChange('contactPhone', event.target.value)}
              className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
            />
          </label>

          <label className="space-y-1">
            <span className="text-white/70">Direccion</span>
            <input
              value={form.address}
              onChange={(event) => onChange('address', event.target.value)}
              className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
            />
          </label>

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
              {mode === 'create' ? 'Crear' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierFormModal;
