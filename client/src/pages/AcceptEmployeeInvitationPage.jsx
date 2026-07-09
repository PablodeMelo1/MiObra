import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { getApiErrorMessage } from '../utils/apiError';

function AcceptEmployeeInvitationPage() {
  const { acceptEmployeeInvitation, isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const accept = async () => {
      if (isLoading || !isAuthenticated || !token) return;
      try {
        setStatus('loading');
        const response = await acceptEmployeeInvitation(token);
        if (!isMounted) return;
        setStatus('success');
        setMessage(response.data?.message || 'Cuenta vinculada correctamente.');
      } catch (error) {
        if (!isMounted) return;
        setStatus('error');
        setMessage(getApiErrorMessage(error, 'No se pudo aceptar la invitacion.'));
      }
    };

    accept();
    return () => {
      isMounted = false;
    };
  }, [acceptEmployeeInvitation, isAuthenticated, isLoading, token]);

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0c0f14] px-4 text-white">
        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111723] p-6 text-center">
          <h1 className="text-xl font-semibold">Invitacion invalida</h1>
          <p className="mt-2 text-sm text-white/60">El link no incluye un token de vinculacion.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#0c0f14] px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111723] p-6 text-center">
        <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200">MIOBRA</p>
        <h1 className="mt-2 text-2xl font-semibold">Vincular empleado</h1>
        {!isAuthenticated && !isLoading ? (
          <div className="mt-5 space-y-3">
            <p className="text-sm text-white/65">Inicia sesion o crea una cuenta con este link para vincularte a la ficha de empleado.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link to="/login" className="rounded border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10">Iniciar sesion</Link>
              <Link to={`/register?employeeInvitationToken=${encodeURIComponent(token)}`} className="rounded bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#071017] hover:bg-cyan-200">Crear cuenta</Link>
            </div>
          </div>
        ) : (
          <div className={`mt-5 rounded-lg border px-3 py-3 text-sm ${status === 'error' ? 'border-rose-300/25 bg-rose-500/10 text-rose-100' : 'border-cyan-300/25 bg-cyan-500/10 text-cyan-50'}`}>
            {status === 'loading' || isLoading ? 'Aceptando invitacion...' : message || 'Preparando vinculacion...'}
          </div>
        )}
        {status === 'success' && <Link to="/employees" className="mt-4 inline-flex w-full justify-center rounded bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#071017] hover:bg-cyan-200">Ir a empleados</Link>}
      </section>
    </main>
  );
}

export default AcceptEmployeeInvitationPage;
