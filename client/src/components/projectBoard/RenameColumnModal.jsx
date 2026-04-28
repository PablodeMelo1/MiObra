function RenameColumnModal({ isOpen, currentName, nextName, onClose, onChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/65 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-xl border border-white/15 bg-[#111722] p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm font-semibold">Renombrar columna</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/20 px-2 py-1 text-[11px] text-white/70 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-2 text-xs" onSubmit={onSubmit}>
          <p className="text-white/60">Actual: {currentName}</p>
          <label className="space-y-1">
            <span className="text-white/70">Nuevo nombre</span>
            <input
              value={nextName}
              onChange={(event) => onChange(event.target.value)}
              className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              required
            />
          </label>

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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameColumnModal;
