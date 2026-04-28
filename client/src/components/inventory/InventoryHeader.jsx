import { ITEM_TYPES } from './constants';

function InventoryHeader({ query, onQueryChange, typeFilter, onTypeFilterChange, onOpenHistory, onOpenCreate }) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-[#111723] p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Inventario</h1>
          <p className="text-xs text-white/60">Listado de items. Entrando a cada uno ves toda la info y su historial.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            type="button"
            onClick={onOpenHistory}
            className="rounded-lg border border-cyan-300/40 bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/30"
          >
            Ver historial global
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30"
          >
            Nuevo item
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="min-w-55 flex-1 rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/60"
          placeholder="Buscar por nombre, descripcion o tipo"
        />

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          className="rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/60"
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
