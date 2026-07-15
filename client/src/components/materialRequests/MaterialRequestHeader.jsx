import { MATERIAL_REQUEST_FILTER_OPTIONS } from '../../constants/materialRequest';

function MaterialRequestHeader({ statusFilter, onStatusFilterChange, onOpenCreate }) {
  return (
    <header className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Abastecimiento</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Peticiones de materiales</h1>
        <p className="text-xs text-white/60">Solicitudes de materiales y estado de compra/recepcion</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          aria-label="Filtrar peticiones por estado"
          className="min-h-10 border border-white/15 bg-[#0d1119] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
        >
          {MATERIAL_REQUEST_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex min-h-10 items-center justify-center gap-2 border border-cyan-300/30 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-500/10"
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Nueva peticion
        </button>
      </div>
    </header>
  );
}

export default MaterialRequestHeader;
