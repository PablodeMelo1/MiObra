import { ITEM_TYPES } from './constants';

function InventoryHeader({ query, onQueryChange, typeFilter, onTypeFilterChange, onOpenHistory, onOpenCreate }) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-[#111723] p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Inventario</h1>
          <p className="text-xs text-white/60">Stock, herramientas y materiales disponibles para operar las obras.</p>
        </div>

        <div className="flex w-full flex-col gap-2 self-start sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/30"
          >
            <i className="fa-solid fa-timeline" aria-hidden="true" />
            Ver historial global
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30"
          >
            <i className="fa-solid fa-plus" aria-hidden="true" />
            Nuevo item
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full flex-1 rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/60 sm:min-w-55"
          placeholder="Buscar por nombre, descripcion o tipo"
        />

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          className="w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/60 sm:w-auto"
        >
          <option value="ALL">Todos los tipos</option>
          {ITEM_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default InventoryHeader;
