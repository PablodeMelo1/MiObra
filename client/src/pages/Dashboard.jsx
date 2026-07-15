import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/routing/LoadingScreen';
import PageShell from '../components/common/PageShell';
import MetricTile from '../components/common/MetricTile';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import WorkloadList from '../components/dashboard/WorkloadList';
import { useAuth } from '../context/auth-context';
import {
  getLowStockItems,
  getOpenMaterialRequests,
  getOverdueTasks,
  getUpcomingMaterialArrivals,
  getUpcomingTasks,
  loadOperationsSnapshot,
} from '../services/operationsData';

function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [snapshot, setSnapshot] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setErrorMessage('');
        setSnapshot(await loadOperationsSnapshot());
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setErrorMessage('No se pudo cargar el dashboard operativo.');
      }
    };

    loadData();
  }, [isAuthenticated, isLoading, navigate]);

  const metrics = useMemo(() => {
    if (!snapshot) return null;
    const openRequests = getOpenMaterialRequests(snapshot.materialRequests);
    const overdueTasks = getOverdueTasks(snapshot.tasks);
    const lowStock = getLowStockItems(snapshot.items);
    const upcomingTasks = getUpcomingTasks(snapshot.tasks, 7);
    const deliveries = getUpcomingMaterialArrivals(snapshot.materialRequests, 14);

    return {
      openRequests,
      overdueTasks,
      lowStock,
      upcomingTasks,
      deliveries,
      completedTasks: snapshot.tasks.filter((task) => task.status === 'DONE').length,
    };
  }, [snapshot]);

  if (isLoading || !snapshot || !metrics) return <LoadingScreen message="Cargando dashboard..." />;

  return (
    <PageShell>
      <div className="space-y-3">
        <header className="border-b border-white/10 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Panel operativo</h1>
              <p className="mt-1 text-sm text-white/55">
                Estado general de obras, materiales, tareas e inventario.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/calendar')}
              className="inline-flex items-center justify-center gap-2 border border-cyan-300/30 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/10"
            >
              <i className="fa-regular fa-calendar-days" aria-hidden="true" />
              Ver calendario
            </button>
          </div>
        </header>

        {errorMessage ? <p className="text-xs text-rose-200">{errorMessage}</p> : null}

        <div className="grid gap-px overflow-hidden border-y border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile label="Obras activas" value={snapshot.projects.length} detail="Proyectos en seguimiento" tone="cyan" icon="fa-solid fa-building" />
          <MetricTile label="Tareas vencidas" value={metrics.overdueTasks.length} detail="Requieren accion" tone={metrics.overdueTasks.length ? 'rose' : 'emerald'} icon="fa-solid fa-triangle-exclamation" />
          <MetricTile label="Materiales abiertos" value={metrics.openRequests.length} detail="Pedidos sin recibir" tone="amber" icon="fa-solid fa-truck-ramp-box" />
          <MetricTile label="Stock critico" value={metrics.lowStock.length} detail="Items con baja disponibilidad" tone={metrics.lowStock.length ? 'rose' : 'emerald'} icon="fa-solid fa-boxes-stacked" />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <WorkloadList
            title="Tareas de la semana"
            items={metrics.upcomingTasks}
            emptyTitle="No hay tareas próximas."
            getTitle={(task) => task.title || 'Tarea'}
            getDate={(task) => task.dueDate}
            getMeta={(task) => task.projectName || 'Sin obra'}
            tone="amber"
          />
          <WorkloadList
            title="Entregas próximas"
            items={metrics.deliveries}
            emptyTitle="No hay entregas próximas."
            getTitle={(request) => request.materialName}
            getDate={(request) => request.arrivalDate}
            getMeta={(request) => request.supplierId?.name || request.projectId?.name || 'Sin proveedor'}
            tone="emerald"
          />
          <section className="border-t border-white/15 pt-3">
            <h2 className="text-sm font-semibold text-white">Inventario crítico</h2>
            <div className="mt-3 space-y-2">
              {metrics.lowStock.length === 0 ? (
                <EmptyState title="No hay alertas de stock." />
              ) : (
                metrics.lowStock.slice(0, 6).map((item) => (
                  <div key={item._id || item.id} className="border-b border-white/10 px-1 py-2.5 last:border-b-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate text-sm font-medium text-white/85">{item.name}</p>
                      <StatusBadge tone="rose">{item.availableQuantity}/{item.totalQuantity}</StatusBadge>
                    </div>
                    <p className="mt-1 text-xs text-white/50">{item.description || 'Sin descripcion'}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="border-t border-white/15 pt-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Obras recientes</h2>
            <StatusBadge tone="cyan">{snapshot.tasks.length} tareas</StatusBadge>
          </div>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {snapshot.projects.length === 0 ? (
              <EmptyState title="No hay obras cargadas." />
            ) : (
              snapshot.projects.slice(0, 6).map((project) => (
                <button
                  type="button"
                  key={project._id || project.id}
                  onClick={() => navigate(`/projects/${project._id || project.id}`)}
                  className="border-l-2 border-white/10 bg-white/[0.018] p-3 text-left hover:border-cyan-300/50 hover:bg-white/[0.035]"
                >
                  <p className="truncate text-sm font-semibold text-white/90">{project.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-white/50">{project.description || project.location || 'Sin descripcion'}</p>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default Dashboard;
