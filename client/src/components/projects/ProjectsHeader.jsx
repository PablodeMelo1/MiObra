function ProjectsHeader({ onOpenCreate }) {
  return (
    <header className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Operacion</p><h1 className="mt-1 text-xl font-semibold tracking-tight">Proyectos</h1></div>
      <button
        type="button"
        onClick={onOpenCreate}
        className="w-full border border-cyan-300/30 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-500/10 sm:w-auto"
      >
        Nuevo proyecto
      </button>
    </header>
  );
}

export default ProjectsHeader;
