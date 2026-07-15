import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  declineCompanyInvitationRequest,
  previewCompanyInvitationRequest,
} from '../api/auth';
import { useAuth } from '../context/auth-context';
import { getApiErrorMessage } from '../utils/apiError';

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gerente',
  supervisor: 'Supervisor',
  operator: 'Operador',
  viewer: 'Solo lectura',
};

function CompanyInvitationPage() {
  const { acceptCompanyInvitation, signOut, user } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const location = useLocation();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [status, setStatus] = useState(token ? 'loading' : 'invalid');
  const [message, setMessage] = useState(token ? '' : 'El link no incluye un token de invitacion.');

  useEffect(() => {
    if (!token) return undefined;
    let isMounted = true;

    previewCompanyInvitationRequest(token)
      .then((response) => {
        if (!isMounted) return;
        setInvitation(response.data?.invitation || null);
        setStatus('ready');
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus(error?.response?.data?.code === 'INVITATION_EMAIL_MISMATCH' ? 'mismatch' : 'error');
        setMessage(getApiErrorMessage(error, 'No se pudo consultar la invitacion.'));
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAccept = async () => {
    try {
      setStatus('accepting');
      setMessage('');
      await acceptCompanyInvitation(token);
      setStatus('accepted');
      setMessage('Te uniste a la empresa y ahora esta activa en tu sesion.');
    } catch (error) {
      setStatus(error?.response?.data?.code === 'INVITATION_EMAIL_MISMATCH' ? 'mismatch' : 'error');
      setMessage(getApiErrorMessage(error, 'No se pudo aceptar la invitacion.'));
    }
  };

  const handleDecline = async () => {
    try {
      setStatus('declining');
      setMessage('');
      await declineCompanyInvitationRequest(token);
      setStatus('declined');
      setMessage('Rechazaste la invitacion. No se modificaron tus empresas.');
    } catch (error) {
      setStatus(error?.response?.data?.code === 'INVITATION_EMAIL_MISMATCH' ? 'mismatch' : 'error');
      setMessage(getApiErrorMessage(error, 'No se pudo rechazar la invitacion.'));
    }
  };

  const handleChangeAccount = async () => {
    try {
      await signOut();
    } finally {
      navigate('/login', { replace: true, state: { from: location } });
    }
  };

  const isWorking = ['loading', 'accepting', 'declining'].includes(status);

  return (
    <main className="grid min-h-screen place-items-center bg-[#090d13] px-4 py-8 text-white">
      <section className="w-full max-w-lg border-y border-white/15 bg-[#0d131c] px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200">MIOBRA</p>
        <h1 className="mt-2 text-2xl font-semibold">Invitacion a empresa</h1>

        {status === 'loading' ? <p className="mt-5 text-sm text-white/60">Consultando invitacion...</p> : null}

        {invitation && ['ready', 'accepting', 'declining'].includes(status) ? (
          <div className="mt-5 space-y-4">
            <div className="border-l-2 border-cyan-300/45 bg-white/[0.025] px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-white/45">Empresa</p>
              <p className="mt-1 text-lg font-semibold">{invitation.company?.name || 'Empresa'}</p>
              <p className="mt-2 text-sm text-white/60">Rol: {roleLabels[invitation.role] || invitation.role}</p>
              <p className="mt-1 text-sm text-white/60">Cuenta invitada: {invitation.email}</p>
            </div>
            <p className="text-sm text-white/65">Confirma si deseas incorporar esta empresa a tu cuenta. La invitacion no se acepta automaticamente.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" disabled={isWorking} onClick={handleDecline} className="rounded-lg border border-rose-300/25 px-4 py-2.5 text-sm font-semibold text-rose-100 hover:bg-rose-500/10 disabled:opacity-50">{status === 'declining' ? 'Rechazando...' : 'Rechazar'}</button>
              <button type="button" disabled={isWorking} onClick={handleAccept} className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-[#071017] hover:bg-cyan-200 disabled:opacity-50">{status === 'accepting' ? 'Aceptando...' : 'Aceptar invitacion'}</button>
            </div>
          </div>
        ) : null}

        {status === 'mismatch' ? (
          <div className="mt-5 border-l-2 border-amber-300/45 bg-amber-500/10 p-4 text-sm text-amber-50">
            <p className="font-medium">La invitacion no corresponde a {user?.email || 'esta cuenta'}.</p>
            <p className="mt-1 text-amber-50/70">Cierra esta sesion e ingresa con el email que recibio la invitacion.</p>
            <button type="button" onClick={handleChangeAccount} className="mt-4 rounded-lg border border-amber-200/30 px-4 py-2 font-semibold hover:bg-amber-200/10">Cambiar de cuenta</button>
          </div>
        ) : null}

        {['invalid', 'error', 'accepted', 'declined'].includes(status) ? (
          <div className={`mt-5 rounded-lg border px-4 py-3 text-sm ${status === 'error' || status === 'invalid' ? 'border-rose-300/25 bg-rose-500/10 text-rose-100' : 'border-cyan-300/25 bg-cyan-500/10 text-cyan-50'}`}>
            {message}
          </div>
        ) : null}

        {['accepted', 'declined', 'error', 'invalid'].includes(status) ? <Link to="/dashboard" className="mt-4 inline-flex w-full justify-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10">Ir al panel</Link> : null}
      </section>
    </main>
  );
}

export default CompanyInvitationPage;
