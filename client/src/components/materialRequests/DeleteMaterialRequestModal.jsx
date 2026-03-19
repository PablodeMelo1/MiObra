function DeleteMaterialRequestModal({ isOpen, materialName, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-3">
      <div className="w-full max-w-md rounded-xl border border-white/15 bg-[#111722] p-4 text-white shadow-2xl">
        <h3 className="text-sm font-semibold">Eliminar peticion</h3>
        <p className="mt-2 text-xs text-white/70">
          Seguro que queres eliminar la peticion de <strong>{materialName}</strong>?
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded border border-rose-300/30 bg-rose-500/20 px-3 py-1.5 text-xs text-rose-100 hover:bg-rose-500/30"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMaterialRequestModal;
