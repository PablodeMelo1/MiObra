import { PENDING_FILTER_OPTIONS } from '../../constants/pending';

function PendingHeader({ searchValue, onSearchChange, filter, onFilterChange, onOpenCreate }) {
  const filterButtonClass = (value) =>
    `rounded border px-2.5 py-1 text-xs transition ${
      filter === value
        ? 'border-cyan-300/40 bg-cyan-400/20 text-cyan-100'
        : 'border-white/20 text-white/75 hover:bg-white/10'
    }`;

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-lg font-semibold">Pendientes</h1>
        <p className="text-xs text-white/60">Lista personal para seguimiento diario</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por titulo"
          className="w-56 rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-xs text-white outline-none placeholder:text-white/35 focus:border-white/30"
        />

        {PENDING_FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={filterButtonClass(option.value)}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onOpenCreate}
          className="rounded border border-cyan-300/35 bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-500/30"
        >
          Nuevo pendiente
        </button>
      </div>
    </div>
  );
}

export default PendingHeader;
