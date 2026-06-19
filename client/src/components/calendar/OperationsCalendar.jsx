import { useMemo, useState } from 'react';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { formatDate, toInputDate } from '../../utils/dates';

const FILTERS = [
  { value: 'ALL', label: 'Todo' },
  { value: 'project', label: 'Obras' },
  { value: 'task', label: 'Tareas' },
  { value: 'material', label: 'Pedidos' },
  { value: 'delivery', label: 'Entregas' },
];

const TONE_BY_TYPE = {
  project: 'cyan',
  task: 'amber',
  material: 'neutral',
  delivery: 'emerald',
};

const LABEL_BY_TYPE = {
  project: 'Obra',
  task: 'Tarea',
  material: 'Pedido',
  delivery: 'Entrega',
};

function OperationsCalendar({ events, projects }) {
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const byType = typeFilter === 'ALL' || event.type === typeFilter;
        const byProject = projectFilter === 'ALL' || String(event.projectId || '') === projectFilter;
        return byType && byProject;
      }),
    [events, projectFilter, typeFilter],
  );

  const eventsByDay = useMemo(() => {
    const groups = new Map();
    filteredEvents.forEach((event) => {
      const key = toInputDate(event.date);
      if (!key) return;
      groups.set(key, [...(groups.get(key) || []), event]);
    });
    return [...groups.entries()].slice(0, 30);
  }, [filteredEvents]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-[#111723] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Calendario operativo</h1>
          <p className="mt-1 text-xs text-white/55">Vencimientos, pedidos, entregas e hitos de obra.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-xs text-white outline-none"
          >
            {FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className="rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-xs text-white outline-none"
          >
            <option value="ALL">Todas las obras</option>
            {projects.map((project) => (
              <option key={project._id || project.id} value={project._id || project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {eventsByDay.length === 0 ? (
        <EmptyState title="No hay eventos para los filtros seleccionados." />
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {eventsByDay.map(([date, dayEvents]) => (
            <section key={date} className="rounded-lg border border-white/10 bg-[#111723] p-3">
              <h2 className="text-sm font-semibold text-white">{formatDate(date)}</h2>
              <div className="mt-3 space-y-2">
                {dayEvents.map((event) => (
                  <div key={event.id} className="rounded border border-white/10 bg-[#0d1119] p-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate text-sm font-medium text-white/85">{event.title}</p>
                      <StatusBadge tone={TONE_BY_TYPE[event.type]}>{LABEL_BY_TYPE[event.type]}</StatusBadge>
                    </div>
                    <p className="mt-1 text-xs text-white/50">{event.subtitle}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default OperationsCalendar;
