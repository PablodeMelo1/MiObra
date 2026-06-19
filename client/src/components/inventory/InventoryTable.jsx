import StatusBadge from '../common/StatusBadge';

const getStockTone = (item) => {
  const available = Number(item.availableQuantity ?? 0);
  const total = Number(item.totalQuantity ?? 0);
  if (available <= 0) return 'rose';
  if (available <= Math.max(1, Math.ceil(total * 0.2))) return 'amber';
  return 'emerald';
};

const getStockLabel = (item) => {
  const available = Number(item.availableQuantity ?? 0);
  if (available <= 0) return 'Sin stock';
  if (getStockTone(item) === 'amber') return 'Bajo';
  return 'Disponible';
};

function InventoryTable({ items, getItemTypeLabel, onOpenDetails, onOpenEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <p className="rounded border border-white/10 bg-[#10141d] p-4 text-sm text-white/60">
        No hay items de inventario para los filtros seleccionados.
      </p>
    );
  }

  return (
    <div className="mb-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#111723] p-2">
      <table className="min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-white/60">
            <th className="px-2 py-2">Nombre</th>
            <th className="px-2 py-2">Tipo</th>
            <th className="px-2 py-2">Total</th>
            <th className="px-2 py-2">Disponible</th>
            <th className="px-2 py-2">Estado</th>
            <th className="px-2 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id || item.id} className="border-b border-white/5">
              <td className="px-2 py-2">
                <button
                  type="button"
                  onClick={() => onOpenDetails(item)}
                  className="text-cyan-200 underline-offset-2 hover:underline"
                >
                  {item.name}
                </button>
              </td>
              <td className="px-2 py-2">{getItemTypeLabel(item.itemType)}</td>
              <td className="px-2 py-2">{item.totalQuantity}</td>
              <td className="px-2 py-2">{item.availableQuantity}</td>
              <td className="px-2 py-2">
                <StatusBadge tone={getStockTone(item)}>{getStockLabel(item)}</StatusBadge>
              </td>
              <td className="px-2 py-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/10"
                    onClick={() => onOpenEdit(item)}
                  >
                    <i className="fa-regular fa-pen-to-square" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-rose-300/35 bg-rose-500/15 px-2 py-1 text-xs text-rose-100"
                    onClick={() => onDelete(item)}
                  >
                    <i className="fa-regular fa-trash-can" aria-hidden="true" />
                    Borrar
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

export default InventoryTable;
