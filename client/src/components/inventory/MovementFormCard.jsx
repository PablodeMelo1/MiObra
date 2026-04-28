import { selectClassName } from './constants';

function MovementFormCard({
  movementUserId,
  selectedMovementUser,
  isUserDropdownOpen,
  userDropdownRef,
  userSearch,
  filteredUsers,
  movementMode,
  movementQty,
  canCheckout,
  movementError,
  onToggleDropdown,
  onUserSearch,
  onSelectUser,
  onMovementMode,
  onMovementQty,
  onSubmit,
}) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-[#111723] p-4">
      <h2 className="mb-3 text-base font-semibold">Registrar movimiento</h2>

      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
        <label className="text-sm text-white/80">
          Usuario
          <div ref={userDropdownRef} className="relative mt-1 w-72">
            <button
              type="button"
              onClick={onToggleDropdown}
              className={`${selectClassName} flex items-center justify-between text-left`}
            >
              <span className="truncate">
                {selectedMovementUser?.name || selectedMovementUser?.email || 'Seleccionar usuario'}
              </span>
              <i className={`fa-solid ${isUserDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs text-white/45`} aria-hidden="true" />
            </button>

            {isUserDropdownOpen ? (
              <div className="absolute z-30 mt-1 w-full rounded-lg border border-white/15 bg-[#0b111a] p-2 shadow-[0_16px_30px_rgba(0,0,0,0.4)]">
                <div className="mb-2 flex items-center gap-2 rounded-md border border-white/10 bg-black/25 px-2 py-1">
                  <i className="fa-solid fa-magnifying-glass text-xs text-white/40" aria-hidden="true" />
                  <input
                    value={userSearch}
                    onChange={(event) => onUserSearch(event.target.value)}
                    placeholder="Buscar usuario"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto pr-1">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((movementUser) => {
                      const currentId = movementUser._id || movementUser.id;
                      const isSelected = currentId === movementUserId;

                      return (
                        <button
                          key={currentId}
                          type="button"
                          onClick={() => onSelectUser(currentId)}
                          className={`mb-1 flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition ${isSelected ? 'bg-cyan-500/20 text-cyan-100' : 'text-white/80 hover:bg-white/8'}`}
                        >
                          <span className="truncate">{movementUser.name || movementUser.email}</span>
                          {isSelected ? <i className="fa-solid fa-check text-[11px]" aria-hidden="true" /> : null}
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-2 py-2 text-xs text-white/50">No hay usuarios que coincidan.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </label>

        <label className="text-sm text-white/80">
          Tipo
          <div className="relative mt-1 w-40">
            <select
              value={movementMode}
              onChange={(event) => onMovementMode(event.target.value)}
              className={selectClassName}
            >
              <option value="checkout">Checkout</option>
              <option value="checkin">Checkin</option>
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/45" aria-hidden="true" />
          </div>
        </label>

        <label className="text-sm text-white/80">
          Cantidad
          <input
            type="number"
            min="1"
            value={movementQty}
            onChange={(event) => onMovementQty(event.target.value)}
            className="mt-1 w-36 rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={movementMode === 'checkout' && !canCheckout}
          className="rounded-md border border-cyan-300/35 bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Guardar movimiento
        </button>
      </form>

      {movementError ? <p className="mt-2 text-xs text-rose-200">{movementError}</p> : null}
    </div>
  );
}

export default MovementFormCard;
