import { useState } from 'react';

const roleOptions = [
  ['admin', 'Administrador'],
  ['manager', 'Gerente'],
  ['supervisor', 'Supervisor'],
  ['operator', 'Operador'],
  ['viewer', 'Solo lectura'],
];

const statusLabels = {
  pending: 'Pendiente de envio',
  sent: 'Enviada',
  accepted: 'Aceptada',
  declined: 'Rechazada',
  expired: 'Expirada',
  revoked: 'Revocada',
};

function CompanyInvitationsPanel({ invitations, canManage, sending, busyId, onInvite, onRevoke }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('operator');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sent = await onInvite({ email: email.trim(), role });
    if (sent) setEmail('');
  };

  if (!canManage) return null;

  return (
    <section className="border-t border-white/15 pt-4">
      <div>
        <h2 className="text-sm font-semibold">Invitaciones</h2>
        <p className="mt-1 text-xs text-white/50">Invita usuarios que ya tengan una cuenta. El acceso de propietario no se otorga por invitacion.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-end">
        <label className="space-y-1">
          <span className="text-xs text-white/70">Email</span>
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Rol</span>
          <select value={role} onChange={(event) => setRole(event.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0d1119] px-3 py-2 text-sm outline-none focus:border-cyan-300/60">
            {roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button disabled={sending} type="submit" className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#071017] hover:bg-cyan-200 disabled:opacity-50">{sending ? 'Enviando...' : 'Enviar invitacion'}</button>
      </form>

      <div className="mt-5 space-y-2">
        {invitations.map((invitation) => {
          const invitationId = invitation._id || invitation.id;
          const canRevoke = ['pending', 'sent'].includes(invitation.status);
          return (
            <div key={invitationId} className="flex flex-col gap-2 border-b border-white/10 px-1 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{invitation.email}</p>
                <p className="mt-1 text-xs text-white/50">{roleOptions.find(([value]) => value === invitation.role)?.[1] || invitation.role} · {statusLabels[invitation.status] || invitation.status}</p>
              </div>
              {canRevoke ? <button type="button" disabled={busyId === invitationId} onClick={() => onRevoke(invitation)} className="w-fit rounded-lg border border-rose-300/25 px-2.5 py-1.5 text-xs text-rose-100 hover:bg-rose-500/10 disabled:opacity-50">Revocar</button> : null}
            </div>
          );
        })}
        {invitations.length === 0 ? <p className="border-l-2 border-white/15 bg-white/[0.025] p-4 text-sm text-white/45">No hay invitaciones registradas.</p> : null}
      </div>
    </section>
  );
}

export default CompanyInvitationsPanel;
