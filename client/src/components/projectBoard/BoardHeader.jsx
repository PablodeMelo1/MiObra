function BoardHeader({
  project,
  boardMessage,
  newListName,
  onOpenProjectSettings,
  onNewListNameChange,
  onAddList,
}) {
  return (
    <header className="mb-3 border-b border-white/10 pb-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">{project?.name || 'Proyecto'}</h1>
        <button
          type="button"
          onClick={onOpenProjectSettings}
          className="rounded border border-white/20 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10"
        >
          Configuracion
        </button>
      </div>

      <p className="mt-1 text-xs text-white/60">
        {project?.description || 'Tablero de tareas estilo Trello'}
      </p>

      <form className="mt-2 flex max-w-sm gap-2" onSubmit={onAddList}>
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
