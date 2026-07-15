import { ITEM_TYPES } from './constants';

function InventoryHeader({ query, onQueryChange, typeFilter, onTypeFilterChange, onOpenHistory, onOpenCreate }) {
  return (
    <header className="mb-4 border-b border-white/10 pb-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Recursos</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">Inventario</h1>
          <p className="text-xs text-white/60">Stock, herramientas y materiales disponibles para operar las obras.</p>
        </div>

        <div className="flex w-full flex-col gap-2 self-start sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-white/15 px-3 py-2 text-sm text-white/75 hover:border-white/30 hover:text-white"
          >
            <i className="fa-solid fa-timeline" aria-hidden="true" />
            Ver historial global
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-cyan-300/35 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-500/10"
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
          aria-label="Buscar items de inventario"
          className="min-h-10 w-full flex-1 border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 sm:min-w-55"
          placeholder="Buscar por nombre, descripcion o tipo"
        />

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          aria-label="Filtrar inventario por tipo"
          className="min-h-10 w-full border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 sm:w-auto"
        >
          <option value="ALL">Todos los tipos</option>
          {ITEM_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default InventoryHeader;
