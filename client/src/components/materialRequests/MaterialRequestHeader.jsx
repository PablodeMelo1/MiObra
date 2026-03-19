import { MATERIAL_REQUEST_FILTER_OPTIONS } from '../../constants/materialRequest';

function MaterialRequestHeader({ onOpenCreate, statusFilter, onStatusFilterChange }) {
  const getFilterClass = (value) =>
    `rounded border px-2.5 py-1 text-xs transition ${
      statusFilter === value
        ? 'border-white/30 bg-white/15 text-white'
        : 'border-white/20 text-white/70 hover:bg-white/10'
    }`;

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-lg font-semibold">Peticiones de materiales</h1>
        <p className="text-xs text-white/60">Solicitudes de materiales y estado de compra/recepcion</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">

        <button
          type="button"
          onClick={onOpenCreate}
          className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
        >
          Nueva peticion
        </button>
      </div>
    </div>
  );
}

export default MaterialRequestHeader;
