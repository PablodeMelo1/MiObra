const roleLabels = {
  owner: 'Propietario',
  admin: 'Administrador',
  manager: 'Gerente',
  supervisor: 'Supervisor',
  operator: 'Operador',
  viewer: 'Solo lectura',
};

const roles = Object.keys(roleLabels);

function CompanyMembersPanel({ members, currentUserId, currentRole, canManage, busyId, onRoleChange, onDeactivate }) {
  const canManageMember = (member) => canManage && !(currentRole === 'admin' && member.role === 'owner');

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111723]">
      <div className="p-4">
        <h2 className="text-sm font-semibold">Miembros</h2>
        <p className="mt-1 text-xs text-white/50">Cuentas con acceso a la empresa activa.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-4 py-2">Miembro</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((member) => {
              const memberId = member._id || member.id;
              const userId = member.userId?._id || member.userId?.id || member.userId;
              const isSelf = String(userId) === String(currentUserId);
              const manageable = canManageMember(member);
              return (
                <tr key={memberId}>
                  <td className="px-4 py-3 font-medium">{member.userId?.name || 'Usuario'}{isSelf ? ' (tu)' : ''}</td>
                  <td className="px-4 py-3 text-white/60">{member.userId?.email || '-'}</td>
                  <td className="px-4 py-3">
                    {manageable ? (
                      <select aria-label={`Rol de ${member.userId?.name || 'miembro'}`} value={member.role} disabled={busyId === memberId} onChange={(event) => onRoleChange(member, event.target.value)} className="rounded-lg border border-white/15 bg-[#0d1119] px-2 py-1.5 text-sm outline-none focus:border-cyan-300/60">
                        {roles.map((role) => (
                          <option key={role} value={role} disabled={role === 'owner' && currentRole !== 'owner'}>{roleLabels[role]}</option>
                        ))}
                      </select>
                    ) : <span className="text-white/70">{roleLabels[member.role] || member.role}</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {manageable && !isSelf ? (
                      <button type="button" disabled={busyId === memberId} onClick={() => onDeactivate(member)} className="rounded-lg border border-rose-300/25 px-2.5 py-1.5 text-xs text-rose-100 hover:bg-rose-500/10 disabled:opacity-50">Desactivar</button>
                    ) : <span className="text-xs text-white/35">Sin acciones</span>}
                  </td>
                </tr>
              );
            })}
            {members.length === 0 ? <tr><td colSpan="4" className="px-4 py-8 text-center text-white/45">No hay miembros activos.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CompanyMembersPanel;
