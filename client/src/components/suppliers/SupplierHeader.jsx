function SupplierHeader({ searchValue, onSearchChange, onOpenCreate }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-lg font-semibold">Proveedores</h1>
        <p className="text-xs text-white/60">Gestion completa de proveedores</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre"
          className="w-52 rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-xs text-white outline-none placeholder:text-white/35 focus:border-white/30"
        />
        <button
          type="button"
          onClick={onOpenCreate}
          className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
        >
          Nuevo proveedor
        </button>
      </div>
    </div>
  );
}

export default SupplierHeader;
