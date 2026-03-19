import { MATERIAL_REQUEST_STATUS_OPTIONS } from '../../constants/materialRequest';

function MaterialRequestFormModal({
  isOpen,
  mode,
  form,
  suppliers,
  projects,
  requesterName,
  error,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  const isEditMode = mode === 'edit';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-3">
      <div className="w-full max-w-2xl rounded-xl border border-white/15 bg-[#111722] p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm font-semibold">{mode === 'create' ? 'Nueva peticion' : 'Editar peticion'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-white/20 px-2 py-1 text-[11px] text-white/70 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-3 text-xs" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1">
              <span className="text-white/70">Material</span>
              <input
                value={form.materialName}
                onChange={(event) => onChange('materialName', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                required
              />
            </label>

            <label className="space-y-1">
              <span className="text-white/70">Cantidad</span>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(event) => onChange('quantity', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                required
              />
            </label>

            <label className="col-span-2 space-y-1">
              <span className="text-white/70">Solicitado por</span>
              <input
                value={requesterName || 'Usuario'}
                readOnly
                className="w-full rounded border border-white/10 bg-[#090d14] px-2 py-1.5 text-white/60"
              />
            </label>

            <label className="col-span-2 space-y-1">
              <span className="text-white/70">Descripcion</span>
              <textarea
                value={form.description}
                onChange={(event) => onChange('description', event.target.value)}
                rows={2}
                className="w-full resize-none rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
            </label>

            <label className="space-y-1">
              <span className="text-white/70">Fecha pedido</span>
              <input
                type="date"
                value={form.orderDate}
                onChange={(event) => onChange('orderDate', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              />
            </label>

            {isEditMode ? (
              <>
                <label className="space-y-1">
                  <span className="text-white/70">Estado</span>
                  <select
                    value={form.status}
                    onChange={(event) => onChange('status', event.target.value)}
                    className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                  >
                    {MATERIAL_REQUEST_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-white/70">Proveedor</span>
                  <select
                    value={form.supplierId}
                    onChange={(event) => onChange('supplierId', event.target.value)}
                    className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                  >
                    <option value="">Sin proveedor</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier._id || supplier.id} value={supplier._id || supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-white/70">Llega dia</span>
                  <input
                    type="date"
                    value={form.arrivalDate}
                    onChange={(event) => onChange('arrivalDate', event.target.value)}
                    className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                  />
                </label>
              </>
            ) : null}

            <label className="col-span-2 space-y-1">
              <span className="text-white/70">Proyecto (opcional)</span>
              <select
                value={form.projectId}
                onChange={(event) => onChange('projectId', event.target.value)}
                className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
              >
                <option value="">Sin proyecto</option>
                {projects.map((project) => (
                  <option key={project._id || project.id} value={project._id || project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="col-span-2 rounded border border-white/10 bg-[#0f1420] p-2">
              <p className="mb-2 text-[11px] uppercase tracking-wide text-white/55">Dimensiones opcionales</p>
              <div className="grid grid-cols-3 gap-2">
                <label className="space-y-1">
                  <span className="text-white/70">Largo</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.length}
                    onChange={(event) => onChange('length', event.target.value)}
                    className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-white/70">Ancho</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.width}
                    onChange={(event) => onChange('width', event.target.value)}
                    className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-white/70">Espesor</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.thickness}
                    onChange={(event) => onChange('thickness', event.target.value)}
                    className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-1.5 text-white outline-none focus:border-white/30"
                  />
                </label>
              </div>
            </div>
          </div>

          {error ? <p className="text-[11px] text-rose-200">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247]"
            >
              {mode === 'create' ? 'Crear' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MaterialRequestFormModal;
