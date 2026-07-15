import { useState } from 'react';

function CompanySwitcher({ companies, activeCompanyId, switching, onSwitch }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState(activeCompanyId || '');
  const hasMultipleCompanies = companies.length > 1;

  return (
    <section className="rounded-xl border border-white/10 bg-[#111723] p-4">
      <div>
        <h2 className="text-sm font-semibold">Empresa activa</h2>
        <p className="mt-1 text-xs text-white/50">Selecciona el espacio que deseas administrar.</p>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <select aria-label="Empresa activa" disabled={!hasMultipleCompanies || switching} value={selectedCompanyId} onChange={(event) => setSelectedCompanyId(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60 disabled:text-white/45">
          {companies.map((membership) => (
            <option key={membership.companyId} value={membership.companyId}>
              {membership.company?.name || 'Empresa'}
            </option>
          ))}
        </select>
        <button type="button" disabled={!hasMultipleCompanies || switching || selectedCompanyId === activeCompanyId} onClick={() => onSwitch(selectedCompanyId)} className="rounded-lg border border-cyan-200/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/35">
          {switching ? 'Cambiando...' : 'Cambiar empresa'}
        </button>
      </div>
    </section>
  );
}

export default CompanySwitcher;
