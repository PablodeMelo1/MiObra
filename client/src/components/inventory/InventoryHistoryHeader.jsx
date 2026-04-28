function InventoryHistoryHeader({ onBack, errorMessage }) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-[#111723] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Historial global de inventario</h1>
          <p className="text-xs text-white/60">Actividad consolidada de todos los items.</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

      {errorMessage ? <p className="text-xs text-rose-200">{errorMessage}</p> : null}
    </div>
  );
}

export default InventoryHistoryHeader;
