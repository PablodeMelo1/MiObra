function ProjectsHeader({ onOpenCreate }) {
  return (
    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-lg font-semibold">Proyectos</h1>
      <button
        type="button"
        onClick={onOpenCreate}
        className="w-full rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247] sm:w-auto"
      >
        Nuevo proyecto
      </button>
    </div>
  );
}

export default ProjectsHeader;
