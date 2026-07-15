function formatDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function PendingList({ pendings, onToggleDone, onEdit, onDelete }) {
  if (pendings.length === 0) {
    return (
      <p className="border-l-2 border-white/15 bg-white/[0.025] p-4 text-sm text-white/65">
        No hay pendientes para mostrar.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {pendings.map((pending) => {
        const id = pending._id || pending.id;
        const done = Boolean(pending.isDone);

        return (
          <article
            key={id}
            className={`border-l-2 px-3 py-3 transition-colors ${
              done
                ? 'border-emerald-300/45 bg-emerald-500/[0.06]'
                : 'border-white/15 bg-[#101722] hover:border-cyan-300/45'
            }`}
          >
            <div className="flex flex-wrap items-start gap-3">
              <label className="mt-0.5 inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={(event) => onToggleDone(pending, event.target.checked)}
                  className="h-4 w-4 rounded border-white/25 bg-[#0d1119] accent-emerald-400"
                />
              </label>

              <div className="min-w-0 flex-1">
                <h3 className={`truncate text-sm font-semibold ${done ? 'text-emerald-100/90 line-through' : 'text-white'}`}>
                  {pending.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/70">{pending.description || 'Sin descripcion'}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded border border-white/15 px-2 py-0.5 text-white/70">
                    Vence: {formatDate(pending.dueDate)}
                  </span>
                  <span className="rounded border border-white/15 px-2 py-0.5 text-white/70">
                    Assigned: {pending.assignedTo?.name || pending.assignedTo?.email || 'Sin asignar'}
                  </span>
                  <span className="rounded border border-white/15 px-2 py-0.5 text-white/70">
                    Colab: {(pending.collaborators || []).length}
                  </span>
                  <span className={`rounded px-2 py-0.5 ${done ? 'bg-emerald-400/20 text-emerald-100' : 'bg-cyan-400/20 text-cyan-100'}`}>
                    {done ? 'Completado' : 'Activo'}
                  </span>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => onEdit(pending)}
                  className="flex-1 rounded border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/10 sm:flex-none"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(pending)}
                  className="flex-1 rounded border border-rose-300/35 px-2 py-1 text-xs text-rose-100/90 hover:bg-rose-500/20 sm:flex-none"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default PendingList;
