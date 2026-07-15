import { useCallback, useEffect, useState } from 'react';
import PageShell from '../components/common/PageShell';
import LoadingScreen from '../components/routing/LoadingScreen';
import CompanyProfileForm from '../components/company/CompanyProfileForm';
import CompanyMembersPanel from '../components/company/CompanyMembersPanel';
import CompanyInvitationsPanel from '../components/company/CompanyInvitationsPanel';
import CompanySwitcher from '../components/company/CompanySwitcher';
import {
  createCompanyInvitation,
  deactivateCompanyMember,
  getCompanyInvitations,
  getCompanyMembers,
  revokeCompanyInvitation,
  updateCompanyMemberRole,
  updateCurrentCompany,
} from '../api/companies';
import { useAuth } from '../context/auth-context';
import { getApiErrorMessage } from '../utils/apiError';

function Settings() {
  const { user, companies, activeCompany, companyRole, refreshSession, switchCompany } = useAuth();
  const canManage = ['owner', 'admin'].includes(companyRole);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);
  const [switchingCompany, setSwitchingCompany] = useState(false);
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [busyMemberId, setBusyMemberId] = useState('');
  const [busyInvitationId, setBusyInvitationId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAccessData = useCallback(async () => {
    if (!activeCompany?._id) return;
    try {
      setLoading(true);
      setError('');
      const [membersResponse, invitationsResponse] = await Promise.all([
        getCompanyMembers(),
        canManage ? getCompanyInvitations() : Promise.resolve({ data: { invitations: [] } }),
      ]);
      setMembers(membersResponse.data?.members || []);
      setInvitations(invitationsResponse.data?.invitations || []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'No se pudo cargar la configuracion de la empresa.'));
    } finally {
      setLoading(false);
    }
  }, [activeCompany?._id, canManage]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadAccessData, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadAccessData]);

  const beginAction = () => {
    setMessage('');
    setError('');
  };

  const handleSaveCompany = async (payload) => {
    try {
      beginAction();
      setSavingCompany(true);
      await updateCurrentCompany(payload);
      await refreshSession();
      setMessage('Datos de la empresa actualizados.');
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, 'No se pudo actualizar la empresa.'));
    } finally {
      setSavingCompany(false);
    }
  };

  const handleSwitchCompany = async (companyId) => {
    try {
      beginAction();
      setSwitchingCompany(true);
      await switchCompany(companyId);
      setMessage('Empresa activa actualizada.');
    } catch (switchError) {
      setError(getApiErrorMessage(switchError, 'No se pudo cambiar la empresa activa.'));
    } finally {
      setSwitchingCompany(false);
    }
  };

  const handleRoleChange = async (member, role) => {
    const memberId = member._id || member.id;
    try {
      beginAction();
      setBusyMemberId(memberId);
      const response = await updateCompanyMemberRole(memberId, role);
      setMembers((current) => current.map((item) => (
        String(item._id || item.id) === String(memberId) ? response.data.member : item
      )));
      setMessage('Rol del miembro actualizado.');
      if (String(member.userId?._id || member.userId) === String(user?._id || user?.id)) await refreshSession();
    } catch (roleError) {
      setError(getApiErrorMessage(roleError, 'No se pudo actualizar el rol.'));
      await loadAccessData();
    } finally {
      setBusyMemberId('');
    }
  };

  const handleDeactivate = async (member) => {
    if (!window.confirm(`¿Desactivar el acceso de ${member.userId?.name || member.userId?.email || 'este miembro'}?`)) return;
    const memberId = member._id || member.id;
    try {
      beginAction();
      setBusyMemberId(memberId);
      await deactivateCompanyMember(memberId);
      setMembers((current) => current.filter((item) => String(item._id || item.id) !== String(memberId)));
      setMessage('Miembro desactivado.');
    } catch (deactivateError) {
      setError(getApiErrorMessage(deactivateError, 'No se pudo desactivar el miembro.'));
    } finally {
      setBusyMemberId('');
    }
  };

  const handleInvite = async (payload) => {
    try {
      beginAction();
      setSendingInvitation(true);
      const response = await createCompanyInvitation(payload);
      setInvitations((current) => [response.data.invitation, ...current]);
      setMessage(response.data.acceptUrl ? `Invitacion enviada. Link local: ${response.data.acceptUrl}` : 'Invitacion enviada por email.');
      return true;
    } catch (inviteError) {
      setError(getApiErrorMessage(inviteError, 'No se pudo enviar la invitacion.'));
      await loadAccessData();
      return false;
    } finally {
      setSendingInvitation(false);
    }
  };

  const handleRevoke = async (invitation) => {
    const invitationId = invitation._id || invitation.id;
    try {
      beginAction();
      setBusyInvitationId(invitationId);
      const response = await revokeCompanyInvitation(invitationId);
      setInvitations((current) => current.map((item) => (
        String(item._id || item.id) === String(invitationId) ? response.data.invitation : item
      )));
      setMessage('Invitacion revocada.');
    } catch (revokeError) {
      setError(getApiErrorMessage(revokeError, 'No se pudo revocar la invitacion.'));
    } finally {
      setBusyInvitationId('');
    }
  };

  if (loading) return <LoadingScreen message="Cargando configuracion..." />;

  return (
    <PageShell>
      <div className="space-y-4">
        <header className="rounded-xl border border-white/10 bg-[#111723] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold">Gestion de empresa</h1>
              <p className="mt-1 text-sm text-white/55">Configura la empresa activa, sus miembros e invitaciones.</p>
            </div>
            <span className="inline-flex w-fit rounded border border-cyan-300/25 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100">Rol: {companyRole || 'sin rol'}</span>
          </div>
        </header>

        {(message || error) ? (
          <div role="status" className={`rounded-lg border px-3 py-2 text-sm ${error ? 'border-rose-300/25 bg-rose-500/10 text-rose-100' : 'border-cyan-300/25 bg-cyan-500/10 text-cyan-50'}`}>
            {error || message}
          </div>
        ) : null}

        <CompanySwitcher key={activeCompany?._id || 'company-switcher'} companies={companies || []} activeCompanyId={activeCompany?._id || ''} switching={switchingCompany} onSwitch={handleSwitchCompany} />
        <CompanyProfileForm key={activeCompany?._id || 'company'} company={activeCompany} canManage={canManage} saving={savingCompany} onSave={handleSaveCompany} />
        <CompanyMembersPanel members={members} currentUserId={user?._id || user?.id} currentRole={companyRole} canManage={canManage} busyId={busyMemberId} onRoleChange={handleRoleChange} onDeactivate={handleDeactivate} />
        <CompanyInvitationsPanel invitations={invitations} canManage={canManage} sending={sendingInvitation} busyId={busyInvitationId} onInvite={handleInvite} onRevoke={handleRevoke} />
      </div>
    </PageShell>
  );
}

export default Settings;
