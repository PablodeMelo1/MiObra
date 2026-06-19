import { MATERIAL_REQUEST_FILTER_OPTIONS } from '../../constants/materialRequest';

function MaterialRequestHeader({ statusFilter, onStatusFilterChange, onOpenCreate }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-lg font-semibold">Peticiones de materiales</h1>
        <p className="text-xs text-white/60">Solicitudes de materiales y estado de compra/recepcion</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-xs text-white outline-none focus:border-white/30"
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
          className="inline-flex items-center gap-2 rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Nueva peticion
        </button>
      </div>
    </div>
  );
}

export default MaterialRequestHeader;
