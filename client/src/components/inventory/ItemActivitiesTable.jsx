import { MOVEMENT_STATUS_LABELS, MOVEMENT_TYPE_LABELS } from './constants';
import { formatDate, getLabel } from './utils';

function ItemActivitiesTable({
  activities,
  rowActionLoadingId,
  rowReturnQty,
  rowActionError,
  onReturnAll,
  onReturnQtyChange,
  onReturnPartial,
}) {
  return (
    <section className="border-t border-white/15 pt-4">
      <h2 className="mb-3 text-base font-semibold">Historial del item</h2>
      <div className="overflow-x-auto border border-white/10 bg-[#101620]">
        <table className="min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/60">
              <th className="px-2 py-2">Usuario</th>
              <th className="px-2 py-2">Saldo</th>
              <th className="px-2 py-2">Pendiente</th>
              <th className="px-2 py-2">Ultimo movimiento</th>
              <th className="px-2 py-2">Estado</th>
              <th className="px-2 py-2">Actualizado</th>
              <th className="px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id} className="border-b border-white/5">
                <td className="px-2 py-2">{activity.userId?.name || activity.userId?.email || '-'}</td>
                <td className="px-2 py-2">{activity.quantity}</td>
                <td className="px-2 py-2">{activity.remainingQuantity}</td>
                <td className="px-2 py-2">{getLabel(MOVEMENT_TYPE_LABELS, activity.type)}</td>
                <td className="px-2 py-2">{getLabel(MOVEMENT_STATUS_LABELS, activity.status)}</td>
                <td className="px-2 py-2">{formatDate(activity.updatedAt || activity.createdAt)}</td>
                <td className="px-2 py-2">
                  {Number(activity.remainingQuantity || 0) > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onReturnAll(activity)}
                        disabled={rowActionLoadingId === activity._id}
                        className="rounded-md border border-emerald-300/35 bg-emerald-500/20 px-2 py-1 text-xs text-emerald-100 disabled:opacity-50"
                      >
                        Devolver todo
                      </button>

                      <input
                        type="number"
                        min="1"
                        max={activity.remainingQuantity}
                        value={rowReturnQty[activity._id] ?? ''}
                        onChange={(event) => onReturnQtyChange(activity._id, event.target.value)}
                        className="w-24 rounded-md border border-white/15 bg-black/20 px-2 py-1 text-xs outline-none"
                        placeholder="Cantidad"
                      />

                      <button
                        type="button"
                        onClick={() => onReturnPartial(activity)}
                        disabled={rowActionLoadingId === activity._id}
                        className="rounded-md border border-cyan-300/35 bg-cyan-500/20 px-2 py-1 text-xs text-cyan-100 disabled:opacity-50"
                      >
                        Devolver
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-white/45">Sin pendiente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rowActionError ? <p className="mt-2 text-xs text-rose-200">{rowActionError}</p> : null}
    </section>
  );
}

export default ItemActivitiesTable;
