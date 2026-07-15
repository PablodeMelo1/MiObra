import { MOVEMENT_STATUS_LABELS, MOVEMENT_TYPE_LABELS } from './constants';
import { formatDate, getLabel } from './utils';

function InventoryHistoryTable({ activities }) {
  return (
    <div className="overflow-x-auto border border-white/10 bg-[#101620]">
      <table className="min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.025] text-left text-xs uppercase tracking-wide text-white/55">
            <th className="px-2 py-2">Fecha</th>
            <th className="px-2 py-2">Item</th>
            <th className="px-2 py-2">Tipo</th>
            <th className="px-2 py-2">Cantidad</th>
            <th className="px-2 py-2">Usuario</th>
            <th className="px-2 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id} className="border-b border-white/5">
              <td className="px-2 py-2">{formatDate(activity.createdAt)}</td>
              <td className="px-2 py-2">{activity.itemId?.name || activity.itemName || '-'}</td>
              <td className="px-2 py-2">{getLabel(MOVEMENT_TYPE_LABELS, activity.type)}</td>
              <td className="px-2 py-2">{activity.quantity}</td>
              <td className="px-2 py-2">{activity.userId?.name || activity.userId?.email || '-'}</td>
              <td className="px-2 py-2">{getLabel(MOVEMENT_STATUS_LABELS, activity.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryHistoryTable;
