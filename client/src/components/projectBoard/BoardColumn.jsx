import TaskCard from './TaskCard';

function BoardColumn({
  listName,
  columnTasks,
  draggingListName,
  draggingTaskId,
  onColumnDrop,
  onColumnDragStart,
  onRenameColumn,
  onCreateTask,
  onDeleteColumn,
  onTaskDragStart,
  onEditTask,
  onDeleteTask,
  getAssignedLabel,
}) {
  const taskCount = columnTasks.length;
  const canDeleteColumn = taskCount === 0;

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onColumnDrop(event, listName)}
      className={`min-h-[70vh] w-64 min-w-64 rounded-lg border bg-[#141a24] p-2 ${
        draggingListName === listName ? 'border-sky-300/40' : 'border-white/10'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-1">
        <h2 className="truncate text-xs font-semibold tracking-wide text-white/90">{listName}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            draggable
            onDragStart={(event) => onColumnDragStart(event, listName)}
            className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/70 hover:text-white"
            title="Arrastrar columna"
          >
            ::
          </button>
          <button
            type="button"
            onClick={() => onRenameColumn(listName)}
            className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/70 hover:text-white"
            title="Renombrar columna"
          >
            Edit
          </button>
          <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-[10px] text-white/60">
            {taskCount}
          </span>
          <button
            type="button"
            onClick={() => onCreateTask(listName)}
            className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/70 hover:text-white"
          >
            +
          </button>
          <button
            type="button"
            disabled={!canDeleteColumn}
            onClick={() => onDeleteColumn(listName)}
            className={`rounded border px-1.5 py-0.5 text-[10px] ${
              canDeleteColumn
                ? 'border-rose-300/30 text-rose-100/80 hover:text-rose-100'
                : 'cursor-not-allowed border-white/10 text-white/30'
            }`}
            title={canDeleteColumn ? 'Borrar columna' : 'No se puede borrar: tiene tareas'}
          >
            x
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {columnTasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onDragStart={onTaskDragStart}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            assignedLabel={task.assignedTo ? getAssignedLabel(task.assignedTo?._id || task.assignedTo) : ''}
          />
        ))}

        {draggingTaskId && taskCount === 0 ? (
          <div className="rounded-md border border-dashed border-white/20 p-2 text-center text-[10px] text-white/40">
            Solta la tarea aca
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BoardColumn;
