function MaterialRequestHeader({ onOpenCreate }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-lg font-semibold">Peticiones de materiales</h1>
        <p className="text-xs text-white/60">Solicitudes de materiales y estado de compra/recepcion</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">

        <button
          type="button"
          onClick={onOpenCreate}
          className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
        >
          Nueva peticion
        </button>
      </div>
    </div>
  );
}

export default MaterialRequestHeader;
