import EmptyState from '../common/EmptyState';
import MetricTile from '../common/MetricTile';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/dates';
import { getLowStockItems, getOpenMaterialRequests, getOverdueTasks } from '../../services/operationsData';

function ProjectControlPanel({ project, tasks, materialRequests, items }) {
  const openRequests = getOpenMaterialRequests(materialRequests);
  const overdueTasks = getOverdueTasks(tasks);
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
  const lowStockItems = getLowStockItems(items);
  const suppliers = [
    ...new Map(
      materialRequests
        .map((request) => request.supplierId)
        .filter(Boolean)
        .map((supplier) => [supplier._id || supplier.id || supplier, supplier]),
    ).values(),
  ];

  return (
    <section className="space-y-3">
      <div className="grid gap-px overflow-hidden border-y border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Tareas" value={tasks.length} detail={`${completedTasks} completadas`} tone="cyan" icon="fa-solid fa-list-check" />
        <MetricTile label="Vencidas" value={overdueTasks.length} detail="Fuera de fecha" tone={overdueTasks.length ? 'rose' : 'emerald'} icon="fa-solid fa-clock" />
        <MetricTile label="Materiales abiertos" value={openRequests.length} detail="Pedidos sin recibir" tone="amber" icon="fa-solid fa-truck-ramp-box" />
        <MetricTile label="Proveedores" value={suppliers.length} detail="Vinculados a la obra" tone="neutral" icon="fa-solid fa-truck-field" />
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <div className="border-t border-white/15 pt-3">
          <h2 className="text-sm font-semibold">Datos de obra</h2>
          <dl className="mt-3 grid gap-2 text-xs text-white/65">
            <div className="flex justify-between gap-3">
              <dt>Ubicacion</dt>
              <dd className="truncate text-white/85">{project?.location || '-'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Inicio</dt>
              <dd className="text-white/85">{formatDate(project?.startDate)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Fin previsto</dt>
              <dd className="text-white/85">{formatDate(project?.endDate)}</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-white/15 pt-3">
          <h2 className="text-sm font-semibold">Materiales de la obra</h2>
          <div className="mt-3 space-y-2">
            {materialRequests.length === 0 ? (
              <EmptyState title="No hay materiales asociados." />
            ) : (
              materialRequests.slice(0, 4).map((request) => (
                <div key={request._id || request.id} className="border-b border-white/10 px-1 py-2.5 last:border-b-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm text-white/85">{request.materialName}</p>
                    <StatusBadge tone={request.status === 'RECIBIDO' ? 'emerald' : 'amber'}>{request.status}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    {request.quantity} unidades · llega {formatDate(request.arrivalDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-white/15 pt-3">
          <h2 className="text-sm font-semibold">Inventario critico</h2>
          <div className="mt-3 space-y-2">
            {lowStockItems.length === 0 ? (
              <EmptyState title="No hay alertas de stock." />
            ) : (
              lowStockItems.slice(0, 4).map((item) => (
                <div key={item._id || item.id} className="border-b border-white/10 px-1 py-2.5 last:border-b-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm text-white/85">{item.name}</p>
                    <StatusBadge tone="rose">{item.availableQuantity}/{item.totalQuantity}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-white/50">{item.description || 'Sin descripcion'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectControlPanel;
