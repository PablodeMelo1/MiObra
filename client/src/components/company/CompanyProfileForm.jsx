import { useState } from 'react';

const emptyCompany = {
  name: '',
  legalName: '',
  taxId: '',
  timezone: 'America/Montevideo',
  currency: 'UYU',
  logoUrl: '',
};

function CompanyProfileForm({ company, canManage, saving, onSave }) {
  const [form, setForm] = useState(() => ({
    ...emptyCompany,
    name: company?.name || '',
    legalName: company?.legalName || '',
    taxId: company?.taxId || '',
    timezone: company?.timezone || emptyCompany.timezone,
    currency: company?.currency || emptyCompany.currency,
    logoUrl: company?.logoUrl || '',
  }));

  const updateField = (field) => (event) => setForm((current) => ({
    ...current,
    [field]: event.target.value,
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      name: form.name.trim(),
      legalName: form.legalName.trim(),
      taxId: form.taxId.trim(),
      timezone: form.timezone.trim(),
      currency: form.currency.trim().toUpperCase(),
      logoUrl: form.logoUrl.trim(),
    });
  };

  return (
    <section className="border-t border-white/15 pt-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">Datos de la empresa</h2>
        <p className="mt-1 text-xs text-white/50">Identidad y preferencias de la empresa activa.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs text-white/70">Nombre comercial *</span>
          <input required disabled={!canManage} value={form.name} onChange={updateField('name')} className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 disabled:text-white/45" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Razon social</span>
          <input disabled={!canManage} value={form.legalName} onChange={updateField('legalName')} className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 disabled:text-white/45" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">RUT / identificacion fiscal</span>
          <input disabled={!canManage} value={form.taxId} onChange={updateField('taxId')} className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 disabled:text-white/45" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Logo (URL)</span>
          <input type="url" disabled={!canManage} value={form.logoUrl} onChange={updateField('logoUrl')} placeholder="https://..." className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 disabled:text-white/45" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Zona horaria</span>
          <input disabled={!canManage} value={form.timezone} onChange={updateField('timezone')} className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 disabled:text-white/45" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Moneda</span>
          <input required maxLength={3} disabled={!canManage} value={form.currency} onChange={updateField('currency')} className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm uppercase outline-none focus:border-cyan-300/60 disabled:text-white/45" />
        </label>
        {canManage ? (
          <div className="flex justify-end sm:col-span-2">
            <button disabled={saving} type="submit" className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#071017] hover:bg-cyan-200 disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar empresa'}
            </button>
          </div>
        ) : null}
      </form>
    </section>
  );
}

export default CompanyProfileForm;
