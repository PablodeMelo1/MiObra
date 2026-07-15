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
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Tablero de obra</p>
          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight">{project?.name || 'Proyecto'}</h1>
          <p className="mt-1 text-xs text-white/60">
            {project?.description || 'Tablero de tareas de la obra'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenSummary}
            className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
          >
            <i className="fa-solid fa-chart-simple" aria-hidden="true" />
            Resumen
          </button>
          <button
            type="button"
            onClick={onOpenJournal}
            className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
          >
            <i className="fa-regular fa-clipboard" aria-hidden="true" />
            Bitacora
          </button>
          <button
            type="button"
            onClick={onOpenProjectSettings}
            className="inline-flex min-h-9 items-center gap-2 border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
          >
            <i className="fa-solid fa-gear" aria-hidden="true" />
            Configuracion
          </button>
        </div>
      </div>

      <form className="mt-3 flex w-full gap-2 sm:max-w-sm" onSubmit={onAddList}>
        <input
          value={newListName}
          onChange={(event) => onNewListNameChange(event.target.value)}
          placeholder="Nueva columna"
          aria-label="Nombre de la nueva columna"
          className="min-h-10 w-full border border-white/15 bg-[#0d1119] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60"
        />
        <button
          type="submit"
          className="min-h-10 border border-cyan-300/30 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-500/10"
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
