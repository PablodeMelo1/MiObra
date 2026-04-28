function SupplierTable({ suppliers, onEdit, onDelete }) {
  if (suppliers.length === 0) {
    return <p className="rounded border border-white/10 bg-[#10141d] p-4 text-sm text-white/60">No hay proveedores disponibles</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#10141d]">
      <table className="min-w-[720px] text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
          <tr>
            <th className="px-3 py-2 text-left">Nombre</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Telefono</th>
            <th className="px-3 py-2 text-left">Direccion</th>
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id || supplier.id} className="border-t border-white/5 text-white/85">
              <td className="px-3 py-2">{supplier.name}</td>
              <td className="px-3 py-2">{supplier.contactEmail}</td>
              <td className="px-3 py-2">{supplier.contactPhone || '-'}</td>
              <td className="px-3 py-2">{supplier.address || '-'}</td>
              <td className="px-3 py-2">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(supplier)}
                    className="rounded border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(supplier)}
                    className="rounded border border-rose-300/30 px-2 py-1 text-xs text-rose-100/80 hover:bg-rose-500/20"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;
