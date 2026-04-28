import { ITEM_TYPES } from './constants';

function ItemFormModal({ isOpen, mode, selectedItem, form, error, onChange, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#101722] p-4"
      >
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-lg font-semibold">
            {mode === 'create' ? 'Nuevo item' : `Editar ${selectedItem?.name || ''}`}
          </h3>
          <button type="button" className="text-white/60 hover:text-white" onClick={onClose}>X</button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="text-sm text-white/80">
            Nombre
            <input
              value={form.name}
              onChange={(event) => onChange('name', event.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/60"
            />
          </label>

          <label className="text-sm text-white/80">
            Tipo
            <select
              value={form.itemType}
              onChange={(event) => onChange('itemType', event.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/60"
            >
              {ITEM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-white/80 md:col-span-2">
            Descripcion
            <textarea
              value={form.description}
              onChange={(event) => onChange('description', event.target.value)}
              className="mt-1 min-h-20 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/60"
            />
          </label>

          <label className="text-sm text-white/80">
            Total
            <input
              type="number"
              min="0"
              disabled={form.itemType === 'unique'}
              value={form.totalQuantity}
              onChange={(event) => onChange('totalQuantity', event.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none disabled:opacity-50 focus:border-cyan-300/60"
            />
          </label>

          <label className="text-sm text-white/80">
            Disponible
            <input
              type="number"
              min="0"
              disabled={form.itemType === 'unique'}
              value={form.availableQuantity}
              onChange={(event) => onChange('availableQuantity', event.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none disabled:opacity-50 focus:border-cyan-300/60"
            />
          </label>
        </div>

        {error ? <p className="mt-3 text-xs text-rose-200">{error}</p> : null}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-white/15 px-3 py-2 text-sm hover:bg-white/10">
            Cancelar
          </button>
          <button type="submit" className="rounded-md border border-emerald-300/35 bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemFormModal;
