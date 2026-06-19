function SupplierHeader({ searchValue, onSearchChange, onOpenCreate }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-lg font-semibold">Proveedores</h1>
        <p className="text-xs text-white/60">Contactos, compras abiertas e historial operativo.</p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre"
          className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-xs text-white outline-none placeholder:text-white/35 focus:border-white/30 sm:w-52"
        />
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Nuevo proveedor
        </button>
      </div>
    </div>
  );
}

export default SupplierHeader;
