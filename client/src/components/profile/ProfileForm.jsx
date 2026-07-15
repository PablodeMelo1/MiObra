function ProfileForm({ form, saving, message, error, onChange, onSubmit }) {
  return (
    <form className="max-w-3xl space-y-4 border-t border-white/15 pt-4" onSubmit={onSubmit}>
      <h2 className="text-sm font-semibold text-white">Datos del usuario</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs text-white/70">Nombre</span>
          <input
            value={form.name}
            onChange={(event) => onChange('name', event.target.value)}
            className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm text-white outline-none focus:border-white/30"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs text-white/70">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            className="w-full rounded border border-white/15 bg-[#0d1119] px-2 py-2 text-sm text-white outline-none focus:border-white/30"
            required
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded border border-white/20 bg-[#1b2331] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#253247] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {message ? <p className="text-xs text-emerald-200">{message}</p> : null}
      {error ? <p className="text-xs text-rose-200">{error}</p> : null}
    </form>
  );
}

export default ProfileForm;
