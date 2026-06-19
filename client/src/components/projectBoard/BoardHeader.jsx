function BoardHeader({
  project,
  boardMessage,
  newListName,
  onOpenProjectSettings,
  onOpenSummary,
  onOpenJournal,
  onNewListNameChange,
  onAddList,
}) {
  return (
    <header className="mb-3 border-b border-white/10 pb-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{project?.name || 'Proyecto'}</h1>
          <p className="mt-1 text-xs text-white/60">
            {project?.description || 'Tablero de tareas de la obra'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenSummary}
            className="inline-flex items-center gap-2 rounded border border-white/15 px-2 py-1.5 text-[11px] text-white/80 hover:bg-white/10"
          >
            <i className="fa-solid fa-chart-simple" aria-hidden="true" />
            Resumen
          </button>
          <button
            type="button"
            onClick={onOpenJournal}
            className="inline-flex items-center gap-2 rounded border border-white/15 px-2 py-1.5 text-[11px] text-white/80 hover:bg-white/10"
          >
            <i className="fa-regular fa-clipboard" aria-hidden="true" />
            Bitacora
          </button>
          <button
            type="button"
            onClick={onOpenProjectSettings}
            className="inline-flex items-center gap-2 rounded border border-white/20 px-2 py-1.5 text-[11px] text-white/80 hover:bg-white/10"
          >
            <i className="fa-solid fa-gear" aria-hidden="true" />
            Configuracion
          </button>
        </div>
      </div>

      <form className="mt-3 flex max-w-sm gap-2" onSubmit={onAddList}>
        <input
          value={newListName}
          onChange={(event) => onNewListNameChange(event.target.value)}
          placeholder="Nueva columna"
          className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-xs text-white outline-none placeholder:text-white/35 focus:border-white/30"
        />
        <button
          type="submit"
          className="rounded border border-white/20 bg-[#1b2331] px-2 py-1.5 text-xs font-medium text-white transition hover:bg-[#253247]"
        >
          Agregar
        </button>
      </form>

      {boardMessage ? (
        <p className="mt-2 text-[11px] text-amber-200/90">{boardMessage}</p>
      ) : null}
    </header>
  );
}

export default BoardHeader;
