import { getTaskStatusLabel, toInputDate } from './boardUtils';

function TaskCard({ task, onDragStart, onEdit, onDelete, assignedLabel }) {
  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, task)}
      className="border-l-2 border-white/10 bg-[#151b25] p-2 transition-colors hover:border-cyan-300/45 hover:bg-[#18212d]"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-white">{task.title}</h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/70 hover:text-white"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded border border-rose-300/25 px-1.5 py-0.5 text-[10px] text-rose-100/80 hover:text-rose-100"
          >
            Borrar
          </button>
        </div>
      </div>

      <p className="mt-1 text-[11px] leading-relaxed text-white/70">
        {task.description || 'Sin descripcion'}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-white/55">
        <span className="rounded border border-white/10 px-1.5 py-0.5">
          {getTaskStatusLabel(task.status)}
        </span>
        <span className="rounded border border-white/10 px-1.5 py-0.5">{task.priority || 'MEDIUM'}</span>
        <span className="sm:col-span-2 truncate rounded border border-white/10 px-1.5 py-0.5">
          {assignedLabel ? `Asignado: ${assignedLabel}` : 'Sin asignar'}
        </span>
        <span className="sm:col-span-2 rounded border border-white/10 px-1.5 py-0.5">
          {task.dueDate ? `Vence: ${toInputDate(task.dueDate)}` : 'Sin fecha limite'}
        </span>
      </div>
    </article>
  );
}

export default TaskCard;
