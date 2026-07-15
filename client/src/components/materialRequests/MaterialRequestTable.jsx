import { MATERIAL_REQUEST_STATUS_STYLES } from '../../constants/materialRequest';
import MaterialRequestStatusBadge from './MaterialRequestStatusBadge';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

function formatDimensions(dimensions) {
  if (!dimensions) return '-';
  const { length, width, thickness } = dimensions;
  const parts = [];
  if (length) parts.push(`L: ${length}`);
  if (width) parts.push(`A: ${width}`);
  if (thickness) parts.push(`E: ${thickness}`);
  return parts.length > 0 ? parts.join(' | ') : '-';
}

function MaterialRequestTable({ requests, onEdit, onDelete }) {
  if (requests.length === 0) {
    return (
      <p className="border-l-2 border-white/15 bg-white/[0.025] p-4 text-sm text-white/60">
        No hay peticiones de materiales
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-white/10 bg-[#101620]">
      <table className="min-w-[1040px] text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
          <tr>
            <th className="px-3 py-2 text-left">Material</th>
            <th className="px-3 py-2 text-left">Cant.</th>
            <th className="px-3 py-2 text-left">Solicitado por</th>
            <th className="px-3 py-2 text-left">Estado</th>
            <th className="px-3 py-2 text-left">Fecha pedido</th>
            <th className="px-3 py-2 text-left">Proveedor</th>
            <th className="px-3 py-2 text-left">Llega dia</th>
            <th className="px-3 py-2 text-left">Dimensiones</th>
            <th className="px-3 py-2 text-left">Proyecto</th>
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const style = MATERIAL_REQUEST_STATUS_STYLES[request.status] || MATERIAL_REQUEST_STATUS_STYLES.DEFAULT;

            return (
            <tr
              key={request._id || request.id}
              className={`border-t border-white/5 text-white/85 transition ${style.row}`}
            >
              <td className="px-3 py-2">{request.materialName}</td>
              <td className="px-3 py-2">{request.quantity}</td>
              <td className="px-3 py-2">{request.createdBy?.name || '-'}</td>
              <td className="px-3 py-2">
                <MaterialRequestStatusBadge status={request.status} />
              </td>
              <td className="px-3 py-2">{formatDate(request.orderDate)}</td>
              <td className="px-3 py-2">{request.supplierId?.name || '-'}</td>
              <td className="px-3 py-2">{formatDate(request.arrivalDate)}</td>
              <td className="px-3 py-2">{formatDimensions(request.dimensions)}</td>
              <td className="px-3 py-2">{request.projectId?.name || '-'}</td>
              <td className="px-3 py-2">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(request)}
                    className="rounded border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(request)}
                    className="rounded border border-rose-300/30 px-2 py-1 text-xs text-rose-100/80 hover:bg-rose-500/20"
                  >
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

export default MaterialRequestTable;
