import StatusBadge from '../common/StatusBadge';

function phoneHref(phone) {
  const clean = String(phone || '').replace(/[^\d+]/g, '');
  return clean ? `https://wa.me/${clean.replace(/^\+/, '')}` : '';
}

function SupplierTable({ suppliers, getStats, onEdit, onDelete }) {
  if (suppliers.length === 0) {
    return <p className="border-l-2 border-white/15 bg-white/[0.025] p-4 text-sm text-white/60">No hay proveedores disponibles</p>;
  }

  return (
    <div className="overflow-x-auto border border-white/10 bg-[#101620]">
      <table className="min-w-[720px] text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
          <tr>
            <th className="px-3 py-2 text-left">Nombre</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Telefono</th>
            <th className="px-3 py-2 text-left">Direccion</th>
            <th className="px-3 py-2 text-left">Pedidos</th>
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => {
            const stats = getStats ? getStats(supplier) : { total: 0, open: 0 };
            const whatsapp = phoneHref(supplier.contactPhone);

            return (
            <tr key={supplier._id || supplier.id} className="border-t border-white/5 text-white/85">
              <td className="px-3 py-2 font-medium">{supplier.name}</td>
              <td className="px-3 py-2">
                {supplier.contactEmail ? (
                  <a className="text-cyan-100 hover:underline" href={`mailto:${supplier.contactEmail}`}>
                    {supplier.contactEmail}
                  </a>
                ) : '-'}
              </td>
              <td className="px-3 py-2">
                {whatsapp ? (
                  <a className="inline-flex items-center gap-1 text-emerald-100 hover:underline" href={whatsapp} target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                    {supplier.contactPhone}
                  </a>
                ) : supplier.contactPhone || '-'}
              </td>
              <td className="px-3 py-2">{supplier.address || '-'}</td>
              <td className="px-3 py-2">
                <div className="flex gap-1">
                  <StatusBadge tone={stats.open ? 'amber' : 'neutral'}>{stats.open} abiertos</StatusBadge>
                  <StatusBadge tone="cyan">{stats.total} total</StatusBadge>
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(supplier)}
                    className="inline-flex items-center gap-1 rounded border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    <i className="fa-regular fa-pen-to-square" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(supplier)}
                    className="inline-flex items-center gap-1 rounded border border-rose-300/30 px-2 py-1 text-xs text-rose-100/80 hover:bg-rose-500/20"
                  >
                    <i className="fa-regular fa-trash-can" aria-hidden="true" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          );})}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;
