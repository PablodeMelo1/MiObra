function ItemDetailsHeader({ onEdit, onBack }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-xl font-semibold">Detalle de item</h1>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-amber-300/35 bg-amber-500/20 px-3 py-2 text-sm text-amber-100 hover:bg-amber-500/30"
        >
          Editar item
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>
    </div>
  );
}

export default ItemDetailsHeader;
