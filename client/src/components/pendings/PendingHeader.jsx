import { PENDING_FILTER_OPTIONS } from '../../constants/pending';

function PendingHeader({ searchValue, onSearchChange, filter, onFilterChange, onOpenCreate }) {
  const filterButtonClass = (value) =>
    `rounded border px-2.5 py-1 text-xs transition ${
      filter === value
        ? 'border-cyan-300/40 bg-cyan-400/20 text-cyan-100'
        : 'border-white/20 text-white/75 hover:bg-white/10'
    }`;

  return (
    <header className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Seguimiento</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Pendientes</h1>
        <p className="text-xs text-white/60">Lista personal para seguimiento diario</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por titulo"
          aria-label="Buscar pendientes por titulo"
          className="min-h-10 w-full border border-white/15 bg-[#0d1119] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60 sm:w-56"
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
    </header>
  );
}

export default PendingHeader;
