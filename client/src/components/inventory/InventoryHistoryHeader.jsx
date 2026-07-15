function InventoryHistoryHeader({ onBack, errorMessage }) {
  return (
    <header className="mb-4 border-b border-white/10 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Inventario</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">Historial global</h1>
          <p className="text-xs text-white/60">Actividad consolidada de todos los items.</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="border border-white/20 px-3 py-2 text-sm hover:bg-white/5"
        >
          Volver al listado
        </button>
      </div>

      {errorMessage ? <p className="text-xs text-rose-200">{errorMessage}</p> : null}
    </header>
  );
}

export default InventoryHistoryHeader;
