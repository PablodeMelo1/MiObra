function SupplierHeader({ searchValue, onSearchChange, onOpenCreate }) {
  return (
    <header className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Abastecimiento</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Proveedores</h1>
        <p className="text-xs text-white/60">Contactos, compras abiertas e historial operativo.</p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre"
          aria-label="Buscar proveedores por nombre"
          className="min-h-10 w-full border border-white/15 bg-[#0d1119] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60 sm:w-52"
        />
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex min-h-10 items-center justify-center gap-2 border border-cyan-300/30 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-500/10"
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Nuevo proveedor
        </button>
      </div>
    </header>
  );
}

export default SupplierHeader;
